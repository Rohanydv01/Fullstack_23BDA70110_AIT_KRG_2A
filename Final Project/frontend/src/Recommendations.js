import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Recommendations() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // ✅ Provide a test userId (like "u1")
    axios.get('http://localhost:5000/api/recommendations?userId=u1')
      .then(res => {
        console.log("Fetched recommendations:", res.data.results);
        setItems(res.data.results);
      })
      .catch(err => console.error("Error fetching recommendations:", err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Capstone Recommendation Engine</h2>
      <div className="row">
        {items.map(item => (
          <div key={item._id} className="col-md-4 mb-4">
            <div className="card shadow-sm p-3">
              <h5>{item.title}</h5>
              <p><b>Tags:</b> {item.tags.join(', ')}</p>
              <p><b>Score:</b> {item.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
