import React, { useState } from 'react';
import axios from 'axios';
import '../css/Teacheronline.css';  // Importing the CSS file

const LiveClassForm = () => {
  // States for all input fields
  const [inputValue, setInputValue] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [classTime, setClassTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission

  // Function to handle pasting (optional functionality if needed)
  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setInputValue(text);
    });
  };

  // Function to handle posting data to the server (saving to database)
  const handlePost = async () => {
    if (inputValue && instructorName && courseName && classTime) {
      setIsSubmitting(true);  // Set submitting state to true when submitting the form

      try {
        // Make a POST request to your backend API to save data
        const response = await axios.post('http://localhost:5000/api/liveclass', {
          liveClassName: inputValue,
          instructorName,
          courseName,
          classTime,
        });
        if (response.status === 200) {
          alert('Data saved successfully!');
        }
      } catch (error) {
        console.error('Error posting data:', error);
        alert('Failed to save data');
      } finally {
        setIsSubmitting(false);  // Reset submitting state
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Function to detect URLs and return a clickable hyperlink
  const renderWithLinks = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.split(urlPattern).map((part, index) => 
      urlPattern.test(part) ? (
        <a href={part} key={index} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="live-class-form">
      <h1>Live Class Form</h1>
      <div>
        {/* Input for live class name (URL) */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter live class link or description"
          className="input-box"
        />
      </div>
      <div>
        {/* Input for Instructor Name */}
        <input
          type="text"
          value={instructorName}
          onChange={(e) => setInstructorName(e.target.value)}
          placeholder="Enter instructor name"
          className="input-box"
        />
      </div>
      <div>
        {/* Input for Course Name */}
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Enter course name"
          className="input-box"
        />
      </div>
      <div>
        {/* Input for Class Time */}
        <input
          type="text"
          value={classTime}
          onChange={(e) => setClassTime(e.target.value)}
          placeholder="Enter class time"
          className="input-box"
        />
      </div>
      <div className="buttons">
        <button onClick={handlePaste} className="button paste-button" disabled={isSubmitting}>
          Paste
        </button>
        <button 
          onClick={handlePost} 
          className="button post-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {inputValue && (
        <div className="live-class-preview">
          <h3>Preview:</h3>
          <p>{renderWithLinks(inputValue)}</p>
        </div>
      )}
    </div>
  );
};

export default LiveClassForm;
