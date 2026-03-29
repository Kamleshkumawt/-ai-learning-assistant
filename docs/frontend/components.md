# Frontend Components

## Overview

Components are reusable React components organized by feature and purpose. They follow consistent patterns for props, state management, and styling.

## Layout Components (`components/layout/`)

### AppLayout (`AppLayout.jsx`)

**Purpose:** Main application layout wrapper.

**Features:**
- Two-column layout (sidebar + main content)
- Responsive sidebar toggle for mobile
- Consistent header across all pages
- Content area for page components

**State Management:**
```javascript
const [sidebarOpen, setSidebarOpen] = useState(false);
```

**Props:**
- `children`: Page content to render in main area

**Responsive Behavior:**
- Desktop: Sidebar always visible
- Mobile: Sidebar overlay with toggle

### Header (`Header.jsx`)

**Purpose:** Application header with navigation and user info.

**Features:**
- User profile display (avatar, name)
- Sidebar toggle button (mobile)
- Notification bell (placeholder)
- Responsive design

**Components Used:**
- User avatar with fallback
- Menu toggle button
- Notification icon

### Sidebar (`Sidebar.jsx`)

**Purpose:** Main navigation sidebar.

**Features:**
- Navigation links to main sections
- Active route highlighting
- Collapsible on mobile
- Clean, accessible navigation

**Navigation Items:**
- Dashboard
- Documents
- Flashcards
- Quizzes
- Profile

**Props:**
- `isOpen`: Boolean for mobile visibility
- `onToggle`: Function to toggle sidebar

## Authentication Components (`components/auth/`)

### ProtectedRoute (`ProtectedRoute.jsx`)

**Purpose:** Route guard for authenticated pages.

**Functionality:**
- Checks authentication status via `useAuth` hook
- Redirects to login if not authenticated
- Wraps protected pages with `AppLayout`

