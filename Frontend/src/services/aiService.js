import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const generateFlashcards = async (documentId, options) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
      documentId,
      ...options,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to generate flashcards." };
  }
};

const generateQuiz = async (documentId, options) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
      documentId,
      ...options,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to generate quiz." };
  }
};

const generateSummary = async (documentId) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
      documentId,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to generate summary." };
  }
};
const chat = async (documentId, message) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AI.CHAT, {
      documentId,
      question: message,
    }); //remove history from payload
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Chat request failed." };
  }
};

const explainConcept = async (documentId, concept) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
      documentId,
      concept,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to explain concept." };
  }
};
const getChatHistory = async (documentId) => {
  try {
    const res = await axiosInstance.get(
      API_PATHS.AI.GET_CHAT_HISTORY(documentId),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to fetch chat history." };
  }
};

const aiService = {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
};

export default aiService;