// StudentInfo.jsx - Fixed version
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Admindash.css';

function StudentInfo() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [studentDetails, setStudentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // The issue is here - we need to match the actual endpoint structure
        fetch(`http://localhost:5000/students/${studentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Student not found');
                }
                return response.json();
            })
            .then(data => {
                setStudentDetails(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching student details:", error);
                setLoading(false);
            });
    }, [studentId]);

    const handleBack = () => {
        navigate('/admindash');
    };

    if (loading) {
        return <div className="loading-container">Loading student details...</div>;
    }

    if (!studentDetails) {
        return <div className="not-found-container">Student not found!</div>;
    }

    return (
        <div className="detail-page">
            <div className="detail-card">
                <h2 className="detail-title">Student Information</h2>
                <div className="detail-content">
                    <p><strong>Name:</strong> {`${studentDetails.firstName} ${studentDetails.lastName}`}</p>
                    <p><strong>Email:</strong> {studentDetails.email}</p>
                    <p><strong>ID:</strong> {studentDetails._id}</p>
                    <p><strong>Student ID:</strong> {studentDetails.studentId}</p>
                    <p><strong>Institution:</strong> {studentDetails.institution || "N/A"}</p>
                    <p><strong>Department:</strong> {studentDetails.department || "N/A"}</p>
                </div>
                
                <button className="back-button" onClick={handleBack}>← Back to Dashboard</button>
            </div>
        </div>
    );
}

export default StudentInfo;