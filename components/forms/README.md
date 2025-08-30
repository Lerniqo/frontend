# LoginForm Component Usage Guide

## Basic Usage

```tsx
import LoginForm from '@/components/forms/LoginForm';

// Basic usage with default settings
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  );
}
```

## Advanced Usage with Custom Props

```tsx
import LoginForm from '@/components/forms/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomLoginPage() {
  const { login, isLoading } = useAuth();

  const handleCustomLogin = async (email: string, password: string) => {
    // Custom login logic
    const result = await login(email, password);
    
    if (result.success) {
      // Custom success handling
      console.log('Login successful!');
    }
    
    return result;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm 
        onSubmit={handleCustomLogin}
        isLoading={isLoading}
        className="shadow-2xl"
        showSignUpLink={true}
        redirectPath="/custom-dashboard"
      />
    </div>
  );
}
```

## Component Features

### Real-time Validation
- **Email validation**: Checks for proper email format
- **Password validation**: Minimum 6 characters
- **Visual feedback**: Color-coded borders and icons
- **Error messages**: Helpful validation messages

### Accessibility Features
- **ARIA labels**: Proper screen reader support
- **Keyboard navigation**: Tab order and Enter submission
- **Focus management**: Visual focus indicators
- **Error announcements**: Screen reader error notifications

### Authentication Integration
- **AuthContext**: Seamless integration with existing auth system
- **Loading states**: Visual feedback during authentication
- **Error handling**: Graceful error display
- **Success feedback**: Confirmation messages

### Professional Styling
- **Blue-purple gradient theme**: Consistent with project colors
- **Responsive design**: Mobile-first approach
- **GSAP animations**: Smooth entrance and interaction effects
- **Modern UI**: Clean, professional appearance

## Customization Options

### Styling
```tsx
<LoginForm 
  className="max-w-lg mx-auto mt-16 custom-shadow"
/>
```

### Behavior
```tsx
<LoginForm 
  showSignUpLink={false}        // Hide sign up link
  redirectPath="/admin"         // Custom redirect
/>
```

### Integration
```tsx
<LoginForm 
  onSubmit={customLoginHandler} // Custom login logic
  isLoading={customLoadingState} // Custom loading state
/>
```