import React, { useState, useEffect } from 'react';
import '../css/Recordclass.css';
import axios from 'axios';

const Recordedclass = () => {
  const [course, setCourse] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieve teacherId from localStorage
  const stored = localStorage.getItem('userData');
  const teacherId = stored ? JSON.parse(stored)._id : null;

  // Fetch teacher's courses for dropdown
  useEffect(() => {
    if (!teacherId) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/teacher/${teacherId}/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error fetching courses:', err))
      .finally(() => setLoading(false));
  }, [teacherId]);

  // Fetch existing videos (populated with course info)
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/videos')
      .then(res => setVideoList(res.data))
      .catch(err => console.error('Error fetching videos:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!course || !videoUrl) {
      alert('Please select a course and provide a video URL');
      return;
    }

    setLoading(true);
    try {
      const { data: newVideo } = await axios.post(
        'http://localhost:5000/api/videos',
        { course, videoUrl }
      );
      setVideoList(prev => [...prev, newVideo]);
      setCourse('');
      setVideoUrl('');
      alert('Video uploaded successfully!');
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-library-container">
      <h1 className="video-library-title">Pre-Recorded Classes</h1>

      <form onSubmit={handleSubmit} className="video-form">
        <div className="form-group">
          <label htmlFor="course-select">Select Course</label>
          <select
            id="course-select"
            value={course}
            onChange={e => setCourse(e.target.value)}
            required
          >
            <option value="">-- Select a course --</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>
                {c.Course_Name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="video-url">Video URL</label>
          <input
            id="video-url"
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="upload-btn">
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>

      
    </div>
  );
};

export default Recordedclass;