# DSA Quest, Phase 1 Player Dashboard

This upgrade adds a production-style player dashboard to the existing DSA Quest full-stack app.

## Features

- Player dashboard
- XP and level progression
- Daily streak
- Coins
- Completed challenge count
- Achievement system
- Achievement progress
- Recent submission activity
- Daily challenge
- Continue quest
- Profile page
- World map
- Topic challenge lists
- Coding challenge editor
- Hint system
- Leaderboard
- JWT authentication
- MongoDB Atlas persistence
- Safe demo evaluator when Judge0 is not configured

## Run

### Backend

```powershell
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```

If your backend is already connected to MongoDB Atlas, keep the existing `.env`.

### Frontend

```powershell
cd client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo account

```text
demo@dsaquest.local
Demo123!
```

## Admin account

```text
admin@dsaquest.local
Admin123!
```

## API additions

```text
GET /api/dashboard
GET /api/profile
GET /api/daily-challenge
```

## Important

Do not commit `.env`.

For real code execution, configure Judge0. The demo evaluator never executes arbitrary user code.
