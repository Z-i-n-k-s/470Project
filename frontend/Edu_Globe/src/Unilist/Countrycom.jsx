import React, { useEffect, useState } from 'react';
import '../css/Countrycom.css';

const CountryComparison = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode toggle

  useEffect(() => {
    fetch('http://localhost:5000/countries') // Replace with your actual API route
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sanitize costs and facilities if they are strings
          const parsedData = data.map(country => ({
            ...country,
            costs: typeof country.costs === 'string' ? JSON.parse(country.costs.replace(/'/g, '"')) : country.costs,
            facilities: typeof country.facilities === 'string' ? JSON.parse(country.facilities.replace(/'/g, '"')) : country.facilities
          }));
          setCountries(parsedData); // Only set if it's an array
        } else {
          console.error("API response is not an array:", data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  if (loading) return <div className="comparison-container">Loading...</div>;

  return (
    <div className={`comparison-container ${isDarkMode ? 'dark' : 'light'}`}> {/* Apply conditional classes */}
      <h1 className="comparison-title">Country Comparison</h1>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <div className="country-grid">
        {countries.map((country, index) => (
          <div className="country-card" key={index}>
            <h2 className="country-name">{country.name} ({country.currency})</h2>
            <div className="cost-breakdown">
              <p><strong>Accommodation:</strong> {country.costs.accommodation}</p>
              <p><strong>Food:</strong> {country.costs.food}</p>
              <p><strong>Transport:</strong> {country.costs.transport}</p>
              <p className="total-cost"><strong>Total:</strong> {country.costs.total}</p>
            </div>
            {country.facilities && country.facilities.length > 0 && (
              <div className="facility-section">
                <h3>Student Facilities</h3>
                <ul>
                  {country.facilities.map((facility, i) => (
                    <li key={i}>
                      {facility.name} - {facility.rating} ⭐
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryComparison;
