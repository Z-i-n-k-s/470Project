// CreateQuiz.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateQuiz.css';

export default function CreateQuiz() {
  const [quizName, setQuizName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctIndex: 0 }
  ]);

  // fetch teacher's courses
  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (!stored) return;
    const teacherId = JSON.parse(stored)._id;
    axios.get(`http://localhost:5000/teacher/${teacherId}/courses`)
      .then(res => setCourses(res.data))
      .catch(console.error);
  }, []);

  const handleQuestionChange = (i, field, val) =>
    setQuestions(qs => qs.map((q, j) => j===i ? { ...q, [field]: val } : q));

  const handleOptionChange = (qi, oi, val) =>
    setQuestions(qs => qs.map((q, j) => {
      if (j!==qi) return q;
      const opts = [...q.options]; opts[oi] = val;
      return { ...q, options: opts };
    }));

  const handleCorrectChange = (qi, oi) =>
    setQuestions(qs => qs.map((q, j) => j===qi ? { ...q, correctIndex: oi } : q));

  const addQuestion = () =>
    setQuestions(qs => [...qs, { text:'', options:['','','',''], correctIndex:0 }]);

  const createQuiz = async () => {
    if (!quizName.trim()) return alert('Enter a quiz name');
    if (!selectedCourse) return alert('Select a course');
    for (let i=0; i<questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim() || q.options.some(o=>!o.trim())) {
        return alert(`Fill out all fields for question ${i+1}`);
      }
    }
    const payload = { name: quizName, questions };
    try {
      const teacherId = JSON.parse(localStorage.getItem('userData'))._id;
      await axios.post(
        `http://localhost:5000/teacher/${teacherId}/courses/${selectedCourse}/quizzes`,
        payload
      );
      alert('Quiz created!');
      setQuizName(''); setSelectedCourse('');
      setQuestions([{ text:'', options:['','','',''], correctIndex:0 }]);
    } catch (e) {
      console.error(e);
      alert('Failed to create quiz');
    }
  };

  return (
    <div className="create-quiz-page">
      <h2>Create New Quiz</h2>

      <div className="form-group">
        <label>Quiz Name</label>
        <input
          type="text"
          value={quizName}
          onChange={e => setQuizName(e.target.value)}
          placeholder="Enter quiz title"
        />
      </div>

      <div className="form-group">
        <label>Select Course</label>
        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="">-- choose a course --</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>
              {c.Course_Name}
            </option>
          ))}
        </select>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} className="question-block">
          <div className="form-group">
            <label>Question {qi+1}</label>
            <input
              type="text"
              value={q.text}
              onChange={e => handleQuestionChange(qi, 'text', e.target.value)}
              placeholder="Enter question text"
            />
          </div>
          <div className="options">
            {q.options.map((opt, oi) => (
              <div key={oi} className="option-group">
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={q.correctIndex === oi}
                  onChange={() => handleCorrectChange(qi, oi)}
                />
                <input
                  type="text"
                  value={opt}
                  onChange={e => handleOptionChange(qi, oi, e.target.value)}
                  placeholder={`Option ${oi+1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="buttons">
        <button onClick={addQuestion}>Add Question</button>
        <button onClick={createQuiz}>Create Quiz</button>
      </div>
    </div>
  );
}
