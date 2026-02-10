import documentModel from "../models/document.model.js";
import flashcardModel from "../models/flashcard.model.js";
import quizModel from "../models/quiz.model.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs";
import mongoose from "mongoose";

//@desc Upload PDF document
//@route POST /document/upload
//@access Private

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file",
        statusCode: 400,
      });
    }

    const { title } = req.body;

    if (!title) {
      // Delete uploaded file if title is not provided
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Please provide a title",
        statusCode: 400,
      });
    }

    // Construct the URL for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    //Create document record
    const document = await documentModel.create({
      userId: req.user.id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl, // Store the URL instead of the local path
      fileSize: req.file.size,
      status: "processing",
    });

    //process PDF in background (in production, use a queue like Bull)
    processPDF(document._id, req.file.path).catch((err) => {
      console.error("PDF processing error:", err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: "Document uploaded successfully, Processing in progress....",
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

// Helper function to process PDF
const processPDF = async (documentId, filepath) => {
  try {
    const { text } = await extractTextFromPDF(filepath);

    // Create chunks
    const chunks = chunkText(text, 500, 50);

    // Update document status
    const document = await documentModel.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);

    await documentModel.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};

//@desc Get all user documents
//@route GET /document
//@access Private

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await documentModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcardSets",
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes",
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: "$flashcardSets" },
          quizCount: { $size: "$quizzes" },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      {
        $sort: {
          uploadDate: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Get document details
//@route GET /document/:id
//@access Private

export const getDocument = async (req, res, next) => {
  try {
    const document = await documentModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404,
      });
    }

    //Get counts of associated flashcards and quizzes
    const flashcardCount = await flashcardModel.countDocuments({
      documentId: document._id,
      userId: req.user.id,
    });
    const quizCount = await quizModel.countDocuments({
      documentId: document._id,
      userId: req.user.id,
    });

    //Update last accessed 
    document.lastAccessed = new Date();
    await document.save();

    //Combine document data with counts
    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData,
    });

  } catch (error) {
    next(error);
  }
};

//@desc Delete document
//@route DELETE /document/:id
//@access Private

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await documentModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404,
      });
    }
    
    //Delete file from filesystem
    await fs.unlink(document.filePath).catch(() => {});

    //Delete document from database
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};