# Frontend Services

## Overview

Services handle API communication and business logic, abstracting HTTP requests and providing a clean interface for components.

## Axios Configuration (`utils/axiosInstance.js`)

**Purpose:** Centralized HTTP client configuration.

**Features:**
- Base URL configuration
- JWT token automatic inclusion
- Request/response interceptors
- Timeout configuration
- Error handling

**Configuration:**
```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` header
- Retrieves token from localStorage

**Response Interceptor:**
- Handles 401 errors (token expiry)
- Global error logging
- Response data extraction

## API Paths (`utils/apiPaths.js`)

**Purpose:** Centralized API endpoint definitions.

**Structure:**
```javascript
export const API_PATHS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  DOCUMENTS: {
    LIST: '/document',
    UPLOAD: '/document/upload',
    DETAIL: (id) => `/document/${id}`,
    DELETE: (id) => `/document/${id}`
  },
  // ... more sections
};
```

**Benefits:**
- Single source of truth for API paths
- Type safety with template literals
- Easy refactoring of endpoint changes
- Consistent URL construction

## Authentication Service (`services/authService.js`)

**Purpose:** Handle user authentication operations.

### `login(email, password)`
**Process:**
1. POST to `/api/auth/login`
2. Returns `{ user, token }`
3. Handles validation errors

**Error Handling:**
- Invalid credentials
- Network errors
- Server validation errors

### `register(username, email, password)`
**Process:**
1. POST to `/api/auth/register`
2. Returns `{ user, token }`
3. Handles duplicate email/username errors

### `getProfile()`
**Process:**
1. GET `/api/auth/profile`
2. Returns user profile data

### `updateProfile(userData)`
**Process:**
1. PUT `/api/auth/profile`
2. Updates username, email, profileImage
3. Returns updated user data

### `changePassword(passwords)`
**Process:**
1. POST `/api/auth/change-password`
2. Requires current password verification
3. Updates password hash on server

**Parameters:**
```javascript
{
  currentPassword: string,
  newPassword: string
}
```

## Document Service (`services/documentService.js`)

**Purpose:** Manage document CRUD operations.

### `getDocuments()`
**Returns:** Array of user documents with statistics

**Response:**
```javascript
{
  documents: [
    {
      id: string,
      title: string,
      fileSize: number,
      status: 'processing' | 'ready' | 'failed',
      uploadDate: string,
      flashcardCount: number,
      quizCount: number
    }
  ]
}
```

### `uploadDocument(formData)`
**Parameters:** FormData with file and title

**Process:**
1. Creates FormData with PDF file and title
2. POST multipart to `/api/document/upload`
3. Returns document metadata

**File Validation:**
- PDF type checking
- Size limits (client-side)
- FormData construction

### `getDocumentById(id)`
**Returns:** Complete document details

**Response:**
```javascript
{
  document: {
    id: string,
    title: string,
    filePath: string,
    extractedText: string,
    chunks: [...],
    flashcardCount: number,
    quizCount: number
  }
}
```

### `deleteDocument(id)`
**Process:**
1. DELETE `/api/document/:id`
2. Removes document and associated data

## AI Service (`services/aiService.js`)

**Purpose:** Interface for AI-powered features.

### `generateFlashcards(documentId, count)`
**Parameters:**
- `documentId`: string
- `count`: number (default 10)

**Process:**
1. POST `/api/ai/generate-flashcards`
2. Returns generated flashcard set

**Response:**
```javascript
{
  flashcardSet: {
    id: string,
    cards: [
      {
        question: string,
        answer: string,
        difficulty: 'easy' | 'medium' | 'hard'
      }
    ]
  }
}
```

### `generateQuiz(documentId, questionCount)`
**Parameters:**
- `documentId`: string
- `questionCount`: number (default 5)

**Process:**
1. POST `/api/ai/generate-quiz`
2. Returns generated quiz

**Response:**
```javascript
{
  quiz: {
    id: string,
    title: string,
    questions: [
      {
        question: string,
        options: [string, string, string, string],
        correctAnswer: number,
        explanation: string,
        difficulty: 'easy' | 'medium' | 'hard'
      }
    ]
  }
}
```

### `generateSummary(documentId)`
**Parameters:** `documentId`: string

**Process:**
1. POST `/api/ai/generate-summary`
2. Returns document summary

**Response:**
```javascript
{
  summary: string
}
```

### `chat(documentId, message)`
**Parameters:**
- `documentId`: string
- `message`: string

**Process:**
1. POST `/api/ai/chat`
2. Returns AI response with context

**Response:**
```javascript
{
  response: string,
  relevantChunks: [number, ...]
}
```

### `explainConcept(documentId, concept)`
**Parameters:**
- `documentId`: string
- `concept`: string

**Process:**
1. POST `/api/ai/explain-concept`
2. Returns concept explanation

### `getChatHistory(documentId)`
**Parameters:** `documentId`: string

**Returns:** Complete chat conversation history

**Response:**
```javascript
{
  messages: [
    {
      role: 'user' | 'assistant',
      content: string,
      timestamp: string,
      relevantChunks: [number, ...]
    }
  ]
}
```

## Flashcard Service (`services/flashcardService.js`)

**Purpose:** Manage flashcard operations.

