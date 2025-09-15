<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\Application;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if not exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@scholarship.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'category' => 'other',
                'is_admin' => true,
            ]
        );

        // Create sample institutes
        $institutes = [
            [
                'name' => 'University of Technology',
                'type' => 'university',
                'status' => 'verified',
                'email' => 'admin@utech.edu',
                'phone' => '+1 (555) 123-4567',
                'website' => 'https://utech.edu',
                'address' => '123 University Ave, New York, NY 10001',
                'description' => 'A leading technology university offering cutting-edge programs in engineering and computer science.',
                'established' => '1985',
                'accreditation' => 'Regional',
                'students' => 15000,
                'scholarships_count' => 0,
                'rating' => 4.8,
                'contact_person' => 'Dr. Sarah Johnson',
                'contact_phone' => '+1 (555) 123-4568',
            ],
            [
                'name' => 'State Community College',
                'type' => 'community_college',
                'status' => 'verified',
                'email' => 'info@scc.edu',
                'phone' => '+1 (555) 987-6543',
                'website' => 'https://scc.edu',
                'address' => '456 College Blvd, Los Angeles, CA 90210',
                'description' => 'A community college providing affordable education and career training programs.',
                'established' => '1970',
                'accreditation' => 'Regional',
                'students' => 8000,
                'scholarships_count' => 0,
                'rating' => 4.2,
                'contact_person' => 'Mr. Robert Smith',
                'contact_phone' => '+1 (555) 987-6544',
            ],
            [
                'name' => 'Tech Institute of Innovation',
                'type' => 'technical_institute',
                'status' => 'verified',
                'email' => 'contact@tii.edu',
                'phone' => '+1 (555) 456-7890',
                'website' => 'https://tii.edu',
                'address' => '789 Innovation Dr, Austin, TX 73301',
                'description' => 'A specialized technical institute focusing on innovation and entrepreneurship.',
                'established' => '2000',
                'accreditation' => 'National',
                'students' => 5000,
                'scholarships_count' => 0,
                'rating' => 4.6,
                'contact_person' => 'Prof. Michael Chen',
                'contact_phone' => '+1 (555) 456-7891',
            ],
        ];

        $createdInstitutes = [];
        foreach ($institutes as $instituteData) {
            $createdInstitutes[] = Institute::create($instituteData);
        }

        // Create sample users
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'password' => Hash::make('password123'),
                'category' => 'undergraduate',
                'is_admin' => false,
                'institute_id' => $createdInstitutes[0]->id,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'password' => Hash::make('password123'),
                'category' => 'graduate',
                'is_admin' => false,
                'institute_id' => $createdInstitutes[1]->id,
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike.johnson@example.com',
                'password' => Hash::make('password123'),
                'category' => 'undergraduate',
                'is_admin' => false,
                'institute_id' => $createdInstitutes[2]->id,
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $createdUsers[] = User::create($userData);
        }

        // Create sample scholarships
        $scholarships = [
            [
                'title' => 'Merit-Based Engineering Scholarship',
                'institute_id' => $createdInstitutes[0]->id,
                'type' => 'merit_based',
                'status' => 'active',
                'amount' => 25000.00,
                'currency' => 'USD',
                'deadline' => now()->addMonths(3),
                'max_applications' => 100,
                'field' => 'Engineering',
                'level' => 'undergraduate',
                'description' => 'A prestigious scholarship for outstanding engineering students demonstrating academic excellence and leadership potential.',
                'requirements' => 'Minimum 3.8 GPA, Engineering major, Leadership experience',
                'eligibility' => 'US citizens, Full-time students, Engineering majors',
                'documents' => 'Transcript, Resume, Letters of recommendation, Personal statement',
            ],
            [
                'title' => 'Community Service Leadership Award',
                'institute_id' => $createdInstitutes[1]->id,
                'type' => 'need_based',
                'status' => 'active',
                'amount' => 10000.00,
                'currency' => 'USD',
                'deadline' => now()->addMonths(2),
                'max_applications' => 50,
                'field' => 'Any',
                'level' => 'undergraduate',
                'description' => 'Recognition for students who have demonstrated exceptional community service and leadership.',
                'requirements' => 'Minimum 3.0 GPA, 100+ community service hours, Leadership role',
                'eligibility' => 'All students, Community service experience required',
                'documents' => 'Service log, Letters of recommendation, Personal statement',
            ],
            [
                'title' => 'Innovation in Technology Grant',
                'institute_id' => $createdInstitutes[2]->id,
                'type' => 'project_based',
                'status' => 'active',
                'amount' => 15000.00,
                'currency' => 'USD',
                'deadline' => now()->addMonths(4),
                'max_applications' => 25,
                'field' => 'Technology',
                'level' => 'graduate',
                'description' => 'Funding for innovative technology projects that demonstrate creativity and potential impact.',
                'requirements' => 'Project proposal, Technology background, Innovation focus',
                'eligibility' => 'Graduate students, Technology/CS majors',
                'documents' => 'Project proposal, Portfolio, Academic references',
            ],
        ];

        $createdScholarships = [];
        foreach ($scholarships as $scholarshipData) {
            $scholarship = Scholarship::create($scholarshipData);
            $createdScholarships[] = $scholarship;
            
            // Update institute scholarships count
            $institute = Institute::find($scholarship->institute_id);
            $institute->increment('scholarships_count');
        }

        // Create sample applications
        $applications = [
            [
                'user_id' => $createdUsers[0]->id,
                'scholarship_id' => $createdScholarships[0]->id,
                'status' => 'pending',
                'personal_statement' => 'I am passionate about engineering and have maintained a 3.9 GPA throughout my studies.',
                'gpa' => 3.9,
                'submitted_at' => now()->subDays(2),
            ],
            [
                'user_id' => $createdUsers[1]->id,
                'scholarship_id' => $createdScholarships[1]->id,
                'status' => 'approved',
                'personal_statement' => 'I have dedicated over 200 hours to community service and have led several volunteer initiatives.',
                'gpa' => 3.7,
                'submitted_at' => now()->subDays(5),
                'reviewed_at' => now()->subDays(1),
            ],
            [
                'user_id' => $createdUsers[2]->id,
                'scholarship_id' => $createdScholarships[2]->id,
                'status' => 'pending',
                'personal_statement' => 'My project focuses on developing AI solutions for environmental monitoring.',
                'gpa' => 3.8,
                'submitted_at' => now()->subDays(1),
            ],
        ];

        foreach ($applications as $applicationData) {
            Application::create($applicationData);
        }

        $this->command->info('Sample data created successfully!');
        $this->command->info('Admin login: admin@scholarship.com / password123');
    }
}