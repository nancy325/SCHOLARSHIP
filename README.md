# Scholarship Management System - Backend API

A comprehensive REST API built with Laravel 11 for managing scholarship applications, submissions, and user profiles.

## 🚀 Features

### Authentication & Authorization
- User registration with strong password validation
- Secure login with Laravel Sanctum tokens
- Role-based access control (Student, Institute Admin, University Admin, Admin, Super Admin)
- Token-based API authentication

### Scholarship Management
- CRUD operations for scholarships
- Role-based scholarship visibility
- Advanced filtering (type, university, institute, search)
- Pagination support
- Multiple scholarship types (Government, Private, University, Institute)

### Application System
- Submit scholarship applications
- Track application status (Pending, Under Review, Approved, Rejected)
- Document upload support
- GPA and personal statement tracking
- Admin review and status management

### Profile Management
- Comprehensive user profiles
- Education details
- Personal information
- Career goals

## 🏗️ Architecture

### Service-Based Pattern
```
Controller → Service → Model → Database
     ↑          ↑
Form Request   Response
Validation     Resource
```

### Key Components
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic and data operations
- **Form Requests**: Validate incoming data
- **Resources**: Transform models to consistent JSON
- **Middleware**: Authentication and authorization

## 📋 Requirements

- PHP 8.2 or higher
- Composer
- MySQL 5.7+ or SQLite
- Laravel 11.x

## ⚙️ Installation

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Configuration
Update `.env`:
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
## 191 schema

### 5. Seed Database (Optional)
```bash
php artisan db:seed
```

### 6. Start Server
```bash
php artisan serve
```

API available at: `http://localhost:8000/api`

## 📚 API Documentation

### Quick Reference

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (auth required)
- `GET /api/auth/me` - Get current user (auth required)

#### Scholarship Endpoints
- `GET /api/scholarships` - List scholarships (public)
- `GET /api/scholarships/{id}` - Get scholarship details (public)
- `POST /api/scholarships` - Create scholarship (admin only)
- `PUT /api/scholarships/{id}` - Update scholarship (admin only)
- `DELETE /api/scholarships/{id}` - Delete scholarship (admin only)

#### Application Endpoints
- `GET /api/applications` - List applications (auth)
- `GET /api/applications/my-applications` - My applications (auth)
- `GET /api/applications/{id}` - Get application (auth)
- `POST /api/applications` - Submit application (auth)
- `PUT /api/applications/{id}` - Update application (auth)
- `DELETE /api/applications/{id}` - Delete application (auth)

#### Profile Endpoints
- `GET /api/profile` - Get profile (auth)
- `PUT /api/profile` - Update profile (auth)

### Detailed Documentation
- [Complete API Documentation](./API_DOCUMENTATION.md)
- [Quick Start Guide](./QUICK_START.md)
- [Refactoring Summary](./REFACTORING_SUMMARY.md)

## 🔐 Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer {your-token}
```

### Getting a Token

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!",
    "category": "undergraduate"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Student** | View scholarships, submit applications, manage own profile |
| **Institute Admin** | Manage institute scholarships, review institute applications |
| **University Admin** | Manage university scholarships, review university applications |
| **Admin** | Manage all scholarships and applications |
| **Super Admin** | Complete system access |

## 🧪 Testing

### Using Postman
Import the collection from `postman/ScholarSnap_API.json`

### Unit Tests
```bash
php artisan test
```

### Feature Tests
```bash
php artisan test --filter=AuthenticationTest
php artisan test --filter=ScholarshipTest
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ScholarshipController.php
│   │   │   ├── ApplicationController.php
│   │   │   └── ProfileController.php
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   ├── StoreScholarshipRequest.php
│   │   │   ├── UpdateScholarshipRequest.php
│   │   │   ├── StoreApplicationRequest.php
│   │   │   └── UpdateApplicationRequest.php
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── ScholarshipResource.php
│   │       └── ApplicationResource.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── ScholarshipService.php
│   │   └── ApplicationService.php
│   └── Models/
│       ├── User.php
│       ├── Scholarship.php
│       ├── Application.php
│       ├── University.php
│       └── Institute.php
├── routes/
│   └── api.php
├── database/
│   └── migrations/
└── Documentation/
    ├── API_DOCUMENTATION.md
    ├── QUICK_START.md
    └── REFACTORING_SUMMARY.md
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ Strong password requirements
- ✅ Compromised password checking
- ✅ Token-based authentication (Laravel Sanctum)
- ✅ Role-based authorization
- ✅ Input validation with Form Requests
- ✅ SQL injection protection (Eloquent ORM)
- ✅ XSS protection
- ✅ CORS configuration

## 🛠️ Development

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

### Generate API Token (Testing)
```bash
php artisan tinker
```
```php
$user = User::find(1);
$token = $user->createToken('test-token')->plainTextToken;
echo $token;
```

### Check Logs
```bash
tail -f storage/logs/laravel.log
```

## 📊 Database Schema

### Main Tables
- `users` - User accounts and authentication
- `scholarships` - Scholarship opportunities
- `applications` - Student applications
- `universities` - University information
- `institutes` - Institute/College information

### Relationships
```
University → hasMany → Institutes
University → hasMany → Scholarships
Institute → hasMany → Scholarships
User → hasMany → Applications
Scholarship → hasMany → Applications
```

## 🚧 Troubleshooting

### Common Issues

**401 Unauthorized**
- Check if token is included in Authorization header
- Verify token is valid and not expired

**422 Validation Error**
- Check request body matches validation rules
- Review error messages for specific field issues

**403 Forbidden**
- Verify user role has permission for the action
- Check role-based middleware configuration

**500 Server Error**
- Check `storage/logs/laravel.log` for details
- Verify database connection
- Ensure all required environment variables are set

### CORS Issues
Update `config/cors.php` to allow your frontend origin:
```php
'allowed_origins' => ['http://localhost:5173'],
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For detailed documentation:
- [API Reference](./API_DOCUMENTATION.md)
- [Quick Start Guide](./QUICK_START.md)
- [Architecture Details](./REFACTORING_SUMMARY.md)

## 🎯 Roadmap

### Completed ✅
- [x] Authentication system
- [x] Scholarship CRUD operations
- [x] Application submission
- [x] Role-based access control
- [x] Profile management

### Planned 🔄
- [ ] File upload for documents
- [ ] Email notifications
- [ ] Admin dashboard analytics
- [ ] Advanced search filters
- [ ] Export to PDF
- [ ] Real-time notifications
- [ ] Multi-language support

---

Built with ❤️ using Laravel 11

**Version:** 1.0.0  
**Last Updated:** October 11, 2025
