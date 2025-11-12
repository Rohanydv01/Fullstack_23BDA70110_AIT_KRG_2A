Recommendation Engine – Capstone Project
Overview
This is a full-stack Recommendation Engine for movies, built as part of the Capstone Project 

Frontend: React.js

Backend: Node.js + Express

Database: MongoDB

Recommendation Model Service: Python FastAPI

Users can add themselves, add movies, record interactions, and instantly view movie recommendations – all through a modern, browser-based UI.

Features
Live add/view/update for users, movies, interactions

Dynamic movie recommendations for any user

Multi-service architecture (Node.js backend + Python microservice)

Data stored in MongoDB

Modern React UI for easy testing

Recommendation-Engine/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── db/
│   │   └── seed.js
│
├── modelservice/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│
├── visual_outputs/
│   ├── ui_homepage.png
│   ├── recommendation_sample.png
│   ├── er_diagram.png
│   └── other_screens.png
│
└── README.md

Installation & Run Instructions
Clone the repo:

bash
git clone https://github.com/LakishaJaiswal/Recommendation-Engine.git
cd Recommendation-Engine
Start Model Service (Python/FastAPI)

bash
cd modelservice
C:\Python314\python.exe -m uvicorn app:app --reload --port 8000
Start Backend (Node.js/Express)

bash
cd ../backend
npm install
node server.js
Start Frontend (React)

bash
cd ../frontend
npm install
npm start
Open http://localhost:3000 in your browser

How It Works
Add User: Create a new user (userId) via frontend form

Add Movie: Insert movies with title and tags

Add Interaction: Indicate interest in a movie for a given user

Get Recommendations: Select a user and fetch personalized movie suggestions

Backend APIs interact with MongoDB and the Python microservice to generate recommendations in real-time.

## Screenshots

### 1. Home Page
![Home Page](visual_outputs/ui_homepage.png)

### 2. Recommendation Result
![Recommendation](visual_outputs/recommendation_sample.png)

### 3. ER Diagram
![ER Diagram](visual_outputs/er_diagram.png)


ER Diagram
text
[User] ----< [Interaction] >---- [Item/Movie]
User: userId

Item/Movie: itemId, title, tags

Interaction: userId, itemId

References
MongoDB Documentation

Node.js Documentation

React.js Documentation

FastAPI Documentation

ByteXL Capstone Guidelines

Authors
Yashasvi

License
For educational use. Adapt and expand as needed.