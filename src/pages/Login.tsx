import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignIn from "../utility/Google";
import { useAuth } from "../context/AuthContext";


interface LoginResponse {
  token: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); 

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>("http://localhost:8080/api/login", {
        email,
        password,
      });

      const token = response.data.token;

      if (token) {

        localStorage.setItem("authToken", token);
        login(token);
       
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div>
              <label>Email:</label>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div>
              <label>Password:</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="google-signin-container">
          <GoogleSignIn />
        </div>
        <p className="signup-link">
          Don't have an account?{" "}
          <Link to="/signup" className="link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
