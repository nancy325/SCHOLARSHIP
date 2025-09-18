<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            if (Schema::hasColumn('scholarships', 'university_id')) {
                // Best-effort drop of any existing foreign key on university_id
                try {
                    $table->dropForeign(['university_id']);
                } catch (\Throwable $e) {
                    // ignore if not present
                }

                // Re-add proper foreign key to universities table
                $table->foreign('university_id')->references('id')->on('universities')->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            if (Schema::hasColumn('scholarships', 'university_id')) {
                try {
                    $table->dropForeign(['university_id']);
                } catch (\Throwable $e) {
                    // ignore
                }
                // Optionally re-link to institutes if needed (not restoring to avoid bad state)
            }
        });
    }
};



