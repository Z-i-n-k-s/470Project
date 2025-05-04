import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all data from localStorage
    localStorage.clear();

    // Redirect to the home page
    navigate('/');
  }, [navigate]);

  return null; // Since we're redirecting, no UI is needed
};

export default Logout;
