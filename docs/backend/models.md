# Database Models

## Overview

The application uses MongoDB with Mongoose ODM for data modeling. All models include automatic timestamps and follow consistent naming conventions.

## User Model

**Collection:** `users`

**Schema:**
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [emailValidator]
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String,
    default: null
  }
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)

**Methods:**
- `isValidPassword(password)` - Compares provided password with hashed password using bcrypt

**Pre-save Hook:**
- Automatically hashes password using bcryptjs before saving

## Document Model

**Collection:** `documents`

**Schema:**
```javascript
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  chunks: [{
    content: String,
    pageNumber: Number,
    chunkIndex: Number
  }],
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `{ userId: 1, uploadDate: -1 }` (compound index for user documents sorted by date)

## Chat History Model

**Collection:** `chathistories`

**Schema:**
```javascript
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    relevantChunks: [Number] // Array of chunk indices used for this message
  }]
}
```

**Indexes:**
- `{ userId: 1, documentId: 1 }` (compound index for user-document chat histories)

## Flashcard Model

**Collection:** `flashcards`

**Schema:**
```javascript
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  cards: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    lastReviewed: {
      type: Date,
      default: null
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isStarred: {
      type: Boolean,
      default: false
    }
  }]
}
```

**Indexes:**
- `{ userId: 1, documentId: 1 }` (compound index for user-document flashcards)

## Quiz Model

**Collection:** `quizzes`

**Schema:**
```javascript
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    explanation: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }],
  userAnswers: [Number], // Array of selected option indices
  score: Number, // Percentage score (0-100)
  totalQuestions: {
    type: Number,
    default: function() { return this.questions.length; }
  },
  completedAt: Date
}
```

**Indexes:**
- `{ userId: 1, documentId: 1 }` (compound index for user-document quizzes)

## Model Relationships

```
User
├── 1:N Documents (userId)
├── 1:N ChatHistories (userId)
├── 1:N Flashcards (userId)
└── 1:N Quizzes (userId)

Document
├── 1:1 User (userId)
├── 1:N ChatHistories (documentId)
├── 1:N Flashcards (documentId)
└── 1:N Quizzes (documentId)
```

## Data Validation

- **Email validation** using validator library
- **Password minimum length** enforced at model level
- **Enum constraints** for status, difficulty, and role fields
- **Reference validation** ensures related documents exist
- **Array length validation** for quiz options (exactly 4)

## Indexing Strategy

- **Compound indexes** on frequently queried fields (userId + documentId)
- **Unique indexes** on username and email
- **Sorted indexes** for date-based queries (uploadDate, timestamp)

## Data Types and Constraints

- **ObjectId** for MongoDB document references
- **String trimming** to prevent whitespace issues
- **Lowercase conversion** for email fields
- **Default values** for optional fields
- **Required fields** marked appropriately
- **Array constraints** for fixed-length arrays (quiz options)

## Performance Considerations

- **Chunked text storage** allows efficient retrieval of relevant document sections
- **Message history arrays** store conversation context without separate collections
- **Embedded documents** reduce lookup operations for related data
- **Indexing** optimizes query performance for user-specific data</content>
<parameter name="filePath">d:\UserDefine Folder\ai-learning-assistant\docs\backend\models.md