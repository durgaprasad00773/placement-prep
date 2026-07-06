import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import problemsRoutes from './routes/problems.routes.js';
import profileRoutes from './routes/profile.routes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;