import React, { useState } from "react";
import '../CSS/Adminlogin.css'

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (username && password) {
            alert(`Logged in as ${username}`);
        } else {
            alert("Please enter both username and password.");
        }
    };

    const handleRegister = () => {
        alert("Redirecting to registration page...");
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
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
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
            </div>
        </div>
    );
};

export default Login;
