# API Routes Summary

## Overview
This document provides a complete list of all API endpoints with their proper JSON response formats.

## Base URL
```
http://your-domain.com/api
```

## Authentication
All protected routes require the `Authorization: Bearer {token}` header.

---

## Public Endpoints

### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000000Z",
  "version": "1.0.0"
}
```

### Authentication

#### Register User
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "category": "undergraduate"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "category": "undergraduate",
      "role": "student"
    },
    "token": "1|aBcDeFgHiJkLmNoPqRsTuVwXyZ..."
  }
}
```

#### Login User
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "category": "undergraduate",
      "role": "student"
    },
    "token": "2|aBcDeFgHiJkLmNoPqRsTuVwXyZ..."
  }
}
```

### Scholarships

#### Get All Scholarships
```
GET /api/scholarships
```
**Query Parameters:**
- `type` - Filter by type (government, private, university, institute)
- `university_id` - Filter by university ID
- `institute_id` - Filter by institute ID
- `search` - Search in title and description
- `per_page` - Results per page (default: 15)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Merit Scholarship 2024",
      "description": "For outstanding students...",
      "type": "government",
      "university_id": null,
      "institute_id": null,
      "eligibility": "GPA > 3.5",
      "start_date": "2024-01-01",
      "deadline": "2024-12-31",
      "apply_link": "https://example.com/apply",
      "created_by": 1,
      "university": null,
      "institute": null,
      "creator": {
        "id": 1,
        "name": "Admin User"
      },
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

#### Get Single Scholarship
```
GET /api/scholarships/{id}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Merit Scholarship 2024",
    "description": "For outstanding students...",
    "type": "government",
    "university_id": null,
    "institute_id": null,
    "eligibility": "GPA > 3.5",
    "start_date": "2024-01-01",
    "deadline": "2024-12-31",
    "apply_link": "https://example.com/apply",
    "created_by": 1,
    "university": null,
    "institute": null,
    "creator": {
      "id": 1,
      "name": "Admin User"
    },
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### Public Data Endpoints

#### Get Institutes Options
```
GET /api/institutes/options
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Computer Science Institute",
      "university_id": 1
    }
  ],
  "message": "Institutes retrieved successfully"
}
```

#### Get Scholarship Types
```
GET /api/scholarship-types
```
**Response:**
```json
{
  "success": true,
  "data": [
    {"value": "government", "label": "Government"},
    {"value": "private", "label": "Private"},
    {"value": "university", "label": "University"},
    {"value": "institute", "label": "Institute"}
  ],
  "message": "Scholarship types retrieved successfully"
}
```

#### Get User Categories
```
GET /api/user-categories
```
**Response:**
```json
{
  "success": true,
  "data": [
    {"value": "high-school", "label": "High School"},
    {"value": "diploma", "label": "Diploma"},
    {"value": "undergraduate", "label": "Undergraduate"},
    {"value": "postgraduate", "label": "Postgraduate"},
    {"value": "other", "label": "Other"}
  ],
  "message": "User categories retrieved successfully"
}
```

#### Get Statistics
```
GET /api/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total_scholarships": 150,
    "active_scholarships": 120,
    "by_type": {
      "government": 50,
      "private": 30,
      "university": 40,
      "institute": 30
    }
  },
  "message": "Statistics retrieved successfully"
}
```