**Usage:**
```jsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

**Redirect Logic:**
- Authenticated: Render children with layout
- Not authenticated: Redirect to `/login`

## Chat Components (`components/chat/`)

### ChatInterface (`ChatInterface.jsx`)

**Purpose:** Interactive chat interface for document Q&A.

**Features:**
- Message history display
- Real-time chat input
- Markdown rendering for AI responses
- Typing indicators
- Auto-scroll to latest message

**State Management:**
```javascript
const [messages, setMessages] = useState([]);
const [inputMessage, setInputMessage] = useState('');
const [isTyping, setIsTyping] = useState(false);
```

**Message Types:**
- User messages: Right-aligned, green background
- AI messages: Left-aligned, white background with markdown

**Components Used:**
- `MarkdownRenderer` for AI responses
- Scroll container with auto-scroll
- Typing animation component

**API Integration:**
- Loads chat history on mount
- Sends messages via `aiService.chat()`
- Updates message list in real-time

## AI Components (`components/ai/`)

### AIAction (`AIAction.jsx`)

**Purpose:** Interface for AI-powered content generation.

**Features:**
- Generate flashcards button
- Generate quiz button
- Generate summary button
- Explain concept form
- Progress feedback and error handling

**Actions:**
1. **Generate Flashcards:**
   - Input: Number of cards (default 10)
   - Calls `aiService.generateFlashcards()`
   - Shows success/error toast

2. **Generate Quiz:**
   - Input: Number of questions (default 5)
   - Calls `aiService.generateQuiz()`
   - Shows success/error toast

3. **Generate Summary:**
   - No input required
   - Displays summary in modal
   - Calls `aiService.generateSummary()`

4. **Explain Concept:**
   - Text input for concept
   - Calls `aiService.explainConcept()`
   - Shows explanation in modal

**Components Used:**
- `Button` components
- `Modal` for results display
- Form inputs with validation
- Toast notifications

## Document Components (`components/documents/`)

### DocumentCard (`DocumentCard.jsx`)

**Purpose:** Display card for individual documents.

**Features:**
- Document title and metadata
- File size display
- Upload date (relative format)
- Flashcard and quiz counts as badges
- Delete action with confirmation

**Props:**
```javascript
{
  document: {
    id: string,
    title: string,
    fileSize: number,
    uploadDate: string,
    flashcardCount: number,
    quizCount: number
  },
  onDelete: function
}
```

**Components Used:**
- Hover effects for actions
- Badge components for counts
- Confirmation modal for delete
- Click navigation to detail page

## Flashcard Components (`components/flashcards/`)

### FlashcardManager (`FlashcardManager.jsx`)

**Purpose:** Complete flashcard review interface.

**Features:**
- List of flashcard sets for document
- Individual card review with flip animation
- Navigation between cards
- Star/favorite toggle
- Review tracking
- Delete set functionality

**State Management:**
```javascript
const [flashcardSets, setFlashcardSets] = useState([]);
const [selectedSet, setSelectedSet] = useState(null);
const [currentCardIndex, setCurrentCardIndex] = useState(0);
const [showAnswer, setShowAnswer] = useState(false);
```

**Components Used:**
- `Flashcard` for individual cards
- `FlashcardSetCard` for set selection
- Navigation buttons
- Star toggle buttons

### Flashcard (`Flashcard.jsx`)

**Purpose:** Individual flashcard component with flip animation.

**Features:**
- Question/answer flip animation
- Difficulty level display
- Star favorite button
- Smooth CSS transitions

**Props:**
```javascript
{
  card: {
    question: string,
    answer: string,
    difficulty: 'easy' | 'medium' | 'hard',
    isStarred: boolean
  },
  onStarToggle: function,
  showAnswer: boolean
}
```

**Animation:**
- 3D flip effect using CSS transforms
- Smooth transition on flip
- Visual feedback for interactions

### FlashcardSetCard (`FlashcardSetCard.jsx`)

**Purpose:** Card representing a flashcard set.

**Features:**
- Set title and document reference
- Card count display
- Creation date
- Click to start review

**Props:**
```javascript
{
  flashcardSet: {
    id: string,
    documentTitle: string,
    cardCount: number,
    createdAt: string
  },
  onSelect: function
}
```

## Quiz Components (`components/quizzes/`)

### QuizManager (`QuizManager.jsx`)

**Purpose:** Quiz management interface for documents.

**Features:**
- List existing quizzes
- Generate new quiz modal
- Delete quiz confirmation
- Navigation to take quiz

**State Management:**
```javascript
const [quizzes, setQuizzes] = useState([]);
const [showGenerateModal, setShowGenerateModal] = useState(false);
```

**Components Used:**
- `QuizCard` for each quiz
- `Modal` for quiz generation
- Form inputs for question count

### QuizCard (`QuizCard.jsx`)

**Purpose:** Display card for individual quizzes.

**Features:**
- Quiz title and document info
- Question count
- Completion status
- Take quiz navigation

**Props:**
```javascript
{
  quiz: {
    id: string,
    title: string,
    totalQuestions: number,
    score: number | null,
    completedAt: string | null
  }
}
```

## Common Components (`components/common/`)

### Button (`Button.jsx`)

**Purpose:** Reusable button component with variants.

**Variants:**
- `primary`: Blue background, white text
- `secondary`: Gray background, dark text
- `danger`: Red background for destructive actions

**Props:**
```javascript
{
  variant: 'primary' | 'secondary' | 'danger',
  size: 'sm' | 'md' | 'lg',
  disabled: boolean,
  loading: boolean,
  onClick: function,
  children: ReactNode,
  icon: ReactNode
}
```

**Features:**
- Loading state with spinner
- Disabled state styling
- Icon support
- Consistent styling across app

### Modal (`Modal.jsx`)

**Purpose:** Reusable modal dialog component.

**Features:**
- Overlay backdrop with blur
- Close button (X)
- Click outside to close
- Smooth animations
- Accessible focus management

**Props:**
```javascript
{
  isOpen: boolean,
  onClose: function,
  title: string,
  children: ReactNode
}
```

**Usage:**
```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Action">
  <p>Are you sure?</p>
  <Button onClick={confirmAction}>Yes</Button>
