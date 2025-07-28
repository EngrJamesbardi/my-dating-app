import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const pool = new Pool({ connectionString: process.env.POSTGRES_URI });
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Google OAuth login
router.post('/google', async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Missing Google token' });
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ error: 'Invalid Google token' });
    // Check if user exists
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [payload.email]);
    if (user.rows.length === 0) {
      // Create new user
      const result = await pool.query(
        'INSERT INTO users (email, google_id, name, verified) VALUES ($1, $2, $3, $4) RETURNING id',
        [payload.email, payload.sub, payload.name, true]
      );
      user.rows.push({ ...result.rows[0], email: payload.email });
    }
    const jwtToken = jwt.sign({ userId: user.rows[0].id, email: payload.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken });
  } catch (err) {
    res.status(500).json({ error: 'Google OAuth failed' });
  }
});

export default router;