### `getAllFlashcardSets()`
**Returns:** All flashcard sets for user

**Response:**
```javascript
{
  flashcardSets: [
    {
      id: string,
      documentId: string,
      documentTitle: string,
      cardCount: number,
      createdAt: string
    }
  ]
}
```

### `getFlashcardsForDocument(documentId)`
**Returns:** Flashcards for specific document

**Response:**
```javascript
{
  flashcards: [
    {
      id: string,
      question: string,
      answer: string,
      difficulty: 'easy' | 'medium' | 'hard',
      lastReviewed: string,
      reviewCount: number,
      isStarred: boolean
    }
  ]
}
```

### `reviewFlashcard(cardId, cardIndex)`
**Parameters:**
- `cardId`: string
- `cardIndex`: number

**Process:**
1. POST `/api/flashcard/:cardId/review`
2. Updates review timestamp and count

### `toggleStar(cardId)`
**Parameters:** `cardId`: string

**Process:**
1. PUT `/api/flashcard/:cardId/star`
2. Toggles isStarred boolean

### `deleteFlashcardSet(id)`
**Parameters:** `id`: string

**Process:**
1. DELETE `/api/flashcard/:id`
2. Removes entire flashcard set

## Quiz Service (`services/quizService.js`)

**Purpose:** Manage quiz operations.

### `getQuizzesForDocument(documentId)`
**Returns:** Quizzes for specific document

**Response:**
```javascript
{
  quizzes: [
    {
      id: string,
      title: string,
      totalQuestions: number,
      score: number | null,
      completedAt: string | null
    }
  ]
}
```

### `getQuizById(quizId)`
**Returns:** Complete quiz data (without answers for taking)

**Response:**
```javascript
{
  quiz: {
    id: string,
    title: string,
    questions: [
      {
        question: string,
        options: [string, string, string, string]
      }
    ]
  }
}
```

### `submitQuiz(quizId, answers)`
**Parameters:**
- `quizId`: string
- `answers`: number[] (selected option indices)

**Process:**
1. POST `/api/quizzes/:id/submit`
2. Auto-grades quiz
3. Returns score and results

**Response:**
```javascript
{
  score: 80,
  totalQuestions: 5,
  results: [...]
}
```

### `getQuizResults(quizId)`
**Returns:** Detailed quiz results with explanations

**Response:**
```javascript
{
  quiz: {
    title: string,
    score: number,
    questions: [
      {
        question: string,
        options: [string, ...],
        correctAnswer: number,
        userAnswer: number,
        explanation: string
      }
    ]
  }
}
```

### `deleteQuiz(quizId)`
**Parameters:** `quizId`: string

**Process:** DELETE `/api/quizzes/:id`

## Progress Service (`services/progressService.js`)

**Purpose:** Retrieve learning progress and statistics.

### `getDashboardData()`
**Returns:** Comprehensive dashboard statistics

**Response:**
```javascript
{
  stats: {
    totalDocuments: number,
    totalFlashcards: number,
    totalQuizzes: number,
    reviewedCards: number,
    starredCards: number,
    averageQuizScore: number,
    studyStreak: number
  },
  recentActivity: [
    {
      type: 'document' | 'quiz',
      title: string,
      date: string,
      score?: number
    }
  ]
}
```

## Service Architecture

### Error Handling

**Consistent Error Pattern:**
```javascript
try {
  const response = await axiosInstance.post(endpoint, data);
  return response.data;
} catch (error) {
  // Handle different error types
  if (error.response) {
    // Server responded with error status
    throw new Error(error.response.data.message);
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other error
    throw new Error('An unexpected error occurred.');
  }
}
```

### Request/Response Interception

**Global Error Handling:**
- 401 errors trigger logout
- Network errors show user-friendly messages
- Server errors are logged and formatted

### Data Transformation

**Response Processing:**
- Extract `data` field from API responses
- Transform dates to appropriate formats
- Normalize nested object structures

### Caching Strategy

**Current Implementation:**
- No client-side caching
- Fresh data on each request
- Future: Implement React Query or SWR

### Type Safety

**Interface Definitions:**
```typescript
// Example type definitions (for future TypeScript migration)
interface Document {
  id: string;
  title: string;
  fileSize: number;
  status: 'processing' | 'ready' | 'failed';
  uploadDate: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

## Testing

### Service Testing
```javascript
// Mock axios for testing
jest.mock('../utils/axiosInstance');

describe('authService', () => {
  it('should login user successfully', async () => {
    const mockResponse = {
      data: { user: { id: '1', username: 'test' }, token: 'token' }
    };
    axiosInstance.post.mockResolvedValue(mockResponse);

    const result = await authService.login('email', 'password');
    expect(result).toEqual(mockResponse.data);
  });
});
```

### Integration Testing
- API endpoint verification
- Error handling validation
- Authentication flow testing
- Data transformation testing

## Performance Considerations

### Optimization Techniques
- Request deduplication (future)
- Response caching (future)
- Lazy loading of service modules
- Minimal data transfer

### Monitoring
- Request/response logging
- Error tracking
- Performance metrics (future)

## Future Enhancements

### Planned Features
- Request caching with React Query
- Optimistic updates
- Background sync
- Request retry logic
- API versioning support