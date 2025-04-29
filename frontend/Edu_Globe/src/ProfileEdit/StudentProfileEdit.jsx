import React, { useState, useEffect } from "react";
import axios from "axios";
import '../css/StudentProfileEdit.css';
const ProfileUpdatePage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        institution: "",
        department: "",
        password: "",
        studentId: ""
    });

    const [message, setMessage] = useState("");
    const studentId = localStorage.getItem("customerId"); // Assuming studentId is stored in localStorage

    useEffect(() => {
        // Fetch the current student's data using the studentId
        if (studentId) {
            axios.get(`http://localhost:5000/api/student/${studentId}`)
                .then((response) => {
                    setFormData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching student data:", error);
                    setMessage("Error fetching data");
                });
        }
    }, [studentId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put('http://localhost:5000/updateProfile', { studentId, ...formData })
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                setMessage("Profile update failed");
            });
    };

    return (
        <div className="profile-update">
            <h2>Update Your Profile</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Institution:</label>
                    <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Department:</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>StudentID</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfileUpdatePage;
