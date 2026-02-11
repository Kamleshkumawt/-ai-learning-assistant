import documentModel from "../models/document.model.js";
import flashcardModel from "../models/flashcard.model.js";
import quizModel from '../models/quiz.model.js';

//@dsc  Get user learning statistics
//@route GET /api/progress
//@access Private
export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;

        //Get counts
        const totalDocuments = await documentModel.countDocuments({ userId });
        const totalFlashcardSets = await flashcardModel.countDocuments({ userId });
        const totalQuizzes = await quizModel.countDocuments({ userId });
        const completedQuizzes = await quizModel.countDocuments({ userId, completedAt: { $ne: null } });

        // Get flashcard statistics
        const flashcardSets = await flashcardModel.find({ userId });
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(card => card.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(card => card.isStarred).length;
        });

        // Get quiz statistics
        const quizzes = await quizModel.find({ userId, completedAt: { $ne: null } });
        const averageScore = quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) : 0;

        // Recent activity
        const recentDocuments = await documentModel.find({ userId }).sort({ lastAccessed: -1 }).limit(5).select('title fileName lastAccessed status');

        const recentQuizzes = await quizModel.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('documentId', 'title').select('title score totalQuestions completedAt');

        //Study streak (simplified - in production, track daily activity)
        const studyStreak = Math.floor(Math.random() * 7) + 1;

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            },
        });
    } catch (error) {
        next(error);
    }
};