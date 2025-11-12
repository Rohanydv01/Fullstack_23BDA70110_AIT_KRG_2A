import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userId, setUserId] = useState('');
  const [userList, setUserList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [correlationId, setCorrelationId] = useState('');

  const [newMovie, setNewMovie] = useState({ itemId: '', title: '', tags: '' });
  const [newUser, setNewUser] = useState({ userId: '' });
  const [newInteraction, setNewInteraction] = useState({ userId: '', itemId: '' });

  // Fetch users from users collection
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUserList(res.data);
      if (res.data.length > 0 && userId === '') {
        setUserId(res.data[0]);
      }
    } catch {
      setUserList([]);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/recommendations', {
        params: { userId }
      });
      setRecommendations(response.data.results);
      setFromCache(response.data.fromCache);
      setCorrelationId(response.data.correlationId);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert('Failed to fetch recommendations');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Movie Recommendation Engine</h1>
      </header>

      <div className="container">

        {/* Add a New User */}
        <form
          style={{ marginBottom: 20, marginTop: 20 }}
          onSubmit={async (e) => {
            e.preventDefault();
            await axios.post('http://localhost:5000/api/adduser', {
              userId: newUser.userId,
            });
            alert('User added!');
            setNewUser({ userId: '' });
            fetchUsers();
          }}
        >
          <h3>Add a New User</h3>
          <input
            placeholder="User ID"
            value={newUser.userId}
            onChange={e => setNewUser({ userId: e.target.value })}
          />
          <button type="submit">Add User</button>
        </form>

        {/* Add a New Movie */}
        <form
          style={{ marginBottom: 20 }}
          onSubmit={async (e) => {
            e.preventDefault();
            await axios.post('http://localhost:5000/api/addmovie', {
              itemId: newMovie.itemId,
              title: newMovie.title,
              tags: newMovie.tags.split(',').map(tag => tag.trim()),
            });
            alert('Movie added!');
            setNewMovie({ itemId: '', title: '', tags: '' });
          }}
        >
          <h3>Add a New Movie</h3>
          <input
            placeholder="Movie ID"
            value={newMovie.itemId}
            onChange={e => setNewMovie({ ...newMovie, itemId: e.target.value })}
          />
          <input
            placeholder="Title"
            value={newMovie.title}
            onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
          />
          <input
            placeholder="Tags (comma separated)"
            value={newMovie.tags}
            onChange={e => setNewMovie({ ...newMovie, tags: e.target.value })}
          />
          <button type="submit">Add Movie</button>
        </form>

        {/* Add User Interaction */}
        <form
          style={{ marginBottom: 20 }}
          onSubmit={async (e) => {
            e.preventDefault();
            await axios.post('http://localhost:5000/api/interact', {
              userId: newInteraction.userId,
              itemId: newInteraction.itemId,
            });
            alert('User interaction saved!');
            setNewInteraction({ userId: '', itemId: '' });
            fetchUsers(); // update available users
          }}
        >
          <h3>Add User Interaction</h3>
          <input
            placeholder="User ID"
            value={newInteraction.userId}
            onChange={e => setNewInteraction({ ...newInteraction, userId: e.target.value })}
          />
          <input
            placeholder="Movie ID"
            value={newInteraction.itemId}
            onChange={e => setNewInteraction({ ...newInteraction, itemId: e.target.value })}
          />
          <button type="submit">Add Interaction</button>
        </form>

        <div className="control-panel">
          <div className="user-selector">
            <label htmlFor="userId">Select User: </label>
            <select
              id="userId"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            >
              {userList.map(uid => (
                <option key={uid} value={uid}>
                  {uid.startsWith('u') ? `User ${uid.substring(1)}` : uid}
                </option>
              ))}
            </select>
          </div>
          <button onClick={fetchRecommendations} disabled={loading}>
            {loading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </div>

        {correlationId && (
          <div className="info-box">
            <p><strong>Correlation ID:</strong> {correlationId}</p>
            <p><strong>From Cache:</strong> {fromCache ? '✅ Yes (60s TTL)' : '❌ Fresh from DB'}</p>
          </div>
        )}

        <div className="recommendations-container">
          <h2>Recommended Movies for {userId}</h2>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : recommendations.length > 0 ? (
            <div className="carousel">
              {[...new Map(recommendations.map(m => [m.itemId, m])).values()].map((movie) => (
                <div key={movie.itemId} className="movie-card">
                  <div className="movie-id">{movie.itemId}</div>
                  <h3>{movie.title}</h3>
                  <div className="tags">
                    {movie.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="score">
                    <strong>Score:</strong> {(parseFloat(movie.score) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No recommendations found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
