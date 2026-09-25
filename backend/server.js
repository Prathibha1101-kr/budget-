const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Embedded SQLite DB file in a dedicated folder
const DB_DIR = path.join(__dirname, 'database');
const DB_PATH = path.join(DB_DIR, 'expenses.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB', err);
    process.exit(1);
  }
});

const CREATE_SQL = `
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT,
  type TEXT NOT NULL CHECK(type IN ('income','expense')),
  date TEXT NOT NULL
);`;

db.run(CREATE_SQL, (err) => {
  if (err) {
    console.error('Failed to create table', err);
    process.exit(1);
  }
});

// GET /api/expenses -> newest first
app.get('/api/expenses', (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/expenses -> add record
app.post('/api/expenses', (req, res) => {
  const { title, amount, category = '', type, date } = req.body;
  if (!title || typeof amount !== 'number' || !type) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }
  const isoDate = date ? new Date(date).toISOString() : new Date().toISOString();
  const sql = 'INSERT INTO expenses (title, amount, category, type, date) VALUES (?,?,?,?,?)';
  db.run(sql, [title, amount, category, type, isoDate], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM expenses WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

// DELETE /api/expenses/:id -> delete
app.delete('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  db.run('DELETE FROM expenses WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deletedId: id });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Expense Tracker API listening on http://localhost:${PORT}`));
