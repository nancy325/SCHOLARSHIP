<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@scholarship.com',
            'password' => bcrypt('admin123'),
            'category' => 'postgraduate',
            'is_admin' => true,
        ]);

        // Create Test Students
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => bcrypt('password123'),
            'category' => 'undergraduate',
            'is_admin' => false,
        ]);

        User::factory()->create([
            'name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
            'password' => bcrypt('password123'),
            'category' => 'postgraduate',
            'is_admin' => false,
        ]);

        User::factory()->create([
            'name' => 'Mike Johnson',
            'email' => 'mike.johnson@example.com',
            'password' => bcrypt('password123'),
            'category' => 'diploma',
            'is_admin' => false,
        ]);

        User::factory()->create([
            'name' => 'Sarah Wilson',
            'email' => 'sarah.wilson@example.com',
            'password' => bcrypt('password123'),
            'category' => 'high-school',
            'is_admin' => false,
        ]);

        // Create additional random users
        User::factory(5)->create([
            'category' => fake()->randomElement(['high-school', 'diploma', 'undergraduate', 'postgraduate', 'other']),
            'is_admin' => false,
        ]);
    }
}
