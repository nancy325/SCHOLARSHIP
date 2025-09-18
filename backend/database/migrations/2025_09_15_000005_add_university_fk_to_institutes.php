<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('institutes', function (Blueprint $table) {
            if (!Schema::hasColumn('institutes', 'university_id')) {
                $table->foreignId('university_id')->nullable()->after('name')->constrained('universities')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('institutes', function (Blueprint $table) {
            if (Schema::hasColumn('institutes', 'university_id')) {
                $table->dropConstrainedForeignId('university_id');
            }
        });
    }
};


