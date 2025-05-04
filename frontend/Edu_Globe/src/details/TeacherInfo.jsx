// TeacherInfo.jsx - Fixed version
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Admindash.css';

function TeacherInfo() {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // The issue is here - we need to match the actual endpoint structure
        fetch(`http://localhost:5000/teachers/${teacherId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Teacher not found');
                }
                return response.json();
            })
            .then(data => {
                setTeacherDetails(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching teacher details:", error);
                setLoading(false);
            });
    }, [teacherId]);

    const handleBack = () => {
        navigate('/admindash');
    };

    if (loading) {
        return <div className="loading-container">Loading teacher details...</div>;
    }

    if (!teacherDetails) {
        return <div className="not-found-container">Teacher not found!</div>;
    }

    return (
        <div className="detail-page">
            <div className="detail-card">
                <h2 className="detail-title">Teacher Information</h2>
                <div className="detail-content">
                    <p><strong>Name:</strong> {`${teacherDetails.firstName} ${teacherDetails.lastName}`}</p>
                    <p><strong>Email:</strong> {teacherDetails.email}</p>
                    <p><strong>ID:</strong> {teacherDetails._id}</p>
                    <p><strong>Institution:</strong> {teacherDetails.institution || "N/A"}</p>
                    <p><strong>Degree:</strong> {teacherDetails.degree || "N/A"}</p>
                    <p><strong>Revenue:</strong> ${teacherDetails.revenue || 0}</p>
                    
                    {teacherDetails.courses && teacherDetails.courses.length > 0 && (
                        <div className="courses-section">
                            <h3>Teaching Courses</h3>
                            <ul className="courses-list">
                                {teacherDetails.courses.map((course, idx) => (
                                    <li key={idx}>{course}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                
                <button className="back-button" onClick={handleBack}>← Back to Dashboard</button>
            </div>
        </div>
    );
}

export default TeacherInfo;