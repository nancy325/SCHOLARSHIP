import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/scholarship-hero.jpg";
import { apiService } from '@/services/api';
import { toast } from "sonner";

interface LoginData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await apiService.login(formData);
      
      if (response.success && response.data) {
        // Store user data
        apiService.storeUser(response.data.user);
        
        // Show success message
        toast.success("Welcome back");
        
        // Redirect to appropriate dashboard
        const role = (response.data.user as any).role;
        if (role === 'super_admin' || role === 'admin' || role === 'university_admin' || role === 'institute_admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message && error.message.includes('Invalid credentials')) {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
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
      <div className="relative z-10 w-full max-w-md rounded-lg border border-white/60 bg-card/95 p-7 shadow-2xl backdrop-blur sm:p-9">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-primary">ScholarSnap</p>
        <h2 className="mb-2 text-center text-3xl font-semibold text-foreground">Welcome back</h2>
        <p className="mb-7 text-center text-sm text-muted-foreground">Sign in to continue your scholarship journey.</p>
        
        {errors.general && (
            <div role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <input
              id="login-email"
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
          <div className="mb-6">
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-foreground">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
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
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
