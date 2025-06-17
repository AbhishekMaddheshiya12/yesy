import React, { useEffect, useState } from "react";
import ProblemStatement from "../components/ProblemStatement";
import PlayGround from "../components/PlayGround";
import Split from "react-split";
import "../components/split.css";
import NavBar from "../components/NavBar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router";
import problems from "../fakeData/problems.js";
import Submission from "../components/Submission.jsx";
import axios from "axios";
import Loader from "../components/loader/Loader.jsx";

function Solution() {
  const { problemId } = useParams();
  const [isSubmission, setIsSubmission] = useState(false);
  const [problemdata, setProblemData] = useState(null); // ← initialize as null

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/problems/${problemId}`);
        setProblemData(response?.data?.problem[0]);
        console.log(response.data.problem[0]);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [problemId]);

  // Show loading UI until data is fetched
  if (!problemdata) {
    return <Box><Loader/></Box>;
  }

  const tesTCases = problemdata.testCases;

  return (
    <Box>
      <NavBar />
      {isMobile ? (
        <div className="pane">
          {isSubmission ? (
            <Submission
              problemId={problemId}
              setIsSubmission={setIsSubmission}
            />
          ) : (
            <ProblemStatement
              problemData={problemdata}
              setIsSubmission={setIsSubmission}
            />
          )}
        </div>
      ) : (
        <Split
          className="split"
          sizes={isMobile ? [100, 0] : [50, 50]}
          minSize={200}
          gutterSize={10}
          direction="horizontal"
          cursor="col-resize"
        >
          <div className="pane">
            {isSubmission ? (
              <Submission
                problemId={problemId}
                setIsSubmission={setIsSubmission}
              />
            ) : (
              <ProblemStatement
                problemData={problemdata}
                setIsSubmission={setIsSubmission}
              />
            )}
          </div>
          <div className="pane">
            <PlayGround tesTCases={tesTCases} problemId={problemId} />
          </div>
        </Split>
      )}
    </Box>
  );
}

export default Solution;