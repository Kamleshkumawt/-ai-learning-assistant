import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getQuizzesForDocument = async (documentId) => {
    try {
        const res = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_FOR_DOC(documentId));
        return res.data;
    } catch (error) {
        throw error.response?.data || { Message: "Failed to fetch quizzes." };
    }
};

const getQuizById = async (quizId) => {
    try {
        const res = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId));
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to fetch quiz." };
    }
};

const submitQuiz = async (quizId, answers) => {
    try {
        const res = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), answers);
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to submit quiz." };
    }
};

const getQuizResults = async (quizId) => {
    try {
        const res = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to fetch quiz results." };
    }
};

const deleteQuiz = async (quizId) => {
    try {
        const res = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(quizId));
        return res.data;
    } catch(error){
        throw error.response?.data || { Message: "Failed to delete quiz." };
    }
};

const quizService = {
    getQuizzesForDocument,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
};

export default quizService;