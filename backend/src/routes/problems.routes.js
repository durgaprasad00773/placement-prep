import express from 'express';
import {
  addProblem,
  getProblems,
  updateProblem,
  deleteProblem,
  toggleRevision,
  getRevisionList
} from '../controllers/problems.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes protected
router.use(authMiddleware);

router.post('/', addProblem);
router.get('/', getProblems);
router.put('/:id', updateProblem);
router.delete('/:id', deleteProblem);
router.put('/:id/revision', toggleRevision);
router.get('/revision/list', getRevisionList);

export default router;