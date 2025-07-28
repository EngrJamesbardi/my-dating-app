import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = Router();
const pool = new Pool({ connectionString: process.env.POSTGRES_URI });
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Simple admin middleware
function adminAuth(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.isAdmin) return res.status(403).json({ error: 'Forbidden' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// View all users
router.get('/users', adminAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Suspend user
router.post('/users/:id/suspend', adminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE users SET verified = FALSE WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// View reports
router.get('/reports', adminAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM reports');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Analytics dashboard (basic)
router.get('/analytics', adminAuth, async (req: Request, res: Response) => {
  try {
    const usersRes = await pool.query('SELECT COUNT(*) FROM users');
    const matchesRes = await pool.query('SELECT COUNT(*) FROM matches');
    res.json({ users: usersRes.rows[0].count, matches: matchesRes.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
