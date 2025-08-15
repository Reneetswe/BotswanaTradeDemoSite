# Authentication System Documentation

## Overview

The BSE Trading Platform includes a comprehensive authentication system that handles user registration, login, and session management. The system is designed to be easily connected to your backend database.

## Features

- **User Registration**: Create new accounts with email validation
- **User Login**: Secure authentication with password validation
- **Session Management**: Persistent login sessions using localStorage
- **Route Protection**: Protected routes that require authentication
- **Logout**: Secure logout with session cleanup

## File Structure

```
client/src/
├── pages/auth/
│   ├── login.tsx          # Login page component
│   └── register.tsx       # Registration page component
├── components/auth/
│   └── AuthGuard.tsx      # Route protection component
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── lib/
│   └── authService.ts     # Authentication API service
└── pages/
    └── dashboard.tsx      # Protected dashboard page
```

## Components

### Login Page (`/auth/login`)
- Email and password input fields
- Form validation
- Loading states
- Error handling
- Link to registration page

### Registration Page (`/auth/register`)
- First name, last name, email, and password fields
- Password confirmation
- Form validation (email format, password strength, etc.)
- Success state with redirect to login
- Link to login page

### Dashboard (`/dashboard`)
- Protected route requiring authentication
- Portfolio overview with mock data
- Trading interface tabs
- User profile display
- Logout functionality

### AuthGuard Component
- Protects routes that require authentication
- Redirects unauthenticated users to login
- Shows loading state during authentication check

## Authentication Flow

1. **Landing Page** → User clicks "Get Started" or "Sign In"
2. **Registration** → New users create account
3. **Login** → Users authenticate with credentials
4. **Dashboard** → Authenticated users access trading platform
5. **Logout** → Users can log out and return to landing page

## API Integration

The authentication system is designed to work with your backend API. The `authService.ts` file contains methods that can be easily connected to your database:

### Current Implementation (Demo Mode)
- Uses simulated API calls for demonstration
- Stores user data in localStorage
- Accepts any email/password combination

### Backend Integration
To connect to your actual backend:

1. Update the `API_BASE_URL` in `authService.ts`
2. Replace `simulateLogin` and `simulateRegister` with actual API calls
3. Implement proper JWT token handling
4. Add database validation for user credentials

### Database Schema
The system expects users to have the following fields (as defined in `shared/schema.ts`):
- `id`: Unique user identifier
- `email`: User's email address (unique)
- `firstName`: User's first name
- `lastName`: User's last name
- `profileImageUrl`: Optional profile image URL
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

## Security Features

- **Password Validation**: Minimum 8 characters required
- **Email Validation**: Proper email format validation
- **Session Management**: Secure token storage
- **Route Protection**: Unauthorized access prevention
- **Form Validation**: Client-side validation with error messages

## Usage Examples

### Protecting a Route
```tsx
import AuthGuard from "@/components/auth/AuthGuard";

<Route path="/protected">
  <AuthGuard>
    <ProtectedComponent />
  </AuthGuard>
</Route>
```

### Using Authentication in Components
```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.firstName}!</div>;
}
```

### Login Form
```tsx
const { login, isLoginLoading } = useAuth();

const handleSubmit = (e) => {
  e.preventDefault();
  login(
    { email, password },
    {
      onSuccess: () => {
        // Redirect to dashboard
        window.location.href = "/dashboard";
      },
      onError: () => {
        // Handle error
      },
    }
  );
};
```

## Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Next Steps

1. **Connect to Backend**: Replace simulated API calls with real backend endpoints
2. **Add Password Hashing**: Implement secure password hashing on the backend
3. **JWT Implementation**: Add proper JWT token generation and validation
4. **Email Verification**: Add email verification for new accounts
5. **Password Reset**: Implement password reset functionality
6. **Two-Factor Authentication**: Add 2FA for enhanced security

## Testing

The authentication system works in demo mode without requiring a backend. You can:

1. Register a new account
2. Login with any email/password
3. Access the protected dashboard
4. Logout and verify session cleanup

All data is stored in localStorage for demonstration purposes. 