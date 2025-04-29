import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Studentonline.css'; // Assuming you will create the CSS in a separate file

function StudentDashboard() {
    const [liveClasses, setLiveClasses] = useState([]);

    useEffect(() => {
        // Fetch the last data from the database when the component mounts
        axios.get('http://localhost:5000/api/liveclass')
            .then((response) => {
                setLiveClasses(response.data); // Assuming response data is an array of live class objects
            })
            .catch((error) => {
                console.error('Error fetching live classes:', error);
            });
    }, []); // Empty dependency array means this runs once when the component is mounted

    return (
        <div className="student-dashboard">
            <h1>Live Classes</h1>
            <div className="live-classes-container">
                {liveClasses.length === 0 ? (
                    <p>No live classes available at the moment.</p>
                ) : (
                    liveClasses.map((liveClass, index) => (
                        <div className="live-class-box" key={index}>
                            <h1>Course Name: {liveClass.courseName}</h1>
                            <h1>Instructor Name: {liveClass.instructorName}</h1>
                            <h1>Class Time: {liveClass.classTime}</h1>
                            <a href={liveClass.liveClassName}>
                                Click Here
                            </a>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;
