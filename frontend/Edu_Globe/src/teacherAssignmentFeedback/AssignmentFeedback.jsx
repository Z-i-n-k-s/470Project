import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AssignmentFeedback.css';

const AssignmentFeedback = () => {
  const [questions, setQuestions] = useState([]);
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [feedbacks, setFeedbacks] = useState({});          // { [answerId]: string }
  const [feedbacksGiven, setFeedbacksGiven] = useState({}); // { [answerId]: true }

  const stored = localStorage.getItem('userData');
  if (!stored) return null;

  const teacher = JSON.parse(stored);
  const teacherID = teacher._id;

  // fetch questions + answers
  useEffect(() => {
    if (!teacherID) return;
    axios
      .get(`http://localhost:5000/assignments-questions?teacherId=${teacherID}`)
      .then(({ data }) => {
        setQuestions(data);
        data.forEach((question) => {
          axios
            .get(`http://localhost:5000/assignment-answers-questions?assignmentQuestionId=${question._id}`)
            .then(({ data: answers }) => {
              setAnswersByQuestion(prev => ({
                ...prev,
                [question._id]: answers,
              }));
            })
            .catch(err => console.error(err));
        });
      })
      .catch(err => console.error(err));
  }, [teacherID]);

  // fetch already-given feedbacks
  useEffect(() => {
    if (!teacherID) return;
    axios
      .get(`http://localhost:5000/assignment-feedback?teacherId=${teacherID}`)
      .then(({ data }) => {
        const map = {};
        data.forEach(fb => {
          map[fb.assignmentAnswerId] = true;
        });
        setFeedbacksGiven(map);
      })
      .catch(err => console.error(err));
  }, [teacherID]);

  const handleFeedbackChange = (answerId, value) => {
    setFeedbacks(prev => ({ ...prev, [answerId]: value }));
  };

  const submitFeedback = async (answerId) => {
    const text = feedbacks[answerId];
    if (!text) return;
    try {
      await axios.post('http://localhost:5000/assignment-feedback', {
        assignmentAnswerId: answerId,
        teacherId: teacherID,
        feedback: text,
      });
      // mark as given
      setFeedbacksGiven(prev => ({ ...prev, [answerId]: true }));
      setFeedbacks(prev => ({ ...prev, [answerId]: '' }));
      alert('Feedback submitted!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback.');
    }
  };

  return (
    <div className="assignment-feedback-container">
      <h2>Assignment Feedback</h2>

      {questions.length === 0 ? (
        <p>No assignment questions found.</p>
      ) : (
        questions.map(q => {
          // only show answers that don't have feedback yet
          const pendingAnswers = (answersByQuestion[q._id] || [])
            .filter(ans => !feedbacksGiven[ans._id]);

          return (
            <div key={q._id} className="question-block">
              <h3>{q.assignmentName}</h3>
              <p><strong>Question:</strong> {q.assignmentQuestion}</p>

              {pendingAnswers.length > 0 ? (
                <div className="answers-list">
                  <h4>Awaiting Feedback:</h4>
                  {pendingAnswers.map(ans => (
                    <div key={ans._id} className="answer-item">
                      <p><strong>Student ID:</strong> {ans.studentId}</p>
                      {ans.answers?.[0]?.image && (
                        <img
                          src={ans.answers[0].image}
                          alt={`Submission by ${ans.studentId}`}
                          className="submitted-image"
                        />
                      )}
                      <textarea
                        placeholder="Write feedback..."
                        value={feedbacks[ans._id] || ''}
                        onChange={e => handleFeedbackChange(ans._id, e.target.value)}
                      />
                      <button onClick={() => submitFeedback(ans._id)}>
                        Submit Feedback
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>All submissions for this question have feedback.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default AssignmentFeedback;
