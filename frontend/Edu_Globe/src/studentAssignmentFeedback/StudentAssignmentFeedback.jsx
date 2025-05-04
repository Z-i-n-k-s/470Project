// StudentAssignmentFeedback.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import './StudentAssignmentFeedback.css';

const StudentAssignmentFeedback = () => {
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [feedbackByAnswer, setFeedbackByAnswer] = useState({});

  const stored = localStorage.getItem("userData");
  const studentId = stored ? JSON.parse(stored)._id : null;

  // 1. fetch all submissions
  useEffect(() => {
    if (!studentId) return;
    axios
      .get(`http://localhost:5000/assignment-answers?studentId=${studentId}`)
      .then(({ data }) => setSubmittedAnswers(data))
      .catch(err => console.error("Error fetching submissions:", err));
  }, [studentId]);

  // 2. fetch feedback for each submission
  useEffect(() => {
    submittedAnswers.forEach(sub => {
      axios
        .get(`http://localhost:5000/assignment-feedback/by-answer?assignmentAnswerId=${sub._id}`)
        .then(({ data }) => {
          const fbText = Array.isArray(data) && data.length ? data[0].feedback : null;
          setFeedbackByAnswer(prev => ({ ...prev, [sub._id]: fbText }));
        })
        .catch(err => {
          console.error(`Error fetching feedback for ${sub._id}:`, err);
          setFeedbackByAnswer(prev => ({ ...prev, [sub._id]: null }));
        });
    });
  }, [submittedAnswers]);

  return (
    <div className="student-feedback-container">
      <h2>Your Submissions & Feedback</h2>

      {submittedAnswers.length === 0
        ? <p className="no-submissions">You haven’t submitted any assignments yet.</p>
        : submittedAnswers.map(sub => (
          <div key={sub._id} className="submission-card">
            {sub.answers?.[0]?.image && (
              <img
                src={sub.answers[0].image}
                alt="Your submission"
                className="submission-image"
              />
            )}
            <div className="feedback-box">
              <h4>Feedback:</h4>
              {feedbackByAnswer[sub._id] == null
                ? <p className="no-feedback"><em>No feedback yet.</em></p>
                : <p>{feedbackByAnswer[sub._id]}</p>
              }
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default StudentAssignmentFeedback;
