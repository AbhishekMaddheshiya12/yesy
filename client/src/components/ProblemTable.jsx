import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { green, red, yellow } from "@mui/material/colors";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "./StyledComp.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "./loader/Loader.jsx";
import { Box } from "@mui/material";
import SubmitAnimation from "./loader/SubmitAnimation.jsx";

function ProblemTable() {
  const user = useSelector((state) => state.auth.user);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        const config = {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        };
        const response = await axios.get(
          "http://localhost:4000/problems/all-problems",
          config
        );
        setProblems(response.data || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
        setProblems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (isLoading || !user) {
    return (
      <tbody style={{ backgroundColor: "#2C3E5D", borderRadius: "12px" }}>
        <tr>
          <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
              <svg style={{margin:'auto',marginTop:'20px',background:'none',display:'block',shapeRendering:'auto'}} width="100" height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="white" stroke="#2c3e5d" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#2B2B2B" stroke="#2B2B2B" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#2B2B2B" stroke="#2B2B2B" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody style={{ backgroundColor: "#2C3E5D", borderRadius: "12px" }}>
      {problems.length > 0 ? (
        problems.map((problem) => {
          const difficultyColor =
            problem.difficulty === "Easy"
              ? green[500]
              : problem.difficulty === "Medium"
              ? yellow[600]
              : red[500];

          const isSolved = user?.problemSolved?.includes(String(problem.id));

          return (
            <tr key={problem.id}>
              <td style={{ padding: "9px", textAlign: "center" }}>
                {isSolved && <CheckIcon sx={{ color: green[500] }} />}
              </td>
              <td style={{ paddingLeft: "12px", textAlign: "left" }}>
                <Link sx={{ color: "white" }} to={`/problems/${problem.id}`}>
                  {problem.id}. {problem.title}
                </Link>
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: difficultyColor,
                }}
              >
                {problem.difficulty}
              </td>
              <td style={{ padding: "12px", textAlign: "center" }}>
                {problem.category}
              </td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                {problem.videoId === "" ? (
                  "Coming Soon ..."
                ) : (
                  <a
                    href={`https://www.youtube.com/watch?v=${problem.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <YouTubeIcon sx={{ color: "red" }} />
                  </a>
                )}
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
            No problems available.
          </td>
        </tr>
      )}
    </tbody>
  );
}

export default ProblemTable;
