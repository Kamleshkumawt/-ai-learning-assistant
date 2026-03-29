# Backend Controllers

## Overview

Controllers handle business logic and act as intermediaries between routes and services/models. Each controller follows a consistent pattern with async/await error handling.

## Authentication Controller (`auth.controller.js`)

### `register(req, res)`
Handles user registration.

**Process:**
1. Validates input (username, email, password)
2. Checks for existing user with same email/username
3. Creates new user (password auto-hashed via pre-save hook)
4. Generates JWT token
5. Returns user data and token

**Error Handling:**
- Validation errors (express-validator)
- Duplicate key errors (MongoDB)
- General server errors

### `login(req, res)`
Handles user authentication.

**Process:**
1. Validates email/password input
2. Finds user by email
3. Compares password using bcrypt
4. Generates JWT token
5. Returns user data and token

**Error Handling:**
- Invalid credentials
- User not found
- Server errors

### `getProfile(req, res)`
Retrieves current user profile.

**Process:**
1. Extracts user ID from JWT (via auth middleware)
2. Fetches user data (excluding password)
3. Returns user profile

### `updateProfile(req, res)`
Updates user profile information.

**Process:**
1. Validates input fields
2. Updates user document
3. Returns updated user data

**Validation:**
- Username: 3-50 characters
- Email: valid email format
- Profile image: optional URL

### `changePassword(req, res)`
Changes user password.

**Process:**
1. Validates current password
2. Verifies current password match
3. Hashes new password
4. Updates user document
5. Returns success message

**Security:**
- Requires current password verification
- Uses bcrypt for password hashing

## Document Controller (`document.controller.js`)

### `uploadDocument(req, res)`
Handles PDF document upload.

**Process:**
1. Validates file upload (Multer middleware)
2. Creates document record with "processing" status
3. Triggers background PDF processing
4. Returns document metadata

**File Validation:**
- PDF format only
- Max size: 10MB (configurable)
- Automatic filename generation with timestamp

### `processPDF(documentId)`
Background PDF processing function.

**Process:**
1. Retrieves document record
2. Extracts text using pdf-parse
3. Chunks text with overlap (500 words, 50 overlap)
4. Updates document with extracted text and chunks
5. Sets status to "ready"

**Error Handling:**
- PDF parsing errors
- File not found
- Database update failures

### `getDocuments(req, res)`
Retrieves all user documents with statistics.

**Process:**
1. Aggregates documents with flashcard/quiz counts
2. Uses MongoDB aggregation pipeline
3. Returns documents with metadata

**Aggregation Pipeline:**
```javascript
[
  { $match: { userId: ObjectId(userId) } },
  { $lookup: { from: 'flashcards', ... } },
  { $lookup: { from: 'quizzes', ... } },
  { $project: { ... } }
]
```

### `getDocument(req, res)`
Retrieves specific document details.

**Process:**
1. Finds document by ID
2. Updates lastAccessed timestamp
3. Aggregates flashcard/quiz counts
4. Returns complete document data

### `deleteDocument(req, res)`
Deletes a document and associated data.

**Process:**
1. Finds document record
2. Deletes physical file from filesystem
3. Removes document from database
4. Cascading delete of related flashcards/quizzes/chat history

## AI Controller (`ai.controller.js`)

### `generateFlashcards(req, res)`
Generates flashcards using Google Gemini.

**Process:**
1. Retrieves document and chunks
2. Calls Gemini API with prompt
3. Parses response into flashcard format
4. Saves flashcard set to database
5. Returns flashcard data

**Gemini Prompt Structure:**
```
Generate {count} flashcards from this text.
Format: Q: Question
A: Answer
D: difficulty
```

### `generateQuiz(req, res)`
Generates MCQ quiz using Google Gemini.

**Process:**
1. Retrieves document chunks
2. Calls Gemini with quiz generation prompt
3. Parses response into quiz format
4. Validates exactly 4 options per question
5. Saves quiz to database

**Quiz Format:**
```
Q: Question
01: Option A
02: Option B
03: Option C
04: Option D
C: correct_index
D: difficulty
```

### `generateSummary(req, res)`
Creates document summary using Gemini.

**Process:**
1. Retrieves document text
2. Calls Gemini with summarization prompt
3. Returns generated summary

