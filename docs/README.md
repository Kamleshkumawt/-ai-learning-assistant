# AI Learning Assistant - Documentation

## Overview

The AI Learning Assistant is a full-stack web application that enables users to upload PDF documents and leverage AI (Google Gemini) to generate learning materials including flashcards, quizzes, and provide intelligent chat interactions with document content.

## Features

- **Document Management**: Upload and manage PDF documents
- **AI-Powered Learning Tools**:
  - Flashcard generation
  - Quiz creation with auto-grading
  - Document summarization
  - Intelligent chat with document context (RAG)
  - Concept explanation
- **Progress Tracking**: Dashboard with learning statistics
- **User Authentication**: Secure JWT-based authentication
- **Responsive UI**: Modern React interface with Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Google Gemini AI integration
- JWT authentication
- Multer for file uploads
- PDF parsing with pdf-parse

### Frontend
- React 19 with Vite
- Tailwind CSS
- React Router
- Axios for API calls
- React Hot Toast for notifications

## Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

- **Backend**: RESTful API with MVC pattern
- **Frontend**: Component-based React application
- **Database**: MongoDB with structured schemas
- **AI Integration**: Google Gemini for content generation and chat

## Documentation Structure

- [Setup Guide](setup.md)
- [API Documentation](backend/api-endpoints.md)
- [Database Models](backend/models.md)
- [Backend Components](backend/)
  - [Controllers](backend/controllers.md)
  - [Routes](backend/routes.md)
  - [Middleware](backend/middleware.md)
  - [Utilities](backend/utils.md)
- [Frontend Components](frontend/)
  - [Pages](frontend/pages.md)
  - [Components](frontend/components.md)
  - [Services](frontend/services.md)
  - [Context](frontend/context.md)
- [Architecture Details](architecture.md)

## Quick Start

1. Clone the repository
2. Install dependencies for both backend and frontend
3. Set up environment variables
4. Start the backend server
5. Start the frontend development server

See [Setup Guide](setup.md) for detailed instructions.</content>
<parameter name="filePath">d:\UserDefine Folder\ai-learning-assistant\docs\README.md