#### Search Scholarships
```
GET /api/search
```
**Query Parameters:**
- `q` - Search query
- `type` - Filter by type
- `university_id` - Filter by university
- `institute_id` - Filter by institute
- `per_page` - Results per page

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Merit Scholarship 2024",
        "description": "For outstanding students...",
        "type": "government",
        "deadline": "2024-12-31",
        "apply_link": "https://example.com/apply"
      }
    ],
    "last_page": 3,
    "per_page": 15,
    "total": 45
  },
  "message": "Search completed successfully"
}
```

---

## Protected Endpoints (Require Authentication)

### Authentication

#### Logout
```
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Current User
```
GET /api/auth/me
```
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "category": "undergraduate",
      "role": "student"
    }
  }
}
```

### Scholarships (Admin Only)

#### Create Scholarship
```
POST /api/scholarships
```
**Headers:** `Authorization: Bearer {token}`
**Required Role:** super_admin, admin, university_admin, institute_admin

**Request Body:**
```json
{
  "title": "New Scholarship 2024",
  "description": "Detailed description...",
  "type": "university",
  "university_id": 1,
  "eligibility": "GPA > 3.0",
  "start_date": "2024-06-01",
  "deadline": "2024-12-31",
  "apply_link": "https://example.com/apply"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Scholarship created successfully",
  "data": {
    "id": 2,
    "title": "New Scholarship 2024",
    "description": "Detailed description...",
    "type": "university",
    "university_id": 1,
    "institute_id": null,
    "eligibility": "GPA > 3.0",
    "start_date": "2024-06-01",
    "deadline": "2024-12-31",
    "apply_link": "https://example.com/apply",
    "created_by": 2,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

#### Update Scholarship
```
PUT /api/scholarships/{id}
```
**Headers:** `Authorization: Bearer {token}`
**Required Role:** super_admin, admin, university_admin, institute_admin

**Response:**
```json
{
  "success": true,
  "message": "Scholarship updated successfully",
  "data": { /* Updated scholarship object */ }
}
```

#### Delete Scholarship
```
DELETE /api/scholarships/{id}
```
**Headers:** `Authorization: Bearer {token}`
**Required Role:** super_admin, admin, university_admin, institute_admin

**Response:**
```json
{
  "success": true,
  "message": "Scholarship deleted successfully"
}
```

### Applications

#### Get My Applications
```
GET /api/applications/my-applications
```
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**
- `per_page` - Results per page (default: 15)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "scholarship_id": 1,
      "applied_at": "2024-01-15T10:30:00.000000Z",
      "scholarship": {
        "id": 1,
        "title": "Merit Scholarship 2024",
        "type": "government",
        "deadline": "2024-12-31",
        "apply_link": "https://example.com/apply"
      },
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 45
  }
}
```

#### Get Application Statistics
```
GET /api/applications/stats
```
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "success": true,
  "data": {
    "total_applications": 25,
    "recent_applications": 5,
    "applications_by_type": {
      "government": 10,
      "private": 8,
      "university": 5,
      "institute": 2
    }
  }
}
```

#### Get Single Application
```
GET /api/applications/{id}
```
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 5,
    "scholarship_id": 1,
    "applied_at": "2024-01-15T10:30:00.000000Z",
    "scholarship": {
      "id": 1,
      "title": "Merit Scholarship 2024",
      "type": "government",
      "deadline": "2024-12-31",
      "apply_link": "https://example.com/apply"
    },
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

#### Record Application
```
POST /api/applications
```
**Headers:** `Authorization: Bearer {token}`
**Request Body:**
```json
{
  "scholarship_id": 1
}
```
**Response:**
```json
{
  "success": true,
  "message": "Application recorded successfully",
  "data": {
    "id": 2,
    "user_id": 5,
    "scholarship_id": 1,
    "applied_at": "2024-01-15T10:30:00.000000Z",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

#### Delete Application Record
```
DELETE /api/applications/{id}
```
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "success": true,
  "message": "Application record deleted successfully"
}
```

### Profile

#### Get Profile
```
GET /api/profile
```
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "dob": "1995-05-15",
    "gender": "male",
    "category": "undergraduate",
    "disability": "none",
    "state": "California",
    "email": "john@example.com",
    "phone": "+1234567890",
    "parentOccupation": "Engineer",
    "annualIncome": "50000",
    "course": "Computer Science",
    "year": "3",
    "mode": "full-time",
    "institution": "ABC University",
    "prevPercentage": "85",
    "cgpa": "3.8",
    "hasScholarship": "yes",
    "careerGoal": "Software Engineer"
  }
}
```

#### Update Profile
```
PUT /api/profile
```
**Headers:** `Authorization: Bearer {token}`
**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "state": "California",
  "course": "Computer Science",
  "year": "3",
  "cgpa": "3.8"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Profile saved",
  "data": { /* Updated profile object */ }
}
```

### Universities Options (Authenticated)
```
GET /api/universities/options
```
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ABC University"
    }
  ],
  "message": "Universities retrieved successfully"
}
```

---

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "An error occurred",
  "error": "Detailed error message"
}
```

### Endpoint Not Found (404)
```json
{
  "success": false,
  "message": "Endpoint not found",
  "error": "The requested endpoint does not exist"
}
```

---

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* Response data */ },
  "meta": { /* Pagination info (when applicable) */ }
}
```

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (optional)",
  "errors": { /* Validation errors (optional) */ }
}
```

---

## Testing

### Using cURL
```bash
# Health check
curl -X GET http://localhost:8000/api/health

# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123!","password_confirmation":"SecurePass123!","category":"undergraduate"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'

# Get scholarships
curl -X GET http://localhost:8000/api/scholarships

# Record application (with token)
curl -X POST http://localhost:8000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"scholarship_id":1}'
```

### Using Postman
Import the collection from `postman/ScholarSnap_API.json` for pre-configured requests.

---

**Last Updated:** October 11, 2025  
**API Version:** 1.0.0
