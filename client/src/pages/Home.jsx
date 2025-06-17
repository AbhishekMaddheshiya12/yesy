import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import ProblemTable from "../components/ProblemTable";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import Image1 from "../assets/Dsa.png";
import Profile from "../components/Profile";
import { useDispatch, useSelector } from "react-redux";
import { userExist } from "../redux/reducers/auth";

function Home() {
  const theme = useTheme();
  const isMoblie = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector(state => state.auth.user);
  console.log(user);
  return (
    <Box sx={{height: isMoblie ? 'auto' : '100vh' ,background: "linear-gradient(135deg,rgb(90, 103, 130) 40%,rgb(255, 255, 255) 100%)"}}>
      <Box sx={{}}>
        <NavBar></NavBar>
      </Box>
      <Box sx={{maxWidth: isMoblie ? 'auto' : '80%',margin:'auto',overflowY:"hidden",overflowX:""}}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 9 }}>
          <Paper>
          <div
            style={{ position: "relative", margin: "auto", marginTop: "20px" }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", }}>
              <thead style={{ backgroundColor: "#1A2B4A", color: "white" }}>
                <tr style={{ paddingBottom: "6px" }}>
                  <th style={{ paddingLeft: "18px" }}>Status</th>
                  <th style={{ paddingRight: "40px" }}>Title</th>
                  <th style={{ padding: "8px" }}>Difficulty</th>
                  <th style={{ padding: "8px" }}>Category</th>
                  <th style={{ padding: "8px" }}>Solution</th>
                </tr>
              </thead>
              <ProblemTable />
            </table>
          </div>
          </Paper>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Profile></Profile>
        </Grid2>
      </Grid2>
      </Box>
    </Box>
  );
}

export default Home;
