import React, { useState, useEffect } from 'react';
import '../css/Recordclass.css'; // Importing the CSS file

const VideoLibrary = () => {
  const [course, setCourse] = useState('');
  const [chapter, setChapter] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch videos from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/videos') // Fetch videos from the backend
      .then(response => response.json())
      .then(data => {
        setVideoList(data); // Store the video data
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const videoData = {
      course,
      chapter,
      videoUrl
    };

    // Here you can make an API call to save the video data to your database
    fetch('http://localhost:5000/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData),
    })
      .then(response => response.json())
      .then(data => {
        setVideoList([...videoList, data]); // Add the newly added video to the list
        setLoading(false);
        setCourse('');
        setChapter('');
        setVideoUrl('');
      })
      .catch(error => {
        console.error('Error saving video:', error);
        setLoading(false);
      });
  };

  return (
    <div className="video-library-container">
      <h1 className="video-library-title">Pre-Recorded Classes</h1>

      {/* Video Upload Form */}
      <form onSubmit={handleSubmit} className="video-form">
        <label>Course</label>
        <input 
          type="text" 
          value={course} 
          onChange={(e) => setCourse(e.target.value)} 
          placeholder="Enter course name" 
          required
        />

        <label>Chapter</label>
        <input 
          type="text" 
          value={chapter} 
          onChange={(e) => setChapter(e.target.value)} 
          placeholder="Enter chapter name" 
          required
        />

        <label>Video URL</label>
        <input 
          type="url" 
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)} 
          placeholder="Enter video URL" 
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Upload Video'}
        </button>
      </form>

      {/* Video List Display */}
      <div className="video-list">
        {videoList.length === 0 ? (
          <p>No videos available yet.</p>
        ) : (
          videoList.map((video, index) => (
            <div key={index} className="video-card">
              <h3>{video.course} - {video.chapter}</h3>
              <video controls>
                <source src={video.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoLibrary;
