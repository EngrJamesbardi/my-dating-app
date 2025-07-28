import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { Request, Response, Router } from 'express';
import multer from 'multer';
dotenv.config();

const router = Router();
const upload = multer();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || '',
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private',
  };
  try {
    const data = await s3.upload(params).promise();
    res.json({ url: data.Location });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
