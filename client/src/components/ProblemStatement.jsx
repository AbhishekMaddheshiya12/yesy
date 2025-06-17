import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import problems from "../fakeData/problems.js";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useParams } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";

function ProblemStatement({ problemData, setIsSubmission }) {
  // console.log(problemData);
  const [likes, setLikes] = useState(problemData?.likes?.length);
  const [disLikes,setDisLikes] = useState(problemData?.dislikes?.length);
  const problemId = useParams()?.problemId;
  const[isLiked,setIsLiked] = useState(false);
  const[isDisLiked,setIsDisLiked] = useState(false);
  const [isSolved,setIsSolved] = useState(false);
  useEffect(() => {

    const getData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      try {
        const response = await axios.get(`http://localhost:4000/problems/getLikes/${problemId}`,config);
        setLikes(response.data.likes);
        setIsLiked(response.data.userLike);
        setDisLikes(response.data.dislikes);
        setIsDisLiked(response.data.userDislike);
      } catch (error) {
        console.log(error);
      }
    };

    
    const getsolved = async() => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      try{
        const response = await axios.get(`http://localhost:4000/problems/getSolved/${problemId}`,config);
        console.log(response);
        setIsSolved(response.data.solved);
      }catch(error){
        console.log(error);
      }
    }
    getsolved();
    getData();
  }, [problemId]); 
  
  const handleLikes = async () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      const response = await axios.post(`http://localhost:4000/problems/like/${problemData._id}`,{},config);
      console.log(response);
    }catch(error){
      console.log(error);
    }
  };
  const handeleDisLikes = async (req, res) => {
    setIsDisLiked(!isDisLiked);
    setDisLikes(isDisLiked ? disLikes - 1 : disLikes + 1);
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
      const response = await axios.post(`http://localhost:4000/problems/dislike/${problemData._id}`,{},config);
      console.log(response);
    }catch(error){
      console.log(error);
    }
  };
  // Function to get the color based on the difficulty level
  const getDifficultyColor = (level) => {
    switch (level) {
      case "Easy":
        return "6BF216";
      case "Medium":
        return "yellow";
      case "Hard":
        return "red";
      default:
        return "yellow";
    }
  };

  return (
    <div
      style={{
        height: `calc(100vh - 64px)`,
        overflowY: "auto",
        background:
          "linear-gradient(135deg,rgb(90, 103, 130) 40%,rgb(255, 255, 255) 100%)",
        scrollbarWidth: "none",
      }}
    >
      <style>
        {`
          /* Hide scrollbar for Chrome, Edge, and Safari */
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div style={{ display: "flex", margin: 10 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2c3e5d",
            width: "6rem",
            height: "2rem",
            fontSize: 12,
            marginRight: 2,
          }}
          onClick={() => setIsSubmission(false)}
        >
          Description
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2c3e5d",
            width: "6rem",
            height: "2rem",
            fontSize: 12,
            marginRight: 2,
          }}
        >
          Solution
        </Button>
        <Button
          varient="contained"
          sx={{
            backgroundColor: "#2c3e5d",
            width: "6rem",
            height: "2rem",
            fontSize: 12,
            color: "white",
          }}
          onClick={() => setIsSubmission(true)}
        >
          Submission
        </Button>
      </div>
      <div style={{ color: "white", margin: 20 }}>
        {/* Problem Heading */}
        <div style={{ fontSize: 35 }}>{problemData.title}</div>
      </div>
      <div
        style={{
          color: "white",
          margin: 20,
          display: "flex",
          alignItems: "center",
          lineHeight: "1.5",
        }}
      >
        <div
          style={{
            color: getDifficultyColor(problemData.difficulty),
            fontWeight: "bold",
          }}
        >
          {problemData.difficulty}
        </div>
        <div
          style={{
            marginLeft: 20,
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleLikes}>
          <ThumbUpIcon style={{ color: isLiked?"#6BF216":"white", fontSize: 18 }} />
            <Typography variant="body2" color="white">{likes}</Typography>
          </IconButton>
        </div>
        <div
          style={{
            marginLeft: 20,
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          <IconButton onClick={handeleDisLikes}>
            <ThumbDownAltIcon style={{ color:isDisLiked?"red": "white", fontSize: 18 }} />
            <Typography variant="body2" color="white">{disLikes}</Typography>
          </IconButton>
        </div>
        <div
          style={{
            marginLeft: 20,
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          <DoneAllIcon style={{color:isSolved?"green": "white", fontSize: 20 }} />
        </div>
      </div>
      <Box marginLeft={2.5}>
        <Typography variant="body1" style={{ color: "white", marginTop: 10 }}>
          {problemData.description}
        </Typography>
        <Typography variant="body1" style={{ color: "white", marginTop: 10 }}>
          Examples :
        </Typography>
        <Box>
          {problemData?.examples?.map((example, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#2c3e5d",
                padding: 2,
                marginTop: 2,
                borderRadius: 2,
                marginRight: 2,
              }}
            >
              <Typography
                variant="body1"
                style={{ color: "white", marginTop: 10 }}
              >
                Input : {example.input}
              </Typography>
              <Typography
                variant="body1"
                style={{ color: "white", marginTop: 10 }}
              >
                Output : {example.output}
              </Typography>
              <Typography
                variant="body1"
                style={{ color: "white", marginTop: 10 }}
              >
                Explanation : {example.explanation}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box>
          <Typography color="white" mt={3} mb={2} fontWeight={500}>
            Constraints :
          </Typography>
          {problemData?.constraints?.map((constraint, index) => (
            <ul
              key={index}
              style={{
                listStyle: "disc",
                color: "white",
                backgroundColor: "#2c3e5d",
                padding: 2,
                width: 200,
                borderRadius: 5,
              }}
            >
              <li key={index}>{constraint}</li>
            </ul>
          ))}
        </Box>
      </Box>
    </div>
  );
}

export default ProblemStatement;
