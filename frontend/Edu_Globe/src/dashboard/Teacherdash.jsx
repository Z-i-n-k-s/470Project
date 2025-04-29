import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import '../CSS/Teacherdash.css';

function TeacherDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const [publishedAnnouncements, setPublishedAnnouncements] = useState([]);

    const yourCourses = ["React Basics", "DBMS", "AI Fundamentals"];
    const activities = ["Joined AI Workshop", "Submitted Assignment 2"];
    const examDates = ["CSE101 - May 10", "CSE202 - May 12"];
    const classLectures = ["Lecture 1 - Intro to AI", "Lecture 2 - Relational Algebra"];

    const handlePublish = () => {
        if (announcement.trim()) {
            setPublishedAnnouncements([...publishedAnnouncements, announcement]);
            setAnnouncement('');
        }
    };

    return (
        <div className="student-page">
            {/* Top Navbar */}
            <div className="top-navbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                <h1>Teacher Dashboard</h1>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
                <ul>
                   <Link to = '/teacheronline'>Live Class  </Link> 
                   <li><Link to = '/teacherprofileedit'>Edit Profile  </Link> </li>
                    <li>Your Courses</li>
                    <li>Activities</li>
                    <li>Announcements</li>
                    <li>Exam Dates</li>
                    <li>Lectures</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-container">
                {/* First Row */}
                <div className="row">
                    <div className="box">
                        <h2>Your Courses</h2>
                        {yourCourses.map((course, index) => (
                            <div key={index} className="item">{course}</div>
                        ))}
                    </div>

                    <div className="box">
                        <h2>Student Activities</h2>
                        {activities.map((activity, index) => (
                            <div key={index} className="item">{activity}</div>
                        ))}
                    </div>

                    <div className="box">
                        <h2>Announcements</h2>
                        {publishedAnnouncements.length === 0 ? (
                            <div className="item">No announcements yet</div>
                        ) : (
                            publishedAnnouncements.map((note, index) => (
                                <div key={index} className="item">{note}</div>
                            ))
                        )}
                    </div>
                </div>

                {/* Second Row */}
                <div className="row">
                    <div className="box">
                        <h2>Exam Date</h2>
                        {examDates.map((date, index) => (
                            <div key={index} className="item">{date}</div>
                        ))}
                    </div>

                    <div className="box">
                        <h2>Class Lectures</h2>
                        {classLectures.map((lecture, index) => (
                            <div key={index} className="item">{lecture}</div>
                        ))}
                    </div>

                    <div className="box">
                        <h2>Publish Announcement</h2>
                        <input
                            type="text"
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                            placeholder="Type your announcement"
                            className="announcement-input"
                        />
                        <button onClick={handlePublish}>Publish</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
