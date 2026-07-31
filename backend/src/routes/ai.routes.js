import express from 'express';
import {
  analyzeResume,
  generateInterview,
  evaluateAnswer,
  generateDailyPlan,
  completeTask,
  getTodayPlan,
  generateRoadmap
} from '../controllers/ai.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/analyze-resume', analyzeResume);
router.post('/generate-interview', generateInterview);
router.post('/evaluate-answer', evaluateAnswer);
router.post('/daily-plan', generateDailyPlan);
router.put('/daily-plan/complete', completeTask);
router.get('/daily-plan', getTodayPlan);
router.post('/roadmap', generateRoadmap);

export default router;