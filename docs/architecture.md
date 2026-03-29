# Architecture Overview

## System Architecture

The AI Learning Assistant is a full-stack web application built with modern technologies, following a layered architecture pattern with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - Components    │    │ - Controllers   │    │ - Documents     │
│ - Pages         │    │ - Routes        │    │ - Users         │
│ - Services      │    │ - Models        │    │ - Chat History  │
│ - Context       │    │ - Middleware    │    │ - Flashcards    │
└─────────────────┘    └─────────────────┘    │ - Quizzes       │
                                              └─────────────────┘
                                                   │
                                                   ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Service    │    │   File Storage  │    │   External APIs │
│   (Gemini)      │    │   (Local)       │    │   (Google)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (Entry Point)
├── AuthProvider (Global State)
├── Router (Navigation)
└── AppLayout (Main Layout)
    ├── Header (Navigation Bar)
    ├── Sidebar (Menu)
    └── Main Content
        ├── Pages (Route Components)
        │   ├── Authentication Pages
        │   ├── Dashboard
        │   ├── Document Management
        │   ├── Flashcard System
        │   ├── Quiz System
        │   └── Profile Management
        └── Components (Reusable UI)
            ├── Layout Components
            ├── Feature Components
            └── Common Components
```

### State Management

**Local State:**
- Component-level state with `useState`
- Form state management
- UI interaction state

**Global State:**
- Authentication state via `AuthContext`
- User preferences and settings

**Data Flow:**
```
User Interaction → Component → Service → API → Backend → Database
Response ← Component ← Service ← API ← Backend ← Database
```

### Routing Architecture

**React Router Structure:**
```jsx
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Protected Routes */}
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } />

    {/* Nested Routes */}
    <Route path="/documents" element={<ProtectedRoute><DocumentListPage /></ProtectedRoute>} />
    <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetailPage /></ProtectedRoute>} />
  </Routes>
</BrowserRouter>
```

## Backend Architecture

### MVC Pattern Implementation

```
Routes (HTTP Layer)
    ↓
Controllers (Business Logic)
    ↓
Models (Data Layer)
    ↙        ↘
Services    Database
```

### Request Flow

```
HTTP Request
    ↓
Middleware (Auth, CORS, Rate Limiting)
    ↓
Routes (Endpoint Matching)
    ↓
Controller (Business Logic)
    ↓
Service/Model (Data Operations)
    ↓
Database (Persistence)
    ↓
Response Formatting
    ↓
HTTP Response
```

### Middleware Stack

```
Request
    ↓
CORS Middleware
    ↓
Helmet Security Headers
    ↓
Morgan Request Logging
    ↓
Rate Limiting
    ↓
JSON Parsing
    ↓
Static File Serving
    ↓
Authentication (Routes)
    ↓
Business Logic
    ↓
Response
```

## Database Architecture

### MongoDB Collections

**Core Collections:**
- `users` - User accounts and profiles
- `documents` - Uploaded PDF files and metadata
- `chathistories` - AI chat conversations
- `flashcards` - Generated flashcard sets
- `quizzes` - Generated quizzes and results

**Relationships:**
```
User (1) ──── (N) Documents
User (1) ──── (N) ChatHistories
User (1) ──── (N) Flashcards
User (1) ──── (N) Quizzes

Document (1) ──── (N) ChatHistories
Document (1) ──── (N) Flashcards
Document (1) ──── (N) Quizzes
```

### Indexing Strategy

**Performance Indexes:**
- `{ userId: 1, uploadDate: -1 }` on documents
- `{ userId: 1, documentId: 1 }` on flashcards/quizzes
- `{ email: 1 }` unique on users
- `{ username: 1 }` unique on users

### Data Flow

**Document Processing Pipeline:**
```
PDF Upload → File Storage → Text Extraction → Chunking → Database Storage → Status Update
```

**AI Content Generation:**
```
Document Chunks → AI Service → Content Generation → Database Storage → UI Update
```

## AI Integration Architecture

### RAG (Retrieval-Augmented Generation) System

```
User Query
    ↓
Query Preprocessing
    ↓
Document Chunk Retrieval
    ↓
Relevance Scoring
    ↓
Context Assembly
    ↓
AI Generation
    ↓
Response Formatting
    ↓
