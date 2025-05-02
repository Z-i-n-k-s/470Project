import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import "../CSS/Teacherdash.css";

function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [yourCourses, setYourCourses] = useState([]);
  const [publishedAnnouncements, setPublishedAnnouncements] = useState([]);
  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [formData, setFormData] = useState({
    Course_Name: "",
    Course_Initial: "",
    Credit: 0,
    Department: "",
    Prerequisites: "",
    Description: "",
    Schedule: "",
    Location: "",
    Difficulty: "",
    Exam_Format: "",
    price: 0,
    advanced: false,
  });

  const stored = localStorage.getItem("userData");
  const teacherId = stored ? JSON.parse(stored)._id : null;

  useEffect(() => {
    if (!teacherId) return;
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/teacher/${teacherId}/courses`
        );
        setYourCourses(data);
      } catch (error) {
        console.error("Error fetching teacher courses:", error);
      }
    };
    fetchCourses();
  }, [teacherId]);

  const handlePublish = () => {
    if (announcement.trim()) {
      setPublishedAnnouncements((prev) => [...prev, announcement]);
      setAnnouncement("");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateCourse = async () => {
    try {
      await axios.post(
        `http://localhost:5000/teacher/${teacherId}/courses`,
        formData
      );
      alert("Course created successfully!");
      setShowCoursePopup(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating course", error);
      alert("Failed to create course");
    }
  };

  // Prepare data for charts
  const enrollmentData = yourCourses.map((c) => ({
    name: c.Course_Initial,
    students: c.studentsEnrolled?.length || 0,
  }));

  const revenueData = yourCourses.map((c) => ({
    name: c.Course_Initial,
    revenue: (c.studentsEnrolled?.length || 0) * c.price,
  }));

  return (
    <div className="student-page">
      {/* Top Navbar */}
      <div className="top-navbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <h1>Teacher Dashboard</h1>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <ul>
          <Link to="/teacheronline">Live Class</Link>
          <li>
            <Link to="/teacherprofileedit">Edit Profile</Link>
          </li>
          <li>Your Courses</li>
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
            {yourCourses.map((course) => (
              <div key={course._id} className="item">
                <strong>{course.Course_Name}</strong> ({course.Course_Initial})
              </div>
            ))}
            <button onClick={() => setShowCoursePopup(true)}>
              + New Course
            </button>
          </div>

          <div className="box">
            <h2>Announcements</h2>
            {publishedAnnouncements.length === 0 ? (
              <div className="item">No announcements yet</div>
            ) : (
              publishedAnnouncements.map((note, idx) => (
                <div key={idx} className="item">
                  {note}
                </div>
              ))
            )}
          </div>

          {/* Enrollment Analytics */}
          <div className="box">
            <h2>Enrollment Analytics</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" name="Enrolled" fill="blue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row */}
        <div className="row">
          <div className="box">
            <h2>Revenue Analytics</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" name="Revenue" fill="blue" />
              </BarChart>
            </ResponsiveContainer>
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

        {/* Create Course Popup */}
        {showCoursePopup && (
          <div className="popup">
            <div className="popup-inner">
              <button
                className="close-popup"
                onClick={() => setShowCoursePopup(false)}
              >
                ×
              </button>
              <h3>Create New Course</h3>
              {[
                { label: "Course Name", name: "Course_Name" },
                { label: "Course Initial", name: "Course_Initial" },
                { label: "Credit", name: "Credit", type: "number" },
                { label: "Department", name: "Department" },
                { label: "Prerequisites", name: "Prerequisites" },
                { label: "Description", name: "Description" },
                { label: "Schedule", name: "Schedule" },
                { label: "Location", name: "Location" },
                { label: "Difficulty", name: "Difficulty" },
                { label: "Exam Format", name: "Exam_Format" },
                { label: "Price", name: "price", type: "number" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className="input-group">
                  <label>{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="popup-input"
                  />
                </div>
              ))}
              <div className="input-group">
                <label>Advanced:</label>
                <input
                  type="checkbox"
                  name="advanced"
                  checked={formData.advanced}
                  onChange={handleChange}
                />
              </div>
              <div className="popup-actions">
                <button onClick={handleCreateCourse}>Create Course</button>
                <button onClick={() => setShowCoursePopup(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
