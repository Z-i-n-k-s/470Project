/* CreateAds.jsx */
import React, { useRef, useState, useEffect } from 'react';
import './CreateAds.css';
import { useNavigate } from 'react-router-dom';

const CreateAds = () => {
  // Store image data and track which ones should be empty
  const [imageData, setImageData] = useState({
    image1: { value: null, deleted: false },
    image2: { value: null, deleted: false },
    image3: { value: null, deleted: false }
  });
  const navigate = useNavigate();
  const [adsId, setAdsId] = useState(null);
  const fileInputs = [useRef(), useRef(), useRef()];

  // We'll convert files to base64 immediately on selection instead

  // Load existing ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch('http://localhost:5000/ads');
        if (!res.ok) throw new Error('Fetch error');
        const data = await res.json();
        if (data.length > 0) {
          const ad = data[0]; // assume first
          setAdsId(ad._id);
          setImageData({
            image1: { value: ad.image1 || null, deleted: false },
            image2: { value: ad.image2 || null, deleted: false },
            image3: { value: ad.image3 || null, deleted: false }
          });
        }
      } catch (err) {
        console.error('Error loading ads:', err);
      }
    };
    fetchAds();
  }, []);

  const handleSelect = (index, file) => {
    if (!file) return;
    
    // Convert to base64 immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const key = `image${index + 1}`;
      setImageData(prev => ({
        ...prev,
        [key]: { value: e.target.result, deleted: false }
      }));
    };
    reader.readAsDataURL(file);
  };

  const onEdit = index => {
    fileInputs[index].current.click();
  };

  const onDelete = index => {
    const key = `image${index + 1}`;
    setImageData(prev => ({
      ...prev,
      [key]: { value: null, deleted: true }
    }));
  };

  const handleSubmit = async () => {
    try {
      // Prepare images payload - including explicit empty strings for deleted images
      const payload = {};
      
      // For each image field, set the appropriate value
      for (let i = 1; i <= 3; i++) {
        const key = `image${i}`;
        if (imageData[key].deleted) {
          // If deleted, explicitly include empty string
          payload[key] = "";
        } else if (imageData[key].value) {
          // If has value and not deleted, include the value
          payload[key] = imageData[key].value;
        }
        // If no value and not deleted, don't include the field
      }
      
      console.log('Submitting payload:', payload);

      const method = adsId ? 'PUT' : 'POST';
      const url = adsId ? `http://localhost:5000/ads/${adsId}` : 'http://localhost:5000/ads';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error('Network error');
      const result = await res.json();
      setAdsId(result._id);
      alert('Ads saved successfully!');
      navigate("/admindash");
    } catch (err) {
      console.error(err);
      alert('Failed to save ads.');
    }
  };

  return (
    <div className="ads-container">
      <h1 className="ads-title">Create Ads</h1>
      <div className="image-list">
        {[0, 1, 2].map((idx) => {
          const key = `image${idx + 1}`;
          const imageInfo = imageData[key];
          const hasImage = imageInfo.value && !imageInfo.deleted;
          
          return (
          <div key={idx} className="image-box">
            {hasImage ? (
              <img src={imageInfo.value} alt="Preview" className="preview" />
            ) : (
              <div className="placeholder">No image selected</div>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputs[idx]}
              onChange={e => handleSelect(idx, e.target.files[0])}
            />
            <div className="button-row">
              <button
                type="button"
                className="btn edit-btn"
                onClick={() => onEdit(idx)}
              >
                {hasImage ? 'Edit' : 'Select'}
              </button>
              {hasImage && (
                <button
                  type="button"
                  className="btn delete-btn"
                  onClick={() => onDelete(idx)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )})}
      </div>
      <div className="submit-container">
        <button
          type="button"
          className="btn submit-btn"
          onClick={handleSubmit}
        >
          Use These Ads
        </button>
      </div>
    </div>
  );
};

export default CreateAds;