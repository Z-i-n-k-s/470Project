import React, { useEffect, useState } from 'react';
import './CountryComparison.css';

const CountryComparison = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/countries') // Replace with your actual API route
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="comparison-container">Loading...</div>;

  return (
    <div className="comparison-container">
      <h1 className="comparison-title">Country Comparison</h1>
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
