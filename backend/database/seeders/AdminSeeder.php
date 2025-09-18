<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Institute;
use App\Models\Scholarship;
use App\Models\Application;
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
                'category' => 'graduate',
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

        // Create India-focused scholarships aligned to spec
        $scholarships = [
            [
                'title' => 'National Means-cum-Merit Scholarship (NMMSS)',
                'type' => 'government',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Central Sector scheme to award scholarships to meritorious students of economically weaker sections.',
                'eligibility' => 'Students of Class IX-XII with parental income below threshold and minimum marks criteria.',
                'start_date' => now()->subMonths(1)->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://scholarships.gov.in/',
            ],
            [
                'title' => 'Prime Minister\'s Research Fellowship (PMRF)',
                'type' => 'government',
                'university_id' => $createdUniversities[0]->id,
                'institute_id' => null,
                'description' => 'Fellowship to attract the best talent into research at leading institutions like IITs and IISc.',
                'eligibility' => 'B.Tech/Integrated M.Tech/MS from IIs/IITs/IISc with high CGPA or GATE score.',
                'start_date' => now()->toDateString(),
                'deadline' => now()->addMonths(3)->toDateString(),
                'apply_link' => 'https://pmrf.in/',
            ],
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
                'title' => 'Tata Scholarship (Private)',
                'type' => 'private',
                'university_id' => null,
                'institute_id' => null,
                'description' => 'Private sector support for Indian students pursuing higher education.',
                'eligibility' => 'Indian citizens with strong academics and means criteria.',
                'start_date' => now()->subMonth()->toDateString(),
                'deadline' => now()->addMonths(4)->toDateString(),
                'apply_link' => 'https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants',
            ],
            // Gujarat specific
            [
                'title' => 'Mukhyamantri Yuva Swavalamban Yojana (MYSY) - Gujarat',
                'type' => 'government',
                'university_id' => $createdUniversities[2]->id, // GTU
                'institute_id' => null,
                'description' => 'Government of Gujarat scholarship for bright and needy students in higher education.',
                'eligibility' => 'Resident of Gujarat, academic merit and income criteria as per scheme.',
                'start_date' => now()->subWeeks(3)->toDateString(),
                'deadline' => now()->addMonths(2)->toDateString(),
                'apply_link' => 'https://mysy.guj.nic.in',
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
            // CHARUSAT scholarships
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
            // Additional CHARUSAT scholarships (representative set)
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
        foreach ($scholarships as $scholarshipData) {
            $scholarship = Scholarship::firstOrCreate(
                [
                    'title' => $scholarshipData['title'],
                ],
                $scholarshipData + ['created_by' => $admin->id]
            );
            $createdScholarships[] = $scholarship;
            
            if ($scholarship->wasRecentlyCreated && $scholarship->institute_id) {
            $institute = Institute::find($scholarship->institute_id);
                if ($institute) {
            $institute->increment('scholarships_count');
                }
            }
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
            Application::firstOrCreate(
                [
                    'user_id' => $applicationData['user_id'],
                    'scholarship_id' => $applicationData['scholarship_id'],
                ],
                $applicationData
            );
        }

        $this->command->info('Sample data created successfully!');
        $this->command->info('Admin login: admin@scholarship.com / password123');
    }
}