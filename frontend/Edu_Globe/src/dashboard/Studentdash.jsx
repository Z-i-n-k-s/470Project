import React, { useState, useEffect } from 'react';
import '../CSS/Studentdash.css';

function Student() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [addedCourses, setAddedCourses] = useState([]);

    const announcements = [
        "📢 Midterm on May 10",
        "📢 AI Workshop this Friday",
        "📢 New course: DevOps Essentials"
    ];
    const scholarships = ["Merit Scholarship", "Need-based Aid", "Sports Scholarship"];
    const results = ["CSE101: A", "CSE102: B+", "CSE103: A-"];
    const examRoutine = ["CSE101 - May 10", "CSE102 - May 12", "CSE103 - May 15"];

    // Fetch courses on component mount
    useEffect(() => {
        fetch('http://localhost:5000/courses')
            .then(response => response.json())
            .then(data => setAvailableCourses(data))
            .catch(error => console.error("Error fetching courses:", error));
    }, []);

    const addCourse = (course) => {
        if (!addedCourses.includes(course)) {
            setAddedCourses([...addedCourses, course]);
        }
    };

    return (
        <div className="student-page">
            {/* Top Navbar */}
            <div className="top-navbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
                <h1>Student Dashboard</h1>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
                <ul>
                    <li>Dashboard</li>
                    <li>Courses</li>
                    <li>Results</li>
                    <li>Scholarships</li>
                    <li>Exam Routine</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-container">
                {/* First Row */}
                <div className="row">
                    <div className="box scrollable">
                        <h2>Available Courses</h2>
                        {availableCourses.map((course, index) => (
                            <div className="item" key={index}>
                                <span>{course.Course_Name}</span>
                                
                                <button onClick={() => addCourse(course.Course_Name)}>ADD</button>
                                
                            </div>
                        ))}
                    </div>


                    <div className="box scrollable">
                        <h2>My Courses</h2>
                        {addedCourses.map((course, index) => (
                            <div className="item" key={index}>
                                <span>{course}</span>
                                <button>Details</button>
                            </div>
                        ))}
                    </div>

                    <div className="box">
                        <h2>Announcements</h2>
                        {announcements.map((note, index) => (
                            <div className="item" key={index}>
                                <span>{note}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second Row */}
                <div className="row">
                    <div className="box">
                        <h2>Scholarships</h2>
                        {scholarships.map((scholarship, index) => (
                            <div className="item" key={index}>
                                <span>{scholarship}</span>
                            </div>
                        ))}
                    </div>

                    <div className="box">
                        <h2>Results</h2>
                        {results.map((result, index) => (
                            <div className="item" key={index}>
                                <span>{result}</span>
                            </div>
                        ))}
                    </div>

                    <div className="box">
                        <h2>Exam Routine</h2>
                        {examRoutine.map((exam, index) => (
                            <div className="item" key={index}>
                                <span>{exam}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Student;
