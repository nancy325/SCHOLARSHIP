# Multi-page web app (Laravel Blade)

The website is now server-rendered by Laravel. Every page is a normal URL with its own
Blade view, forms post back to Laravel (with CSRF protection) and sign-in uses the
normal session guard. The JSON API in `routes/api.php` is unchanged, so the old React
frontend keeps working if you still need it.

No Node/Vite build is required — styles and scripts are plain files in `public/`.

## Run it

```bash
cd backend
composer install            # if vendor/ is missing
php artisan migrate         # adds admin_remarks / reviewed_by to scholarship_applications
php artisan db:seed         # optional demo data (admin@scholarship.com / password123)
php artisan serve           # http://127.0.0.1:8000
```

With WAMP you can also open `http://localhost/SCHOLARSHIP/backend/public/`.

Optional `.env` settings: `SITE_NAME`, `SITE_SUPPORT_EMAIL`, `SITE_SUPPORT_PHONE`,
`SITE_SUPPORT_HOURS`, `APP_TIMEZONE=Asia/Kolkata`.

## Pages

| Area | URL | Who |
|---|---|---|
| Home, About, FAQs, Contact | `/`, `/about`, `/faqs`, `/contact` | everyone |
| Scholarship list / detail | `/scholarships`, `/scholarships/{id}` | everyone (guests see government + private only) |
| Sign in / Register | `/login`, `/register` | guests |
| Student dashboard | `/dashboard` | students |
| Apply | `/scholarships/{id}/apply` | students |
| My applications (withdraw, re-apply) | `/my-applications` | students |
| Profile + change password | `/profile` | any signed-in user |
| Admin dashboard | `/admin` | all admin roles |
| Scholarships CRUD | `/admin/scholarships` | all admin roles (scoped to their university / institute) |
| Review applications | `/admin/applications` | all admin roles (scoped) |
| Universities, Institutes, Users, Feedback | `/admin/universities`, `/admin/institutes`, `/admin/users`, `/admin/feedback` | super_admin, admin |

## Eligibility matching

- **Home page** lists every active scholarship straight from the database (filter by level, provider, status).
- **Students** give their education level, annual family income, gender and state when they register
  (category, last exam % and university/institute are optional). These are stored in `users.category` and the
  `profiles` table.
- After login, the dashboard and the *Eligible for me* tab show only scholarships whose rules the student meets.
  Each scholarship page shows a rule-by-rule check (✓ / ✕ / ?), and students cannot apply when a rule fails.
- **Rules on a scholarship** (all optional, empty = no restriction): education levels, maximum family income,
  minimum %, gender, domicile state, social categories, and "own students only" for university/institute schemes.
  Admins set them in the scholarship form. Logic: `app/Services/EligibilityService.php`.

## Seed data

`php artisan db:seed` loads 10 national/state schemes whose amounts, income limits and links were checked against
official sources in September 2026 (NMMSS, Central Sector Scheme, PMRF, MYSY, AICTE Pragati, Kotak Kanya,
Reliance Foundation UG, HDFC Parivartan ECSS, Gujarat Post-Matric SC, INSPIRE-SHE). The CHARUSAT/GTU/IIT/LDCE
entries are **sample data** for trying the university admin login — replace them with real schemes.
Deadlines and amounts change every year; update them from the admin panel. Re-running the seeder updates
the verified schemes in place.

## Application flow

1. Student opens an open scholarship and presses **Apply now**.
2. They write a statement (min. 30 characters) and confirm their details → status `pending`.
3. Admins see it under **Applications**, open it (statement + student profile), then
   approve or reject. Rejecting requires remarks, which the student sees.
4. Students can withdraw a pending application and re-apply while the scholarship is open.

## Where things live

```
app/Http/Controllers/Web/           PageController, AuthController, ScholarshipController
app/Http/Controllers/Web/Student/   DashboardController, ApplicationController, ProfileController
app/Http/Controllers/Web/Admin/     Dashboard, Scholarship, Application, University, Institute, User, Feedback
app/Http/Middleware/EnsureWebRole.php   role guard for pages (alias `web.role`)
app/Models/ScholarshipApplication.php, Feedback.php
config/faqs.php, config/site.php
resources/views/layouts/            app.blade.php (public + student), admin.blade.php
resources/views/{pages,auth,scholarships,student,admin,partials,errors,components}
public/css/app.css, public/js/app.js, public/images/
routes/web.php
tests/Feature/WebAppTest.php        run with `php artisan test`
```
