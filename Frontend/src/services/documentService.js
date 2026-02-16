import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getDocuments = async () => {
  try {
    const res = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to fetch documents." };
  }
};

const uploadDocument = async (formData) => {
  try {
    const res = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData);
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to upload document." };
  }
};

const deleteDocument = async (id) => {
  try {
    const res = await axiosInstance.delete(
      API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id),
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || { Message: "Failed to delete document." };
  }
};

const getDocumentById = async (id) => {
  try {
    const res = await axiosInstance.get(
      API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id),
    );
    return res.data;
  } catch (error) {
    throw (
      error.response?.data || { Message: "Failed to fetch document details." }
    );
  }
};

const documentService = {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentById,
};
export default documentService;
