import { Avatar, Box, Typography,Paper } from "@mui/material";
import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function User() {
  const [userData, setUser] = useState({});
  const userId = useSelector((state) => state.auth.user._id);
  const avatarUrl = useSelector((state) => state.auth.user.avatarUrl);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          withCredentials: true,
          header: { "Content-Type": "application/json" },
        };
        const user = await axios.get(
          `http://localhost:4000/user/getUserDetails/${userId}`,
          config
        );
        if (!user) {
          console.log("No user found");
        }
        setUser(user.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [userId]);

  // console.log(userData);
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "10%",
        }}
      >
        <Avatar
          sx={{
            width: "160px",
            height: "160px",
            border: "4px solid white",
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
          src={avatarUrl}
        ></Avatar>
      </Box>
      <Box mt={3}>
        <Typography
          sx={{ fontSize: "20px", color: "white", textAlign: "center" }}
        >
          {userData.username}
        </Typography>
        <Typography
          sx={{ fontSize: "15px", color: "white", textAlign: "center" }}
        >
          {userData.email}
        </Typography>
        <hr
          style={{
            color: "white",
            width: "80%",
            margin: "auto",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        ></hr>
        <Typography
          sx={{ fontSize: "15px", color: "white", textAlign: "center" }}
        ></Typography>
        <Typography
          sx={{ fontSize: "15px", color: "white", textAlign: "center" }}
        >
          Total Solved : {userData.problemSolved?.length}
        </Typography>
        <Typography
          sx={{
            fontSize: "20px",
            color: "white",
            marginLeft: "10%",
            marginTop: "10px",
            marginBottom: "10px",
            display: "flex",
            gap: "15px",
          }}
        >
          Languages :
        </Typography>
        {userData.languages?.map((language) => {
          return (
            <Paper
              key={language}
              sx={{
                bgcolor: "white",
                width: "80%",
                margin: "auto",
                marginBottom: "10px",
                padding: "4px",
                borderRadius: "20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "15px",
                  marginLeft: "10%",
                  color: "black",
                }}
              >
                {language}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}

export default memo(User);
