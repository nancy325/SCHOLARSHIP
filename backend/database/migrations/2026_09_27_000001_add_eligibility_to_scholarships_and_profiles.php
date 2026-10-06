<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Eligibility-based matching:
 *  - scholarships get award details and eligibility rules (education level, family income, ...)
 *  - profiles become a real table holding each student's details (was JSON files in storage/)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            $add = fn (string $col) => !Schema::hasColumn('scholarships', $col);

            if ($add('provider')) {
                $table->string('provider')->nullable()->after('title');            // e.g. "Ministry of Education, Govt. of India"
            }
            if ($add('award_amount')) {
                $table->unsignedInteger('award_amount')->nullable()->after('eligibility'); // rupees
            }
            if ($add('award_frequency')) {
                $table->string('award_frequency', 20)->nullable()->after('award_amount'); // one_time | per_year | per_month
            }
            if ($add('benefits')) {
                $table->text('benefits')->nullable()->after('award_frequency');
            }
            if ($add('education_levels')) {
                // comma-wrapped list, e.g. ",undergraduate,postgraduate,"  (NULL = any level)
                $table->string('education_levels')->nullable()->after('benefits');
            }
            if ($add('max_family_income')) {
                $table->unsignedInteger('max_family_income')->nullable()->after('education_levels'); // rupees per year, NULL = no limit
            }
            if ($add('min_percentage')) {
                $table->decimal('min_percentage', 5, 2)->nullable()->after('max_family_income');
            }
            if ($add('gender')) {
                $table->string('gender', 10)->default('any')->after('min_percentage'); // any | female | male
            }
            if ($add('social_categories')) {
                $table->string('social_categories')->nullable()->after('gender'); // ",sc,st," (NULL = all)
            }
            if ($add('state')) {
                $table->string('state', 100)->nullable()->after('social_categories'); // domicile state, NULL = all India
            }
            if ($add('own_students_only')) {
                $table->boolean('own_students_only')->default(false)->after('state');
            }
            if ($add('documents_required')) {
                $table->text('documents_required')->nullable()->after('own_students_only');
            }
        });

        // University / institute scholarships are for their own students by default
        DB::table('scholarships')->whereIn('type', ['university', 'institute'])->update(['own_students_only' => true]);

        Schema::table('profiles', function (Blueprint $table) {
            $add = fn (string $col) => !Schema::hasColumn('profiles', $col);

            if ($add('user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
            foreach ([
                'dob' => fn () => $table->date('dob')->nullable(),
                'gender' => fn () => $table->string('gender', 20)->nullable(),
                'social_category' => fn () => $table->string('social_category', 20)->nullable(),
                'state' => fn () => $table->string('state', 100)->nullable(),
                'phone' => fn () => $table->string('phone', 20)->nullable(),
                'disability' => fn () => $table->string('disability', 10)->nullable(),
                'parent_occupation' => fn () => $table->string('parent_occupation')->nullable(),
                'annual_family_income' => fn () => $table->unsignedInteger('annual_family_income')->nullable(),
                'course' => fn () => $table->string('course')->nullable(),
                'current_year' => fn () => $table->string('current_year', 10)->nullable(),
                'study_mode' => fn () => $table->string('study_mode', 20)->nullable(),
                'institution' => fn () => $table->string('institution')->nullable(),
                'previous_percentage' => fn () => $table->decimal('previous_percentage', 5, 2)->nullable(),
                'cgpa' => fn () => $table->decimal('cgpa', 4, 2)->nullable(),
                'has_other_scholarship' => fn () => $table->string('has_other_scholarship', 10)->nullable(),
                'career_goal' => fn () => $table->string('career_goal')->nullable(),
            ] as $col => $define) {
                if ($add($col)) {
                    $define();
                }
            }
        });

        if (!$this->hasUniqueUserIndex()) {
            // keep only the newest profile row per user before adding the unique index
            $dupes = DB::table('profiles')->select('user_id')->whereNotNull('user_id')
                ->groupBy('user_id')->havingRaw('count(*) > 1')->pluck('user_id');
            foreach ($dupes as $userId) {
                $keep = DB::table('profiles')->where('user_id', $userId)->max('id');
                DB::table('profiles')->where('user_id', $userId)->where('id', '!=', $keep)->delete();
            }
            Schema::table('profiles', fn (Blueprint $t) => $t->unique('user_id', 'profiles_user_id_unique'));
        }

        // Education levels: "graduate" was used for postgraduate students
        DB::table('users')->where('category', 'graduate')->update(['category' => 'postgraduate']);
    }

    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            foreach (['provider', 'award_amount', 'award_frequency', 'benefits', 'education_levels', 'max_family_income',
                'min_percentage', 'gender', 'social_categories', 'state', 'own_students_only', 'documents_required'] as $col) {
                if (Schema::hasColumn('scholarships', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        if ($this->hasUniqueUserIndex()) {
            Schema::table('profiles', fn (Blueprint $t) => $t->dropUnique('profiles_user_id_unique'));
        }
        Schema::table('profiles', function (Blueprint $table) {
            foreach (['dob', 'gender', 'social_category', 'state', 'phone', 'disability', 'parent_occupation', 'annual_family_income',
                'course', 'current_year', 'study_mode', 'institution', 'previous_percentage', 'cgpa', 'has_other_scholarship', 'career_goal'] as $col) {
                if (Schema::hasColumn('profiles', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }

    private function hasUniqueUserIndex(): bool
    {
        return collect(Schema::getIndexes('profiles'))->contains(fn ($i) => $i['name'] === 'profiles_user_id_unique');
    }
};
