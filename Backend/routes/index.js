import { Router } from 'express';
import authRoutes from './auth.routes.js';
import documentRoutes from './document.routes.js';
import flashcardRoutes from './flashcard.routes.js';
import aiRoutes from './ai.routes.js';
import quizRoutes from './quiz.routes.js';
import progressRoutes from './progress.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/document', documentRoutes);
router.use('/flashcard', flashcardRoutes);
router.use('/ai', aiRoutes);
router.use('/quizzes', quizRoutes);
router.use('/progress', progressRoutes);

export default router;