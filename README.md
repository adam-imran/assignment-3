# BudgetTracker

Personal Budgeting + Ranking System built with the MERN stack.
Roll Number: 23i-5517 | BS FinTech, Semester 6, FAST NUCES

## What it does

Users can log income and expense transactions, set monthly budget limits per category, and view a ranking of their spending categories. The ranking shows which category consumed the highest percentage of its budget that month.

## Tech Stack

- Frontend: React, React Router v6
- Backend: Node.js, Express.js
- Database: MongoDB Atlas (Mongoose)
- Auth: JWT (jsonwebtoken + bcryptjs)

## Project Structure

```
BudgetTracker/
  client/          React frontend
  server/          Express backend
    models/        User, Transaction, Budget schemas
    routes/        auth, transactions, budgets, rankings
    middleware/    authMiddleware, validateMiddleware
  README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/transactions | Yes | Get transactions (filter by month/type) |
| POST | /api/transactions | Yes | Add transaction |
| DELETE | /api/transactions/:id | Yes | Delete transaction |
| GET | /api/budgets | Yes | Get budgets (filter by month) |
| POST | /api/budgets | Yes | Set/update budget |
| GET | /api/rankings | Yes | Get ranked spending by category |

## Setup

### Backend
```
cd server
npm install
# create .env with MONGO_URI and JWT_SECRET
npm start
```

### Frontend
```
cd client
npm install
# create .env with REACT_APP_API_URL pointing to your backend
npm start
```

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
