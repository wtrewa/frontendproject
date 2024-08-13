import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import axios from "axios";

interface HeaderProps {
  user: { name: string; email: string } | null;
  showHomeButton?: boolean;
}

interface User {
    name: string;
    email: string;
  }

const Header: React.FC<HeaderProps> = ({  showHomeButton = true }) => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }

    const fetchUserData = async () => {
      try {
        if (token) {
          const userResponse = await axios.get("http://localhost:8080/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(userResponse.data);

          
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data or passwords", error);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  

 


  return (
    <AppBar position="static">
      <Toolbar>
        {showHomeButton && (
          <IconButton edge="start" color="inherit" aria-label="home" component={Link} to="/">
            <HomeIcon />
          </IconButton>
        )}
        {user && (
          <Box display="flex" flexGrow={1} alignItems="center">
            <VpnKeyIcon />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 2 }}>
              Hello, {user.name}
            </Typography>
          </Box>
        )}
        <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
