import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/Studentreg.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        institution: '',
        department: 'Computer Science',
        studentId: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/register', {
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
                    department: 'Computer Science',
                    studentId: '',
                    password: ''
                });
                navigate('/studentlog');
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
            <h1>Student Registration</h1>
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
                    placeholder="Email"
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
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Biotechnology">Biotechnology</option>
                </select>

                <input
                    type="text"
                    name="studentId"
                    placeholder="Student ID"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                />

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
