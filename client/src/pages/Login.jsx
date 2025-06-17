import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducers/auth";
import toast from "react-hot-toast";

function Login({ setIsLogin }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    try {
      const { data } = await axios.post(
        "http://localhost:4000/user/login",
        { username: userName, password, email },
        config
      );
      console.log(data);
      dispatch(userExist(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleChange = () => {
    setIsLogin(false);
  };

  const getHeadingSize = () => {
    if (isMobile) return "h4";
    return "h3";
  };

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "70%", md: "50%", lg: "25%" },
        margin: "auto",
        mt: isMobile ? 15 : 6,
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{ padding: isMobile ? 2 : 4, backgroundColor: "transparent" }}
      >
        <Typography
          variant={getHeadingSize()}
          sx={{
            fontFamily: "cursive",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Welcome
        </Typography>
        <Typography
          variant={getHeadingSize()}
          sx={{
            fontFamily: "cursive",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Back
        </Typography>

        <form
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={submitHandler}
        >
          <TextField
            label="Username"
            variant="standard"
            color="black"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            variant="standard"
            color="black"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            variant="standard"
            color="black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              mt: 2,
              padding: isMobile ? "8px" : "10px",
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
            type="submit"
            fullWidth
          >
            Login
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography sx={{ fontFamily: "cursive", fontWeight: 600 }}>
            Don&apos;t have an account?
          </Typography>
          <Button
            variant="text"
            onClick={handleChange}
            sx={{
              margin: "0 auto",
              display: "block",
              mt: 1,
              color: "black",
              fontFamily: "cursive",
              fontWeight: "bold",
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
