import request from 'supertest';
import express from 'express';
import authRouter from '../src/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth API', () => {
  it('should return 400 for missing fields on register', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });
});
