# Frontend Integration Guide

## Overview
This guide provides everything needed to connect a React frontend to the Laravel API backend.

## Backend Configuration

### ✅ CORS Enabled
The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Alternative React port)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8080`

### ✅ Rate Limiting
- **Auth endpoints**: 5 requests per minute
- **Public endpoints**: 100 requests per minute
- **API endpoints**: 60 requests per minute
- **Admin endpoints**: 30 requests per minute

### ✅ Consistent Status Codes
All endpoints return standardized HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Server Error

---

## Frontend Setup

### 1. Install Dependencies

```bash
npm install axios
# or
yarn add axios
```

### 2. Create API Configuration

Create `src/config/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Create API Service

Create `src/services/apiService.js`:

```javascript
import api from '../config/api';

// Authentication
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Scholarships
export const scholarshipAPI = {
  getAll: (params = {}) => api.get('/scholarships', { params }),
  getById: (id) => api.get(`/scholarships/${id}`),
  create: (data) => api.post('/scholarships', data),
  update: (id, data) => api.put(`/scholarships/${id}`, data),
  delete: (id) => api.delete(`/scholarships/${id}`),
};

// Applications
export const applicationAPI = {
  getMyApplications: (params = {}) => api.get('/applications/my-applications', { params }),
  getStats: () => api.get('/applications/stats'),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  delete: (id) => api.delete(`/applications/${id}`),
};

// Profile
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

// Public Data
export const publicAPI = {
  getInstitutes: () => api.get('/institutes/options'),
  getUniversities: () => api.get('/universities/options'),
  getScholarshipTypes: () => api.get('/scholarship-types'),
  getUserCategories: () => api.get('/user-categories'),
  getStats: () => api.get('/stats'),
  search: (params) => api.get('/search', { params }),
};

// Health Check
export const healthAPI = {
  check: () => api.get('/health'),
};
```

### 4. Create Custom Hooks

Create `src/hooks/useAuth.js`:

```javascript
import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getMe()
        .then(response => {
          setUser(response.data.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

Create `src/hooks/useScholarships.js`:

```javascript
import { useState, useEffect } from 'react';
import { scholarshipAPI } from '../services/apiService';

export const useScholarships = (params = {}) => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchScholarships = async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await scholarshipAPI.getAll({ ...params, ...newParams });
      const { data, meta } = response.data;
      
      setScholarships(data);
      setPagination(meta || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  return {
    scholarships,
    loading,
    error,
    pagination,
    refetch: fetchScholarships,
  };
};
```

### 5. Environment Variables

Create `.env` file in your React project:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Scholarship Management
```

### 6. Example Usage in Components

Create `src/components/LoginForm.js`:

```javascript
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

Create `src/components/ScholarshipList.js`:

```javascript
import React from 'react';
import { useScholarships } from '../hooks/useScholarships';

const ScholarshipList = () => {
  const { scholarships, loading, error, pagination } = useScholarships();

  if (loading) return <div>Loading scholarships...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Scholarships ({pagination.total || 0})</h2>
      
      {scholarships.map(scholarship => (
        <div key={scholarship.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{scholarship.title}</h3>
          <p>{scholarship.description}</p>
          <p><strong>Type:</strong> {scholarship.type}</p>
          <p><strong>Deadline:</strong> {scholarship.deadline}</p>
          <a href={scholarship.apply_link} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </div>
      ))}
      
      {pagination.last_page > 1 && (
        <div>
          <p>Page {pagination.current_page} of {pagination.last_page}</p>
          {/* Add pagination controls here */}
        </div>
      )}
    </div>
  );
};

export default ScholarshipList;
```

---

## Error Handling

### Standard Error Response Format

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (optional)",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### Error Handling in Components

```javascript
const handleApiCall = async () => {
  try {
    const response = await api.get('/some-endpoint');
    // Handle success
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          break;
        case 403:
          // Forbidden - show access denied message
          break;
        case 422:
          // Validation error - show field errors
          break;
        case 429:
          // Rate limited - show retry message
          break;
        default:
          // Generic error
          break;
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
  }
};
```

---

## Testing API Connection

### 1. Health Check

```javascript
import { healthAPI } from './services/apiService';

const testConnection = async () => {
  try {
    const response = await healthAPI.check();
    console.log('API is running:', response.data);
  } catch (error) {
    console.error('API connection failed:', error);
  }
};
```

### 2. Test Authentication

```javascript
const testAuth = async () => {
  try {
    // Test registration
    const registerResponse = await authAPI.register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!',
      password_confirmation: 'TestPass123!',
      category: 'undergraduate'
    });
    console.log('Registration successful:', registerResponse.data);
    
    // Test login
    const loginResponse = await authAPI.login({
      email: 'test@example.com',
      password: 'TestPass123!'
    });
    console.log('Login successful:', loginResponse.data);
    
  } catch (error) {
    console.error('Auth test failed:', error.response?.data);
  }
};
```

---

## Common Issues and Solutions

### 1. CORS Issues
**Problem**: Browser blocks requests due to CORS policy
**Solution**: Ensure backend CORS is configured for your frontend URL

### 2. Token Expiration
**Problem**: API calls fail with 401 after some time
**Solution**: Implement token refresh or automatic logout

### 3. Rate Limiting
**Problem**: API calls fail with 429 status
**Solution**: Implement retry logic with exponential backoff

### 4. Network Errors
**Problem**: Requests fail due to network issues
**Solution**: Add proper error handling and retry mechanisms

---

## Production Considerations

### 1. Environment Variables
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_APP_NAME=Scholarship Management
```

### 2. HTTPS
Ensure both frontend and backend use HTTPS in production

### 3. Error Monitoring
Consider adding error monitoring (Sentry, LogRocket, etc.)

### 4. Performance
- Implement request caching
- Use React Query or SWR for data fetching
- Add loading states and skeletons

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| POST | `/auth/register` | Register user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |
| GET | `/scholarships` | List scholarships | No |
| GET | `/scholarships/{id}` | Get scholarship | No |
| POST | `/scholarships` | Create scholarship | Yes (Admin) |
| PUT | `/scholarships/{id}` | Update scholarship | Yes (Admin) |
| DELETE | `/scholarships/{id}` | Delete scholarship | Yes (Admin) |
| GET | `/applications/my-applications` | My applications | Yes |
| POST | `/applications` | Record application | Yes |
| GET | `/profile` | Get profile | Yes |
| PUT | `/profile` | Update profile | Yes |

---

**Ready for React Integration!** 🚀

The backend is fully configured with CORS, rate limiting, consistent status codes, and proper error handling for seamless frontend integration.
