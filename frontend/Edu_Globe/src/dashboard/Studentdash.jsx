import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS/Studentdash.css";

function Student() {


  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse]   = useState(null);
  const [showPopup, setShowPopup]             = useState(false);
  const [showModal, setShowModal]             = useState(false);
  const stored = localStorage.getItem("userData");
  const studentId = stored ? JSON.parse(stored)._id : null;

  const announcements = [
    "📢 Midterm on May 10",
    "📢 AI Workshop this Friday",
    "📢 New course: DevOps Essentials",
  ];
  const results = ["CSE101: A", "CSE102: B+", "CSE103: A-"];
  const examRoutine = ["CSE101 - May 10", "CSE102 - May 12", "CSE103 - May 15"];

  // 1. Fetch all courses
  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then(r => r.json())
      .then(setAvailableCourses)
      .catch(e => console.error(e));
  }, []);

  // 2. Fetch enrolled courses
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:5000/student/${studentId}/courses`)
      .then(r => r.json())
      .then(setEnrolledCourses)
      .catch(e => console.error(e));
  }, [studentId]);

  // 3. Derive not enrolled
  const notEnrolled = availableCourses.filter(
    c => !enrolledCourses.some(ec => ec._id === c._id)
  );

  const handleEnrollClick = course => {
    setSelectedCourse(course);
    setShowPopup(true);
  };

  const cancelEnroll = () => {
    setShowPopup(false);
    setSelectedCourse(null);
  };

  const confirmEnroll = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/student/${studentId}/courses/${selectedCourse._id}/enroll`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Enroll failed");

      // locally update enrolled list
      setEnrolledCourses(ec => [...ec, selectedCourse]);
      alert("Enrollment successful!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      cancelEnroll();
    }
  };
  return (
    <div className="student-page">
      {/* Top Navbar */}
      <div className="top-navbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <h1>Student Dashboard</h1>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <ul>
          <Link to="/studentonline">Live Class</Link>
          <Link to="/studentprofileedit">LProfile</Link>
          <li>Courses</li>
          <li>Results</li>
          <li>Scholarships</li>
          <li>Exam Routine</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-container-3col">
      {/* Available */}
      <div className="column box scrollable">
        <h2>Available Courses</h2>
        {notEnrolled.map(course => (
          <div className="item" key={course._id}>
            <div>
              <strong>{course.Course_Name}</strong> – ₹{course.price}
            </div>
            <button className="add-btn" onClick={() => handleEnrollClick(course)}>
              Enroll
            </button>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div className="column box scrollable">
        <h2>My Courses</h2>
        {enrolledCourses.map(course => (
          <div className="item" key={course._id}>
            <span>{course.Course_Name}</span>
            <button
              className="details-btn"
              onClick={() => {
                setSelectedCourse(course);
                setShowModal(true);
              }}
            >
              Details
            </button>
          </div>
        ))}
      </div>

      {/* Enrollment Confirmation Popup */}
      {showPopup && selectedCourse && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Confirm Enrollment</h3>
            <p>
              Enroll in <strong>{selectedCourse.Course_Name}</strong> for ₹
              {selectedCourse.price}?
            </p>
            <div className="popup-buttons">
              <button onClick={confirmEnroll}>Yes, Enroll</button>
              <button onClick={cancelEnroll}>Cancel</button>
            </div>
          </div>
        </div>
      )}

        {showModal && selectedCourse && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2>{selectedCourse.Course_Name}</h2>
              <p>
                <strong>Credits:</strong> {selectedCourse.Credit}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedCourse.price}
              </p>
              <p>
                <strong>Schedule:</strong> {selectedCourse.Schedule}
              </p>
              <p>
                <strong>Location:</strong> {selectedCourse.Location}
              </p>
              <p>
                <strong>Prerequisites:</strong> {selectedCourse.Prerequisites}
              </p>
              <p>
                <strong>Difficulty:</strong> {selectedCourse.Difficulty}
              </p>
              <p>
                <strong>Exam Format:</strong> {selectedCourse.Exam_Format}
              </p>
              <p>
                <strong>Description:</strong> {selectedCourse.Description}
              </p>
            </div>
          </div>
        )}

        {/* Column 3 - Announcements, Exam Routine, Results */}
        <div className="column">
          <div className="box">
            <h2>Announcements</h2>
            {announcements.map((note, index) => (
              <div className="item" key={index}>
                <span>{note}</span>
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

          <div className="box">
            <h2>Results</h2>
            {results.map((result, index) => (
              <div className="item" key={index}>
                <span>{result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
