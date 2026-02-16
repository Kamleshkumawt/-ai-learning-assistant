import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths"

const getAllFlashcardSets = async () => {
    try {
        const res = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to fetch flashcard sets." };
    }
};

const getFlashcardsForDocument = async (documentId) => {
    try {
        const res = await axiosInstance.get(API_PATHS.FLASHCARDS. GET_FLASHCARD_FOR_DOC(documentId));
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to fetch flashcards." };
    }
};

const reviewFlashcard = async (cardId,cardIndex) => {
    try {
        const res = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId),{cardIndex});
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to review flashcard." };
    }
};

const toggleStar = async (cardId) => {
    try {
        const res = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to toggle star." };
    }
};

const deleteFlashcardSet = async (id) => {
    try {
        const res = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to delete flashcard set." };
    }
};

const flashcardService = {
    getAllFlashcardSets,
    getFlashcardsForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet,
};

export default flashcardService;