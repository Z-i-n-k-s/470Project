import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Certificate.css';
import CertificateSVG from '../assets/certificate.png';

const Certificate = () => {
  const navigate = useNavigate();
  const stored = localStorage.getItem('userData');
  const studentId = stored ? JSON.parse(stored)._id : 'demo-student-id'; // Fallback ID for demo

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [previewCourse, setPreviewCourse] = useState(null);

  const handleDashboardClick = () => {
    navigate('/studentdash');
  };

  // Fetch enrolled courses
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:5000/student/${studentId}/courses`)
      .then(res => res.json())
      .then(data => {
        // handle if API returns { courses: [] }
        const courses = data.courses || data;
        
        // If we don't have valid enrollment dates, add demo dates
        const coursesWithDates = courses.map(course => {
          if (!course.enrolledAt) {
            // Create random enrollment date within last 2 months
            const randomDaysAgo = Math.floor(Math.random() * 60); // 0-60 days ago
            const enrollDate = new Date();
            enrollDate.setDate(enrollDate.getDate() - randomDaysAgo);
            return { ...course, enrolledAt: enrollDate.toISOString() };
          }
          return course;
        });
        
        setEnrolledCourses(coursesWithDates);

        // Initialize timers for each course (4 months countdown)
        const now = Date.now();
        const timers = {};
        coursesWithDates.forEach(course => {
          const enrolledAt = new Date(course.enrolledAt).getTime();
          const endTime = enrolledAt + 4 * 30 * 24 * 60 * 60 * 1000; // 4 months after enrollment
          timers[course._id] = Math.max(endTime - now, 0); // Ensure positive value
        });
        setTimeRemaining(timers);
      })
      .catch(err => console.error(err));
  }, [studentId]);

  // Countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = {};
        Object.entries(prev).forEach(([id, ms]) => {
          updated[id] = ms - 1000;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = ms => {
    if (ms <= 0) return 'Expired';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Add demo courses if none are returned from API
  useEffect(() => {
    if (enrolledCourses.length === 0 && studentId) {
      // Create demo courses after a brief delay to simulate loading
      const timer = setTimeout(() => {
        const demoCourses = [
          {
            _id: 'demo-course-1',
            Course_Name: 'Web Development Fundamentals',
            enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 1 month ago
          },
          {
            _id: 'demo-course-2',
            Course_Name: 'Advanced React Programming',
            enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
          },
          {
            _id: 'demo-course-3',
            Course_Name: 'UI/UX Design Principles',
            enrolledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago
          }
        ];
        
        setEnrolledCourses(demoCourses);
        
        // Set up timers for demo courses
        const now = Date.now();
        const timers = {};
        demoCourses.forEach(course => {
          const enrolledAt = new Date(course.enrolledAt).getTime();
          const endTime = enrolledAt + 4 * 30 * 24 * 60 * 60 * 1000; // 4 months after enrollment
          timers[course._id] = endTime - now;
        });
        setTimeRemaining(timers);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [enrolledCourses.length, studentId]);

  return (
    <div className="certificate-container">
      {/* Dashboard button moved outside the header to be at the very top left */}
      <button 
        className="dashboard-button"
        onClick={handleDashboardClick}
      >
        Dashboard
      </button>
      
      <div className="certificate-header">
        <h2 className="certificate-title">Your Enrolled Courses</h2>
      </div>

      <div className="courses-column">
        {enrolledCourses.length === 0 ? (
          <div className="empty-courses">Loading courses...</div>
        ) : (
          enrolledCourses.map(course => (
            <div key={course._id} className="course-card">
              <span className="course-name">
                {course.Course_Name || course.Course_Initial}
              </span>
              <div className="course-timer">
                <span className="timer-label">Time Remaining:</span>
                <span className="timer-value">{formatTime(timeRemaining[course._id] || 0)}</span>
              </div>
              <button
                className="preview-button"
                onClick={() => setPreviewCourse(course._id)}
              >
                Preview Certificate
              </button>
            </div>
          ))
        )}
      </div>

      {previewCourse && (
        <div className="modal-overlay" onClick={() => setPreviewCourse(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setPreviewCourse(null)}
            >
              ×
            </button>
            <div className="certificate-image-container">
              <img
                src={CertificateSVG}
                alt="Certificate Preview"
                className="certificate-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificate;