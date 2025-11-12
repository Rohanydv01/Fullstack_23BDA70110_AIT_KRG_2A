from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import random

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "Recommendation_engine"

@app.get("/health")
def health():
    return {"status": "Model service running"}

@app.get("/recommend")
def recommend(userId: str = Query(...), topK: int = Query(5)):
    # Connect to MongoDB
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]

    # Get all movies from items collection
    all_movies = list(db.items.find({}))
    client.close()

    if len(all_movies) == 0:
        return {"recommendations": []}

    # For demo, randomly recommend up to topK movies
    sampled = random.sample(all_movies, min(topK, len(all_movies)))
    recs = [
        {
            "itemId": movie["itemId"],
            "score": round(random.uniform(0.7, 1.0), 2),
            "title": movie["title"]
        }
        for movie in sampled
    ]
    return {"recommendations": recs}
