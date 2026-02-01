<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Convert cache table to InnoDB
        DB::statement('ALTER TABLE `cache` ENGINE=InnoDB');

        // Convert cache_locks table to InnoDB
        DB::statement('ALTER TABLE `cache_locks` ENGINE=InnoDB');

        // Convert failed_jobs table to InnoDB
        DB::statement('ALTER TABLE `failed_jobs` ENGINE=InnoDB');

        // Convert jobs table to InnoDB
        DB::statement('ALTER TABLE `jobs` ENGINE=InnoDB');

        // Convert job_batches table to InnoDB
        DB::statement('ALTER TABLE `job_batches` ENGINE=InnoDB');

        // Convert migrations table to InnoDB
        DB::statement('ALTER TABLE `migrations` ENGINE=InnoDB');

        // Convert password_reset_tokens table to InnoDB
        DB::statement('ALTER TABLE `password_reset_tokens` ENGINE=InnoDB');

        // Convert users table to InnoDB
        DB::statement('ALTER TABLE `users` ENGINE=InnoDB');

        // Convert sessions table to InnoDB
        DB::statement('ALTER TABLE `sessions` ENGINE=InnoDB');

        // Convert profiles table to InnoDB
        DB::statement('ALTER TABLE `profiles` ENGINE=InnoDB');

        // Convert scholarships table to InnoDB
        DB::statement('ALTER TABLE `scholarships` ENGINE=InnoDB');

        // Convert feedback table to InnoDB
        DB::statement('ALTER TABLE `feedback` ENGINE=InnoDB');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback to MyISAM
        DB::statement('ALTER TABLE `cache` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `cache_locks` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `failed_jobs` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `jobs` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `job_batches` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `migrations` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `password_reset_tokens` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `users` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `sessions` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `profiles` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `scholarships` ENGINE=MyISAM');
        DB::statement('ALTER TABLE `feedback` ENGINE=MyISAM');
    }
};
