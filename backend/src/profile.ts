import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { User } from '../../shared/types';

dotenv.config();

const router = Router();
const pool = new Pool({ connectionString: process.env.POSTGRES_URI });

// Middleware to authenticate JWT
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
function authenticate(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Get profile
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { name, age, gender, bio, interests, preferences, photos, privacy } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = $1, age = $2, gender = $3, bio = $4, interests = $5, preferences = $6, photos = $7, privacy = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9',
      [name, age, gender, bio, interests, preferences, photos, privacy, userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
