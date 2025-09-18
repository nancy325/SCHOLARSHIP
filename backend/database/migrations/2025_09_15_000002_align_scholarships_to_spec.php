<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            // Ensure required columns exist per spec
            if (!Schema::hasColumn('scholarships', 'description')) {
                $table->text('description')->after('title');
            }
            if (!Schema::hasColumn('scholarships', 'eligibility')) {
                $table->text('eligibility')->nullable()->after('description');
            }
            if (!Schema::hasColumn('scholarships', 'apply_link')) {
                $table->string('apply_link', 255)->nullable()->after('deadline');
            }
            if (!Schema::hasColumn('scholarships', 'university_id')) {
                $table->foreignId('university_id')->nullable()->after('type')->constrained('institutes')->nullOnDelete();
            }
            if (!Schema::hasColumn('scholarships', 'created_by')) {
                $table->foreignId('created_by')->nullable()->after('apply_link')->constrained('users')->nullOnDelete();
            }

            // Drop non-spec columns if they exist
            foreach (['amount', 'currency', 'max_applications', 'field', 'level', 'requirements', 'documents', 'status'] as $col) {
                if (Schema::hasColumn('scholarships', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }

    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            if (Schema::hasColumn('scholarships', 'university_id')) {
                $table->dropConstrainedForeignId('university_id');
            }
            if (Schema::hasColumn('scholarships', 'created_by')) {
                $table->dropConstrainedForeignId('created_by');
            }
            if (Schema::hasColumn('scholarships', 'apply_link')) {
                $table->dropColumn('apply_link');
            }
            // Note: Not restoring dropped non-spec columns in down()
        });
    }
};


