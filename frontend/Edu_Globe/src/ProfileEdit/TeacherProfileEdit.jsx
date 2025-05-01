import React, { useState, useEffect } from "react";
import axios from "axios";
import '../css/TeacherProfileEdit.css';
import { useNavigate } from "react-router-dom";

const TeacherProfileEdit = () => {
  const navigate = useNavigate();

  // include _id, __v, and courses so we send the full object back
  const [formData, setFormData] = useState({
    _id:         "",
    __v:         0,
    firstName:   "",
    lastName:    "",
    email:       "",
    institution: "",
    degree:      "",
    password:    "",
    courses:     []  // array of course IDs
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) return;

    const teacher = JSON.parse(stored);
    setFormData({
      _id:         teacher._id         || "",
      __v:         teacher.__v         || 0,
      firstName:   teacher.firstName   || "",
      lastName:    teacher.lastName    || "",
      email:       teacher.email       || "",
      institution: teacher.institution || "",
      degree:      teacher.degree      || "",
      password:    teacher.password    || "",
      courses:     teacher.courses     || []
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:5000/teacher/update',
        formData
      );
      setMessage("Profile updated successfully!");
      if (response.data.teacher) {
        localStorage.setItem("userData", JSON.stringify(response.data.teacher));
        navigate("/teacherdash");
      }
    } catch (error) {
      console.error("Error updating teacher profile:", error);
      setMessage("Profile update failed");
    }
  };

  return (
    <div className="teacher-profile-update">
      <h2>Update Your Profile</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name",  name: "lastName",  type: "text" },
          { label: "Email",      name: "email",     type: "email", disabled: true },
          { label: "Institution",name: "institution",type: "text" },
          { label: "Degree",     name: "degree",    type: "text" },
          { label: "Password",   name: "password",   type: "password" }
        ].map(({ label, name, type, disabled }) => (
          <div key={name}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
        ))}

        {/* Hidden fields to carry metadata */}
        <input type="hidden" name="_id" value={formData._id} />
        <input type="hidden" name="__v" value={formData.__v} />
        {/* We don't render courses in the form, but we include them in the payload */}
        <input type="hidden" name="courses" value={JSON.stringify(formData.courses)} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default TeacherProfileEdit;
