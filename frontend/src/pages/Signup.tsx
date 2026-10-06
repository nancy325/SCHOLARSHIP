import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from "@/assets/scholarship-hero.jpg";
import { apiService } from '@/services/api';
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  category: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  category?: string;
  general?: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    category: 'high-school'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters. Consider using a mix of letters, numbers, and special characters for a stronger password.';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiService.register(formData);
      
      if (response.success && response.data) {
        // Store user data and token
        apiService.storeUser(response.data.user);
        
        toast.success("Your account is ready");
        
        // Redirect to appropriate dashboard
        const role = (response.data.user as any).role;
        if (role === 'super_admin' || role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // Try to extract exact error message from API
      let errorMsg: string | undefined = undefined;
      let fieldErrors: FormErrors = {};

      // Handle different error response structures
      if (error?.response?.data) {
        // Laravel validation errors are usually in error.response.data.errors
        if (error.response.data.errors && typeof error.response.data.errors === 'object') {
          const apiErrors = error.response.data.errors;
          Object.entries(apiErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              // Show only the first error message for each field
              if (
                field === 'name' ||
                field === 'email' ||
                field === 'password' ||
                field === 'password_confirmation' ||
                field === 'category'
              ) {
                fieldErrors[field] = messages[0];
              }
              // Fallback: put any non-form error in general
              if (
                field !== 'name' &&
                field !== 'email' &&
                field !== 'password' &&
                field !== 'password_confirmation' &&
                field !== 'category'
              ) {
                // Concatenate into the general error
                if (!fieldErrors.general) fieldErrors.general = '';
                fieldErrors.general += messages[0] + ' ';
              }
            }
          });
        }
        // Some APIs may put the main error in .message or .error
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
      }

      // If there are field errors set, use them
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else if (errorMsg) {
        setErrors({ general: errorMsg });
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-3 rounded-full bg-white/90 px-3 py-1.5 shadow-sm ring-1 ring-slate-200 hover:bg-white"
      >
        <img src="/favicon.png" alt="ScholarSnap" className="w-8 h-8 rounded-md" />
        <span className="text-sm font-semibold text-slate-800">Back to Home</span>
      </Link>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-primary/75 to-foreground/90"></div>
      </div>
      <div className="relative z-10 my-8 w-full max-w-lg rounded-lg border border-white/60 bg-card/95 p-7 shadow-2xl backdrop-blur sm:p-9">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-primary">ScholarSnap</p>
        <h2 className="mb-2 text-center text-3xl font-semibold text-foreground">Create your account</h2>
        <p className="mb-7 text-center text-sm text-muted-foreground">Find opportunities that fit your next step.</p>
        
        {errors.general && (
            <div role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-foreground">Full name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.name)}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p role="alert" className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email)}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className={`h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p role="alert" className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-foreground">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
              aria-invalid={Boolean(errors.password)}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className={`h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && <p role="alert" className="mt-1 text-sm text-destructive">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="signup-password-confirmation" className="mb-2 block text-sm font-medium text-foreground">Confirm password</label>
            <input
              id="signup-password-confirmation"
              type="password"
              name="password_confirmation"
              autoComplete="new-password"
              required
              aria-invalid={Boolean(errors.password_confirmation)}
              value={formData.password_confirmation}
              onChange={handleInputChange}
              placeholder="••••••••"
              className={`h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.password_confirmation ? 'border-red-500' : ''
              }`}
            />
            {errors.password_confirmation && <p role="alert" className="mt-1 text-sm text-destructive">{errors.password_confirmation}</p>}
          </div>

          <div>
            <label htmlFor="signup-category" className="mb-2 block text-sm font-medium text-foreground">Education level</label>
            <select 
              id="signup-category"
              name="category"
              required
              value={formData.category}
              onChange={handleInputChange}
              className={`h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="high-school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="other">Other</option>
            </select>
            {errors.category && <p role="alert" className="mt-1 text-sm text-destructive">{errors.category}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
