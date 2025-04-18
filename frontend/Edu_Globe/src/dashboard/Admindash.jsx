import React, { useState, useEffect } from 'react';
import '../css/Admindash.css';
import { Link } from "react-router-dom";

function Admin() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState(["John Doe", "Jane Smith", "Mike Johnson"]);
    const [teachers, setTeachers] = useState(["Prof. Alan", "Dr. Emily", "Mr. Brown"]);
    const [announcements, setAnnouncements] = useState([
        "📢 New course on AI starting next week!",
        "📢 Midterm exams scheduled for May 10"
    ]);
    const [newAnnouncement, setNewAnnouncement] = useState("");

    useEffect(() => {
        fetch('http://localhost:5000/courses')
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error("Error fetching courses:", error));
    }, []);

    const publishAnnouncement = () => {
        if (newAnnouncement.trim() !== "") {
            setAnnouncements([newAnnouncement, ...announcements]);
            setNewAnnouncement("");
        }
    };

    return (
        <div className="admin-page">
            {/* Top Navbar */}
            <div className="top-navbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                <h1>Admin Dashboard</h1>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
                <ul>
                    <li>Dashboard</li>
                    <li>Courses</li>
                    <li>Students</li>
                    <li>Teachers</li>
                    <li>Announcements</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-container">

                {/* Courses */}
                <div className="box scrollable">
                    <h2>Courses</h2>
                    {courses.map((course, index) => (
                        <div className="item" key={index}>
                            <span>{course.Course_Name}</span>
                            <Link to={`/course/${encodeURIComponent(course.Course_Name)}`}>
                                <button>Details</button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Students */}
                <div className="box scrollable">
                    <h2>Students</h2>
                    {students.map((student, index) => (
                        <div className="item" key={index}>
                            <span>{student}</span>
                            <button>See More</button>
                        </div>
                    ))}
                </div>

                {/* Teachers */}
                <div className="box scrollable">
                    <h2>Teachers</h2>
                    {teachers.map((teacher, index) => (
                        <div className="item" key={index}>
                            <span>{teacher}</span>
                            <button>See More</button>
                        </div>
                    ))}
                </div>

                {/* Announcements */}
                <div className="box announcement-box">
                    <h2>Announcements</h2>

                    <div className="announcement-input">
                        <input
                            type="text"
                            value={newAnnouncement}
                            onChange={(e) => setNewAnnouncement(e.target.value)}
                            placeholder="Write your announcement here..."
                        />
                        <button onClick={publishAnnouncement}>Publish</button>
                    </div>

                    <div className="announcement-list">
                        {announcements.map((note, index) => (
                            <div className="item" key={index}>
                                <span>{note}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Admin;