### `chat(req, res)`
Implements RAG (Retrieval-Augmented Generation) chat.

**Process:**
1. Finds relevant text chunks using semantic search
2. Sends question + context to Gemini
3. Saves conversation to chat history
4. Returns AI response with chunk references

**RAG Process:**
1. Keyword-based chunk selection
2. Context windowing (top 3 chunks)
3. Context-aware response generation

### `explainConcept(req, res)`
Explains specific concepts from document.

**Process:**
1. Finds relevant chunks for concept
2. Sends concept + context to Gemini
3. Returns educational explanation

### `getChatHistory(req, res)`
Retrieves chat conversation history.

**Process:**
1. Finds chat history for document
2. Returns all messages with metadata

## Flashcard Controller (`flashcard.controller.js`)

### `getFlashcards(req, res)`
Retrieves flashcards for a document.

**Process:**
1. Finds flashcard set by document ID
2. Returns all cards with metadata

### `getAllFlashcards(req, res)`
Retrieves all flashcard sets for user.

**Process:**
1. Finds all flashcard sets for user
2. Includes document title reference
3. Returns summarized data

### `reviewFlashcard(req, res)`
Marks flashcard as reviewed.

**Process:**
1. Updates lastReviewed timestamp
2. Increments reviewCount
3. Returns updated card data

### `toggleStarFlashcard(req, res)`
Toggles favorite status of flashcard.

**Process:**
1. Updates isStarred boolean
2. Returns updated card data

### `deleteFlashcard(req, res)`
Deletes entire flashcard set.

**Process:**
1. Removes flashcard document
2. Returns success confirmation

## Quiz Controller (`quiz.controller.js`)

### `getQuizzes(req, res)`
Retrieves all quizzes for a document.

**Process:**
1. Finds quizzes by document ID
2. Returns quiz metadata (without answers)

### `getQuizById(req, res)`
Retrieves specific quiz details.

**Process:**
1. Finds quiz by ID
2. Returns quiz with questions (without correct answers)

### `submitQuiz(req, res)`
Processes quiz submission and grading.

**Process:**
1. Validates answer array length
2. Calculates score (percentage correct)
3. Saves user answers and score
4. Sets completion timestamp
5. Returns results

**Grading Logic:**
```javascript
const correctAnswers = questions.map(q => q.correctAnswer);
const score = answers.reduce((acc, answer, index) =>
  acc + (answer === correctAnswers[index] ? 1 : 0), 0
);
const percentage = (score / totalQuestions) * 100;
```

### `getQuizResults(req, res)`
Retrieves detailed quiz results.

**Process:**
1. Finds completed quiz
2. Returns score, answers, and explanations

### `deleteQuiz(req, res)`
Deletes a quiz.

**Process:**
1. Removes quiz document
2. Returns success confirmation

## Progress Controller (`progress.controller.js`)

### `getDashboard(req, res)`
Aggregates learning statistics for dashboard.

**Process:**
1. Counts total documents
2. Aggregates flashcard statistics (total, reviewed, starred)
3. Calculates quiz statistics (total, average score)
4. Retrieves recent activity (last 5 documents/quizzes)
5. Returns comprehensive dashboard data

**Statistics Calculated:**
- Total documents uploaded
- Total flashcards generated
- Cards reviewed today/week
- Starred/favorited cards
- Average quiz score
- Study streak (days)
- Recent document uploads
- Recent quiz completions

## Error Handling Pattern

All controllers follow consistent error handling:

```javascript
try {
  // Controller logic
  res.status(200).json({
    success: true,
    message: "Operation successful",
    data: result
  });
} catch (error) {
  // Error passed to global error handler
  next(error);
}
```

## Validation

Controllers use express-validator for input validation:

- **Authentication:** Email format, password length, username constraints
- **Documents:** File type, size limits
- **AI Requests:** Document existence, count limits
- **Quiz Submission:** Answer array validation

## Security Considerations

- **Authentication Required:** All controllers except auth routes
- **User Isolation:** All queries filtered by userId
- **Input Sanitization:** Validation prevents malicious input
- **File Upload Security:** Type and size restrictions
- **Rate Limiting:** Applied at application level</content>
<parameter name="filePath">d:\UserDefine Folder\ai-learning-assistant\docs\backend\controllers.md