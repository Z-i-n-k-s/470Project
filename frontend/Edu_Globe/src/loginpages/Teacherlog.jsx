import React, { useState } from "react";
import '../CSS/Studentlogin.css'
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = async () => {
      if (username && password) {
          try {
              // Sending the login data to the backend for verification
              const response = await fetch("http://localhost:5000/tlogin", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email: username, password: password }),
              });

              const data = await response.json();

              if (response.ok) {
                  // If the login is successful, redirect to Student Dashboard
                  console.log(`Logged in as ${username}`);
                  navigate("/teacherdash");
              } else {
                  // If the credentials are incorrect
                  alert("Invalid email or password. Please try again.");
              }
          } catch (error) {
              console.log("An error occurred. Please try again later.");
          }
      } else {
          console.log("Please enter both username and password.");
      }
  };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Teacher Login</h2>

                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                <button onClick={handleLogin} className="login-btn">
                    Log In
                </button>

                <button onClick={() => navigate('/teacherreg')} className="register-btn">
                    Register
                </button>
            </div>
        </div>
    );
};

export default Login;
