<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('institutes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // university, community_college, technical_institute, liberal_arts
            $table->string('status')->default('pending'); // verified, pending, suspended, rejected
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->text('description')->nullable();
            $table->string('established')->nullable();
            $table->string('accreditation')->nullable();
            $table->integer('students')->default(0);
            $table->integer('scholarships_count')->default(0);
            $table->decimal('rating', 3, 1)->default(0);
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutes');
    }
};