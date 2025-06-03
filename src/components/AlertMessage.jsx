// components/AlertMessage.js
import React from "react";
import "./AlertMessage.css";

const AlertMessage = ({ message, onClose }) => {
  return (
    <div className="alert-backdrop">
      <div className="alert-box">
        <p>{message}</p>
        <button onClick={onClose}>Okay</button>
      </div>
    </div>
  );
};

export default AlertMessage;