Chat History Storage
```

### Content Generation Pipeline

**Flashcard Generation:**
```
Document Text → Gemini API → Structured Parsing → Flashcard Objects → Database
```

**Quiz Generation:**
```
Document Text → Gemini API → MCQ Formatting → Validation → Quiz Objects → Database
```

**Chat System:**
```
User Message → Chunk Selection → Context Injection → Gemini API → Response → History Update
```

## Security Architecture

### Authentication Flow

```
Login Request → Password Verification → JWT Generation → Token Response
    ↓
Token Storage (Client) → Automatic Inclusion → Server Verification → User Context
```

### Authorization Layers

**API Level:**
- JWT token verification
- User ownership validation
- Rate limiting

**Data Level:**
- Database query filtering by userId
- Field-level access control

### Security Measures

- **Password Security:** bcrypt hashing, minimum requirements
- **Token Security:** JWT with expiration, secure storage
- **Input Validation:** Server-side validation with express-validator
- **File Security:** Type validation, size limits, secure storage
- **Rate Limiting:** Request throttling to prevent abuse

## Performance Architecture

### Frontend Optimizations

- **Code Splitting:** Route-based lazy loading
- **Caching:** Browser caching for static assets
- **Bundle Optimization:** Vite build optimizations
- **Image Optimization:** Efficient asset handling

### Backend Optimizations

- **Database Indexing:** Optimized queries
- **Connection Pooling:** MongoDB connection reuse
- **Caching:** Response caching where appropriate
- **Async Processing:** Background PDF processing

### AI Processing Optimizations

- **Chunking Strategy:** Overlapping text chunks for context preservation
- **Relevance Scoring:** Efficient keyword-based retrieval
- **Batch Processing:** Multiple operations handling
- **Error Recovery:** Robust error handling and retries

## Scalability Considerations

### Horizontal Scaling

**Database:**
- MongoDB sharding capabilities
- Read/write separation potential
- Connection pooling

**Backend:**
- Stateless API design
- Load balancer ready
- Microservices potential

**AI Services:**
- External API rate limiting
- Response caching
- Async processing queues

### Vertical Scaling

**Resource Optimization:**
- Memory-efficient text processing
- Optimized database queries
- Efficient file handling

## Deployment Architecture

### Development Environment

```
Local Development
├── Frontend (Vite dev server)
├── Backend (Node.js dev server)
├── Database (Local MongoDB)
└── AI Service (Google Gemini API)
```

### Production Environment

```
Production Deployment
├── Frontend (Static hosting)
├── Backend (Node.js server)
├── Database (MongoDB Atlas)
├── Reverse Proxy (Nginx)
└── SSL Termination
```

### CI/CD Pipeline

```
Code Push → Testing → Build → Deploy
    ↓         ↓        ↓        ↓
GitHub     Jest    Vite    Docker
Actions   Tests   Build  Compose
```

## Monitoring and Logging

### Application Monitoring

**Frontend:**
- Error tracking (console, user feedback)
- Performance monitoring (Core Web Vitals)
- User interaction analytics

**Backend:**
- Request/response logging (Morgan)
- Error tracking and alerting
- Performance metrics

**Database:**
- Query performance monitoring
- Connection pool monitoring
- Storage usage tracking

### Logging Strategy

**Log Levels:**
- ERROR: Application errors, security issues
- WARN: Potential issues, deprecated features
- INFO: Important business logic events
- DEBUG: Detailed debugging information

**Log Aggregation:**
- Structured logging with context
- Centralized log collection (future)
- Log retention policies

## Error Handling Architecture

### Frontend Error Handling

**Component Level:**
- Try-catch in async operations
- Error boundaries for React components
- User-friendly error messages

**Global Level:**
- Axios interceptors for API errors
- Toast notifications for user feedback
- Fallback UI states

### Backend Error Handling

**Middleware Level:**
- Global error handler middleware
- Consistent error response format
- Error logging and monitoring

**Application Level:**
- Controller error handling
- Service layer error management
- Database operation error handling

## Future Architecture Evolution

### Planned Enhancements

**Microservices Migration:**
- Separate AI service
- Document processing service
- User management service

**Advanced Features:**
- Real-time collaboration
- Advanced analytics
- Mobile application
- API marketplace

**Infrastructure Improvements:**
- Kubernetes orchestration
- Service mesh (Istio)
- Advanced monitoring (Prometheus/Grafana)
- CDN integration

### Technology Stack Evolution

**Potential Additions:**
- GraphQL API layer
- Redis caching layer
- Elasticsearch for search
- WebSocket for real-time features
- TypeScript migration
- Advanced state management (Zustand/Redux)

This architecture provides a solid foundation for the AI Learning Assistant, with clear separation of concerns, scalable design patterns, and room for future enhancements.