import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
    
      localStorage.setItem("googleToken", token);
      login(token);

    
      navigate("/");
    }
  }, [location, login, navigate]);

  return (
    <div>Success</div>
  );
};

export default Success;

