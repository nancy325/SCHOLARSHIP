<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            // Drop existing FK and column then re-add as nullable to avoid DBAL dependency
            if (Schema::hasColumn('scholarships', 'institute_id')) {
                $table->dropForeign(['institute_id']);
                $table->dropColumn('institute_id');
            }
        });

        Schema::table('scholarships', function (Blueprint $table) {
            $table->foreignId('institute_id')->nullable()->after('university_id')->constrained('institutes')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            if (Schema::hasColumn('scholarships', 'institute_id')) {
                $table->dropForeign(['institute_id']);
                $table->dropColumn('institute_id');
            }
        });

        Schema::table('scholarships', function (Blueprint $table) {
            $table->foreignId('institute_id')->after('type')->constrained('institutes')->cascadeOnDelete();
        });
    }
};


