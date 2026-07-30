import express from 'express';
import { analyzeResume } from '../controllers/ai.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/analyze-resume', analyzeResume);

export default router;