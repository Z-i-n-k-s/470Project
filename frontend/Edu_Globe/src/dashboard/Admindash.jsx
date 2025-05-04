import React, { useState, useEffect } from "react";
import "../css/Admindash.css";
import { Link } from "react-router-dom";

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // fetch courses
  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then((r) => r.json())
      .then(setCourses)
      .catch((e) => console.error(e));
  }, []);

  // fetch students
  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((r) => r.json())
      .then(setStudents)
      .catch((e) => console.error("Error fetching students:", e));
  }, []);

  // fetch teachers
  useEffect(() => {
    fetch("http://localhost:5000/teachers")
      .then((r) => r.json())
      .then(setTeachers)
      .catch((e) => console.error("Error fetching teachers:", e));
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar after selection on mobile
  };

  // Debug log to check if state is changing
  const toggleSidebar = () => {
    console.log("Current sidebar state:", sidebarOpen);
    setSidebarOpen(!sidebarOpen);
    console.log("New sidebar state:", !sidebarOpen);
  };
  return (
    <div className="admin-page">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="navbar-left">
          <button
            className="menu-btn"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <span className="menu-icon">☰</span>
          </button>
        </div>
        <div className="navbar-center">
          <h1>Admin Dashboard</h1>
        </div>
      </header>

      {/* Sidebar - added visible debugging */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Debug indicator */}

        <button
          className="close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <ul className="sidebar-menu">
          <li className={activeTab === "dashboard" ? "active" : ""}>
            <Link to="/admindash" >
              Dashboard
            </Link>
          </li>

          {/* New Create Ads link */}
          <li className={activeTab === "createads" ? "active" : ""}>
            <Link to="/createads" onClick={() => handleTabClick("createads")}>
              Create Ads
            </Link>
          </li>
          <li className="logout">
            <Link
              to="/logout"
              onClick={() => localStorage.removeItem("userData")}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
        {activeTab === "dashboard" && (
          <div className="dashboard-grid">
            {/* Overview Cards */}
            <div className="overview-cards">
              <div className="card">
                <h3>Total Courses</h3>
                <p className="card-value">{courses.length}</p>
              </div>
              <div className="card">
                <h3>Total Students</h3>
                <p className="card-value">{students.length}</p>
              </div>
              <div className="card">
                <h3>Total Teachers</h3>
                <p className="card-value">{teachers.length}</p>
              </div>
            </div>

            {/* Three Columns Grid */}
            <div className="three-column-grid">
              {/* Courses Column */}
              <div className="column">
                <div className="column-header">
                  <h2>Courses</h2>
                </div>
                <div className="column-content">
                  {courses.slice(0, 5).map((course) => (
                    <div
                      className="column-item"
                      key={course.id || course.Course_ID}
                    >
                      <div className="item-details">
                        <h4>{course.Course_Name}</h4>
                        <p>{course.Description?.substring(0, 50)}...</p>
                      </div>
                      <div className="item-actions">
                        <Link
                          to={`/course/${encodeURIComponent(
                            course.Course_Name
                          )}/admindash`}
                          className="button"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teachers Column */}
              <div className="column">
                <div className="column-header">
                  <h2>Teachers</h2>
                </div>
                <div className="column-content">
                  {teachers.map((teacher) => (
                    <div className="column-item" key={teacher._id}>
                      <div className="item-details">
                        <h4>{`${teacher.firstName} ${teacher.lastName}`}</h4>
                        <p>
                          {teacher.degree || teacher.institution || "Teacher"}
                        </p>
                      </div>
                      <div className="item-actions">
                        <Link
                          to={`/teacher/${encodeURIComponent(teacher._id)}`}
                          className="button"
                        >
                          See More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Students Column */}
              <div className="column">
                <div className="column-header">
                  <h2>Students</h2>
                </div>
                <div className="column-content">
                  {students.map((student) => (
                    <div className="column-item" key={student._id}>
                      <div className="item-details">
                        <h4>{`${student.firstName} ${student.lastName}`}</h4>
                        <p>
                          {student.department ||
                            student.institution ||
                            "Student"}
                        </p>
                      </div>
                      <div className="item-actions">
                        <Link
                          to={`/student/${encodeURIComponent(student._id)}`}
                          className="button"
                        >
                          See More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="courses-container">
            <h2>All Courses</h2>
            <div className="courses-grid">
              {courses.map((course) => (
                <div
                  className="course-card"
                  key={course.id || course.Course_ID}
                >
                  <h3>{course.Course_Name}</h3>
                  <p>{course.Description?.substring(0, 100)}...</p>
                  <Link
                    to={`/course/${encodeURIComponent(course.Course_Name)}`}
                    className="button"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="students-container">
            <h2>All Students</h2>
            <div className="students-list">
              {students.map((student) => (
                <div className="student-item" key={student._id}>
                  <div className="student-info">
                    <h3>{`${student.firstName} ${student.lastName}`}</h3>
                    <p>{student.email}</p>
                  </div>
                  <Link
                    to={`/student/${encodeURIComponent(student._id)}`}
                    className="button"
                  >
                    See More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "teachers" && (
          <div className="teachers-container">
            <h2>All Teachers</h2>
            <div className="teachers-list">
              {teachers.map((teacher) => (
                <div className="teacher-item" key={teacher._id}>
                  <div className="teacher-info">
                    <h3>{`${teacher.firstName} ${teacher.lastName}`}</h3>
                    <p>{teacher.degree || teacher.institution}</p>
                  </div>
                  <Link
                    to={`/teacher/${encodeURIComponent(teacher._id)}`}
                    className="button"
                  >
                    See More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* No modal needed anymore */}
    </div>
  );
}

export default Admin;
