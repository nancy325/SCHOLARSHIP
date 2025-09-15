<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('institutes', function (Blueprint $table) {
            if (!Schema::hasColumn('institutes', 'created_by')) {
                $table->foreignId('created_by')->nullable()->after('rating')->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('institutes', function (Blueprint $table) {
            if (Schema::hasColumn('institutes', 'created_by')) {
                $table->dropConstrainedForeignId('created_by');
            }
        });
    }
};