</Modal>
```

### Spinner (`Spinner.jsx`)

**Purpose:** Loading indicator component.

**Features:**
- CSS-only animation
- Multiple sizes
- Centered display option
- Consistent styling

**Props:**
```javascript
{
  size: 'sm' | 'md' | 'lg',
  centered: boolean
}
```

### EmptyState (`EmptyState.jsx`)

**Purpose:** Display when no data is available.

**Features:**
- Icon, title, and description
- Call-to-action button
- Consistent styling for empty states

**Props:**
```javascript
{
  icon: ReactNode,
  title: string,
  description: string,
  action: {
    label: string,
    onClick: function
  }
}
```

### Tabs (`Tabs.jsx`)

**Purpose:** Tabbed content navigation.

**Features:**
- Multiple tab support
- Active tab indication
- Content switching
- Accessible keyboard navigation

**Props:**
```javascript
{
  tabs: [
    {
      id: string,
      label: string,
      content: ReactNode
    }
  ],
  activeTab: string,
  onTabChange: function
}
```

### MarkdownRenderer (`MarkdownRenderer.jsx`)

**Purpose:** Render markdown content with syntax highlighting.

**Features:**
- Markdown parsing with `react-markdown`
- GitHub Flavored Markdown support
- Syntax highlighting for code blocks
- Custom styling for chat messages

**Libraries Used:**
- `react-markdown`
- `remark-gfm` (GitHub Flavored Markdown)
- `react-syntax-highlighter`

**Supported Features:**
- Headers, lists, links
- Code blocks with language-specific highlighting
- Tables, strikethrough
- Inline code

### PageHeader (`PageHeader.jsx`)

**Purpose:** Consistent page title display.

**Features:**
- Large title text
- Optional subtitle
- Consistent spacing and typography

**Props:**
```javascript
{
  title: string,
  subtitle?: string
}
```

## Component Architecture

### State Management

**Local State:**
- `useState` for component-specific state
- `useEffect` for side effects and data fetching
- `useCallback` for memoized functions

**Global State:**
- `AuthContext` for authentication state
- Local storage persistence for auth data

### Props Interface

**Consistent Patterns:**
- Callback functions for user interactions
- Data objects for content display
- Boolean flags for conditional rendering
- Loading/error states

### Styling Approach

**Tailwind CSS:**
- Utility-first CSS framework
- Responsive design utilities
- Consistent spacing and colors
- Dark/light theme support (prepared)

**Component Styling:**
- Class composition for reusability
- Conditional classes based on props
- Hover and focus states
- Accessibility-compliant colors

### Accessibility

**Standards Followed:**
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility
- Focus management in modals

### Performance

**Optimization Techniques:**
- `React.memo` for expensive components
- `useCallback` for event handlers
- Lazy loading for heavy components
- Efficient re-rendering prevention

### Error Boundaries

**Error Handling:**
- Try-catch in async operations
- User-friendly error messages
- Fallback UI for component errors
- Toast notifications for feedback

## Component Hierarchy

```
App
├── AuthContext
├── Router
└── AppLayout
    ├── Header
    ├── Sidebar
    └── Main Content
        ├── Pages
        │   ├── DashboardPage
        │   ├── DocumentListPage
        │   │   └── DocumentCard
        │   ├── DocumentDetailPage
        │   │   ├── Tabs
        │   │   ├── ChatInterface
        │   │   ├── AIAction
        │   │   ├── FlashcardManager
        │   │   │   ├── Flashcard
        │   │   │   └── FlashcardSetCard
        │   │   └── QuizManager
        │   │       └── QuizCard
        │   ├── ProfilePage
        │   └── Auth Pages
        └── Common Components
            ├── Button
            ├── Modal
            ├── Spinner
            ├── EmptyState
            ├── MarkdownRenderer
            └── PageHeader
```

## Testing

**Component Testing:**
- Unit tests for individual components
- Props validation
- Event handler testing
- State updates verification

**Integration Testing:**
- Component interaction testing
- API integration verification
- End-to-end user flows

## Future Enhancements

**Planned Improvements:**
- Dark mode toggle
- Component theming system
- Animation library integration
- Advanced accessibility features
- Performance monitoring