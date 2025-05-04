import React, { useState, useEffect } from "react";
import "./ViewRecord.css";

const ViewRecord = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseVideos, setCourseVideos] = useState({});

  // Get student ID from localStorage
  const stored = localStorage.getItem("userData");
  const studentId = stored ? JSON.parse(stored)._id : null;

  // 1. Fetch enrolled courses
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:5000/student/${studentId}/courses`)
      .then((res) => res.json())
      .then((data) => setEnrolledCourses(data))
      .catch((err) => console.error(err));
  }, [studentId]);

  // 2. For each course, fetch its videos
  useEffect(() => {
    enrolledCourses.forEach((course) => {
      fetch(`http://localhost:5000/api/videos/by-course?course=${course._id}`)
        .then((res) => {
          if (!res.ok) throw new Error("No videos found");
          return res.json();
        })
        .then((videos) => {
          setCourseVideos((prev) => ({
            ...prev,
            [course._id]: videos,
          }));
        })
        .catch(() => {
          setCourseVideos((prev) => ({
            ...prev,
            [course._id]: [],
          }));
        });
    });
  }, [enrolledCourses]);

  return (
    <div className="view-record-container">
      <h2 className="heading">My Course Videos</h2>

      {enrolledCourses.map((course) => (
        <div key={course._id} className="course-section">
          <h3 className="course-title">{course.Course_Name}</h3>

          {courseVideos[course._id]?.length > 0 ? (
            courseVideos[course._id].map((video) => {
              const { url, createdAt } = video.video; // <-- destructure the real URL here
              return (
                <div key={video._id} className="video-item">
                  <button
                    type="button" // <-- prevents form submission
                    className="video-button"
                    onClick={() => window.open(url, `${video.video.url}`)}
                  >
                    ▶️ Watch Video
                  </button>
                </div>
              );
            })
          ) : (
            <p className="no-videos">No videos available for this course.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewRecord;
