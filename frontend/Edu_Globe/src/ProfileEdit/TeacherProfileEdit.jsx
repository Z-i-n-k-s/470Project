import React, { useState, useEffect } from "react";
import axios from "axios";
import '../css/TeacherProfileEdit.css';

const TeacherProfileEdit = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        institution: "",
        degree: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const email = localStorage.getItem("teacherEmail"); // Assuming email is stored in localStorage after login

    useEffect(() => {
        // Fetch the current teacher's data using the email
        if (email) {
            axios.get(`http://localhost:5000/teacher/${email}`)
                .then((response) => {
                    setFormData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching teacher data:", error);
                    setMessage("Error fetching data");
                });
        }
    }, [email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log the request URL to verify it's correct
        console.log("PUT request URL:", `http://localhost:5000/teacher/${email}`);

        // Make the PUT request to the correct URL with teacher's email
        axios.put(`http://localhost:5000/teacher/${email}`, formData)
            .then((response) => {
                setMessage("Profile updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                setMessage("Profile update failed");
            });
    };

    return (
        <div className="teacher-profile-update">
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
                        disabled
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
                    <label>Degree:</label>
                    <input
                        type="text"
                        name="degree"
                        value={formData.degree}
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
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default TeacherProfileEdit;
