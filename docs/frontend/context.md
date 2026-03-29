# Frontend Context

## Overview

Context provides global state management for authentication and user data across the React application.

## AuthContext (`context/AuthContext.jsx`)

**Purpose:** Centralized authentication state management.

**Features:**
- Global auth state (user, isAuthenticated, loading)
- Login/logout functionality
- User data persistence
- Automatic auth restoration on app load

**Context Value:**
```javascript
{
  user: {
    id: string,
    username: string,
    email: string,
    profileImage?: string
  } | null,
  isAuthenticated: boolean,
  loading: boolean,
  login: (userData: object, token: string) => void,
  logout: () => void,
  updateUser: (userData: object) => void
}
```

### State Management

**Internal State:**
```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
```

**Computed Values:**
```javascript
const isAuthenticated = !!user;
```

### Methods

#### `login(userData, token)`
**Parameters:**
- `userData`: User object from API
- `token`: JWT token string

**Process:**
1. Store user data in state
2. Save token to localStorage
3. Persist user data to localStorage
4. Set loading to false

**Storage Keys:**
- `auth_token`: JWT token
- `auth_user`: Stringified user object

#### `logout()`
**Process:**
1. Clear user state
2. Remove token from localStorage
3. Remove user data from localStorage
4. Redirect to home/login

#### `updateUser(userData)`
**Parameters:** `userData`: Partial user object

**Process:**
1. Merge new data with existing user
2. Update state
3. Persist to localStorage

#### `checkAuthStatus()`
**Process:** (Called on app initialization)
1. Check for stored token and user data
2. Validate token expiry (client-side check)
3. Restore user state if valid
4. Set loading to false

### Usage in Components

**Consuming Auth Context:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Provider Setup in App:**
```javascript
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* App routes */}
      </Router>
    </AuthProvider>
  );
}
```

## Context Architecture

### Provider Component

**AuthProvider Structure:**
```jsx
export function AuthProvider({ children }) {
  // State and methods defined here

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Context Creation

**Context Definition:**
```javascript
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {}
});
```

### Custom Hook

**useAuth Hook:**
```javascript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## Data Persistence

### localStorage Strategy

**Storage Keys:**
```javascript
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
```

**Persistence Logic:**
- **Login:** Store both token and user data
- **Update:** Merge and re-store user data
- **Logout:** Clear both keys
- **Init:** Restore from storage if available

**Storage Format:**
```javascript
// Token
localStorage.setItem('auth_token', 'jwt_token_here');

// User data
localStorage.setItem('auth_user', JSON.stringify({
  id: '123',
  username: 'john_doe',
  email: 'john@example.com'
}));
```

### Token Validation

**Client-side Expiry Check:**
```javascript
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // Invalid token format
  }
};
```

## Security Considerations

### Token Handling
- JWT stored in localStorage (accessible to JavaScript)
- Automatic inclusion in API requests via axios interceptor
- Client-side expiry validation

### Data Sanitization
- User data validated before storage
- Sensitive data excluded from client storage
- Input sanitization on user updates

### Session Management
- Automatic logout on token expiry
- Secure token transmission (HTTPS required in production)
- No sensitive data stored client-side

## Integration with Components

### Protected Routes

**Integration Pattern:**
```jsx
function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### API Integration

**Automatic Token Inclusion:**
- Axios interceptor adds Authorization header
- Token retrieved from localStorage
- Applied to all API requests

**Error Handling:**
- 401 responses trigger logout
- Token expiry handled gracefully
- User redirected to login

## Testing

### Context Testing
```javascript
describe('AuthContext', () => {
  it('should provide auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });

  it('should handle login', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    act(() => {
      result.current.login(mockUser, mockToken);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});
```

### Mock Implementation
```javascript
const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn()
};
```

## Performance Considerations

### Re-rendering Optimization
- Context value memoization
- Selective state updates
- Minimal context value changes

### Memory Management
- Cleanup on unmount
- Efficient state structure
- Garbage collection of expired data

## Future Enhancements

### Planned Features
- Refresh token implementation
- Remember me functionality
- Multi-device session management
- Account lockout protection
- Two-factor authentication support

### State Management Evolution
- Consider Redux Toolkit for complex state
- Implement persistent state with redux-persist
- Add state synchronization across tabs

### Security Improvements
- Implement token refresh mechanism
- Add CSRF protection
- Enhance client-side security headers
- Implement secure token storage (future: Web Crypto API)