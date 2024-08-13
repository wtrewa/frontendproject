import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import zxcvbn from 'zxcvbn';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, IconButton, 
  TextField, Typography, AppBar, Toolbar, Box 
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

interface Password {
  id: number;
  url: string;
  password: string;
}

interface User {
  name: string;
  email: string;
}

const HomePage: React.FC = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [editPassword, setEditPassword] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

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

          const passwordResponse = await axios.get("http://localhost:8080/api/passwords", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPasswords(passwordResponse.data);
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

  const checkPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    if (result.score <= 2) {
      setSuggestion(result.feedback.suggestions.join(" ") || "Consider using a stronger password.");
    } else {
      setSuggestion("");
    }
  };

  const handleEditPassword = async (id: number) => {
    try {
      await axios.patch(`http://localhost:8080/api/passwords/${id}`, { password: editPassword }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditId(null);
      setEditPassword("");
      setSuggestion("");

      const response = await axios.get("http://localhost:8080/api/passwords", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPasswords(response.data);
    } catch (error) {
      console.error("Error updating password", error);
    }
  };

  const handleDeletePassword = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/passwords/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPasswords(passwords.filter(password => password.id !== id));
    } catch (error) {
      console.error("Error deleting password", error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPassword(e.target.value);
    checkPasswordStrength(e.target.value);
  };

  const generateStrongPassword = () => {
    const strongPassword = Math.random().toString(36).slice(-12) + "Aa1!";
    setEditPassword(strongPassword);
    checkPasswordStrength(strongPassword);
  };

  return (
    <div className="home-container">
      <AppBar position="static">
        <Toolbar>
          {user && (
            <Box display="flex" flexGrow={1} alignItems="center">
              <VpnKeyIcon />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 2 }}>
                Hello, {user.name}
              </Typography>
            </Box>
          )}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          component={Link} 
          to="/add-password"
          sx={{ marginBottom: 2 }}
        >
          Add Password
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>URL</TableCell>
                <TableCell>Password</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passwords.map((password) => (
                <TableRow key={password.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {editId === password.id ? (
                    <>
                      <TableCell>
                        <TextField 
                          fullWidth 
                          value={editPassword} 
                          onChange={handlePasswordChange} 
                          variant="outlined"
                          size="small"
                        />
                        {suggestion && <Typography variant="body2" color="error">{suggestion}</Typography>}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="success" 
                          startIcon={<SaveIcon />} 
                          onClick={() => handleEditPassword(password.id)}
                          sx={{ marginRight: 1 }}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          startIcon={<CancelIcon />} 
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          variant="contained" 
                          color="warning" 
                          onClick={generateStrongPassword}
                        >
                          Generate Strong Password
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell><strong>{password.url}</strong></TableCell>
                      <TableCell>{password.password}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => setEditId(password.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeletePassword(password.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default HomePage;
