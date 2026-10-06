<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // MySQL-only migration (INFORMATION_SCHEMA / storage engines)
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        // Convert cache table to InnoDB
        if (Schema::hasTable('cache')) {
            DB::statement('ALTER TABLE `cache` ENGINE=InnoDB');
        }

        if (Schema::hasTable('cache_locks')) {
            DB::statement('ALTER TABLE `cache_locks` ENGINE=InnoDB');
        }

        if (Schema::hasTable('failed_jobs')) {
            DB::statement('ALTER TABLE `failed_jobs` ENGINE=InnoDB');
        }

        if (Schema::hasTable('jobs')) {
            DB::statement('ALTER TABLE `jobs` ENGINE=InnoDB');
        }

        if (Schema::hasTable('job_batches')) {
            DB::statement('ALTER TABLE `job_batches` ENGINE=InnoDB');
        }

        if (Schema::hasTable('migrations')) {
            DB::statement('ALTER TABLE `migrations` ENGINE=InnoDB');
        }

        if (Schema::hasTable('password_reset_tokens')) {
            DB::statement('ALTER TABLE `password_reset_tokens` ENGINE=InnoDB');
        }

        if (Schema::hasTable('users')) {
            DB::statement('ALTER TABLE `users` ENGINE=InnoDB');
        }

        if (Schema::hasTable('sessions')) {
            DB::statement('ALTER TABLE `sessions` ENGINE=InnoDB');
        }

        if (Schema::hasTable('profiles')) {
            DB::statement('ALTER TABLE `profiles` ENGINE=InnoDB');
        }

        if (Schema::hasTable('scholarships')) {
            DB::statement('ALTER TABLE `scholarships` ENGINE=InnoDB');
        }

        if (Schema::hasTable('feedback')) {
            DB::statement('ALTER TABLE `feedback` ENGINE=InnoDB');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // MySQL-only migration (INFORMATION_SCHEMA / storage engines)
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if (Schema::hasTable('cache')) {
            DB::statement('ALTER TABLE `cache` ENGINE=MyISAM');
        }
        if (Schema::hasTable('cache_locks')) {
            DB::statement('ALTER TABLE `cache_locks` ENGINE=MyISAM');
        }
        if (Schema::hasTable('failed_jobs')) {
            DB::statement('ALTER TABLE `failed_jobs` ENGINE=MyISAM');
        }
        if (Schema::hasTable('jobs')) {
            DB::statement('ALTER TABLE `jobs` ENGINE=MyISAM');
        }
        if (Schema::hasTable('job_batches')) {
            DB::statement('ALTER TABLE `job_batches` ENGINE=MyISAM');
        }
        if (Schema::hasTable('migrations')) {
            DB::statement('ALTER TABLE `migrations` ENGINE=MyISAM');
        }
        if (Schema::hasTable('password_reset_tokens')) {
            DB::statement('ALTER TABLE `password_reset_tokens` ENGINE=MyISAM');
        }
        if (Schema::hasTable('users')) {
            DB::statement('ALTER TABLE `users` ENGINE=MyISAM');
        }
        if (Schema::hasTable('sessions')) {
            DB::statement('ALTER TABLE `sessions` ENGINE=MyISAM');
        }
        if (Schema::hasTable('profiles')) {
            DB::statement('ALTER TABLE `profiles` ENGINE=MyISAM');
        }
        if (Schema::hasTable('scholarships')) {
            DB::statement('ALTER TABLE `scholarships` ENGINE=MyISAM');
        }
        if (Schema::hasTable('feedback')) {
            DB::statement('ALTER TABLE `feedback` ENGINE=MyISAM');
        }
    }
};
