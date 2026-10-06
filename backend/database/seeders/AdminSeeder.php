<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\University;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin user if not exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@scholarship.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'category' => 'other',
                'role' => 'super_admin',
            ]
        );

        // Create Indian universities
        $universities = [
            [
                'name' => 'Indian Institute of Technology Bombay',
                'status' => 'verified',
                'email' => 'info@iitb.ac.in',
                'phone' => '+91-22-25722545',
                'website' => 'https://www.iitb.ac.in',
                'address' => 'Powai, Mumbai 400076, Maharashtra',
                'description' => 'IIT Bombay is one of India\'s premier institutions for engineering education and research.',
                'established' => '1958',
                'accreditation' => 'National',
                'students' => 11000,
                'rating' => 4.8,
            ],
            [
                'name' => 'University of Delhi',
                'status' => 'verified',
                'email' => 'info@du.ac.in',
                'phone' => '+91-11-27667853',
                'website' => 'http://www.du.ac.in',
                'address' => 'Benito Juarez Road, South Campus, New Delhi - 110021',
                'description' => 'A premier university of the country with a venerable legacy and international acclaim.',
                'established' => '1922',
                'accreditation' => 'National',
                'students' => 400000,
                'rating' => 4.5,
            ],
            [
                'name' => 'Gujarat Technological University (GTU)',
                'status' => 'verified',
                'email' => 'info@gtu.ac.in',
                'phone' => '+91-79-23267500',
                'website' => 'https://www.gtu.ac.in',
                'address' => 'Nr. Vishwakarma Government Engineering College, Visat-Gandhinagar Highway, Chandkheda, Ahmedabad - 382424, Gujarat',
                'description' => 'State university affiliating many engineering, pharmacy and management colleges across Gujarat.',
                'established' => '2007',
                'accreditation' => 'State',
                'students' => 450000,
                'rating' => 4.3,
            ],
            [
                'name' => 'Gujarat University',
                'status' => 'verified',
                'email' => 'contact@gujaratuniversity.ac.in',
                'phone' => '+91-79-26301341',
                'website' => 'https://www.gujaratuniversity.ac.in',
                'address' => 'Navrangpura, Ahmedabad - 380009, Gujarat',
                'description' => 'One of the oldest universities in Gujarat with a large number of affiliated colleges.',
                'established' => '1949',
                'accreditation' => 'State',
                'students' => 300000,
                'rating' => 4.2,
            ],
            [
                'name' => 'The Maharaja Sayajirao University of Baroda (MSU)',
                'status' => 'verified',
                'email' => 'info@msubaroda.ac.in',
                'phone' => '+91-265-2795555',
                'website' => 'https://msubaroda.ac.in',
                'address' => 'Pratapgunj, Vadodara - 390002, Gujarat',
                'description' => 'Renowned public university in Vadodara offering diverse programs.',
                'established' => '1949',
                'accreditation' => 'State',
                'students' => 35000,
                'rating' => 4.4,
            ],
            [
                'name' => 'Charotar University of Science and Technology (CHARUSAT)',
                'status' => 'verified',
                'email' => 'info@charusat.ac.in',
                'phone' => '+91-2697-265011',
                'website' => 'https://www.charusat.ac.in',
                'address' => 'CHARUSAT Campus, Off Nadiad-Petlad Highway, Changa 388421, Gujarat',
                'description' => 'Private university in Gujarat with multiple constituent institutes.',
                'established' => '2009',
                'accreditation' => 'State',
                'students' => 9000,
                'rating' => 4.3,
            ],
        ];

        $createdUniversities = [];
        foreach ($universities as $u) {
            $createdUniversities[] = University::firstOrCreate(
                ['email' => $u['email']],
                $u + ['created_by' => $admin->id]
            );
        }

        // Create Indian institutes (colleges/centres) linked to above universities
        $institutes = [
            [
                'name' => 'IIT Bombay - Computer Science & Engineering',
                'type' => 'technical_institute',
                'status' => 'verified',
                'email' => 'cse@iitb.ac.in',
                'phone' => '+91-22-2576-7901',
                'website' => 'https://www.cse.iitb.ac.in',
                'address' => 'IIT Bombay, Powai, Mumbai 400076, Maharashtra',
                'description' => 'Department of Computer Science and Engineering at IIT Bombay.',
                'established' => '1982',
                'accreditation' => 'National',
                'students' => 1200,
                'scholarships_count' => 0,
                'rating' => 4.9,
                'contact_person' => 'Head of Department',
                'contact_phone' => '+91-22-2576-7901',
                'university_id' => $createdUniversities[0]->id,
            ],
            [
                'name' => 'St. Stephen\'s College, University of Delhi',
                'type' => 'college',
                'status' => 'verified',
                'email' => 'principal@ststephens.edu',
                'phone' => '+91-11-27667271',
                'website' => 'https://www.ststephens.edu',
                'address' => 'University Enclave, North Campus, Delhi 110007',
                'description' => 'One of India\'s most prestigious colleges, affiliated to the University of Delhi.',
                'established' => '1881',
                'accreditation' => 'National',
                'students' => 2000,
                'scholarships_count' => 0,
                'rating' => 4.7,
                'contact_person' => 'Principal',
                'contact_phone' => '+91-11-27667271',
                'university_id' => $createdUniversities[1]->id,
            ],
            // Gujarat institutes
            [
                'name' => 'L. D. College of Engineering (LDCE)',
                'type' => 'engineering_college',
                'status' => 'verified',
                'email' => 'contact@ldce.ac.in',
                'phone' => '+91-79-26302887',
                'website' => 'https://ldce.ac.in',
                'address' => 'Opp. Gujarat University, Navrangpura, Ahmedabad - 380015',
                'description' => 'Premier government engineering college in Gujarat affiliated to GTU.',
                'established' => '1948',
                'accreditation' => 'State',
                'students' => 7000,
                'scholarships_count' => 0,
                'rating' => 4.6,
                'contact_person' => 'Principal',
                'contact_phone' => '+91-79-26302887',
                'university_id' => $createdUniversities[2]->id, // GTU
            ],
            [
                'name' => 'DA-IICT, Gandhinagar',
                'type' => 'technical_institute',
                'status' => 'verified',
                'email' => 'info@daiict.ac.in',
                'phone' => '+91-79-68261500',
                'website' => 'https://www.daiict.ac.in',
                'address' => 'Near Reliance Chowkdi, Gandhinagar - 382007',
                'description' => 'Dhirubhai Ambani Institute of Information and Communication Technology.',
                'established' => '2001',
                'accreditation' => 'Deemed',
                'students' => 2000,
                'scholarships_count' => 0,
                'rating' => 4.7,
                'contact_person' => 'Registrar',
                'contact_phone' => '+91-79-68261500',
                'university_id' => $createdUniversities[2]->id, // linked under GTU for listing
            ],
            [
                'name' => 'Faculty of Technology & Engineering, MSU Baroda',
                'type' => 'engineering_college',
                'status' => 'verified',
                'email' => 'fte@msubaroda.ac.in',
                'phone' => '+91-265-2795555',
                'website' => 'https://msubaroda.ac.in/Academics/Technology',
                'address' => 'MSU Campus, Vadodara - 390001',
                'description' => 'Constituent engineering faculty of MSU Baroda.',
                'established' => '1890',
                'accreditation' => 'State',
                'students' => 5000,
                'scholarships_count' => 0,
                'rating' => 4.5,
                'contact_person' => 'Dean',
                'contact_phone' => '+91-265-2795555',
                'university_id' => $createdUniversities[4 - 1]->id, // MSU index 3
            ],
            // CHARUSAT institutes
            [
                'name' => 'Chandubhai S. Patel Institute of Technology (CSPIT)',
                'type' => 'engineering_college',
                'status' => 'verified',
                'email' => 'info@cspit.ac.in',
                'phone' => '+91-2697-265011',
                'website' => 'https://www.charusat.ac.in/cspit',
                'address' => 'CSPIT, CHARUSAT Campus, Changa 388421, Gujarat',
                'description' => 'Engineering institute under CHARUSAT offering UG and PG programs.',
                'established' => '2000',
                'accreditation' => 'State',
                'students' => 3500,
                'scholarships_count' => 0,
                'rating' => 4.4,
                'contact_person' => 'Principal, CSPIT',
                'contact_phone' => '+91-2697-265011',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
            ],
            [
                'name' => 'Ramanbhai Patel College of Pharmacy (RPCP)',
                'type' => 'pharmacy_college',
                'status' => 'verified',
                'email' => 'info@rpcp.ac.in',
                'phone' => '+91-2697-265011',
                'website' => 'https://www.charusat.ac.in/rpcp',
                'address' => 'RPCP, CHARUSAT Campus, Changa 388421, Gujarat',
                'description' => 'Pharmacy institute under CHARUSAT.',
                'established' => '2004',
                'accreditation' => 'State',
                'students' => 1200,
                'scholarships_count' => 0,
                'rating' => 4.2,
                'contact_person' => 'Principal, RPCP',
                'contact_phone' => '+91-2697-265011',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
            ],
        ];

        $createdInstitutes = [];
        foreach ($institutes as $instituteData) {
            $createdInstitutes[] = Institute::firstOrCreate(
                ['email' => $instituteData['email']],
                $instituteData + ['created_by' => $admin->id]
            );
        }

        // Create sample users
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'password' => Hash::make('password123'),
                'category' => 'undergraduate',
                'role' => 'student',
                'institute_id' => $createdInstitutes[0]->id,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'password' => Hash::make('password123'),
                'category' => 'postgraduate',
                'role' => 'student',
                'institute_id' => $createdInstitutes[1]->id,
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike.johnson@example.com',
                'password' => Hash::make('password123'),
                'category' => 'undergraduate',
                'role' => 'student',
                'institute_id' => $createdInstitutes[0]->id,
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $createdUsers[] = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // Create CHARUSAT university admin user
        $charusatUniversity = collect($createdUniversities)->firstWhere('name', 'Charotar University of Science and Technology (CHARUSAT)');
        if ($charusatUniversity) {
            User::firstOrCreate(
                ['email' => 'charusat@scholarship.com'],
                [
                    'name' => 'CHARUSAT Admin',
                    'password' => Hash::make('password123'),
                    'category' => 'other',
                    'role' => 'university_admin',
                    'university_id' => $charusatUniversity->id,
                    'institute_id' => null, // University admin doesn't belong to specific institute
                ]
            );
        }

        // Demo university / institute scholarships (sample data — university admins replace these with their own)
        $scholarships = [
            [
                'title' => 'IIT Bombay Institute Scholarship',
                'type' => 'institute',
                'university_id' => $createdUniversities[0]->id,
                'institute_id' => $createdInstitutes[0]->id,
                'description' => 'Financial assistance for deserving UG students of IIT Bombay CSE.',
                'eligibility' => 'Merit-cum-means as per IIT Bombay norms.',
                'start_date' => now()->subWeeks(2)->toDateString(),
                'deadline' => now()->addMonths(1)->toDateString(),
                'apply_link' => 'https://www.iitb.ac.in/en/education/scholarships',
            ],
            [
                'title' => 'St. Stephen\'s College Merit Scholarship',
                'type' => 'institute',
                'university_id' => $createdUniversities[1]->id,
                'institute_id' => $createdInstitutes[1]->id,
                'description' => 'Merit-based support for outstanding undergraduate students.',
                'eligibility' => 'High academic standing as per college criteria.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.ststephens.edu/scholarships/',
            ],
            [
                'title' => 'GTU Merit Scholarship for Engineering Undergraduates',
                'type' => 'university',
                'university_id' => $createdUniversities[2]->id, // GTU
                'institute_id' => null,
                'description' => 'Merit scholarship by Gujarat Technological University for top-ranking UG students.',
                'eligibility' => 'Top 5% students in semester results; GTU affiliated colleges.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(1)->toDateString(),
                'apply_link' => 'https://www.gtu.ac.in',
            ],
            [
                'title' => 'LDCE Alumni Association Scholarship',
                'type' => 'institute',
                'university_id' => $createdUniversities[2]->id, // GTU
                'institute_id' => collect($createdInstitutes)->firstWhere('email', 'contact@ldce.ac.in')->id ?? null,
                'description' => 'Support from LDCE Alumni Association to deserving students.',
                'eligibility' => 'LDCE students meeting merit-cum-means criteria.',
                'start_date' => now()->subDays(10)->toDateString(),
                'deadline' => now()->addMonths(1)->toDateString(),
                'apply_link' => 'https://ldce.ac.in/alumni',
            ],
            [
                'title' => 'CHARUSAT Merit Scholarship',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Merit scholarship for top-performing students across CHARUSAT constituent institutes.',
                'eligibility' => 'Top 5% students by CGPA in each program; no backlogs.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CHARUSAT Need-Based Assistance',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Financial assistance for economically weaker students enrolled at CHARUSAT.',
                'eligibility' => 'Family income below university threshold; satisfactory academic progress.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(3)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CSPIT Excellence Scholarship',
                'type' => 'institute',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => collect($createdInstitutes)->firstWhere('email', 'info@cspit.ac.in')->id ?? null,
                'description' => 'Scholarship for CSPIT students with outstanding academic performance and contributions.',
                'eligibility' => 'CGPA >= 9.0; involvement in projects/clubs; faculty recommendation.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(1)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/cspit/scholarships',
            ],
            [
                'title' => 'CHARUSAT Sports Excellence Scholarship',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Fee concession for students with state/national level sports achievements.',
                'eligibility' => 'State/National level participation/medal in last 3 years; minimum CGPA as per policy.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CHARUSAT Alumni Scholarship',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Scholarship funded by CHARUSAT alumni for meritorious and needy students.',
                'eligibility' => 'Family income threshold and merit as per alumni trust norms.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CHARUSAT Girl Child Scholarship',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Tuition fee concession for female students to promote higher education.',
                'eligibility' => 'Open to all female students meeting academic progression criteria.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CHARUSAT EWS Tuition Fee Waiver',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Partial tuition fee waiver for Economically Weaker Section students.',
                'eligibility' => 'EWS certificate and income proof; satisfactory CGPA.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(3)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CHARUSAT Hostel Fee Concession',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Need-based concession on hostel fees for eligible students.',
                'eligibility' => 'Income threshold; good disciplinary record.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(3)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CHARUSAT Research Seed Grant (UG/PG)',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Seed grant to support student research and innovation projects.',
                'eligibility' => 'Faculty mentor required; proposal and budget approval by committee.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(4)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/research',
            ],
            [
                'title' => 'CHARUSAT PG Teaching Assistantship',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Monthly stipend for PG students assisting in labs/tutorials.',
                'eligibility' => 'Minimum CGPA and workload norms as per policy.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/scholarships',
            ],
            [
                'title' => 'CHARUSAT Doctoral Fellowship (PhD)',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Fellowship for full-time PhD scholars at CHARUSAT.',
                'eligibility' => 'Full-time PhD registration and merit as per CHARUSAT PhD rules.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(4)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/phd',
            ],
            [
                'title' => 'International Conference Travel Grant (Students)',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Partial travel support for presenting papers at reputed international conferences.',
                'eligibility' => 'Accepted paper with supervisor endorsement; ranking of conference considered.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(6)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/research',
            ],
            [
                'title' => 'CHARUSAT Student Startup Seed Support',
                'type' => 'university',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => null,
                'description' => 'Seed support for student-founded startups incubated at CHARUSAT Innovation & Incubation Center.',
                'eligibility' => 'Selection by incubation cell; milestone-based release.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(5)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/incubation',
            ],
            [
                'title' => 'RPCP Merit Scholarship',
                'type' => 'institute',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => collect($createdInstitutes)->firstWhere('email', 'info@rpcp.ac.in')->id ?? null,
                'description' => 'Merit scholarship for top-ranking B.Pharm and M.Pharm students at RPCP.',
                'eligibility' => 'Top 10% by CGPA; no backlog.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(1)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/rpcp/scholarships',
            ],
            [
                'title' => 'RPCP Need-Based Scholarship',
                'type' => 'institute',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => collect($createdInstitutes)->firstWhere('email', 'info@rpcp.ac.in')->id ?? null,
                'description' => 'Financial assistance for economically weaker students at RPCP.',
                'eligibility' => 'Income threshold and satisfactory progress.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/rpcp/scholarships',
            ],
            [
                'title' => 'CSPIT Innovation Project Grant',
                'type' => 'institute',
                'university_id' => $createdUniversities[ count($createdUniversities) - 1 ]->id,
                'institute_id' => collect($createdInstitutes)->firstWhere('email', 'info@cspit.ac.in')->id ?? null,
                'description' => 'Mini-grants to support innovative engineering projects at CSPIT.',
                'eligibility' => 'Faculty-mentored proposal; demo/prototype expected.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://www.charusat.ac.in/cspit/scholarships',
            ],
        ];

        $createdScholarships = [];
        $sampleNote = 'Sample entry for demonstration. The university/institute admin should replace it with official details.';
        foreach (array_merge($this->verifiedSchemes(), $scholarships) as $scholarshipData) {
            $isDemo = in_array($scholarshipData['type'], ['university', 'institute'], true);
            if ($isDemo) {
                $scholarshipData = array_merge(
                    ['own_students_only' => true, 'benefits' => $sampleNote],
                    $this->demoRules()[$scholarshipData['title']] ?? [],
                    $scholarshipData
                );
            }
            $scholarship = Scholarship::updateOrCreate(
                ['title' => $scholarshipData['title']],
                $scholarshipData + ['created_by' => $admin->id, 'RecStatus' => 'active']
            );
            $createdScholarships[] = $scholarship;

            if ($scholarship->wasRecentlyCreated && $scholarship->institute_id) {
                Institute::whereKey($scholarship->institute_id)->increment('scholarships_count');
            }
        }

        // Older seed entries replaced by verified schemes
        Scholarship::whereIn('title', ['Tata Scholarship (Private)'])->update(['RecStatus' => 'inactive']);

        // Student profiles used for eligibility matching (demo values)
        $this->seedStudentProfiles();

        $this->command->info('Sample data created successfully!');
        $this->command->info('Admin login: admin@scholarship.com / password123');
    }

    /**
     * National / state schemes. Figures checked in September 2026 against the official
     * portals and scheme guidelines (NSP, AICTE, pmrf.in, MYSY, Digital Gujarat, DST INSPIRE)
     * and the sponsors' own pages. Amounts, income limits and deadlines change every year —
     * update them here or from the admin panel when a new cycle opens.
     */
    private function verifiedSchemes(): array
    {
        $in = fn (int $days) => now()->addDays($days)->toDateString();

        return [
            [
                'title' => 'National Means-cum-Merit Scholarship (NMMSS)',
                'provider' => 'Ministry of Education, Government of India',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Central sector scheme that awards scholarships to meritorious students from economically weaker sections to stop them dropping out after Class 8 and encourage them to continue to Class 12.',
                'eligibility' => "Selected through the state-level NMMS exam taken in Class 8.\nMinimum 55% marks in Class 8 (5% relaxation for SC/ST).\nAnnual parental income not more than Rs 3,50,000.\nMust study in a government, government-aided or local-body school.\nTo keep the scholarship: 60% in Class 10 (55% SC/ST) and 55% in Class 11.",
                'award_amount' => 12000,
                'award_frequency' => 'per_year',
                'benefits' => 'Rs 12,000 per year (Rs 1,000 per month) for Classes 9 to 12, paid directly to the bank account through NSP.',
                'education_levels' => ['high-school'],
                'max_family_income' => 350000,
                'min_percentage' => 55,
                'gender' => 'any',
                'documents_required' => "NMMS exam result / selection letter\nIncome certificate of parents\nClass 8 marksheet\nCaste certificate (SC/ST, if applicable)\nAadhaar and bank account details",
                'start_date' => now()->subDays(20)->toDateString(),
                'deadline' => '2026-10-31',
                'apply_link' => 'https://scholarships.gov.in/',
            ],
            [
                'title' => 'Central Sector Scheme of Scholarship for College and University Students',
                'provider' => 'Department of Higher Education, Ministry of Education',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Merit scholarship for students who scored above the 80th percentile in their Class 12 board exam and are pursuing a regular UG or PG degree.',
                'eligibility' => "Above 80th percentile of successful candidates in Class 12 of your board.\nPursuing a regular (not distance/correspondence/diploma) UG or PG course.\nAnnual family income not more than Rs 4,50,000.\nNot receiving any other scholarship.\nRenewal needs 50% marks and 75% attendance each year.",
                'award_amount' => 12000,
                'award_frequency' => 'per_year',
                'benefits' => "UG (first 3 years): Rs 12,000 per year.\nPG, and 4th/5th year of professional courses: Rs 20,000 per year.",
                'education_levels' => ['undergraduate', 'postgraduate'],
                'max_family_income' => 450000,
                'min_percentage' => 80,
                'gender' => 'any',
                'documents_required' => "Class 12 marksheet\nIncome certificate\nCollege admission / bonafide certificate\nAadhaar and bank account details",
                'start_date' => now()->subDays(60)->toDateString(),
                'deadline' => '2026-09-30',
                'apply_link' => 'https://scholarships.gov.in/',
            ],
            [
                'title' => 'Prime Minister\'s Research Fellowship (PMRF)',
                'provider' => 'Ministry of Education, Government of India',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Fellowship to attract the best talent into doctoral research at IITs, IISc, IISERs, NITs and other top institutions.',
                'eligibility' => "PhD admission (direct entry or lateral entry) at a PMRF-granting institution (IITs, IISc, IISERs, and other notified institutes).\nDirect entry: final year or completed B.Tech / integrated M.Tech / 5-year integrated M.Sc / UG-PG dual degree in science or technology with high CGPA, as per current PMRF guidelines.\nSelection through the PMRF selection committee.",
                'award_amount' => 70000,
                'award_frequency' => 'per_month',
                'benefits' => "Fellowship of Rs 70,000 per month in years 1–2, Rs 75,000 in year 3 and Rs 80,000 in years 4–5.\nResearch grant of Rs 2 lakh per year (Rs 10 lakh over 5 years).",
                'education_levels' => ['phd'],
                'max_family_income' => null,
                'gender' => 'any',
                'documents_required' => "Degree certificates and transcripts\nResearch proposal\nRecommendation letters\nPhD admission letter",
                'start_date' => now()->subDays(10)->toDateString(),
                'deadline' => $in(75),
                'apply_link' => 'https://www.pmrf.in/',
            ],
            [
                'title' => 'Mukhyamantri Yuva Swavalamban Yojana (MYSY) - Gujarat',
                'provider' => 'Education Department, Government of Gujarat',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Government of Gujarat support for bright students from families with modest income who take admission in diploma or degree courses in Gujarat.',
                'eligibility' => "Domicile of Gujarat.\nAnnual family income less than Rs 6,00,000.\nDiploma: 80 percentile or more in Class 10.\nDegree: 80 percentile or more in Class 12 (Science / General stream).\nDiploma-to-degree: 65% or more in diploma.",
                'award_amount' => 50000,
                'award_frequency' => 'per_year',
                'benefits' => "Tuition fee: 50% of fee up to Rs 50,000 (engineering, pharmacy, technical), up to Rs 2,00,000 (medical, dental), up to Rs 10,000 (BA, B.Sc, B.Com, BBA, BCA).\nHostel assistance: Rs 1,200 per month for 10 months (students studying outside their taluka).\nOne-time support for books and instruments.",
                'education_levels' => ['diploma', 'undergraduate'],
                'max_family_income' => 600000,
                'min_percentage' => 80,
                'gender' => 'any',
                'state' => 'Gujarat',
                'documents_required' => "Income certificate\nClass 10/12 marksheet\nAdmission letter and fee receipt\nDomicile certificate\nAadhaar and bank account details",
                'start_date' => '2026-07-01',
                'deadline' => '2026-09-23',
                'apply_link' => 'https://mysy.guj.nic.in/',
            ],
            [
                'title' => 'AICTE Pragati Scholarship for Girls (Degree & Diploma)',
                'provider' => 'All India Council for Technical Education (AICTE)',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Scholarship to encourage girls to pursue technical education — 5,000 scholarships for degree and 5,000 for diploma students every year.',
                'eligibility' => "Girl students admitted to the 1st year (or 2nd year through lateral entry) of an AICTE-approved technical degree or diploma course.\nAnnual family income not more than Rs 8,00,000.\nMaximum two girl children per family.",
                'award_amount' => 50000,
                'award_frequency' => 'per_year',
                'benefits' => 'Rs 50,000 per year for every year of study (up to 4 years for degree, 3 years for diploma).',
                'education_levels' => ['diploma', 'undergraduate'],
                'max_family_income' => 800000,
                'gender' => 'female',
                'documents_required' => "Class 10/12 marksheet\nIncome certificate\nAdmission letter and fee receipt\nAadhaar and bank account details",
                'start_date' => now()->subDays(30)->toDateString(),
                'deadline' => '2026-10-31',
                'apply_link' => 'https://scholarships.gov.in/',
            ],
            [
                'title' => 'Kotak Kanya Scholarship',
                'provider' => 'Kotak Education Foundation',
                'type' => 'private',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Scholarship for meritorious girls from low-income families starting a professional degree at a reputed (NIRF / NAAC accredited) institute.',
                'eligibility' => "Girl students in the 1st year of a professional degree: Engineering, MBBS, BDS, integrated LLB, Architecture, Design, Pharmacy, BS-MS etc.\nAt least 75% in Class 12.\nAnnual family income less than Rs 6,00,000.",
                'award_amount' => 150000,
                'award_frequency' => 'per_year',
                'benefits' => 'Up to Rs 1.5 lakh per year until graduation for tuition, hostel, books, laptop and other education costs (renewed every year on performance).',
                'education_levels' => ['undergraduate'],
                'max_family_income' => 600000,
                'min_percentage' => 75,
                'gender' => 'female',
                'documents_required' => "Class 12 marksheet\nIncome certificate\nAdmission letter and fee structure\nAadhaar and bank account details",
                'start_date' => '2026-07-14',
                'deadline' => '2026-09-30',
                'apply_link' => 'https://www.kotakeducationfoundation.org/kotak-kanya-scholarship',
            ],
            [
                'title' => 'Reliance Foundation Undergraduate Scholarship',
                'provider' => 'Reliance Foundation',
                'type' => 'private',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Merit-cum-means scholarship for first-year undergraduate students in any stream, selected through an online aptitude test.',
                'eligibility' => "1st year of a full-time regular UG degree in India.\nAt least 60% in Class 12.\nAnnual household income less than Rs 15 lakh (preference to income below Rs 2.5 lakh).\nMust take the online aptitude test.",
                'award_amount' => 200000,
                'award_frequency' => 'one_time',
                'benefits' => 'Up to Rs 2 lakh over the duration of the degree, plus access to the Reliance Foundation alumni network.',
                'education_levels' => ['undergraduate'],
                'max_family_income' => 1500000,
                'min_percentage' => 60,
                'gender' => 'any',
                'documents_required' => "Class 12 marksheet\nIncome certificate\nAdmission proof\nAadhaar",
                'start_date' => now()->subDays(15)->toDateString(),
                'deadline' => $in(30),
                'apply_link' => 'https://www.scholarships.reliancefoundation.org/UG_Scholarship',
            ],
            [
                'title' => 'HDFC Bank Parivartan ECSS Programme',
                'provider' => 'HDFC Bank Parivartan',
                'type' => 'private',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Educational Crisis Scholarship Support for students from Class 1 to postgraduation whose families face financial difficulty.',
                'eligibility' => "At least 55% in the previous exam.\nAnnual family income not more than Rs 2,50,000.\nPreference to students whose family faced a personal or financial crisis in the last three years.",
                'award_amount' => null,
                'award_frequency' => null,
                'benefits' => "Class 1–6: Rs 15,000 · Class 7–12, Diploma/ITI/Polytechnic: Rs 18,000\nUG general: Rs 30,000 · UG professional: Rs 50,000\nPG general: Rs 35,000 · PG professional: Rs 75,000",
                'education_levels' => ['high-school', 'diploma', 'undergraduate', 'postgraduate'],
                'max_family_income' => 250000,
                'min_percentage' => 55,
                'gender' => 'any',
                'documents_required' => "Previous year marksheet\nIncome proof\nAdmission proof / fee receipt\nCrisis proof (if applicable)\nAadhaar and bank account details",
                'start_date' => now()->subDays(30)->toDateString(),
                'deadline' => '2026-10-31',
                'apply_link' => 'https://www.hdfcbankecss.com/',
            ],
            [
                'title' => 'Post-Matric Scholarship for SC Students (Gujarat)',
                'provider' => 'Social Justice & Empowerment Department, Government of Gujarat',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Government of India post-matric scholarship for Scheduled Caste students, applied for through the Digital Gujarat portal.',
                'eligibility' => "Scheduled Caste (SC) student, domicile of Gujarat.\nStudying in Class 11 or above (college, ITI, diploma or professional course).\nAnnual family income not more than Rs 2,50,000.",
                'award_amount' => null,
                'award_frequency' => null,
                'benefits' => "Maintenance allowance of Rs 250 – 1,200 per month depending on course and hostel status.\nReimbursement of tuition and compulsory fees as per government norms.",
                'education_levels' => ['high-school', 'diploma', 'undergraduate', 'postgraduate', 'phd'],
                'max_family_income' => 250000,
                'gender' => 'any',
                'social_categories' => ['sc'],
                'state' => 'Gujarat',
                'documents_required' => "Caste certificate\nIncome certificate\nPrevious marksheet\nFee receipt\nAadhaar and bank account details",
                'start_date' => now()->subDays(45)->toDateString(),
                'deadline' => '2026-09-30',
                'apply_link' => 'https://www.digitalgujarat.gov.in/',
            ],
            [
                'title' => 'INSPIRE Scholarship for Higher Education (INSPIRE-SHE)',
                'provider' => 'Department of Science & Technology, Government of India',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => '10,000 scholarships every year for top students who choose to study natural and basic sciences at BSc / integrated MSc level.',
                'eligibility' => "Top 1% in Class 12 of your board (or a JEE Advanced / NEET top-10,000 rank, or other notified merit criteria).\nPursuing BSc, BS or integrated MS/MSc in natural and basic sciences.\nAge 17–22 years.",
                'award_amount' => 80000,
                'award_frequency' => 'per_year',
                'benefits' => 'Rs 80,000 per year (Rs 60,000 scholarship + Rs 20,000 summer research mentorship grant) for up to 5 years.',
                'education_levels' => ['undergraduate', 'postgraduate'],
                'max_family_income' => null,
                'gender' => 'any',
                'documents_required' => "Class 12 marksheet\nEligibility certificate from the board (top 1%)\nCollege bonafide certificate\nBank account details",
                'start_date' => now()->subDays(20)->toDateString(),
                'deadline' => $in(50),
                'apply_link' => 'https://online-inspire.gov.in/',
            ],
        ];
    }

    /** Eligibility rules for the demo university / institute scholarships */
    private function demoRules(): array
    {
        $ugpg = ['undergraduate', 'postgraduate'];

        return [
            'IIT Bombay Institute Scholarship' => ['education_levels' => ['undergraduate']],
            'St. Stephen\'s College Merit Scholarship' => ['education_levels' => ['undergraduate']],
            'GTU Merit Scholarship for Engineering Undergraduates' => ['education_levels' => ['undergraduate']],
            'LDCE Alumni Association Scholarship' => ['education_levels' => ['undergraduate'], 'max_family_income' => 600000],
            'CHARUSAT Merit Scholarship' => ['education_levels' => $ugpg],
            'CHARUSAT Need-Based Assistance' => ['education_levels' => $ugpg, 'max_family_income' => 600000],
            'CSPIT Excellence Scholarship' => ['education_levels' => ['undergraduate']],
            'CHARUSAT Sports Excellence Scholarship' => ['education_levels' => $ugpg],
            'CHARUSAT Alumni Scholarship' => ['education_levels' => $ugpg, 'max_family_income' => 600000],
            'CHARUSAT Girl Child Scholarship' => ['education_levels' => $ugpg, 'gender' => 'female'],
            'CHARUSAT EWS Tuition Fee Waiver' => ['education_levels' => $ugpg, 'social_categories' => ['ews'], 'max_family_income' => 800000],
            'CHARUSAT Hostel Fee Concession' => ['education_levels' => $ugpg, 'max_family_income' => 600000],
            'CHARUSAT Research Seed Grant (UG/PG)' => ['education_levels' => $ugpg],
            'CHARUSAT PG Teaching Assistantship' => ['education_levels' => ['postgraduate']],
            'CHARUSAT Doctoral Fellowship (PhD)' => ['education_levels' => ['phd']],
            'International Conference Travel Grant (Students)' => ['education_levels' => ['undergraduate', 'postgraduate', 'phd']],
            'CHARUSAT Student Startup Seed Support' => ['education_levels' => $ugpg],
            'RPCP Merit Scholarship' => ['education_levels' => $ugpg],
            'RPCP Need-Based Scholarship' => ['education_levels' => $ugpg, 'max_family_income' => 600000],
            'CSPIT Innovation Project Grant' => ['education_levels' => ['undergraduate']],
        ];
    }

    /** Demo students get profile details so eligibility matching can be tried straight away */
    private function seedStudentProfiles(): void
    {
        $profiles = [
            'john.doe@example.com' => ['annual_family_income' => 300000, 'gender' => 'male', 'state' => 'Maharashtra', 'social_category' => 'general', 'previous_percentage' => 88],
            'jane.smith@example.com' => ['annual_family_income' => 550000, 'gender' => 'female', 'state' => 'Delhi', 'social_category' => 'obc', 'previous_percentage' => 82],
            'mike.johnson@example.com' => ['annual_family_income' => 200000, 'gender' => 'male', 'state' => 'Gujarat', 'social_category' => 'sc', 'previous_percentage' => 84],
        ];

        foreach ($profiles as $email => $data) {
            $user = User::where('email', $email)->first();
            if (!$user) {
                continue;
            }
            if ($user->institute_id && !$user->university_id) {
                $user->update(['university_id' => Institute::whereKey($user->institute_id)->value('university_id')]);
            }
            \App\Models\Profile::firstOrCreate(['user_id' => $user->id], $data);
        }
    }
}
