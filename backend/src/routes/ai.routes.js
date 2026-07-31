import express from 'express';
import { analyzeResume, generateInterview, evaluateAnswer } from '../controllers/ai.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/analyze-resume', analyzeResume);
router.post('/generate-interview', generateInterview);
router.post('/evaluate-answer', evaluateAnswer);

export default router;