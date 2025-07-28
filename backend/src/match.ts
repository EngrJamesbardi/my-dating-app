import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { User, Match } from '../../shared/types';

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

// Get potential matches (location & preference-based)
router.get('/matches', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    // Fetch user preferences
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user: User = userRes.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Example: filter by age, gender, interests, and location radius
    const matchesRes = await pool.query(
      `SELECT *,
        (ST_Distance(location, ST_MakePoint($1, $2)::geography)/1000) AS distance
       FROM users
       WHERE id != $3
         AND age BETWEEN $4 AND $5
         AND gender = ANY($6)
         AND interests && $7
         AND ST_DWithin(location, ST_MakePoint($1, $2)::geography, $8 * 1000)`,
      [user.location.lat, user.location.lng, userId, user.preferences.minAge, user.preferences.maxAge, user.preferences.gender, user.interests, user.preferences.distance]
    );
    res.json(matchesRes.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Like/pass user (swipe)
router.post('/swipe', authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { targetUserId, action } = req.body; // action: 'like' | 'pass'
  if (!targetUserId || !['like', 'pass'].includes(action)) return res.status(400).json({ error: 'Invalid swipe' });
  try {
    // Store swipe action (could be a separate table)
    if (action === 'like') {
      // Check if target user liked back
      // If mutual, create match
      // For demo, just return success
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process swipe' });
  }
});

export default router;
