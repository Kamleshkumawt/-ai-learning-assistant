# Backend Routes

## Overview

Routes define API endpoints and connect HTTP requests to controller functions. All routes are mounted under `/api` and follow RESTful conventions.

## Route Structure

```
Backend/routes/
├── index.js          (Main router - mounts all route modules)
├── auth.routes.js    (/api/auth/*)
├── document.routes.js (/api/document/*)
├── ai.routes.js      (/api/ai/*)
├── flashcard.routes.js (/api/flashcard/*)
├── quiz.routes.js    (/api/quizzes/*)
└── progress.routes.js (/api/progress/*)
```

## Main Router (`routes/index.js`)

**Purpose:** Central router that mounts all feature-specific routes.

```javascript
const express = require('express');
const router = express.Router();

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/document', documentRoutes);
router.use('/ai', aiRoutes);
router.use('/flashcard', flashcardRoutes);
router.use('/quizzes', quizRoutes);
router.use('/progress', progressRoutes);

module.exports = router;
```

**Middleware Applied:**
- JSON parsing (handled in app.js)
- Authentication (applied per route)

## Authentication Routes (`routes/auth.routes.js`)

**Base Path:** `/api/auth`

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|------------|------------|-------------|
| POST | `/register` | - | `authController.register` | User registration |
| POST | `/login` | - | `authController.login` | User login |
| GET | `/profile` | `auth` | `authController.getProfile` | Get user profile |
| PUT | `/profile` | `auth` | `authController.updateProfile` | Update profile |
| POST | `/change-password` | `auth` | `authController.changePassword` | Change password |

**Validation Rules:**
- `register`: username (3-50 chars), email (valid), password (6+ chars)
- `login`: email (valid), password (required)
- `updateProfile`: optional username/email/profileImage
- `changePassword`: currentPassword, newPassword (6+ chars)

## Document Routes (`routes/document.routes.js`)

**Base Path:** `/api/document`

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|------------|------------|-------------|
| POST | `/upload` | `auth`, `upload.single('file')` | `documentController.uploadDocument` | Upload PDF |
| GET | `/` | `auth` | `documentController.getDocuments` | List user documents |
| GET | `/:id` | `auth` | `documentController.getDocument` | Get document details |
| DELETE | `/:id` | `auth` | `documentController.deleteDocument` | Delete document |

**Middleware Details:**
- `upload.single('file')`: Multer middleware for file handling
- `auth`: JWT authentication required

## AI Routes (`routes/ai.routes.js`)

**Base Path:** `/api/ai`

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|------------|------------|-------------|
| POST | `/generate-flashcards` | `auth` | `aiController.generateFlashcards` | Generate flashcards |
| POST | `/generate-quiz` | `auth` | `aiController.generateQuiz` | Generate quiz |
| POST | `/generate-summary` | `auth` | `aiController.generateSummary` | Generate summary |
| POST | `/chat` | `auth` | `aiController.chat` | Chat with document |
| POST | `/explain-concept` | `auth` | `aiController.explainConcept` | Explain concept |
| GET | `/chat-history/:documentId` | `auth` | `aiController.getChatHistory` | Get chat history |

**Request Validation:**
- `generate-flashcards`: documentId (exists), count (1-50)
- `generate-quiz`: documentId (exists), questionCount (1-20)
- `generate-summary`: documentId (exists)
- `chat`: documentId (exists), message (required, 1-1000 chars)
- `explain-concept`: documentId (exists), concept (required, 1-200 chars)

## Flashcard Routes (`routes/flashcard.routes.js`)

**Base Path:** `/api/flashcard`

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|------------|------------|-------------|
| GET | `/` | `auth` | `flashcardController.getAllFlashcards` | All flashcard sets |
| GET | `/:documentId` | `auth` | `flashcardController.getFlashcards` | Flashcards for document |
| POST | `/:cardId/review` | `auth` | `flashcardController.reviewFlashcard` | Mark card reviewed |
| PUT | `/:cardId/star` | `auth` | `flashcardController.toggleStarFlashcard` | Toggle star status |
| DELETE | `/:id` | `auth` | `flashcardController.deleteFlashcard` | Delete flashcard set |

**Parameter Validation:**
- `documentId`: Valid MongoDB ObjectId, document exists and belongs to user
- `cardId`: Valid MongoDB ObjectId, flashcard exists and belongs to user

## Quiz Routes (`routes/quiz.routes.js`)

**Base Path:** `/api/quizzes`

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|------------|------------|-------------|
| GET | `/:documentId` | `auth` | `quizController.getQuizzes` | Quizzes for document |
| GET | `/quiz/:id` | `auth` | `quizController.getQuizById` | Get specific quiz |
| POST | `/:id/submit` | `auth` | `quizController.submitQuiz` | Submit quiz answers |
| GET | `/:id/results` | `auth` | `quizController.getQuizResults` | Get quiz results |
| DELETE | `/:id` | `auth` | `quizController.deleteQuiz` | Delete quiz |

**Validation:**
- `submit`: answers array length matches questions, values 0-3

## Progress Routes (`routes/progress.routes.js`)

**Base Path:** `/api/progress`

| Method | Endpoint | Middleware | Controller | Description |
|--------|----------|------------|------------|-------------|
| GET | `/dashboard` | `auth` | `progressController.getDashboard` | Dashboard statistics |

## Middleware Application

### Authentication Middleware
Applied to all routes except auth registration/login:

```javascript
router.get('/protected-route', auth, controller.function);
```

### Validation Middleware
Input validation using express-validator:

```javascript
router.post('/endpoint', [
  body('field').isLength({ min: 1 }),
  // ... more validations
], controller.function);
```

### File Upload Middleware
Applied to document upload:

```javascript
router.post('/upload', auth, upload.single('file'), controller.uploadDocument);
```

## Route Parameters

### Path Parameters
- `:id` - MongoDB ObjectId (documents, flashcards, quizzes)
- `:documentId` - Document ObjectId
- `:cardId` - Flashcard ObjectId

### Query Parameters
- `count` - Number of items to generate (flashcards, quiz questions)
- `questionCount` - Alias for count in quiz generation

## Error Handling

Routes don't handle errors directly - they pass errors to the global error handler via `next(error)`.

## Security

- **Authentication Required:** All routes except `/api/auth/register` and `/api/auth/login`
- **User Authorization:** All data access filtered by authenticated user ID
- **Input Validation:** All inputs validated before processing
- **Rate Limiting:** Applied at application level (100 req/15min per IP)

## Route Organization

- **Feature-based grouping:** Related endpoints grouped in modules
- **Consistent naming:** RESTful URL patterns
- **HTTP method semantics:** GET (read), POST (create), PUT (update), DELETE (remove)
- **Parameter validation:** Centralized validation rules
- **Middleware chaining:** Auth, validation, and business logic separation</content>
<parameter name="filePath">d:\UserDefine Folder\ai-learning-assistant\docs\backend\routes.md