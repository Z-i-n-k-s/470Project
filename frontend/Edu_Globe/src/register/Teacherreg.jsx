import React, { useState } from 'react';
import '../CSS/Teacherreg.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        institution: '',
        degree: 'BSC',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/teacregister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    institution: '',
                    degree: 'BSC',
                    password: ''
                });
                navigate('/teacherlog')
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="register-page">
            <h1>Teacher Register</h1>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="institution"
                    placeholder="Institution"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                />
                <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                >
                    <option value="BSC">BSC</option>
                    <option value="MSC">MSC</option>
                    <option value="MBA">MBA</option>
                </select>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
