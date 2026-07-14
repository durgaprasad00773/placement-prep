import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import problemsRoutes from './routes/problems.routes.js';
import profileRoutes from './routes/profile.routes.js';
import oaRoutes from './routes/oa.routes.js';
import notesRoutes from './routes/notes.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';


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
app.use('/api/oa', oaRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;