import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/Adminlogin.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Only these emails are allowed into the admin dashboard
  const allowedAdmins = [
    "admin1@gmail.com",
    "admin2@gmail.com",
    "admin3@gmail.com"
  ];

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    // Quick client‐side check before even talking to backend
    if (!allowedAdmins.includes(username)) {
      alert("Invalid login. You are not an admin.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/tlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password })
      });

      if (!response.ok) {
        alert("Invalid email or password. Please try again.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("userData", JSON.stringify(data.data));
      console.log(`Logged in as ${username}`);
      navigate("/admindash");
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button onClick={handleLogin} className="login-btn">
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;
