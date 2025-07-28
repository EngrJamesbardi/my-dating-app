import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Message } from '../../shared/types';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI);
const MessageModel = mongoose.model('Message', new mongoose.Schema({
  matchId: String,
  senderId: String,
  content: String,
  mediaUrl: String,
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}));

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

// Get chat history
router.get('/chat/:matchId', authenticate, async (req: Request, res: Response) => {
  const { matchId } = req.params;
  try {
    const messages = await MessageModel.find({ matchId }).sort({ sentAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/chat/:matchId', authenticate, async (req: Request, res: Response) => {
  const { matchId } = req.params;
  const { content, mediaUrl } = req.body;
  const senderId = (req as any).user.userId;
  try {
    const message = new MessageModel({ matchId, senderId, content, mediaUrl });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
