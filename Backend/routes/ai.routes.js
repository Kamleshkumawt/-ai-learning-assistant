import {Router} from 'express'
import {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory
} from '../controllers/ai.controller.js'
import protect from '../middleware/auth.js'

const router = Router();

//All routes are protected

router.use(protect);

router.post('/generate-flashcards', generateFlashcards);
router.post('/generate-quiz', generateQuiz);
router.post('/generate-summary', generateSummary);
router.post('/chat', chat);
router.post('/explain-concept', explainConcept);
router.get('/chat-history/:documentId', getChatHistory);

export default router;