# 🌿 EcoSphere AI

An AI-powered environmental intelligence platform that provides real-time ecological insights, sustainability recommendations, and environmental impact analysis.

## 🚀 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, TailwindCSS v4      |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose)                  |
| AI/ML     | Google Gemini API                   |
| Auth      | JWT, bcrypt                         |

## 📁 Project Structure

```
EcoSphere-AI/
├── backend/                  # Node.js + Express API
│   ├── config/               # DB and app configuration
│   ├── controllers/          # Route handler logic
│   ├── middleware/            # Auth, error handling, etc.
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic / AI services
│   ├── utils/                # Helper utilities
│   ├── validators/           # Request validation
│   ├── server.js             # Entry point
│   └── .env                  # Environment variables (not committed)
├── frontend/                 # React + Vite app
│   ├── public/               # Static assets
│   └── src/
│       ├── assets/           # Images, icons
│       ├── App.jsx           # Root component
│       ├── main.jsx          # React entry point
│       ├── App.css           # Global styles
│       └── index.css         # Base CSS
├── docs/                     # Documentation
└── README.md
```

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌍 Features (Planned)
- 🤖 AI-powered environmental insights
- 📊 Real-time pollution & climate data dashboards
- 🌱 Personalized sustainability recommendations
- 📍 Location-based ecological footprint analysis
- 📈 Carbon tracking & reporting

## 📄 License
MIT
