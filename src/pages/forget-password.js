
import React, { useState } from "react";
import axios from "axios";
import sandImage from "../assets/sand.jpg";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

const forgotPasswordStyle = {
 page: {
 backgroundImage: `url(${sandImage})`,
   height: "100vh",
  width: "100%",
 // background: "#9a7055", // same as login page
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Poppins', sans-serif",
},

  wrapper: {
    width: "100%",
    maxWidth: "460px",
    backgroundColor: "#f9f5f1",
    padding: "40px 30px",
    borderRadius: "16px",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    border: "1px solid #e0d6cd",
    
  },
  heading: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#5c4330",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #c4b8ad",
    fontSize: "16px",
    backgroundColor: "#fff",
    color: "#5c4330",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#b46c4c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  successMessage: {
    color: "#2e7d32",
    marginTop: "18px",
    fontWeight: "500",
  },
  errorMessage: {
    color: "#c62828",
    marginTop: "18px",
    fontWeight: "500",
  },
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Check your email for reset instructions.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

 return (
  <div style={forgotPasswordStyle.page}>
    <div style={forgotPasswordStyle.wrapper}>
      <h2 style={forgotPasswordStyle.heading}>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={forgotPasswordStyle.input}
        />
        <button type="submit" style={forgotPasswordStyle.button}>
          Send Reset Link
        </button>
      </form>
      {message && <p style={forgotPasswordStyle.successMessage}>{message}</p>}
      {error && <p style={forgotPasswordStyle.errorMessage}>{error}</p>}
    </div>
  </div>
);
}
export default ForgotPassword;
