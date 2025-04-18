import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/LoginPage.css';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="home-box">
                <h1>Select Your Role</h1>
                <div className="button-group">
                    <button onClick={() => navigate('/studentlog')}>Student</button>
                    <button onClick={() => navigate('/teacherlog')}>Teacher</button>
                    <button onClick={() => navigate('/adminlog')}>Admin</button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
