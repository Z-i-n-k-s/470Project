import React, { useEffect, useState } from 'react';
import '../css/Countrycom.css';

const CountryComparison = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/countries')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('API response is not an array:', data);
          setLoading(false);
          return;
        }

        const parsed = data.map(raw => {
          const { name, currency, ...rest } = raw;

          // rebuild costs
          const costs = Object.keys(rest).reduce((acc, key) => {
            if (key.startsWith('costs.')) {
              const field = key.split('.')[1];
              acc[field] = Number(rest[key]);
            }
            return acc;
          }, {});

          // rebuild facilities
          const facilitiesMap = {};
          Object.keys(rest).forEach(key => {
            const m = key.match(/^facilities\[(\d+)\]\.(name|rating)$/);
            if (m) {
              const idx = m[1];
              const prop = m[2];
              const val = rest[key];
              if (val !== '' && val != null) {
                facilitiesMap[idx] = facilitiesMap[idx] || {};
                facilitiesMap[idx][prop] = prop === 'rating' ? Number(val) : val;
              }
            }
          });
          const facilities = Object.values(facilitiesMap);

          return { name, currency, costs, facilities };
        });

        setCountries(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  const toggleDarkMode = () => setIsDarkMode(d => !d);

  if (loading) return <div className="comparison-container">Loading...</div>;

  return (
    <div className={`comparison-container ${isDarkMode ? 'dark' : 'light'}`}>
      <h1 className="comparison-title">Country Comparison</h1>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <div className="country-grid">
        {countries.map((country, idx) => (
          <div className="country-card" key={idx}>
            <h2 className="country-name">
              {country.name} ({country.currency})
            </h2>

            <div className="cost-breakdown">
              <p>
                <strong>Accommodation:</strong> {country.costs.accommodation}
              </p>
              <p>
                <strong>Food:</strong> {country.costs.food}
              </p>
              <p>
                <strong>Transport:</strong> {country.costs.transport}
              </p>
              <p className="total-cost">
                <strong>Total:</strong> {country.costs.total}
              </p>
            </div>

            {country.facilities.length > 0 && (
              <div className="facility-section">
                <h3>Student Facilities</h3>
                <ul>
                  {country.facilities.map((f, i) => (
                    <li key={i}>
                      {f.name} – {f.rating} ⭐
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
