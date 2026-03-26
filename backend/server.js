const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Database Connection ───
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ─── Middleware ───
app.use(cors());
app.use(express.json());

// ─── Create Table on Startup ───
pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT,
    message    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`)
  .then(() => console.log('✅ contacts table ready'))
  .catch(err => console.error('Table creation error:', err.message));

// ─── Routes ───

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Christy Portfolio Backend is running! 🌷' });
});

// POST /contact — save contact form submission
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [name, email, subject || '', message]
    );

    res.status(201).json({
      success: true,
      message: 'Message saved successfully! 🌸',
      id: result.rows[0].id,
      created_at: result.rows[0].created_at
    });
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error. Please try again.' });
  }
});

// GET /contacts — view all messages (for your own use)
app.get('/contacts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ───
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
