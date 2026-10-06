<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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

        // Add user_id column to profiles if it doesn't exist, then add foreign key
        if (Schema::hasTable('profiles')) {
            Schema::table('profiles', function (Blueprint $table) {
                if (!Schema::hasColumn('profiles', 'user_id')) {
                    $table->unsignedBigInteger('user_id')->nullable()->first();
                }
            });

            if (!$this->constraintExists('profiles', 'profiles_user_id_foreign')) {
                Schema::table('profiles', function (Blueprint $table) {
                    $table->foreign('user_id')
                        ->references('id')
                        ->on('users')
                        ->onDelete('cascade')
                        ->onUpdate('cascade');
                });
            }
        }

        // Add user_id column to sessions if it doesn't exist, then add foreign key
        if (Schema::hasTable('sessions')) {
            Schema::table('sessions', function (Blueprint $table) {
                if (!Schema::hasColumn('sessions', 'user_id')) {
                    $table->unsignedBigInteger('user_id')->nullable()->after('id');
                }
            });

            if (!$this->constraintExists('sessions', 'sessions_user_id_foreign')) {
                Schema::table('sessions', function (Blueprint $table) {
                    $table->foreign('user_id')
                        ->references('id')
                        ->on('users')
                        ->onDelete('set null')
                        ->onUpdate('cascade');
                });
            }
        }

        // Add user_id to feedback table if it exists and add foreign key
        if (Schema::hasTable('feedback')) {
            Schema::table('feedback', function (Blueprint $table) {
                if (!Schema::hasColumn('feedback', 'user_id')) {
                    $table->unsignedBigInteger('user_id')->nullable()->after('id');
                }
            });

            if (!$this->constraintExists('feedback', 'feedback_user_id_foreign')) {
                Schema::table('feedback', function (Blueprint $table) {
                    $table->foreign('user_id')
                        ->references('id')
                        ->on('users')
                        ->onDelete('set null')
                        ->onUpdate('cascade');
                });
            }
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

        // Drop foreign keys
        if (Schema::hasTable('feedback')) {
            Schema::table('feedback', function (Blueprint $table) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // Foreign key might not exist
                }
            });

            Schema::table('feedback', function (Blueprint $table) {
                if (Schema::hasColumn('feedback', 'user_id')) {
                    $table->dropColumn('user_id');
                }
            });
        }

        if (Schema::hasTable('sessions')) {
            Schema::table('sessions', function (Blueprint $table) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // Foreign key might not exist
                }
            });
        }

        if (Schema::hasTable('profiles')) {
            Schema::table('profiles', function (Blueprint $table) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // Foreign key might not exist
                }
            });
        }
    }

    /**
     * Check if a foreign key constraint exists
     */
    private function constraintExists($table, $constraint)
    {
        $result = DB::select(
            "SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_NAME = ?
              AND CONSTRAINT_NAME = ?
              AND TABLE_SCHEMA = ?",
            [$table, $constraint, DB::getDatabaseName()]
        );

        return count($result) > 0;
    }
};

