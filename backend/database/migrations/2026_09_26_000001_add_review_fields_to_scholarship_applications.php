<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scholarship_applications', function (Blueprint $table) {
            if (!Schema::hasColumn('scholarship_applications', 'admin_remarks')) {
                $table->text('admin_remarks')->nullable()->after('notes');
            }
            if (!Schema::hasColumn('scholarship_applications', 'reviewed_by')) {
                $table->foreignId('reviewed_by')->nullable()->after('admin_remarks')
                    ->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('scholarship_applications', function (Blueprint $table) {
            if (Schema::hasColumn('scholarship_applications', 'reviewed_by')) {
                $table->dropForeign(['reviewed_by']);
                $table->dropColumn('reviewed_by');
            }
            if (Schema::hasColumn('scholarship_applications', 'admin_remarks')) {
                $table->dropColumn('admin_remarks');
            }
        });
    }
};
