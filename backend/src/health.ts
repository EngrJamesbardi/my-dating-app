import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const pool = new Pool({ connectionString: process.env.POSTGRES_URI });

// System health endpoint
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // Check PostgreSQL connection
    await pool.query('SELECT 1');
    res.json({ status: 'ok', postgres: true });
  } catch {
    res.status(500).json({ status: 'error', postgres: false });
  }
});

export default router;
