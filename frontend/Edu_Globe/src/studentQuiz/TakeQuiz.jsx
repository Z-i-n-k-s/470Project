// TakeQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './TakeQuiz.css';

export default function TakeQuiz() {
  const location = useLocation();
  const { quizId, quizName, questions: initialQuestions } = location.state || {};

  // Retrieve student ID and token from localStorage
  const stored = localStorage.getItem('userData');
  let studentId = null;
  let token = null;
  if (stored) {
    const userData = JSON.parse(stored);
    studentId = userData._id;
    token = userData.token;
  }

  const [quiz, setQuiz] = useState(
    initialQuestions
      ? { _id: quizId, name: quizName, questions: initialQuestions }
      : null
  );
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!quiz && quizId) {
      fetch(`http://localhost:5000/quiz/${quizId}`)
        .then((res) => res.json())
        .then((data) => {
          setQuiz({ _id: data._id, name: data.quizName, questions: data.questions });
        })
        .catch(console.error);
    }
  }, [quiz, quizId]);

  const handleSelect = (qi, oi) => {
    const newAnswers = [...answers];
    newAnswers[qi] = oi;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Calculate score locally
    const totalMarks = quiz.questions.length;
    let count = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) count++;
    });
    setScore(count);
    setSubmitted(true);

    // Save attempt to backend
    try {
      const res = await fetch('http://localhost:5000/quizAttempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // optionally include auth token if your backend requires it:
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz: quizId,
          student: studentId,
          answers,
          obtainedMarks: count,
          totalMarks: totalMarks
        })
      });
      const result = await res.json();
      if (!res.ok) {
        console.error('Submission error:', result.message || result);
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="take-quiz-page">
      <h2>{quiz.name}</h2>
      {quiz.questions.map((q, qi) => (
        <div key={qi} className="question-block">
          <p className="question-text">
            {qi + 1}. {q.text}
          </p>
          <div className="options">
            {q.options.map((opt, oi) => (
              <label key={oi} className="option-group">
                <input
                  type="radio"
                  name={`q-${qi}`}
                  value={oi}
                  disabled={submitted}
                  checked={answers[qi] === oi}
                  onChange={() => handleSelect(qi, oi)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="buttons">
        {!submitted ? (
          <button onClick={handleSubmit}>Submit Quiz</button>
        ) : (
          <div className="result">
            Your score: {score} / {quiz.questions.length}
          </div>
        )}
      </div>
    </div>
  );
}
