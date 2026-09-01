import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_healing';

// Initialize Database (synchronous with better-sqlite3)
const db = new Database('./database.sqlite');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    messages TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Chat Route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Groq API Key is not configured on the server.' });
    }

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: groqModel,
      messages,
      temperature: 0.8,
      max_tokens: 800,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Chat Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to communicate with AI model' });
  }
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const result = stmt.run(email, hashedPassword);
    const token = jwt.sign({ userId: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: result.lastInsertRowid, email });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message?.includes('UNIQUE constraint')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Register Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, userId: user.id, email: user.email, role: user.role });
});

app.get('/api/history', authenticateToken, (req: any, res) => {
  const history = db.prepare('SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC').all(req.user.userId) as any[];
  res.json(history.map((h: any) => ({ ...h, messages: JSON.parse(h.messages) })));
});

app.post('/api/history', authenticateToken, (req: any, res) => {
  const { messages } = req.body;
  const stmt = db.prepare('INSERT INTO conversations (user_id, messages) VALUES (?, ?)');
  const result = stmt.run(req.user.userId, JSON.stringify(messages));
  res.json({ success: true, id: result.lastInsertRowid });
});


app.listen(port, () => {
  console.log(`Backend Server listening at http://localhost:${port}`);
});
