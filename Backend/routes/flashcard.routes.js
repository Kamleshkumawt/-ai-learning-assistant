import {Router} from 'express';
import {
    getFlashcards,
    getAllFlashcards,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcard
} from '../controllers/flashcard.controller';
import protect from '../middleware/auth.js';

const router = Router();

//All routes are protected

router.use(protect);

router.get('/', getAllFlashcards);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcard);
router.put('/:cardId/star', toggleStarFlashcard);
router.delete('/:id', deleteFlashcard);

export default router;