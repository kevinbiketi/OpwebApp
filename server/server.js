const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fish_farm_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ==================== AUTHENTICATION ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ userId: result.insertId, email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role: 'manager'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'manager'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ==================== FARM SETTINGS ROUTES ====================

// Get farm settings
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const [settings] = await pool.execute(
      'SELECT * FROM farm_settings WHERE user_id = ?',
      [req.userId]
    );

    if (settings.length === 0) {
      return res.json({
        farmName: 'Fish Farm Management',
        logo: null
      });
    }

    res.json(settings[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update farm settings
app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { farmName, logo } = req.body;

    // Check if settings exist
    const [existing] = await pool.execute(
      'SELECT id FROM farm_settings WHERE user_id = ?',
      [req.userId]
    );

    if (existing.length === 0) {
      // Create new settings
      await pool.execute(
        'INSERT INTO farm_settings (user_id, farm_name, logo) VALUES (?, ?, ?)',
        [req.userId, farmName || 'Fish Farm Management', logo]
      );
    } else {
      // Update existing settings
      await pool.execute(
        'UPDATE farm_settings SET farm_name = ?, logo = ? WHERE user_id = ?',
        [farmName || 'Fish Farm Management', logo, req.userId]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== BATCH ROUTES ====================

// Get all batches
app.get('/api/batches', authenticateToken, async (req, res) => {
  try {
    const [batches] = await pool.execute(
      'SELECT * FROM batches WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(batches);
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create batch
app.post('/api/batches', authenticateToken, async (req, res) => {
  try {
    const { batchId, section, species, quantity, startDate, notes } = req.body;

    if (!batchId || !section || !species || !quantity) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const [result] = await pool.execute(
      `INSERT INTO batches (user_id, batch_id, section, species, quantity, start_date, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [req.userId, batchId, section, species, quantity, startDate || null, notes || null]
    );

    const [newBatch] = await pool.execute(
      'SELECT * FROM batches WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newBatch[0]);
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete batch
app.delete('/api/batches/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM batches WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Delete batch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== SECTION RECORDS ROUTES ====================

// Generic route handler for section records
const handleSectionRecords = async (sectionName, req, res) => {
  try {
    if (req.method === 'GET') {
      const [records] = await pool.execute(
        `SELECT * FROM ${sectionName}_records WHERE user_id = ? ORDER BY created_at DESC`,
        [req.userId]
      );
      return res.json(records);
    } else if (req.method === 'POST') {
      const data = req.body;
      const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at');
      const values = fields.map(field => data[field]);
      const placeholders = fields.map(() => '?').join(', ');

      const [result] = await pool.execute(
        `INSERT INTO ${sectionName}_records (user_id, ${fields.join(', ')}) VALUES (?, ${placeholders})`,
        [req.userId, ...values]
      );

      const [newRecord] = await pool.execute(
        `SELECT * FROM ${sectionName}_records WHERE id = ?`,
        [result.insertId]
      );

      return res.status(201).json(newRecord[0]);
    } else if (req.method === 'DELETE') {
      const [result] = await pool.execute(
        `DELETE FROM ${sectionName}_records WHERE id = ? AND user_id = ?`,
        [req.params.id, req.userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      return res.json({ message: 'Record deleted successfully' });
    }
  } catch (error) {
    console.error(`${sectionName} error:`, error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Hatchery routes
app.get('/api/sections/hatchery', authenticateToken, (req, res) => handleSectionRecords('hatchery', req, res));
app.post('/api/sections/hatchery', authenticateToken, (req, res) => handleSectionRecords('hatchery', req, res));
app.delete('/api/sections/hatchery/:id', authenticateToken, (req, res) => handleSectionRecords('hatchery', req, res));

// Pre-grow out routes
app.get('/api/sections/pre-grow-out', authenticateToken, (req, res) => handleSectionRecords('pre_grow_out', req, res));
app.post('/api/sections/pre-grow-out', authenticateToken, (req, res) => handleSectionRecords('pre_grow_out', req, res));
app.delete('/api/sections/pre-grow-out/:id', authenticateToken, (req, res) => handleSectionRecords('pre_grow_out', req, res));

// Grow-out routes
app.get('/api/sections/grow-out', authenticateToken, (req, res) => handleSectionRecords('grow_out', req, res));
app.post('/api/sections/grow-out', authenticateToken, (req, res) => handleSectionRecords('grow_out', req, res));
app.delete('/api/sections/grow-out/:id', authenticateToken, (req, res) => handleSectionRecords('grow_out', req, res));

// Puddling routes
app.get('/api/sections/puddling', authenticateToken, (req, res) => handleSectionRecords('puddling', req, res));
app.post('/api/sections/puddling', authenticateToken, (req, res) => handleSectionRecords('puddling', req, res));
app.delete('/api/sections/puddling/:id', authenticateToken, (req, res) => handleSectionRecords('puddling', req, res));

// Quarantine routes
app.get('/api/sections/quarantine', authenticateToken, (req, res) => handleSectionRecords('quarantine', req, res));
app.post('/api/sections/quarantine', authenticateToken, (req, res) => handleSectionRecords('quarantine', req, res));
app.delete('/api/sections/quarantine/:id', authenticateToken, (req, res) => handleSectionRecords('quarantine', req, res));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
