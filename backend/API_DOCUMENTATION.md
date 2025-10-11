# Scholarship Management API Documentation

## Overview
This is a comprehensive REST API for the Scholarship Management System built with Laravel 11. The API follows best practices with service-based architecture, form request validation, and resource transformations.

## Architecture

### Structure
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data operations
- **Form Requests**: Validate incoming request data
- **Resources**: Transform models into consistent JSON responses
- **Middleware**: Handle authentication and role-based access control

### Files Created/Refactored

#### Controllers
- `app/Http/Controllers/Api/AuthController.php` - Authentication operations
- `app/Http/Controllers/Api/ScholarshipController.php` - Scholarship CRUD operations
- `app/Http/Controllers/Api/ApplicationController.php` - Application submission and management
- `app/Http/Controllers/Api/ProfileController.php` - User profile management

#### Services
- `app/Services/AuthService.php` - Authentication business logic
- `app/Services/ScholarshipService.php` - Scholarship business logic with role-based scoping
- `app/Services/ApplicationService.php` - Application business logic with permissions

#### Form Requests
- `app/Http/Requests/LoginRequest.php` - Login validation
- `app/Http/Requests/RegisterRequest.php` - Registration validation
- `app/Http/Requests/StoreScholarshipRequest.php` - Scholarship creation validation
- `app/Http/Requests/UpdateScholarshipRequest.php` - Scholarship update validation
- `app/Http/Requests/StoreApplicationRequest.php` - Application submission validation
- `app/Http/Requests/UpdateApplicationRequest.php` - Application update validation

#### Resources
- `app/Http/Resources/UserResource.php` - User data transformation
- `app/Http/Resources/ScholarshipResource.php` - Scholarship data transformation
- `app/Http/Resources/ApplicationResource.php` - Application data transformation

---

## Authentication

### Base URL
```
http://your-domain.com/api
```

### Headers
All authenticated requests require:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

---

## API Endpoints

### 1. Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

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

**Categories:** `high-school`, `diploma`, `undergraduate`, `postgraduate`, `other`

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Must not be in compromised passwords database

**Response (201):**
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

---

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
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

---

#### POST `/api/auth/logout`
Logout and revoke current access token.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### GET `/api/auth/me`
Get authenticated user information.

**Headers:** Requires authentication

**Response (200):**
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

---

### 2. Scholarship Endpoints

#### GET `/api/scholarships`
Get all scholarships (with filters and pagination).

**Query Parameters:**
- `type` - Filter by type: `government`, `private`, `university`, `institute`
- `university_id` - Filter by university ID
- `institute_id` - Filter by institute ID
- `search` - Search in title and description
- `per_page` - Results per page (default: 15)

**Role-based Access:**
- **Public (no auth)**: See government and private scholarships only
- **Student**: See public scholarships + their university/institute scholarships
- **Institute Admin**: See only their institute's scholarships
- **University Admin**: See all scholarships in their university
- **Admin/Super Admin**: See all scholarships

**Response (200):**
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

---

#### GET `/api/scholarships/{id}`
Get a single scholarship by ID.

**Response (200):**
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

---

#### POST `/api/scholarships`
Create a new scholarship.

**Headers:** Requires authentication (Admin roles only)

**Allowed Roles:** `super_admin`, `admin`, `university_admin`, `institute_admin`

**Request Body:**
```json
{
  "title": "New Scholarship 2024",
  "description": "Detailed description of the scholarship...",
  "type": "university",
  "university_id": 1,
  "institute_id": null,
  "eligibility": "GPA > 3.0, Age < 25",
  "start_date": "2024-06-01",
  "deadline": "2024-12-31",
  "apply_link": "https://example.com/apply"
}
```

**Role Constraints:**
- **University Admin**: Can only create `university` type scholarships for their university
- **Institute Admin**: Can only create `institute` type scholarships for their institute
- **Admin/Super Admin**: Can create any type of scholarship

**Response (201):**
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
    "eligibility": "GPA > 3.0, Age < 25",
    "start_date": "2024-06-01",
    "deadline": "2024-12-31",
    "apply_link": "https://example.com/apply",
    "created_by": 2,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

---

#### PUT `/api/scholarships/{id}`
Update an existing scholarship.

**Headers:** Requires authentication (Admin roles only)

**Request Body:** Same as POST (all fields optional)

**Role Constraints:**
- Can only update scholarships within their scope
- University/Institute admins cannot change type or scope

**Response (200):**
```json
{
  "success": true,
  "message": "Scholarship updated successfully",
  "data": { /* Updated scholarship object */ }
}
```

---

#### DELETE `/api/scholarships/{id}`
Delete a scholarship.

**Headers:** Requires authentication (Admin roles only)

**Response (200):**
```json
{
  "success": true,
  "message": "Scholarship deleted successfully"
}
```

---

### 3. Application Endpoints

#### GET `/api/applications`
Get applications (role-based access).

**Headers:** Requires authentication

**Query Parameters:**
- `status` - Filter by status: `pending`, `under_review`, `approved`, `rejected`
- `scholarship_id` - Filter by scholarship ID
- `per_page` - Results per page (default: 15)

