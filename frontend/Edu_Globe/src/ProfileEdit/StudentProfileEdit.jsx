import React, { useState, useEffect } from "react";
import axios from "axios";
import '../css/StudentProfileEdit.css';
import { useNavigate } from "react-router-dom";

const ProfileUpdatePage = () => {
  const navigate = useNavigate();

  // include _id and __v in our state so we send everything back
  const [formData, setFormData] = useState({
    _id: "",
    __v: 0,
    firstName: "",
    lastName: "",
    email: "",
    institution: "",
    department: "",
    password: "",
    studentId: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) return;

    const userData = JSON.parse(stored);
    setFormData({
      _id:         userData._id         || "",
      __v:         userData.__v         || 0,
      firstName:   userData.firstName   || "",
      lastName:    userData.lastName    || "",
      email:       userData.email       || "",
      institution: userData.institution || "",
      department:  userData.department  || "",
      password:    userData.password    || "",
      studentId:   userData.studentId   || ""
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // send all of formData—including _id and __v
      const response = await axios.put(
        'http://localhost:5000/updateProfile',
        formData
      );
      setMessage(response.data.message);

      if (response.data.student) {
        // backend is returning the updated student in `student`
        const updated = response.data.student;
        localStorage.setItem("userData", JSON.stringify(updated));
        // redirect
        navigate("/studentdash");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Profile update failed");
    }
  };

  return (
    <div className="profile-update">
      <h2>Update Your Profile</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name",  name: "lastName",  type: "text" },
          { label: "Email",      name: "email",     type: "email" },
          { label: "Institution",name: "institution",type: "text" },
          { label: "Department", name: "department", type: "text" },
          { label: "Password",   name: "password",   type: "password" },
          { label: "Student ID", name: "studentId",  type: "text" }
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Hidden fields for _id and __v so they travel with the payload */}
        <input type="hidden" name="_id" value={formData._id} />
        <input type="hidden" name="__v" value={formData.__v} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileUpdatePage;
