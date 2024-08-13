import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Header from "../components/Header";

const AddPasswordPage: React.FC = () => {


  
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/password",
        { password, url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);

      navigate("/");
    } catch (error) {
      console.error("Error adding password", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
    <Container >
       <Header showHomeButton={true}/>
      <Typography variant="h4" align="center" gutterBottom>
        Add a New Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="URL"
          variant="outlined"
          fullWidth
          margin="normal"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Password
        </Button>
      </form>
    </Container>
    </div>
  );
};

export default AddPasswordPage;
