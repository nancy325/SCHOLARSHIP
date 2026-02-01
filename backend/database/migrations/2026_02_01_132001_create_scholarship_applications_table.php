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
        Schema::create('scholarship_applications', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('scholarship_id');
            
            // Application details
            $table->enum('application_status', ['pending', 'approved', 'rejected', 'withdrawn'])
                ->default('pending');
            $table->timestamp('application_date')->useCurrent();
            $table->timestamp('status_updated_at')->nullable();
            $table->text('notes')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Unique constraint to prevent duplicate applications
            $table->unique(['user_id', 'scholarship_id'], 'unique_user_scholarship');
            
            // Indexes
            $table->index('application_status', 'idx_application_status');
            
            // Foreign key constraints
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            
            $table->foreign('scholarship_id')
                ->references('id')
                ->on('scholarships')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarship_applications');
    }
};
