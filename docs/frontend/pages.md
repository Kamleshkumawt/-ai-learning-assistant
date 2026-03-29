# Frontend Pages

## Overview

Pages are top-level components that represent complete views in the application. They handle routing, data fetching, and orchestrate child components.

## Authentication Pages (`pages/Auth/`)

### LoginPage (`LoginPage.jsx`)

**Purpose:** User authentication entry point.

**Features:**
- Email/password login form
- Form validation with error display
- "Remember me" functionality (localStorage persistence)
- Link to registration page
- Loading states during authentication

**State Management:**
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
```

**Form Validation:**
- Email: Required, valid email format
- Password: Required
- Real-time validation feedback

**Authentication Flow:**
1. Form submission calls `authService.login()`
2. On success: Stores auth data via `useAuth` hook
3. Redirects to dashboard
4. On error: Displays error message

**UI Components:**
- Form inputs with validation styling
- Submit button with loading state
- Error message display
- Navigation links

### RegisterPage (`RegisterPage.jsx`)

**Purpose:** New user registration.

**Features:**
- Username, email, password registration form
- Password confirmation field
- Form validation with real-time feedback
- Link to login page
- Success/error message handling

**Form Validation:**
- Username: 3-50 characters, required
- Email: Valid email format, required
- Password: 6+ characters, required
- Confirm Password: Must match password

**Registration Flow:**
1. Form submission calls `authService.register()`
2. On success: Stores auth data, redirects to dashboard
3. On error: Displays validation/server errors

## Dashboard (`pages/Dashboard/`)

### DashboardPage (`DashboardPage.jsx`)

**Purpose:** Main application dashboard with learning statistics.

**Features:**
- Overview statistics cards
- Recent activity feed
- Learning progress visualization
- Quick action buttons

**Statistics Displayed:**
- Total documents uploaded
- Total flashcards generated
- Total quizzes taken
- Reviewed flashcards count
- Starred flashcards count
- Average quiz score
- Study streak (days)

**Data Fetching:**
```javascript
useEffect(() => {
  const fetchDashboardData = async () => {
    const data = await progressService.getDashboardData();
    setStats(data.stats);
    setRecentActivity(data.recentActivity);
  };
  fetchDashboardData();
}, []);
```

**Components Used:**
- `PageHeader` for title
- Custom stat cards with icons
- Activity list with timestamps
- Loading spinner during data fetch

## Documents (`pages/Documents/`)

### DocumentListPage (`DocumentListPage.jsx`)

**Purpose:** Document management interface.

**Features:**
- Grid layout of document cards
- Upload modal with file selection
- Delete confirmation dialogs
- Empty state for no documents
- File validation and progress feedback

**Upload Process:**
1. File selection triggers validation
2. Upload modal opens with title input
3. Form submission calls `documentService.uploadDocument()`
4. Shows progress and success/error toasts
5. Refreshes document list on success

**File Validation:**
- PDF files only
- Size limit checking (client-side)
- File type verification

**Components Used:**
- `DocumentCard` for each document
- `Modal` for upload form
- `Button` for actions
- `EmptyState` when no documents

### DocumentDetailPage (`DocumentDetailPage.jsx`)

**Purpose:** Comprehensive document view with all features.

**Features:**
- Tabbed interface (Content, Chat, AI Actions, Flashcards, Quizzes)
- PDF viewer integration
- Dynamic content loading based on active tab
- Document metadata display

**Tab Structure:**
1. **Content**: PDF viewer and basic info
2. **Chat**: ChatInterface component
3. **AI Actions**: AIAction component for generation
4. **Flashcards**: FlashcardManager component
5. **Quizzes**: QuizManager component

**Data Fetching:**
```javascript
const { id } = useParams();
const [document, setDocument] = useState(null);
const [activeTab, setActiveTab] = useState('content');

