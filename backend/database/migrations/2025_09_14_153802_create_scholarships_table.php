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
        Schema::create('scholarships', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('institute_id')->constrained()->onDelete('cascade');
            $table->string('type'); // merit_based, need_based, project_based, athletic
            $table->string('status')->default('active'); // active, pending, expired, suspended
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->date('deadline');
            $table->integer('max_applications')->default(100);
            $table->string('field'); // Engineering, Computer Science, etc.
            $table->string('level'); // undergraduate, graduate, phd
            $table->text('description');
            $table->text('requirements');
            $table->text('eligibility');
            $table->text('documents');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarships');
    }
};