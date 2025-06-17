import React, { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { green, red, yellow } from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import problems from '../fakeData/problems.js'
import {Link} from './StyledComp.jsx';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from './loader/Loader.jsx';
import { Box } from '@mui/material';

function ProblemTable() {
  // here we also need to fetch the problem data from the backend
  const user = useSelector((state)=>state.auth.user);
  console.log(user);
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const config = {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        };
        const response = await axios.get('http://localhost:4000/problems/all-problems', config);
        setProblems(response?.data);
        // console.log(response?.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchProblems();
  }, []);
  return (
    !problems ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></Box>
    ):(
      <tbody style={{backgroundColor: '#2C3E5D',borderRadius: '12px'}}>
      {problems?.map((problem) => {
        const difficultyColor = problem.difficulty == 'Easy' ? green[500] : problem.difficulty == 'Medium' ? yellow[600] : red[500];
        return (
          <tr key={problem.id}>
            <td style={{ padding: '9px', textAlign: 'center' }}>
              {user?.problemSolved?.includes(problem.id) ? <CheckIcon sx={{ color: green[500] }} /> : <></>}
            </td>
            <td style={{ paddingLeft: '12px', textAlign: 'left' }}>
              <Link sx={{ color: 'white' }} to={`/problems/${problem.id}`}>{problem.id} . {problem.title}</Link>
            </td>
            <td style={{ padding: '12px', textAlign: 'center', color: difficultyColor }}>{problem.difficulty}</td>
            <td style={{ padding: '12px', textAlign: 'center' }}>{problem.category}</td>
            <td style={{ padding: '8px', textAlign: 'center' }}>{
                problem.videoId == "" ? 'Coming Soon ...' : <a href={`https://www.youtube.com/watch?v=${problem.videoId}`}><YouTubeIcon sx={{ color: 'red'}} /></a>
                }</td>
          </tr>
        );
      })}
    </tbody>
    )
  );
}

export default ProblemTable;
