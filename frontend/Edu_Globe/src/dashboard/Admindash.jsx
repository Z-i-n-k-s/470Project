import React, { useState } from 'react';
import '../css/Admindash.css'; // Import the updated CSS file

const AdminDash = () => {
  const [courses, setCourses] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [advertisementImage, setAdvertisementImage] = useState(null);

  const totalCourses = courses.length;
  const totalTeachers = 25; // Static for demonstration
  const totalStudents = 300; // Static for demonstration

  const handleAddCourse = () => {
    // Logic to add a new course
  };

  const handleDeleteCourse = (courseId) => {
    // Logic to delete a course
  };

  const handleEditCourse = (courseId) => {
    // Logic to edit a course
  };

  const handleAddAnnouncement = () => {
    // Logic to make announcement
  };

  const handleAddAdvertisement = (e) => {
    const file = e.target.files[0];
    setAdvertisementImage(URL.createObjectURL(file));
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <a href="#overview">Overview</a>
          <a href="#courses">Manage Courses</a>
          <a href="#announcements">Announcements</a>
          <a href="#advertisements">Advertisements</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <section id="overview" className="overview-section">
          <div className="overview-card">
            <h3>Total Courses</h3>
            <p>{totalCourses}</p>
          </div>
          <div className="overview-card">
            <h3>Total Teachers</h3>
            <p>{totalTeachers}</p>
          </div>
          <div className="overview-card">
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>
        </section>

        <section id="courses" className="course-management">
          <h3>Course Management</h3>
          <button onClick={handleAddCourse} className="btn">Add Course</button>
          <div className="course-list">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <p>{course.name}</p>
                <button onClick={() => handleEditCourse(course.id)} className="btn">Edit</button>
                <button onClick={() => handleDeleteCourse(course.id)} className="btn">Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section id="announcements" className="announcements">
          <h3>Make Announcement</h3>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Type your announcement here..."
          ></textarea>
          <button onClick={handleAddAnnouncement} className="btn">Post Announcement</button>
        </section>

        <section id="advertisements" className="advertisement">
          <h3>Add Advertisement</h3>
          <input type="file" onChange={handleAddAdvertisement} />
          {advertisementImage && (
            <div className="advertisement-preview">
              <img src={advertisementImage} alt="Advertisement" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDash;
