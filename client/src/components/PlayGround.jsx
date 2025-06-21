import React, { useState, useEffect } from "react";
import NewNav from "./NewNav";
import Split from "react-split";
import "../components/split.css";
import { Box, Button, Paper, Typography } from "@mui/material";
import Editor, { useMonaco } from "@monaco-editor/react";
import axios from "axios";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Loader from "./loader/Loader";
import toast from "react-hot-toast";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SubmitAnimation from "./loader/SubmitAnimation";

function PlayGround({ tesTCases }) {
  const { problemId } = useParams();

  const userId = useSelector((state) => state.auth.user._id);

  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    return savedLanguage || "javascript";
  });

  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem("code");
    return savedCode || "";
  });
  const [failed, setFailed] = useState(false);
  const [testCases, setTestCases] = useState(tesTCases);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  console.log(testCases);

  const monaco = useMonaco();

  useEffect(() => {
    localStorage.setItem("selectedLanguage", language);
  }, [language]);

  useEffect(() => {
    if (monaco) {
      console.log("Monaco instance loaded:", monaco);

      monaco.editor.defineTheme("custom-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "comment", foreground: "888888", fontStyle: "italic" },
          { token: "keyword", foreground: "ff9d00" },
        ],
        colors: {
          "editor.background": "#121212",
          "editor.foreground": "#ffffff",
          "editor.lineHighlightBackground": "#2a2a2a",
        },
      });

      monaco.editor.setTheme("custom-dark");
    }
  }, [monaco]);

  const handleEditorDidMount = (editor, monacoInstance) => {
    console.log("Editor Mounted:", editor);
  };

  const handleCodeChange = (value) => {
    setCode(value);
    localStorage.setItem("code", value);
  };

  const language_id = {
    c: 1,
    cpp: 2,
    javascript: 9,
    java: 3,
    python: 4,
  };

  const encodeBase64 = (str) => {
    return btoa(
      new TextEncoder()
        .encode(str)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  };

  const base64EncodedCode = encodeBase64(code);

  useEffect(() => {
    setFailed(false);
  }, [code]);

  const data = {
    language_id: language_id[language],
    base64EncodedCode: base64EncodedCode,
    problemId: problemId,
  };

  const handleRunCode = async () => {
    const config = {
      withCredentials: true,
      header: { "Content-Type": "application/json" },
    };
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/user/getSubmission",
        data,
        config
      );
      console.log(res);
      const { updatedTestCases, results, hasFailure, failureStatus } = res.data;

      setTestCases(updatedTestCases);
      setFailed(hasFailure);
      setStory(failureStatus);
      setLoading(false);

      return results;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const setAttempt = async () => {
    try {
      setLoading(true);
      const finalResult = await handleRunCode();
      console.log(finalResult);
      let story = "Accepted";
      finalResult.some((result) => {
        if (result.status !== "Accepted") {
          story = result.status;
        }
      });
      console.log("Story after handleRunCode:", story);

      const config = {
        withCredentials: true,
        header: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post(
        "http://localhost:4000/user/judge0-callback",
        { story, problemId, userId },
        config
      );
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleAnalyze = async () => {
    try {
      const config = {
        withCredentials: true,
        header: { "Content-Type": "application/json" },
      };
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4000/problems/analyze`,
        { code },
        config
      );
      console.log(response.data.analysis);
      setResponse(response.data.analysis);
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      setLoading(false);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "Accepted":
        return "green";
      case "Wrong Answer":
        return "red";
      case "Processing":
        return "yellow";
      case "Runtime Error":
        return "red";
      case "Time Limit Exceeded":
        return "red";
      case "Memory Limit Exceeded":
        return "red";
      default:
        return "grey";
    }
  };

  const firstThree = testCases?.slice(0, 3);
  console.log(firstThree);

  // const handleEditorDidMount = (editor, monacoInstance) => {
  //   console.log("Editor Mounted:", editor);
  // };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: "",
        height: `calc(100vh - 64px)`,
      }}
    >
      <NewNav setLanguage={setLanguage} language={language} />
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          sx={{
            backgroundColor: "#2c3e5d",
            px: 3,
            marginBottom: 2,
            color: "white",
          }}
          onClick={handleRunCode}
        >
          Run Code
        </Button>
        <Button
          sx={{
            backgroundColor: "#2c3e5d",
            px: 3,
            marginBottom: 2,
            color: "white",
          }}
          onClick={setAttempt}
        >
          Submit
        </Button>
      </Box>

      <Split
        style={{ height: `calc(100vh)` }}
        direction="vertical"
        sizes={[60, 40]}
      >
        <Box sx={{ width: "100%", height: "60%" }}>
          <Editor
            height="100%"
            language={language}
            defaultValue={code == "" ? "// Write your code here..." : code}
            onMount={handleEditorDidMount}
            theme="custom-dark"
            onChange={handleCodeChange}
          />
        </Box>
        <Box
          sx={{
            height: "40%",
            color: "white",
            padding: "10px",
            borderRadius: 5,
          }}
        >
          <Paper
            sx={{
              backgroundColor: "#2c3e5d",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckBoxIcon sx={{ color: "white" }} />
              <Typography fontWeight={400} color="white" fontSize="1.2rem">
                Testcases:
              </Typography>
            </Box>

            {story == "Accepted" && (
              <Button
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#111",
                  },
                  fontWeight: "bold",
                  borderRadius: 5,
                }}
                onClick={handleAnalyze}
              >
                Analyze
              </Button>
            )}
          </Paper>

          {loading ? (
            <SubmitAnimation />
          ) : (
            <Box>
              <Box display={"flex"} gap={3} mt={3}>
                {firstThree?.map((test) => (
                  <Box
                    key={test.id ? test.id : test?._doc?.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: getColor(test.status),
                    }}
                  >
                    <TaskAltRoundedIcon />
                    <Typography>{`Case ${
                      test.id ? test.id : test?._doc?.id
                    }`}</Typography>
                  </Box>
                ))}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: getColor(story) }}>
                    {story}
                  </Typography>
                </Box>
              </Box>
              <SyntaxHighlighter
                language="cpp"
                style={atomOneLight}
                showLineNumbers
                // wrapLongLines
                customStyle={{
                  maxHeight: "300px",
                  overflowX: "auto", 
                  overflowY: "auto",
                  scrollbarWidth: "none", 
                  msOverflowStyle: "none",
                }}
                className="hide-scrollbar"
              >
                {response}
              </SyntaxHighlighter>
            </Box>
          )}
        </Box>
      </Split>
    </div>
  );
}

export default PlayGround;
