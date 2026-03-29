# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or cloud instance)
- Google Gemini API key

## Environment Variables

Create `.env` files in both Backend and Frontend directories.

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-learning-assistant
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
MAX_FILE_SIZE=10485760
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Installation

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB service (if using local MongoDB)

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will start on `http://localhost:5173`

## Database Setup

The application uses MongoDB. The database and collections will be created automatically when you first run the application.

### Default Collections Created:
- `users` - User accounts
- `documents` - Uploaded PDF documents
- `chathistories` - Chat conversations
- `flashcards` - Generated flashcard sets
- `quizzes` - Generated quizzes

## API Testing

You can test the API endpoints using tools like Postman or curl:

### Health Check
```bash
curl http://localhost:3000/health
```

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## Development

### Backend Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if implemented)

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill process using the port

3. **Gemini API Errors**
   - Verify GEMINI_API_KEY is correct
   - Check API quota limits

4. **CORS Errors**
   - Ensure backend is running on the correct port
   - Check VITE_API_BASE_URL in frontend .env

### Logs

- Backend logs are displayed in the terminal
- Check browser console for frontend errors
- MongoDB logs can be found in MongoDB installation directory</content>
<parameter name="filePath">d:\UserDefine Folder\ai-learning-assistant\docs\setup.md