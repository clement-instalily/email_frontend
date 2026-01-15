import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';
const DB_PATH = join(__dirname, 'email_app.db');

// Initialize SQL.js and database
let db;

async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create users table for login credentials
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Gmail accounts table
  db.run(`
    CREATE TABLE IF NOT EXISTS gmail_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      email TEXT NOT NULL,
      app_password TEXT NOT NULL,
      display_name TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, email)
    )
  `);

  saveDatabase();
  console.log('✅ SQLite Database initialized');
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(DB_PATH, buffer);
}

// Helper to run queries
function dbGet(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function dbAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function dbRun(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] };
}

app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============ AUTH ROUTES (SQLite) ============

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password and store in SQLite
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = dbRun('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name || null]);

    const token = jwt.sign({ id: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.lastInsertRowid, email, name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user in SQLite
    const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = dbGet('SELECT id, email, name, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set new password' });
      }
      
      const user = dbGet('SELECT password FROM users WHERE id = ?', [userId]);
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      dbRun('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    }

    // Update name if provided
    if (name !== undefined) {
      dbRun('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
    }

    const updatedUser = dbGet('SELECT id, email, name, created_at FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============ GMAIL ACCOUNTS ROUTES ============

// Get all Gmail accounts for user
app.get('/api/gmail-accounts', authenticateToken, (req, res) => {
  try {
    const accounts = dbAll(`
      SELECT id, email, display_name, is_active, created_at, updated_at 
      FROM gmail_accounts 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [req.user.id]);

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch Gmail accounts' });
  }
});

// Add new Gmail account
app.post('/api/gmail-accounts', authenticateToken, (req, res) => {
  try {
    const { email, app_password, display_name } = req.body;

    if (!email || !app_password) {
      return res.status(400).json({ error: 'Email and app password are required' });
    }

    // Check if account already exists for this user
    const existing = dbGet('SELECT id FROM gmail_accounts WHERE user_id = ? AND email = ?', [req.user.id, email]);
    if (existing) {
      return res.status(409).json({ error: 'This Gmail account is already added' });
    }

    const result = dbRun(`
      INSERT INTO gmail_accounts (user_id, email, app_password, display_name) 
      VALUES (?, ?, ?, ?)
    `, [req.user.id, email, app_password, display_name || null]);

    const account = dbGet('SELECT id, email, display_name, is_active, created_at FROM gmail_accounts WHERE id = ?', [result.lastInsertRowid]);

    res.status(201).json({
      message: 'Gmail account added successfully',
      account
    });
  } catch (error) {
    console.error('Add account error:', error);
    res.status(500).json({ error: 'Failed to add Gmail account' });
  }
});

// Update Gmail account
app.put('/api/gmail-accounts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { email, app_password, display_name, is_active } = req.body;

    // Verify account belongs to user
    const existing = dbGet('SELECT * FROM gmail_accounts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Gmail account not found' });
    }

    const updates = [];
    const values = [];

    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (app_password !== undefined && app_password !== '') {
      updates.push('app_password = ?');
      values.push(app_password);
    }
    if (display_name !== undefined) {
      updates.push('display_name = ?');
      values.push(display_name);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id, req.user.id);

    dbRun(`
      UPDATE gmail_accounts 
      SET ${updates.join(', ')} 
      WHERE id = ? AND user_id = ?
    `, values);

    const account = dbGet('SELECT id, email, display_name, is_active, created_at, updated_at FROM gmail_accounts WHERE id = ?', [id]);

    res.json({
      message: 'Gmail account updated successfully',
      account
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Failed to update Gmail account' });
  }
});

// Delete Gmail account
app.delete('/api/gmail-accounts/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Verify account belongs to user
    const existing = dbGet('SELECT * FROM gmail_accounts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!existing) {
      return res.status(404).json({ error: 'Gmail account not found' });
    }

    dbRun('DELETE FROM gmail_accounts WHERE id = ? AND user_id = ?', [id, req.user.id]);

    res.json({ message: 'Gmail account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete Gmail account' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'sqlite', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📦 Using SQLite database at: ${DB_PATH}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
