import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Options = () => {
  const languages = ["Java", "Python", "C++", "C", "Javascript"];
  const [selected, setSelected] = useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };

const handleSubmit = async () => {
  const config = {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  try {
    const getResponse = await axios.post(
      "http://localhost:4000/user/updateLanguages",
      { languages: selected },
      config                    
    );
    console.log(getResponse);
    if(!getResponse.data.success){
      toast.error(getResponse.data.message);
      return;
    }
    window.location.reload();
    toast.success(getResponse.data.message);
  } catch (error) {
    console.log(error);
  }
};


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { xs: "90%", sm: "400px" },
        margin: "auto",
        mt: 2,
      }}
    >
      <Typography
        sx={{
          mb: 2,
          fontFamily: "monospace",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {" "}
        Select the languages you Knows:
      </Typography>
      <FormControl>
        <InputLabel>Language</InputLabel>
        <Select
          multiple
          value={selected}
          onChange={handleChange}
          input={
            <OutlinedInput label="Languages" sx={{ fontColor: "black" }} />
          }
          renderValue={(selected) => selected.join(", ")}
          sx={{
            borderRadius: "50px",
            color: "black",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
              borderWidth: "2px",
            },
            mb: 2,
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language}
              value={language}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {language}{" "}
              <Checkbox color="dark" checked={selected.includes(language)} />
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="black"
          sx={{
            width: "40%",
            bgcolor: "black",
            color: "white",
            borderRadius: "50px",
            margin: "auto",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </FormControl>
    </Box>
  );
};

export default Options;
