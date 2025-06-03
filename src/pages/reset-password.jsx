import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/resetpassword.css"; 

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <h2 className="reset-heading">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="reset-input"
          />
          <button type="submit" className="reset-button">Reset Password</button>
        </form>
        {message && <p className="reset-message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
