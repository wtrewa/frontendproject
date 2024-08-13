import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [receivedCode, setReceivedCode] = useState<string>("");
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate(); 

  const sendVerificationCode = async () => {
    try {
      const response = await axios.post<{ code: string }>(
        "http://localhost:8080/api/send-verification-code",
        { email }
      );
      setReceivedCode(response.data.code);
      setIsCodeSent(true);
      setMessage("Verification code sent to your email");
      setError("");
    } catch (err) {
      setError("Failed to send verification code");
      setMessage("");
    }
  };

  const verifyCode = () => {
    if (verificationCode === receivedCode) {
      setIsEmailVerified(true);
      setMessage("Email verified successfully");
      setError("");
    } else {
      setError("Invalid verification code");
      setMessage("");
    }
  };

  const handleSubmit = async () => {
    if (!isEmailVerified) {
      setError("Please verify your email before submitting the form");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/signup", {
        name,
        email,
        password,
      });
      setMessage("Registration successful");
      setError("");
      navigate("/login"); 
    } catch (err) {
      setError("Failed to register");
      setMessage("");
    }
  };

  return (
    <div className="register-container">
      <h3 className="register-title">Register</h3>
      <div className="form-group-sign">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field"
          disabled={isEmailVerified}
        />
        <button
          onClick={sendVerificationCode}
          disabled={isEmailVerified}
          className={`btn ${isEmailVerified ? "btn-verified" : "btn-primary"}`}
        >
          {isEmailVerified ? "Verified" : "Verify"}
        </button>
      </div>
      {isCodeSent && !isEmailVerified && (
        <div className="form-group-sign">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="input-field"
          />
          <button onClick={verifyCode} className="btn btn-primary">
            Submit Code
          </button>
        </div>
      )}
      {isEmailVerified && (
        <div className="form-group-sign">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-field"
          />
          <button onClick={handleSubmit} className="btn btn-primary">
            Register
          </button>
        </div>
      )}
      {message && <p className="message success-message">{message}</p>}
      {error && <p className="message error-message">{error}</p>}
    </div>
  );
};

export default Register;
