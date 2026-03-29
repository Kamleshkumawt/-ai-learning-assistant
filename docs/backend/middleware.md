# Backend Middleware

## Overview

Middleware functions intercept requests to perform common tasks like authentication, error handling, and input validation.

## Authentication Middleware (`middleware/auth.js`)

**Purpose:** Verifies JWT tokens and populates user context.

**Function:**
```javascript
const auth = (req, res, next) => {
  // Extract token from Authorization header
  // Verify token with JWT secret
  // Decode user ID from token
  // Fetch user from database
  // Attach user to req.user
  // Call next() or return 401
}
```

**Process:**
1. Extracts `Bearer <token>` from `Authorization` header
2. Verifies token using `jsonwebtoken.verify()`
3. Checks token expiration
4. Fetches user document (excluding password)
5. Attaches user object to `req.user`
6. Proceeds to next middleware or returns 401 error

**Error Responses:**
- `401 Unauthorized`: Missing/invalid token
- `401 Unauthorized`: Token expired
- `401 Unauthorized`: User not found

## Error Handler Middleware (`middleware/errorHandler.js`)

**Purpose:** Centralized error handling and formatting.

**Function:**
```javascript
const errorHandler = (err, req, res, next) => {
  // Log error details
  // Determine error type
  // Format appropriate response
  // Send JSON error response
}
```

**Error Types Handled:**
- **ValidationError**: Mongoose validation errors
- **CastError**: Invalid MongoDB ObjectId
- **MongoError (11000)**: Duplicate key errors
- **JsonWebTokenError**: JWT verification failures
- **MulterError**: File upload errors
- **Custom errors**: Application-specific errors

**Response Format:**
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Detailed error (development only)"
}
```

**HTTP Status Codes:**
- `400`: Bad Request (validation, cast errors)
- `401`: Unauthorized (auth errors)
- `404`: Not Found
- `409`: Conflict (duplicate keys)
- `413`: Payload Too Large (file size)
- `500`: Internal Server Error

## Application-Level Middleware (in `app.js`)

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Security Headers (Helmet)
```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
```

### Request Logging (Morgan)
```javascript
app.use(morgan('combined'));
```

### Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP'
});
app.use(limiter);
```

### JSON Parsing
```javascript
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
```

### Static File Serving
```javascript
app.use('/uploads', express.static('uploads'));
```

## Multer Configuration (`config/multer.js`)

**Purpose:** File upload handling for PDF documents.

**Configuration:**
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads/documents directory with timestamp
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 // 10MB
  }
});
```

**Features:**
- **Disk Storage**: Saves files to `uploads/documents/`
- **Timestamp Filenames**: Prevents conflicts
- **PDF-only Filter**: Rejects non-PDF files
- **Size Limits**: Configurable via environment variable
- **Directory Creation**: Auto-creates upload directories

## Database Configuration (`config/db.js`)

**Purpose:** MongoDB connection initialization.

**Function:**
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

**Features:**
- **Connection Pooling**: Built-in Mongoose connection pooling
- **Error Handling**: Graceful exit on connection failure
- **Logging**: Connection status logging

## Middleware Order

Request processing order in `app.js`:

1. **CORS** - Handle cross-origin requests
2. **Helmet** - Set security headers
3. **Morgan** - Log HTTP requests
4. **Rate Limiting** - Prevent abuse
5. **JSON Parsing** - Parse request bodies
6. **Static Files** - Serve uploaded files
7. **Routes** - Handle API endpoints
8. **Error Handler** - Catch and format errors

## Custom Middleware Usage

### Authentication in Routes
```javascript
router.get('/protected', auth, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### File Upload in Routes
```javascript
router.post('/upload', auth, upload.single('file'), controller.uploadDocument);
```

## Security Considerations

- **JWT Expiration**: Tokens expire and require refresh
- **User Context**: `req.user` excludes sensitive data (password)
- **File Validation**: Strict type and size limits
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for specific origins
- **Security Headers**: Helmet provides multiple protections
- **Error Information**: Detailed errors only in development

## Development vs Production

- **Error Details**: Stack traces shown only in development
- **Logging**: Morgan uses 'combined' format (detailed)
- **CORS**: More permissive in development
- **Static Files**: Served from local directory

## Testing Middleware

### Authentication Testing
```bash
# Valid token
curl -H "Authorization: Bearer <valid_token>" http://localhost:3000/api/protected

# Invalid token
curl -H "Authorization: Bearer invalid" http://localhost:3000/api/protected

# No token
curl http://localhost:3000/api/protected
```

### File Upload Testing
```bash
# Valid PDF
curl -X POST -H "Authorization: Bearer <token>" \
  -F "file=@document.pdf" -F "title=Test Document" \
  http://localhost:3000/api/document/upload

# Invalid file type
curl -X POST -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg" -F "title=Test" \
  http://localhost:3000/api/document/upload
```</content>
<parameter name="filePath">d:\UserDefine Folder\ai-learning-assistant\docs\backend\middleware.md