**Role-based Access:**
- **Student**: See only their own applications
- **Institute Admin**: See applications for their institute's scholarships
- **University Admin**: See applications for their university's scholarships
- **Admin/Super Admin**: See all applications

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "scholarship_id": 1,
      "status": "pending",
      "personal_statement": "I am passionate about...",
      "documents": ["resume.pdf", "transcript.pdf"],
      "gpa": 3.8,
      "additional_info": "Additional information...",
      "submitted_at": "2024-01-15T10:30:00.000000Z",
      "reviewed_at": null,
      "review_notes": null,
      "user": {
        "id": 5,
        "name": "Jane Student",
        "email": "jane@example.com"
      },
      "scholarship": {
        "id": 1,
        "title": "Merit Scholarship 2024",
        "type": "government",
        "deadline": "2024-12-31"
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

---

#### GET `/api/applications/my-applications`
Get current user's own applications.

**Headers:** Requires authentication

**Query Parameters:**
- `per_page` - Results per page (default: 15)

**Response:** Same format as GET `/api/applications`

---

#### GET `/api/applications/{id}`
Get a single application by ID.

**Headers:** Requires authentication

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 5,
    "scholarship_id": 1,
    "status": "pending",
    "personal_statement": "I am passionate about...",
    "documents": ["resume.pdf", "transcript.pdf"],
    "gpa": 3.8,
    "additional_info": "Additional information...",
    "submitted_at": "2024-01-15T10:30:00.000000Z",
    "reviewed_at": null,
    "review_notes": null,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

---

#### POST `/api/applications`
Submit a new scholarship application.

**Headers:** Requires authentication

**Request Body:**
```json
{
  "scholarship_id": 1,
  "personal_statement": "I am passionate about computer science and have maintained a strong academic record throughout my studies. This scholarship would help me...",
  "documents": ["resume.pdf", "transcript.pdf", "recommendation_letter.pdf"],
  "gpa": 3.8,
  "additional_info": "I have also participated in various coding competitions..."
}
```

**Validation:**
- `personal_statement`: Required, 100-5000 characters
- `documents`: Optional array of strings
- `gpa`: Optional, numeric 0-10
- Cannot apply to same scholarship twice
- Scholarship must be accepting applications (deadline not passed)

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 2,
    "user_id": 5,
    "scholarship_id": 1,
    "status": "pending",
    "personal_statement": "I am passionate about...",
    "documents": ["resume.pdf", "transcript.pdf"],
    "gpa": 3.8,
    "additional_info": "I have also participated...",
    "submitted_at": "2024-01-15T10:30:00.000000Z",
    "reviewed_at": null,
    "review_notes": null,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

---

#### PUT `/api/applications/{id}`
Update an application.

**Headers:** Requires authentication

**Request Body:** (All fields optional)
```json
{
  "personal_statement": "Updated statement...",
  "documents": ["updated_resume.pdf"],
  "gpa": 3.9,
  "additional_info": "Updated information...",
  "status": "approved",
  "review_notes": "Great application!"
}
```

**Permissions:**
- **Students**: Can update their own pending applications (cannot change status)
- **Admins**: Can update any application and change status

**Response (200):**
```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": { /* Updated application object */ }
}
```

---

#### DELETE `/api/applications/{id}`
Delete an application.

**Headers:** Requires authentication

**Permissions:**
- **Students**: Can delete their own pending applications only
- **Admins**: Can delete any application

**Response (200):**
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

### 4. Profile Endpoints

#### GET `/api/profile`
Get user's profile information.

**Headers:** Requires authentication

**Response (200):**
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

---

#### PUT `/api/profile`
Update user's profile.

**Headers:** Requires authentication

**Request Body:** (All fields optional)
```json
{
  "name": "John Doe",
  "dob": "1995-05-15",
  "gender": "male",
  "phone": "+1234567890",
  "state": "California",
  "course": "Computer Science",
  "year": "3",
  "cgpa": "3.8"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile saved",
  "data": { /* Updated profile object */ }
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

---

## User Roles

### Student
- View public scholarships and their university/institute scholarships
- Submit scholarship applications
- View and manage their own applications
- Update their profile

### Institute Admin
- View and manage scholarships for their institute
- View applications for their institute's scholarships
- Review and update application statuses

### University Admin
- View and manage scholarships for their university
- View applications for university's scholarships
- Review and update application statuses

### Admin
- View and manage all scholarships
- View and manage all applications
- Full access to all features

### Super Admin
- Complete system access
- Manage users, universities, institutes
- All admin capabilities

---

## Testing with Postman

A Postman collection is available at: `postman/ScholarSnap_API.json`

Import this collection into Postman to test all endpoints with pre-configured requests.

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **Token Authentication**: Laravel Sanctum for API token management
3. **Rate Limiting**: Applied to prevent abuse
4. **Role-based Access Control**: Middleware enforces permissions
5. **CORS Configuration**: Properly configured for frontend access
6. **Input Validation**: All inputs validated using Form Requests
7. **SQL Injection Protection**: Using Eloquent ORM and parameter binding

---

## Development Notes

### Service Pattern
Business logic is separated into service classes for:
- Better code organization
- Easier testing
- Reusability
- Single Responsibility Principle

### Form Requests
All incoming data is validated through dedicated Form Request classes with:
- Custom validation rules
- Custom error messages
- Attribute aliases for better error readability

### API Resources
All responses use Resource classes for:
- Consistent JSON structure
- Control over exposed data
- Easy modification of response format

### Database Queries
- Eager loading to prevent N+1 queries
- Role-based query scoping
- Pagination for large datasets

---

## Next Steps

1. **File Upload**: Implement actual file upload for application documents
2. **Email Notifications**: Send emails on application status changes
3. **Dashboard Analytics**: Create analytics endpoints for admin dashboards
4. **Search Enhancement**: Add full-text search with Laravel Scout
5. **API Versioning**: Implement versioning for future API changes
6. **Rate Limiting**: Fine-tune rate limits per role
7. **Caching**: Add caching for frequently accessed data

---

## Support

For issues or questions, please refer to the main README.md or contact the development team.

