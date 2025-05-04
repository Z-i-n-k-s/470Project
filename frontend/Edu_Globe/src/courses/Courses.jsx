// CourseInfo.jsx - Redesigned version
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/Courses.css';

function CourseInfo() {
    const { courseName, returnto } = useParams();
    const navigate = useNavigate();
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/course/${encodeURIComponent(courseName)}`)
            .then(response => response.json())
            .then(data => {
                setCourseDetails(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching course details:", error);
                setLoading(false);
            });
    }, [courseName]);

    const handleBack = () => {
        navigate(`/${returnto}`);
    };

    if (loading) {
        return <div className="loading-container">Loading course details...</div>;
    }

    if (!courseDetails) {
        return <div className="not-found-container">Course not found!</div>;
    }

    return (
        <div className="detail-page">
            <div className="detail-card">
                <h2 className="detail-title">Course Information</h2>
                <div className="detail-content">
                    <p><strong>Course:</strong> {courseDetails.Course_Name}</p>
                    <p><strong>Code:</strong> {courseDetails.Course_Initial}</p>
                    <p><strong>Credits:</strong> {courseDetails.Credit}</p>
                    <p><strong>Department:</strong> {courseDetails.Department}</p>
                    <p><strong>Instructor:</strong> {courseDetails.Instructor}</p>
                    <p><strong>Prerequisites:</strong> {courseDetails.Prerequisites}</p>
                    <p><strong>Description:</strong> {courseDetails.Description}</p>
                    <p><strong>Schedule:</strong> {courseDetails.Schedule}</p>
                    <p><strong>Location:</strong> {courseDetails.Location}</p>
                    <p><strong>Enrollment:</strong> {courseDetails.Enrollment}</p>
                    <p><strong>Difficulty:</strong> {courseDetails.Difficulty}</p>
                    <p><strong>Exam Format:</strong> {courseDetails.Exam_Format}</p>
                </div>
                
                <button className="back-button" onClick={handleBack}>← Back to Dashboard</button>
            </div>
        </div>
    );
}

export default CourseInfo;