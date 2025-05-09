// TeacherDashboard.jsx
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
} from "recharts";
import "../CSS/Teacherdash.css";

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [yourCourses, setYourCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [announceCourse, setAnnounceCourse] = useState("");
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceContent, setAnnounceContent] = useState("");

  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [formData, setFormData] = useState({
    Course_Name: "",
    Course_Initial: "",
    Credit: 0,
    Department: "",
    instructor: "",
    studentsEnrolled: [],
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

  // 1. Fetch teacher's courses
  useEffect(() => {
    if (!teacherId) return;
    axios
      .get(`http://localhost:5000/teacher/${teacherId}/courses`)
      .then(({ data }) => setYourCourses(data))
      .catch(console.error);
  }, [teacherId]);

  // 2. Fetch existing announcements
  useEffect(() => {
    if (!teacherId) return;
    axios
      .get(
        `http://localhost:5000/announcements/by-teacher?teacherId=${teacherId}`
      )
      .then(({ data }) => setAnnouncements(data))
      .catch(console.error);
  }, [teacherId]);

  // 3. Publish new announcement: POST to API then prepend locally
  const handlePublish = async () => {
    if (!announceCourse || !announceTitle.trim() || !announceContent.trim()) {
      return alert("Please select a course, title, and content.");
    }

    try {
      const payload = {
        teacherId,
        courseId: announceCourse,
        title: announceTitle.trim(),
        announcement: announceContent.trim(),
      };
      const { data: newAnn } = await axios.post(
        "http://localhost:5000/announcements",
        payload
      );
      setAnnouncements((prev) => [newAnn, ...prev]);

      // reset form
      setAnnounceCourse("");
      setAnnounceTitle("");
      setAnnounceContent("");
    } catch (err) {
      console.error("Failed to publish announcement:", err);
      alert("Error publishing announcement.");
    }
  };

  // Chart data
  const enrollmentData = yourCourses.map((c) => ({
    name: c.Course_Initial,
    students: c.studentsEnrolled?.length || 0,
  }));
  const revenueData = yourCourses.map((c) => ({
    name: c.Course_Initial,
    revenue: (c.studentsEnrolled?.length || 0) * c.price,
  }));

  // Create course modal
  const handleCreateCourse = () => {
    axios
      .post(`http://localhost:5000/teacher/${teacherId}/courses`, formData)
      .then(() => {
        alert("Course created!");
        setShowCoursePopup(false);
        window.location.reload();
      })
      .catch(() => alert("Failed to create course"));
  };


   const [adsId, setAdsId] = useState(null);
    // First, update the setSlots state declaration in the component
    const [slots, setSlots] = useState([
      { file: null, preview: null, existing: null },
      { file: null, preview: null, existing: null },
      { file: null, preview: null, existing: null },
    ]);
  
    // Add these states for the slider functionality
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
  
    // Update the existing useEffect that fetches ads
    useEffect(() => {
      const fetchAds = async () => {
        try {
          const res = await fetch("http://localhost:5000/ads");
          if (!res.ok) throw new Error("Fetch error");
          const data = await res.json();
          if (data.length > 0) {
            const ad = data[0]; // assume first
            setAdsId(ad._id);
            setSlots([
              {
                file: null,
                preview: ad.image1 || null,
                existing: ad.image1 || null,
              },
              {
                file: null,
                preview: ad.image2 || null,
                existing: ad.image2 || null,
              },
              {
                file: null,
                preview: ad.image3 || null,
                existing: ad.image3 || null,
              },
            ]);
            setIsLoaded(true);
          }
        } catch (err) {
          console.error("Error loading ads:", err);
        }
      };
      fetchAds();
    }, []);
  
    // Add auto-slide functionality
    useEffect(() => {
      if (!isLoaded) return;
  
      // Filter out empty slots
      const validSlots = slots.filter((slot) => slot.preview || slot.existing);
      if (validSlots.length <= 1) return; // No need for slider with 0 or 1 image
  
      const interval = setInterval(() => {
        setCurrentSlide((current) =>
          current === validSlots.length - 1 ? 0 : current + 1
        );
      }, 5000); // Change slide every 5 seconds
  
      return () => clearInterval(interval);
    }, [slots, isLoaded]);
  
    // Function to handle manual navigation
    const goToSlide = (index) => {
      setCurrentSlide(index);
    };
  
    // Function to get valid slides
    const getValidSlides = () => {
      return slots.filter((slot) => slot.preview || slot.existing);
    };
  

  return (
    <div className="teacher-page">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="navbar-left">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="hamburger-icon">☰</span>
          </button>
        </div>
        <div className="navbar-center">
          <h1>Teacher Dashboard</h1>
        </div>
        <div className="navbar-right">
          {/* Optional: Add profile or notification icons here */}
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </button>
        <ul className="sidebar-menu">
          <li>
            <Link to="/teacheronline">Live Class</Link>
          </li>
          <li>
            <Link to="/teacherprofileedit">Edit Profile</Link>
          </li>
          <li>
            <Link to="/createassignment">New Assignment</Link>
          </li>
          <li>
            <Link to="/assignmentfeedback">Assignment Feedback</Link>
          </li>
          <li>
            <Link to="/createQuiz">New Quiz</Link>
          </li>
          <li>
            <Link to="/recordedclass">Recorded Class</Link>
          </li>
          <li>
            <Link
              to="/logout"
              style={{
                backgroundColor: "#ff6b6b",
                color: "white",
                fontWeight: "500",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5252")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#ff6b6b")}
              onClick={() => {
                // Optional: Clear local storage on logout
                localStorage.removeItem("userData");
                // You could also add any other logout logic here
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content - Restructured into 2 columns */}
      <main className="main-container">

 {/* Ads Content - ads image slider */}
 <div className="ads-row">
          <div className="slider-container">
            {isLoaded && getValidSlides().length > 0 ? (
              <>
                <div className="slides">
                  {getValidSlides().map((slot, index) => (
                    <div
                      className={`slide ${
                        index === currentSlide ? "active" : ""
                      }`}
                      key={index}
                      style={{
                        backgroundImage: `url(${
                          slot.preview || slot.existing
                        })`,
                        transform: `translateX(${
                          100 * (index - currentSlide)
                        }%)`,
                      }}
                    />
                  ))}
                </div>

                {getValidSlides().length > 1 && (
                  <>
                    <button
                      className="slider-btn prev-btn"
                      onClick={() =>
                        goToSlide(
                          currentSlide === 0
                            ? getValidSlides().length - 1
                            : currentSlide - 1
                        )
                      }
                    >
                      &#10094;
                    </button>
                    <button
                      className="slider-btn next-btn"
                      onClick={() =>
                        goToSlide(
                          currentSlide === getValidSlides().length - 1
                            ? 0
                            : currentSlide + 1
                        )
                      }
                    >
                      &#10095;
                    </button>

                    <div className="dots-container">
                      {getValidSlides().map((_, index) => (
                        <span
                          key={index}
                          className={`dot ${
                            index === currentSlide ? "active" : ""
                          }`}
                          onClick={() => goToSlide(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="loading-placeholder">Loading ads...</div>
            )}
          </div>
        </div>



        <div className="dashboard-columns">
          {/* Column 1: Your Courses and Enrollment Analytics */}
          <div className="dashboard-column">
            {/* Your Courses */}
            <div className="dashboard-box">
              <h2>Your Courses</h2>
              <div className="course-list">
                {yourCourses.length > 0 ? (
                  yourCourses.map((c) => (
                    <div key={c._id} className="course-item">
                      <strong>{c.Course_Name}</strong> ({c.Course_Initial})
                    </div>
                  ))
                ) : (
                  <p className="empty-message">
                    No courses yet. Create your first course!
                  </p>
                )}
              </div>
              <button
                className="action-button"
                onClick={() => setShowCoursePopup(true)}
              >
                + New Course
              </button>
            </div>

            {/* Enrollment Analytics */}
            <div className="dashboard-box chart-box">
              <h2>Enrollment Analytics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#4361ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Column 2: Publish Announcement and Revenue Analytics */}
          <div className="dashboard-column">
            {/* Publish Announcement */}
            <div className="dashboard-box">
              <h2>Publish Announcement</h2>

              {/* Past announcements */}
              {announcements.length > 0 && (
                <div className="announcement-list">
                  {announcements.map((a) => (
                    <div key={a._id} className="announcement-item">
                      <em className="announcement-course">
                        [
                        {yourCourses.find((c) => c._id === a.courseId)
                          ?.Course_Initial || "–"}
                        ]
                      </em>
                      <strong className="announcement-title">{a.title}</strong>
                      <p className="announcement-content">{a.announcement}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* New announcement form */}
              <div className="announcement-form">
                <label htmlFor="course-select">Course</label>
                <select
                  id="course-select"
                  value={announceCourse}
                  onChange={(e) => setAnnounceCourse(e.target.value)}
                >
                  <option value="">-- select course --</option>
                  {yourCourses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.Course_Name}
                    </option>
                  ))}
                </select>

                <label htmlFor="announcement-title">Title</label>
                <input
                  id="announcement-title"
                  type="text"
                  value={announceTitle}
                  onChange={(e) => setAnnounceTitle(e.target.value)}
                  placeholder="Announcement title"
                />

                <label htmlFor="announcement-content">Content</label>
                <textarea
                  id="announcement-content"
                  rows="3"
                  value={announceContent}
                  onChange={(e) => setAnnounceContent(e.target.value)}
                  placeholder="Announcement details..."
                />

                <button className="action-button" onClick={handlePublish}>
                  Publish
                </button>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="dashboard-box chart-box">
              <h2>Revenue Analytics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>

      {/* Course Creation Popup */}
      {showCoursePopup && (
        <div className="popup">
          <div className="popup-inner">
            <button
              className="close-popup"
              onClick={() => setShowCoursePopup(false)}
            >
              <span>×</span>
            </button>
            <h2>Create New Course</h2>

            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                value={formData.Course_Name}
                onChange={(e) =>
                  setFormData({ ...formData, Course_Name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Course Initial</label>
              <input
                type="text"
                value={formData.Course_Initial}
                onChange={(e) =>
                  setFormData({ ...formData, Course_Initial: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Credit</label>
              <input
                type="number"
                value={formData.Credit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Credit: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={formData.Department}
                onChange={(e) =>
                  setFormData({ ...formData, Department: e.target.value })
                }
              />
            </div>

            <input
              type="hidden"
              value={teacherId}
              onChange={(e) =>
                setFormData({ ...formData, instructor: e.target.value })
              }
            />

            <div className="form-group">
              <label>Prerequisites</label>
              <input
                type="text"
                value={formData.Prerequisites}
                onChange={(e) =>
                  setFormData({ ...formData, Prerequisites: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.Description}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Schedule</label>
              <input
                type="text"
                value={formData.Schedule}
                onChange={(e) =>
                  setFormData({ ...formData, Schedule: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.Location}
                onChange={(e) =>
                  setFormData({ ...formData, Location: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <input
                type="text"
                value={formData.Difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, Difficulty: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Exam Format</label>
              <input
                type="text"
                value={formData.Exam_Format}
                onChange={(e) =>
                  setFormData({ ...formData, Exam_Format: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Advanced</label>
              <input
                type="checkbox"
                checked={formData.advanced}
                onChange={(e) =>
                  setFormData({ ...formData, advanced: e.target.checked })
                }
              />
            </div>

            <button className="action-button" onClick={handleCreateCourse}>
              Create Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
