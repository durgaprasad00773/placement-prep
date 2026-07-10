import express from 'express';
import {
  addResume,
  getResumes,
  setActiveResume,
  deleteResume
} from '../controllers/resume.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', upload.single('resume'), addResume);
router.get('/', getResumes);
router.put('/:id/active', setActiveResume);
router.delete('/:id', deleteResume);

export default router;