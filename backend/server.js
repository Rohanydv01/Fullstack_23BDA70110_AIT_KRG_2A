const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');

const app = express();
const cache = new NodeCache({ stdTTL: 60 });

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'Recommendation_engine'; // or 'recodb' or any name you like
const MODEL_URL = 'http://localhost:8000';

app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running on port 5000' });
});

app.get('/api/recommendations', async (req, res) => {
    const userId = req.query.userId || 'u1';
    const cacheKey = `reco_${userId}`;
    const correlationId = uuidv4();

    const cached = cache.get(cacheKey);
    if (cached) {
        return res.json({
            results: cached,
            fromCache: true,
            correlationId: correlationId
        });
    }

    try {
        const modelRes = await axios.get(`${MODEL_URL}/recommend`, {
            params: { userId },
            timeout: 5000
        });

        const itemIds = modelRes.data.recommendations.map(r => r.itemId);

        const client = new MongoClient(MONGO_URL);
        await client.connect();
        const db = client.db(DB_NAME);

        const results = await db.collection('items')
            .find({ itemId: { $in: itemIds } })
            .toArray();

        await client.close();

        // Map for fast lookup
        const movieMap = {};
        results.forEach(movie => {
            movieMap[movie.itemId] = movie;
        });

        // Final unique, ordered array
        const uniqueResults = [];
        const seenIds = new Set();
        for (const rec of modelRes.data.recommendations) {
            if (!seenIds.has(rec.itemId) && movieMap[rec.itemId]) {
                uniqueResults.push({
                    ...movieMap[rec.itemId],
                    score: parseFloat(rec.score)
                });
                seenIds.add(rec.itemId);
            }
        }

        cache.set(cacheKey, uniqueResults, 60);
        res.json({
            results: uniqueResults,
            fromCache: false,
            correlationId: correlationId
        });

    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch recommendations',
            correlationId: correlationId,
            details: err.message
        });
    }
});

// ------- NEW ENDPOINTS FOR FRONTEND/UI FORMS --------

// Add a new user to users collection
app.post('/api/adduser', async (req, res) => {
  const { userId } = req.body;
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db(DB_NAME);

    await db.collection('users').updateOne(
      { userId },
      { $set: { userId } },
      { upsert: true }
    );
    await client.close();
    res.json({ status: 'User added!', userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users from users collection
app.get('/api/users', async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db(DB_NAME);

    const users = await db.collection('users').find({}).toArray();
    await client.close();
    res.json(users.map(u => u.userId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new movie to database
app.post('/api/addmovie', async (req, res) => {
    const { itemId, title, tags } = req.body;
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        const db = client.db(DB_NAME);

        await db.collection('items').insertOne({ itemId, title, tags });
        await client.close();
        res.json({ status: 'Movie added!', itemId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Log a user-movie interaction
app.post('/api/interact', async (req, res) => {
    const { userId, itemId } = req.body;
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        const db = client.db(DB_NAME);

        await db.collection('interactions').insertOne({ userId, itemId });
        await client.close();
        res.json({ status: 'Interaction saved!', userId, itemId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log('✓ Backend running on port 5000');
    console.log('✓ CORS enabled for http://localhost:3000');
    console.log('✓ MongoDB: mongodb://localhost:27017');
    console.log('✓ Model Service: http://localhost:8000');
});
