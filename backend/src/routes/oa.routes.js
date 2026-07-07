import express from 'express';
import { addOA, getOAs, updateOA, deleteOA } from '../controllers/oa.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', addOA);
router.get('/', getOAs);
router.put('/:id', updateOA);
router.delete('/:id', deleteOA);

export default router;