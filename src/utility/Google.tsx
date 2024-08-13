import React from "react";

const GoogleSignIn: React.FC = () => {

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  return (
    <div className="google-signin-container">
      <button className="google-signin-button" onClick={handleLogin}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
          alt="Google logo"
          className="google-logo"
        />
        <span className="google-text">Sign in with Google</span>
      </button>
    </div>
  );
};

export default GoogleSignIn;