useEffect(() => {
  const fetchDocument = async () => {
    const data = await documentService.getDocumentById(id);
    setDocument(data.document);
  };
  fetchDocument();
}, [id]);
```

**Components Used:**
- `Tabs` for navigation
- `ChatInterface`, `AIAction`, `FlashcardManager`, `QuizManager`
- PDF iframe viewer
- Loading states

## Flashcards (`pages/Flashcards/`)

### FlashcardsListPage (`FlashcardsListPage.jsx`)

**Purpose:** Overview of all flashcard sets.

**Features:**
- List of flashcard sets across all documents
- Quick access to review specific sets
- Set metadata (card count, creation date)
- Navigation to individual flashcard review

**Components Used:**
- `FlashcardSetCard` for each set
- `PageHeader`
- `EmptyState` when no flashcards

### FlashcardPage (`FlashcardPage.jsx`)

**Purpose:** Individual flashcard set review interface.

**Features:**
- Full flashcard review experience
- Review statistics tracking
- Navigation between cards
- Star/favorite functionality

**Components Used:**
- `FlashcardManager` (main component)
- `PageHeader`

## Quizzes (`pages/Quizzes/`)

### QuizTakePage (`QuizTakePage.jsx`)

**Purpose:** Quiz taking interface.

**Features:**
- Question-by-question navigation
- Answer selection and validation
- Progress tracking
- Time management (optional)
- Submission handling

**Quiz Flow:**
1. Load quiz questions
2. Display one question at a time
3. Track selected answers
4. Allow navigation between questions
5. Submit all answers at once

**State Management:**
```javascript
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState([]);
const [timeRemaining, setTimeRemaining] = useState(quizTimeLimit);
```

**Components Used:**
- Question display
- Option selection (radio buttons)
- Navigation buttons (Previous/Next/Submit)
- Progress indicator

### QuizResultPage (`QuizResultPage.jsx`)

**Purpose:** Quiz results and review.

**Features:**
- Score display and percentage
- Question-by-question review
- Correct/incorrect answer indication
- Explanation display for each question
- Option to retake quiz

**Results Display:**
- Overall score and statistics
- Individual question breakdown
- User's answers vs correct answers
- Detailed explanations

**Components Used:**
- Score summary card
- Question review list
- Answer explanation modals
- Retake button

## Profile (`pages/Profile/`)

### ProfilePage (`ProfilePage.jsx`)

**Purpose:** User profile management.

**Features:**
- Profile information display and editing
- Password change functionality
- Profile image upload
- Account settings

**Forms:**
1. **Profile Update Form:**
   - Username, email, profile image
   - Validation and error handling
   - Success feedback

2. **Password Change Form:**
   - Current password verification
   - New password with confirmation
   - Security requirements

**Data Handling:**
```javascript
const [profileData, setProfileData] = useState({
  username: user?.username || '',
  email: user?.email || '',
  profileImage: user?.profileImage || ''
});

const handleProfileUpdate = async () => {
  await authService.updateProfile(profileData);
  updateUser(profileData); // Update auth context
};
```

**Components Used:**
- Form inputs with validation
- File upload for profile image
- `Button` components
- Success/error toast notifications

## Common Page Patterns

### Data Fetching Pattern
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.getData();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Loading States
- Skeleton loaders for initial load
- Spinner components for actions
- Disabled states during processing

### Error Handling
- Try-catch blocks around API calls
- User-friendly error messages
- Toast notifications for feedback
- Fallback UI for error states

### Form Handling
- Controlled components with useState
- Real-time validation
- Submit handlers with loading states
- Success/error feedback

### Navigation
- React Router for page transitions
- Protected routes for authenticated pages
- Programmatic navigation after actions
- Breadcrumb navigation where appropriate

## Responsive Design

All pages implement responsive design:
- Mobile-first approach
- Flexible grid layouts
- Collapsible navigation
- Touch-friendly interactions
- Optimized for various screen sizes

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Performance

- Lazy loading of heavy components
- Memoization of expensive operations
- Efficient re-rendering prevention
- Optimized API calls
- Code splitting for large bundles