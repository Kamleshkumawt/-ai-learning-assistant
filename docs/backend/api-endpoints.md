# API Endpoints Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication (`/auth`)

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-50 chars)",
  "email": "string (valid email)",
  "password": "string (6+ chars)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    },
    "token": "jwt_token"
  }
}
```

#### POST `/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "profileImage": "string"
    },
    "token": "jwt_token"
  }
}
```

#### GET `/auth/profile`
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "profileImage": "string"
    }
  }
}
```

#### PUT `/auth/profile`
Update user profile information.

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "profileImage": "string (optional)"
}
```

#### POST `/auth/change-password`
Change user password.

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (6+ chars)"
}
```

### Documents (`/document`)

#### POST `/document/upload`
Upload a PDF document.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: PDF file (max 10MB)
- `title`: Document title

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "string",
      "title": "string",
      "fileName": "string",
      "fileSize": "number",
      "status": "processing",
      "uploadDate": "ISO date"
    }
  }
}
```

#### GET `/document`
Get all documents for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "string",
        "title": "string",
        "fileName": "string",
        "fileSize": "number",
        "status": "ready",
        "uploadDate": "ISO date",
        "lastAccessed": "ISO date",
        "flashcardCount": 0,
        "quizCount": 0
      }
    ]
  }
}
```

#### GET `/document/:id`
Get specific document details.

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "string",
      "title": "string",
      "fileName": "string",
      "filePath": "string",
      "fileSize": "number",
      "extractedText": "string",
      "chunks": [...],
      "status": "ready",
      "uploadDate": "ISO date",
      "lastAccessed": "ISO date",
      "flashcardCount": 0,
      "quizCount": 0
    }
  }
}
```

#### DELETE `/document/:id`
Delete a document.

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### AI Features (`/ai`)

#### POST `/ai/generate-flashcards`
Generate flashcards from a document.

**Request Body:**
```json
{
  "documentId": "string",
  "count": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Flashcards generated successfully",
  "data": {
    "flashcardSet": {
      "id": "string",
      "documentId": "string",
      "cards": [
        {
          "question": "string",
          "answer": "string",
          "difficulty": "easy|medium|hard"
        }
      ]
    }
  }
}
```

#### POST `/ai/generate-quiz`
Generate a quiz from a document.

**Request Body:**
```json
{
  "documentId": "string",
  "questionCount": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz generated successfully",
  "data": {
    "quiz": {
      "id": "string",
      "title": "string",
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": 0,
          "explanation": "string",
          "difficulty": "easy|medium|hard"
        }
      ]
    }
  }
}
```

#### POST `/ai/generate-summary`
Generate a summary of a document.

**Request Body:**
```json
{
  "documentId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Summary generated successfully",
  "data": {
    "summary": "string"
  }
}
```

#### POST `/ai/chat`
Chat with document content using RAG.

**Request Body:**
```json
{
  "documentId": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "string",
    "relevantChunks": [0, 1, 2]
  }
}
```

#### POST `/ai/explain-concept`
Explain a specific concept from the document.

**Request Body:**
```json
{
  "documentId": "string",
  "concept": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "explanation": "string"
  }
}
```

#### GET `/ai/chat-history/:documentId`
Get chat history for a document.

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "role": "user|assistant",
        "content": "string",
        "timestamp": "ISO date",
        "relevantChunks": [0, 1, 2]
      }
    ]
  }
}
```

### Flashcards (`/flashcard`)

#### GET `/flashcard`
Get all flashcard sets for the user.

**Response:**
```json
{
  "success": true,
  "data": {
    "flashcardSets": [
      {
        "id": "string",
        "documentId": "string",
        "documentTitle": "string",
        "cardCount": 10,
        "createdAt": "ISO date"
      }
    ]
  }
}
```

#### GET `/flashcard/:documentId`
Get flashcards for a specific document.

**Response:**
```json
{
  "success": true,
  "data": {
    "flashcards": [
      {
        "id": "string",
        "question": "string",
        "answer": "string",
        "difficulty": "easy|medium|hard",
        "lastReviewed": "ISO date",
        "reviewCount": 0,
        "isStarred": false
      }
    ]
  }
}
```

#### POST `/flashcard/:cardId/review`
Mark a flashcard as reviewed.

**Request Body:**
```json
{
  "cardIndex": 0
}
```

#### PUT `/flashcard/:cardId/star`
Toggle star status of a flashcard.

**Request Body:**
```json
{
  "isStarred": true
}
```

#### DELETE `/flashcard/:id`
Delete a flashcard set.

### Quizzes (`/quizzes`)

#### GET `/quizzes/:documentId`
Get all quizzes for a document.

**Response:**
```json
{
  "success": true,
  "data": {
    "quizzes": [
      {
        "id": "string",
        "title": "string",
        "totalQuestions": 5,
        "score": null,
        "completedAt": null
      }
    ]
  }
}
```

#### GET `/quizzes/quiz/:id`
Get a specific quiz.

**Response:**
```json
{
  "success": true,
  "data": {
    "quiz": {
      "id": "string",
      "title": "string",
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"]
        }
      ]
    }
  }
}
```

#### POST `/quizzes/:id/submit`
Submit answers for a quiz.

**Request Body:**
```json
{
  "answers": [0, 1, 2, 3, 0]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 80,
    "totalQuestions": 5,
    "results": [...]
  }
}
```

#### GET `/quizzes/:id/results`
Get quiz results with explanations.

#### DELETE `/quizzes/:id`
Delete a quiz.

### Progress (`/progress`)

#### GET `/progress/dashboard`
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalDocuments": 5,
      "totalFlashcards": 50,
      "totalQuizzes": 10,
      "reviewedCards": 25,
      "starredCards": 5,
      "averageQuizScore": 85,
      "studyStreak": 7
    },
    "recentActivity": [...]
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details (development only)"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applies to all endpoints

## File Upload Limits

- Maximum file size: 10MB
- Accepted formats: PDF only</content>
<parameter name="filePath">d:\UserDefine Folder\ai-learning-assistant\docs\backend\api-endpoints.md