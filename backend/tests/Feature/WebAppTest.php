<?php

namespace Tests\Feature;

use App\Models\Feedback;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * End-to-end tests for the Blade multi-page app.
 */
class WebAppTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $student;
    private University $uni;
    private Institute $inst;
    private Scholarship $gov;
    private Scholarship $uniScholarship;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local'); // profiles are stored as JSON files

        $this->uni = University::create(['name' => 'Test University', 'email' => 'u@test.in', 'status' => 'verified']);
        $this->inst = Institute::create(['name' => 'Test Institute', 'email' => 'i@test.in', 'type' => 'engineering', 'status' => 'verified', 'university_id' => $this->uni->id]);

        $this->admin = User::create(['name' => 'Super Admin', 'email' => 'admin@test.in', 'password' => Hash::make('Password1!'), 'category' => 'other', 'role' => 'super_admin']);
        $this->student = User::create(['name' => 'Asha Patel', 'email' => 'asha@test.in', 'password' => Hash::make('Password1!'), 'category' => 'undergraduate', 'role' => 'student', 'university_id' => $this->uni->id, 'institute_id' => $this->inst->id]);

        $this->gov = Scholarship::create(['title' => 'National Merit Scholarship', 'type' => 'government', 'description' => 'For meritorious students.', 'eligibility' => 'Income below 2.5L', 'start_date' => today()->subDay(), 'deadline' => today()->addDays(20), 'apply_link' => 'https://example.gov.in', 'created_by' => $this->admin->id]);
        $this->uniScholarship = Scholarship::create(['title' => 'Test University Excellence Award', 'type' => 'university', 'university_id' => $this->uni->id, 'description' => 'University award.', 'eligibility' => 'Students of Test University', 'start_date' => today()->subDay(), 'deadline' => today()->addDays(5), 'created_by' => $this->admin->id]);
    }

    public function test_public_pages_render(): void
    {
        foreach (['/', '/about', '/faqs', '/contact', '/scholarships', '/login', '/register'] as $url) {
            $this->get($url)->assertOk();
        }
        $this->get('/scholarships/' . $this->gov->id)->assertOk()->assertSee('National Merit Scholarship')->assertSee('Sign in to apply');
        $this->get('/does-not-exist')->assertNotFound()->assertSee('Page not found');
    }

    public function test_home_page_lists_every_scholarship_from_the_database(): void
    {
        $this->get('/')->assertOk()
            ->assertSee('National Merit Scholarship')
            ->assertSee('Test University Excellence Award');
        $this->get('/scholarships/' . $this->uniScholarship->id)->assertOk();
    }

    public function test_student_sees_only_eligible_scholarships(): void
    {
        // Income above the limit and the wrong education level are filtered out
        $this->gov->update(['education_levels' => ['undergraduate'], 'max_family_income' => 250000]);
        $pg = Scholarship::create(['title' => 'PG Research Award', 'type' => 'private', 'description' => 'PG only', 'eligibility' => '',
            'education_levels' => ['postgraduate'], 'deadline' => today()->addDays(10), 'created_by' => $this->admin->id]);
        $girls = Scholarship::create(['title' => 'Girls Tech Award', 'type' => 'private', 'description' => 'Girls', 'eligibility' => '',
            'gender' => 'female', 'deadline' => today()->addDays(10), 'created_by' => $this->admin->id]);
        $gujarat = Scholarship::create(['title' => 'Gujarat Only Award', 'type' => 'government', 'description' => 'Gujarat', 'eligibility' => '',
            'state' => 'Gujarat', 'deadline' => today()->addDays(10), 'created_by' => $this->admin->id]);
        $otherUni = University::create(['name' => 'Other University', 'email' => 'o@uni.in', 'status' => 'verified']);
        $otherUniAward = Scholarship::create(['title' => 'Other University Award', 'type' => 'university', 'university_id' => $otherUni->id,
            'own_students_only' => true, 'description' => 'x', 'eligibility' => '', 'deadline' => today()->addDays(10), 'created_by' => $this->admin->id]);
        $this->uniScholarship->update(['own_students_only' => true]);

        \App\Models\Profile::create(['user_id' => $this->student->id, 'annual_family_income' => 200000, 'gender' => 'female', 'state' => 'Maharashtra']);

        $this->actingAs($this->student)->get('/scholarships')
            ->assertSee('National Merit Scholarship')      // UG + income 2L <= 2.5L
            ->assertSee('Girls Tech Award')
            ->assertSee('Test University Excellence Award') // own university
            ->assertDontSee('PG Research Award')
            ->assertDontSee('Gujarat Only Award')
            ->assertDontSee('Other University Award');

        // "All scholarships" tab still lists everything
        $this->get('/scholarships?show=all')->assertSee('PG Research Award')->assertSee('Gujarat Only Award');

        // Income too high -> no longer eligible, and cannot apply
        \App\Models\Profile::where('user_id', $this->student->id)->update(['annual_family_income' => 900000]);
        $this->actingAs($this->student->fresh())->get('/scholarships')->assertDontSee('National Merit Scholarship');
        $this->get("/scholarships/{$this->gov->id}")->assertSee('Not eligible');
        $this->post("/scholarships/{$this->gov->id}/apply", ['notes' => str_repeat('x', 40), 'confirm' => '1'])
            ->assertSessionHas('error');
        $this->assertSame(0, ScholarshipApplication::count());
    }

    public function test_search_and_type_filter(): void
    {
        $this->get('/scholarships?search=Merit')->assertSee('National Merit Scholarship');
        $this->get('/scholarships?search=zzzz')->assertSee('No scholarships match');
        $this->get('/scholarships?type=private')->assertDontSee('National Merit Scholarship');
    }

    public function test_register_login_logout(): void
    {
        $this->post('/register', [
            'name' => 'New Student', 'email' => 'new@test.in', 'category' => 'diploma',
            'password' => 'Str0ng!Pass#2026', 'password_confirmation' => 'Str0ng!Pass#2026',
            'annual_family_income' => '2,40,000', 'gender' => 'female', 'state' => 'Gujarat',
            'institute_id' => $this->inst->id,
        ])->assertRedirect(route('student.dashboard'));
        $new = User::where('email', 'new@test.in')->firstOrFail();
        $this->assertSame(240000, $new->profile->annual_family_income);
        $this->assertSame($this->uni->id, $new->university_id);
        $this->get('/dashboard')->assertOk()->assertSee('Scholarships you are eligible for');
        $this->assertAuthenticated();
        $this->assertSame('student', $new->role);

        $this->post('/logout')->assertRedirect(route('home'));
        $this->assertGuest();

        $this->post('/login', ['email' => 'new@test.in', 'password' => 'wrong'])->assertSessionHasErrors('email');
        $this->post('/login', ['email' => 'admin@test.in', 'password' => 'Password1!'])->assertRedirect(route('admin.dashboard'));
    }

    public function test_deactivated_user_cannot_sign_in(): void
    {
        $this->student->update(['RecStatus' => 'inactive']);
        $this->post('/login', ['email' => 'asha@test.in', 'password' => 'Password1!'])->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_guest_is_redirected_to_login_and_students_cannot_open_admin(): void
    {
        $this->get('/dashboard')->assertRedirect(route('login'));
        $this->get('/admin')->assertRedirect(route('login'));
        $this->actingAs($this->student)->get('/admin')->assertForbidden();
        $this->actingAs($this->admin)->get('/dashboard')->assertForbidden();
    }

    public function test_full_application_flow(): void
    {
        $s = $this->uniScholarship;

        // Student applies
        $this->actingAs($this->student)->get("/scholarships/{$s->id}")->assertSee('Apply now');
        $this->get("/scholarships/{$s->id}/apply")->assertOk()->assertSee('Why should you receive this scholarship?');
        $this->post("/scholarships/{$s->id}/apply", ['notes' => 'too short'])->assertSessionHasErrors(['notes', 'confirm']);
        $this->post("/scholarships/{$s->id}/apply", ['notes' => str_repeat('I am a dedicated student. ', 3), 'confirm' => '1'])
            ->assertRedirect(route('student.applications.index'));

        $app = ScholarshipApplication::firstOrFail();
        $this->assertSame('pending', $app->application_status);

        // Cannot apply twice
        $this->get("/scholarships/{$s->id}/apply")->assertRedirect(route('scholarships.show', $s->id));
        $this->get('/my-applications')->assertSee($s->title)->assertSee('Pending review');
        $this->get('/dashboard')->assertOk()->assertSee($s->title);

        // Admin reviews — rejecting requires remarks
        $this->actingAs($this->admin)->get('/admin/applications')->assertSee('Asha Patel');
        $this->get("/admin/applications/{$app->id}")->assertOk()->assertSee('I am a dedicated student');
        $this->put("/admin/applications/{$app->id}", ['application_status' => 'rejected'])->assertSessionHasErrors('admin_remarks');
        $this->put("/admin/applications/{$app->id}", ['application_status' => 'approved', 'admin_remarks' => 'Congratulations!'])
            ->assertRedirect(route('admin.applications.show', $app));
        $app->refresh();
        $this->assertSame('approved', $app->application_status);
        $this->assertSame($this->admin->id, $app->reviewed_by);

        // Student sees the decision
        $this->actingAs($this->student)->get('/my-applications')->assertSee('Approved')->assertSee('Congratulations!');
    }

    public function test_withdraw_and_reapply(): void
    {
        $this->actingAs($this->student)->post("/scholarships/{$this->gov->id}/apply", ['notes' => str_repeat('Statement text. ', 4), 'confirm' => '1']);
        $app = ScholarshipApplication::firstOrFail();

        $other = User::create(['name' => 'Other', 'email' => 'o@test.in', 'password' => 'x', 'role' => 'student']);
        $this->actingAs($other)->post("/my-applications/{$app->id}/withdraw")->assertNotFound();

        $this->actingAs($this->student)->post("/my-applications/{$app->id}/withdraw")->assertSessionHas('success');
        $this->assertSame('withdrawn', $app->fresh()->application_status);

        $this->post("/scholarships/{$this->gov->id}/apply", ['notes' => str_repeat('Second statement. ', 4), 'confirm' => '1']);
        $this->assertSame('pending', $app->fresh()->application_status);
        $this->assertSame(1, ScholarshipApplication::count());
    }

    public function test_closed_scholarship_cannot_be_applied_to(): void
    {
        $this->gov->update(['deadline' => today()->subDay()]);
        $this->actingAs($this->student)->post("/scholarships/{$this->gov->id}/apply", ['notes' => str_repeat('x', 40), 'confirm' => '1'])
            ->assertRedirect(route('scholarships.show', $this->gov->id));
        $this->assertSame(0, ScholarshipApplication::count());
    }

    public function test_institute_admin_is_scoped_to_own_institute(): void
    {
        $instAdmin = User::create(['name' => 'Inst Admin', 'email' => 'ia@test.in', 'password' => 'x', 'role' => 'institute_admin', 'institute_id' => $this->inst->id, 'university_id' => $this->uni->id]);

        $this->actingAs($instAdmin)->post('/admin/scholarships', [
            'title' => 'Institute Merit Award', 'description' => 'For our students', 'deadline' => today()->addDays(10)->toDateString(),
            'type' => 'government', // ignored for institute admins
        ])->assertRedirect(route('admin.scholarships.index'));

        $created = Scholarship::where('title', 'Institute Merit Award')->firstOrFail();
        $this->assertSame('institute', $created->type);
        $this->assertSame($this->inst->id, $created->institute_id);

        $this->get('/admin/scholarships')->assertSee('Institute Merit Award')->assertDontSee('National Merit Scholarship');
        $this->get("/admin/scholarships/{$this->gov->id}/edit")->assertForbidden();
        $this->get('/admin/users')->assertForbidden();
        $this->get('/admin/universities')->assertForbidden();

        // Applications on other scholarships are hidden from this admin
        $app = ScholarshipApplication::create(['user_id' => $this->student->id, 'scholarship_id' => $this->gov->id, 'notes' => 'x']);
        $this->get("/admin/applications/{$app->id}")->assertForbidden();
    }

    public function test_admin_crud_pages(): void
    {
        $this->actingAs($this->admin);
        foreach (['/admin', '/admin/scholarships', '/admin/scholarships/create', "/admin/scholarships/{$this->gov->id}/edit",
                  '/admin/applications', '/admin/applications?status=all', '/admin/universities', '/admin/universities/create',
                  "/admin/universities/{$this->uni->id}/edit", '/admin/institutes', '/admin/institutes/create',
                  "/admin/institutes/{$this->inst->id}/edit", '/admin/users', '/admin/users/create',
                  "/admin/users/{$this->student->id}/edit", '/admin/feedback', '/profile'] as $url) {
            $this->get($url)->assertOk();
        }

        // Scholarship create / update / deactivate
        $this->post('/admin/scholarships', ['title' => 'Private Award', 'type' => 'private', 'description' => 'Desc', 'deadline' => today()->addMonth()->toDateString()])
            ->assertRedirect(route('admin.scholarships.index'));
        $p = Scholarship::where('title', 'Private Award')->firstOrFail();
        $this->put("/admin/scholarships/{$p->id}", ['title' => 'Private Award 2', 'type' => 'private', 'description' => 'Desc', 'deadline' => today()->addMonth()->toDateString(), 'RecStatus' => 'active'])
            ->assertRedirect(route('admin.scholarships.index'));
        $this->assertSame('Private Award 2', $p->fresh()->title);
        $this->delete("/admin/scholarships/{$p->id}");
        $this->assertSame('inactive', $p->fresh()->RecStatus);

        // University + institute
        $this->post('/admin/universities', ['name' => 'New Uni', 'email' => 'nu@test.in', 'status' => 'pending'])->assertRedirect(route('admin.universities.index'));
        $nu = University::where('email', 'nu@test.in')->firstOrFail();
        $this->assertSame($this->admin->id, $nu->created_by);
        $this->post('/admin/institutes', ['name' => 'New Inst', 'email' => 'ni@test.in', 'type' => 'engineering', 'status' => 'verified', 'university_id' => $nu->id])
            ->assertRedirect(route('admin.institutes.index'));

        // Users: create an institute admin; university follows the institute
        $this->post('/admin/users', ['name' => 'IA', 'email' => 'ia2@test.in', 'password' => 'secret123', 'password_confirmation' => 'secret123', 'category' => 'other', 'role' => 'institute_admin', 'institute_id' => $this->inst->id])
            ->assertRedirect(route('admin.users.index'));
        $ia = User::where('email', 'ia2@test.in')->firstOrFail();
        $this->assertSame($this->uni->id, $ia->university_id);

        // Cannot deactivate self
        $this->delete("/admin/users/{$this->admin->id}")->assertSessionHas('error');
        $this->assertSame('active', $this->admin->fresh()->RecStatus);
    }

    public function test_contact_form_stores_feedback(): void
    {
        $this->post('/contact', ['name' => 'Ravi', 'email' => 'ravi@test.in', 'feedback_type' => 'suggestion', 'message' => 'Please add more private scholarships.'])
            ->assertRedirect(route('contact'));
        $this->assertSame(1, Feedback::count());
        $this->actingAs($this->admin)->get('/admin/feedback')->assertSee('Please add more private scholarships.');
    }

    public function test_profile_update_and_password_change(): void
    {
        $this->actingAs($this->student)->put('/profile', ['name' => 'Asha P', 'category' => 'postgraduate', 'phone' => '9999999999', 'cgpa' => '8.9', 'dob' => '2004-01-02'])
            ->assertRedirect(route('profile.edit'));
        $this->assertSame('Asha P', $this->student->fresh()->name);
        $this->get('/profile')->assertSee('9999999999');
        $this->assertSame(8.9, $this->student->fresh()->profile->cgpa);

        $this->put('/profile/password', ['current_password' => 'wrong', 'password' => 'N3w!Password', 'password_confirmation' => 'N3w!Password'])
            ->assertSessionHasErrorsIn('password', 'current_password');
        $this->put('/profile/password', ['current_password' => 'Password1!', 'password' => 'N3w!Password', 'password_confirmation' => 'N3w!Password'])
            ->assertSessionHas('success');
        $this->assertTrue(Hash::check('N3w!Password', $this->student->fresh()->password));
    }

    public function test_api_still_works(): void
    {
        $this->getJson('/api/health')->assertOk()->assertJson(['success' => true]);
        $this->getJson('/api/scholarships')->assertOk();
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }
}
