const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Christy Portfolio Backend is running! 🌷' });
});

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
      [name, email, subject || '', message]
    );
    res.status(201).json({ success: true, message: 'Message saved! 🌸', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Database error. Please try again.' });
  }
});

app.get('/contacts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/contact/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    res.json({ success: true, message: `Message ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
