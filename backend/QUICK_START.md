# Quick Start Guide

## Prerequisites
- PHP 8.2 or higher
- Composer
- MySQL/SQLite database
- Laravel 11.x

## Installation

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Configure Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup
Update `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=scholarship_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 4. Run Migrations
```bash
php artisan migrate
```

### 5. Seed Database (Optional)
```bash
php artisan db:seed
```

### 6. Start Development Server
```bash
php artisan serve
```

API will be available at: `http://localhost:8000/api`

---

## Testing the API

### Using Postman

1. Import the Postman collection:
   - File: `postman/ScholarSnap_API.json`
   - Environment: `postman/Scholarship_API_Environment.json`

2. Register a new user:
   ```
   POST http://localhost:8000/api/auth/register
   ```

3. Copy the token from the response

4. Use the token in subsequent requests:
   ```
   Authorization: Bearer {your-token}
   ```

### Using cURL

#### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!",
    "category": "undergraduate"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get Scholarships
```bash
curl -X GET http://localhost:8000/api/scholarships \
  -H "Accept: application/json"
```

#### Create Scholarship (Admin only)
```bash
curl -X POST http://localhost:8000/api/scholarships \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer {your-token}" \
  -d '{
    "title": "Merit Scholarship 2024",
    "description": "For outstanding students",
    "type": "government",
    "eligibility": "GPA > 3.5",
    "deadline": "2024-12-31",
    "apply_link": "https://example.com/apply"
  }'
```

#### Submit Application
```bash
curl -X POST http://localhost:8000/api/applications \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer {your-token}" \
  -d '{
    "scholarship_id": 1,
    "personal_statement": "I am a dedicated student with a passion for learning...",
    "gpa": 3.8,
    "documents": ["resume.pdf", "transcript.pdf"]
  }'
```

---

## Common Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout (auth required)
- `GET /api/auth/me` - Get current user (auth required)

### Scholarships
- `GET /api/scholarships` - List scholarships
- `GET /api/scholarships/{id}` - Get scholarship
- `POST /api/scholarships` - Create (admin)
- `PUT /api/scholarships/{id}` - Update (admin)
- `DELETE /api/scholarships/{id}` - Delete (admin)

### Applications
- `GET /api/applications` - List applications (auth)
- `GET /api/applications/my-applications` - My applications (auth)
- `POST /api/applications` - Submit application (auth)
- `PUT /api/applications/{id}` - Update application (auth)
- `DELETE /api/applications/{id}` - Delete application (auth)

### Profile
- `GET /api/profile` - Get profile (auth)
- `PUT /api/profile` - Update profile (auth)

---

## User Roles

### Default Admin
Create a super admin using tinker:
```bash
php artisan tinker
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Super Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('SecurePass123!'),
    'role' => 'super_admin',
    'category' => 'other'
]);
```

### Role Types
- `student` - Default for new registrations
- `institute_admin` - Manages institute scholarships
- `university_admin` - Manages university scholarships
- `admin` - Full access
- `super_admin` - Complete system access

---

## Filters and Pagination

### Scholarship Filters
```
GET /api/scholarships?type=government&university_id=1&search=merit&per_page=20
```

Query parameters:
- `type` - Filter by type (government, private, university, institute)
- `university_id` - Filter by university
- `institute_id` - Filter by institute
- `search` - Search in title and description
- `per_page` - Results per page (default: 15)

### Application Filters
```
GET /api/applications?status=pending&scholarship_id=1&per_page=10
```

Query parameters:
- `status` - Filter by status (pending, under_review, approved, rejected)
- `scholarship_id` - Filter by scholarship
- `per_page` - Results per page (default: 15)

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (if applicable)",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## Development Tips

### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### View Routes
```bash
php artisan route:list
```

### View Database Schema
```bash
php artisan migrate:status
```

### Generate API Token for Testing
```php
// In tinker: php artisan tinker
$user = User::find(1);
$token = $user->createToken('test-token')->plainTextToken;
echo $token;
```

### Check Logs
```bash
tail -f storage/logs/laravel.log
```

---

## Frontend Integration

### Base Configuration
```javascript
// axios configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Example Usage
```javascript
// Register
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};

// Login
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};

// Get Scholarships
const getScholarships = async (filters) => {
  const response = await api.get('/scholarships', { params: filters });
  return response.data;
};

// Submit Application
const submitApplication = async (applicationData) => {
  const response = await api.post('/applications', applicationData);
  return response.data;
};
```

---

## Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Check if token is included in Authorization header

### Issue: 422 Validation Error
**Solution:** Check request body matches validation rules

### Issue: 403 Forbidden
**Solution:** Check user role has permission for the action

### Issue: 500 Server Error
**Solution:** Check `storage/logs/laravel.log` for details

### Issue: CORS Error
**Solution:** Update `config/cors.php` to allow frontend origin

---

## Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Refactoring Summary](./REFACTORING_SUMMARY.md) - Architecture details
- [Laravel Documentation](https://laravel.com/docs/11.x)
- [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)

---

## Support

For issues or questions:
1. Check logs: `storage/logs/laravel.log`
2. Review API documentation
3. Verify request format matches examples
4. Test with Postman collection

---

Happy coding! 🚀

