import React, { useState } from "react";
import axios from "axios";

// Define types for props
interface VerifyEmailProps {
  userId: number;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ userId }) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleVerification = async () => {
    try {
      const response = await axios.post("/api/verify-email", {
        userId,
        verificationCode,
      });

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      // Handle error response
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to verify");
      } else {
        setError("Failed to verify");
      }
      setMessage("");
    }
  };

  return (
    <div>
      <h3>Verify Your Email</h3>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Enter your verification code"
      />
      <button onClick={handleVerification}>Verify</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VerifyEmail;

