import express from 'express';
import {
  getExperiences,
  addExperience,
  toggleUpvote,
  deleteExperience
} from '../controllers/experiences.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getExperiences);
router.post('/', addExperience);
router.put('/:id/upvote', toggleUpvote);
router.delete('/:id', deleteExperience);

export default router;