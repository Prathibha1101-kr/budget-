# Smart Expense Tracker

A lightweight expense tracking web app for managing income, expenses, and overall balance. The project uses a Node.js backend with Express and SQLite to store transactions, and a simple frontend built with HTML, CSS, and JavaScript.

## Features

- Add income and expense entries
- Track total balance, income, and expenses
- View recent transactions
- Store records persistently in a local SQLite database
- Clean dashboard-style UI

## Project Structure

```text
expense tracker/
├── backend/
│   ├── database/
│   │   └── expenses.db
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── README.md
└── package-lock.json
```

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: SQLite
- CORS support for frontend-backend communication

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm

## Installation

1. Open a terminal in the project root.
2. Install backend dependencies:

```bash
npm install --prefix backend
```

## Run the Application

### Start the backend server

```bash
node backend/server.js
```

The backend will run on:

```text
http://localhost:5000
```

### Open the frontend

Open the file below in a browser:

```text
frontend/index.html
```

## API Endpoints

### Get all transactions

```http
GET /api/expenses
```

### Add a transaction

```http
POST /api/expenses
```

Body example:

```json
{
  "title": "Groceries",
  "amount": 1500,
  "category": "Food",
  "type": "expense",
  "date": "2026-09-25"
}
```

### Delete a transaction

```http
DELETE /api/expenses/:id
```

## Database

The app stores all transactions in SQLite in the dedicated database folder:

```text
backend/database/expenses.db
```

This ensures the data is kept in a separate location and is not mixed with the application source files.

## Notes

- This is a local project and is ideal for personal budgeting and learning.
- The database is stored on the local machine where the app is running.

## Future Improvements

- User authentication
- Monthly reports and charts
- Edit transaction feature
- Search and filter by category/date
- CSV export

## License

This project is for educational and personal use.
