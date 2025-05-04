import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateAssignment.css";

const CreateAssignment = () => {
  const [form, setForm] = useState({
    teacherId: "",
    courseId: "",
    assignmentName: "",
    assignmentQuestion: "",
  });
  const [message, setMessage] = useState("");
  const [yourCourses, setYourCourses] = useState([]);
  const stored = localStorage.getItem("userData");
  const teacherId = stored ? JSON.parse(stored)._id : null;

  useEffect(() => {
    if (!teacherId) return;
    setForm((prev) => ({ ...prev, teacherId })); // set teacherId once
    axios
      .get(`http://localhost:5000/teacher/${teacherId}/courses`)
      .then(({ data }) => setYourCourses(data))
      .catch(console.error);
  }, [teacherId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/assignments", {
        teacherId: form.teacherId,
        courseId: form.courseId,
        assignmentName: form.assignmentName,
        assignmentQuestion: form.assignmentQuestion,
      });
      setMessage("Assignment created successfully!");
      setForm({
        teacherId,
        courseId: "",
        assignmentName: "",
        assignmentQuestion: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Error creating assignment.");
    }
  };

  return (
    <div className="create-assignment-container">
      <h2>Create Assignment</h2>
      <form onSubmit={handleSubmit} className="assignment-form">
        {/* Hidden teacher ID input */}
        <input type="hidden" name="teacherId" value={form.teacherId} />

        
        <label htmlFor="courseId">Course</label>
        <select
          id="courseId"
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a Course --</option>
          {yourCourses.map((course) => (
            <option
              key={course._id} // or course.courseId if that's what your API returns
              value={course._id} // <-- this is the one that gets sent
            >
              {course.Course_Name}
            </option>
          ))}
        </select>

        <label>Assignment Name</label>
        <input
          type="text"
          name="assignmentName"
          value={form.assignmentName}
          onChange={handleChange}
          required
        />

        <label>Question</label>
        <textarea
          name="assignmentQuestion"
          value={form.assignmentQuestion}
          onChange={handleChange}
          required
        />

        <button type="submit">Create</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateAssignment;
