<?php

namespace App\Services;

use App\Models\Scholarship;
use App\Models\User;
use App\Support\Options;
use Illuminate\Database\Eloquent\Builder;

/**
 * Decides which scholarships a student is eligible for.
 *
 * Rules on a scholarship are optional — an empty rule means "open to everyone".
 * Hard rules: education level, family income, gender, domicile state, social category,
 * minimum percentage and (for university/institute schemes) being their own student.
 * If the student has not filled in a detail yet, that rule is treated as "not known"
 * rather than a failure, and the student is asked to complete their profile.
 */
class EligibilityService
{
    public function __construct(private ProfileService $profiles)
    {
    }

    /** Student's matching facts in one place */
    public function facts(User $user): array
    {
        $p = $this->profiles->model($user);

        return [
            'level' => $user->category ?: null,
            'income' => $p->annual_family_income,
            'gender' => $p->gender,
            'state' => $p->state,
            'social' => $p->social_category,
            'percentage' => $p->previous_percentage,
            'university_id' => $user->university_id ?: $user->institute?->university_id,
            'institute_id' => $user->institute_id,
        ];
    }

    /** Which key details are still missing for matching */
    public function missingFacts(User $user): array
    {
        $f = $this->facts($user);
        $labels = [
            'level' => 'education level',
            'income' => 'annual family income',
            'gender' => 'gender',
            'state' => 'state',
            'social' => 'social category',
            'percentage' => 'previous exam percentage',
        ];

        return collect($labels)->filter(fn ($l, $k) => $f[$k] === null || $f[$k] === '')->values()->all();
    }

    /** Restrict a scholarship query to the ones this student is eligible for */
    public function applyScope(Builder $query, User $user): Builder
    {
        $f = $this->facts($user);

        // Education level
        if ($f['level']) {
            $query->where(fn ($q) => $q->whereNull('education_levels')->orWhere('education_levels', 'like', '%,' . $f['level'] . ',%'));
        }
        // Family income
        if ($f['income'] !== null) {
            $query->where(fn ($q) => $q->whereNull('max_family_income')->orWhere('max_family_income', '>=', $f['income']));
        }
        // Gender
        if ($f['gender']) {
            $query->where(fn ($q) => $q->whereNull('gender')->orWhere('gender', 'any')->orWhere('gender', $f['gender']));
        }
        // Domicile state
        if ($f['state']) {
            $query->where(fn ($q) => $q->whereNull('state')->orWhere('state', $f['state']));
        }
        // Social category
        if ($f['social']) {
            $query->where(fn ($q) => $q->whereNull('social_categories')->orWhere('social_categories', 'like', '%,' . $f['social'] . ',%'));
        }
        // Minimum percentage
        if ($f['percentage'] !== null) {
            $query->where(fn ($q) => $q->whereNull('min_percentage')->orWhere('min_percentage', '<=', $f['percentage']));
        }
        // Own students only
        $query->where(function ($q) use ($f) {
            $q->where('own_students_only', false)
                ->orWhere(fn ($u) => $u->where('type', 'university')->where('university_id', $f['university_id'] ?? 0))
                ->orWhere(fn ($i) => $i->where('type', 'institute')->where('institute_id', $f['institute_id'] ?? 0))
                ->orWhere(fn ($o) => $o->whereNotIn('type', ['university', 'institute']));
        });

        return $query;
    }

    /**
     * Rule-by-rule check for the detail page.
     * Returns ['eligible' => bool, 'checks' => [[label, status(pass|fail|unknown), detail], ...]]
     */
    public function check(Scholarship $s, User $user): array
    {
        $f = $this->facts($user);
        $checks = [];

        if ($s->education_levels) {
            $checks[] = $this->rule(
                'Education level',
                $f['level'] ? in_array($f['level'], $s->education_levels, true) : null,
                'For ' . implode(', ', $s->educationLevelLabels()),
                $f['level'] ? 'You: ' . (Options::EDUCATION_LEVELS[$f['level']] ?? $f['level']) : 'Add your education level'
            );
        }
        if ($s->max_family_income !== null) {
            $checks[] = $this->rule(
                'Family income',
                $f['income'] !== null ? $f['income'] <= $s->max_family_income : null,
                'Up to ' . Options::rupees($s->max_family_income) . ' per year',
                $f['income'] !== null ? 'You: ' . Options::rupees($f['income']) : 'Add your family income'
            );
        }
        if ($s->gender && $s->gender !== 'any') {
            $checks[] = $this->rule(
                'Gender',
                $f['gender'] ? $f['gender'] === $s->gender : null,
                (Options::GENDERS[$s->gender] ?? $s->gender) . ' students only',
                $f['gender'] ? 'You: ' . (Options::GENDERS[$f['gender']] ?? $f['gender']) : 'Add your gender'
            );
        }
        if ($s->state) {
            $checks[] = $this->rule(
                'Domicile',
                $f['state'] ? $f['state'] === $s->state : null,
                'Residents of ' . $s->state,
                $f['state'] ? 'You: ' . $f['state'] : 'Add your state'
            );
        }
        if ($s->social_categories) {
            $labels = array_map(fn ($c) => Options::SOCIAL_CATEGORIES[$c] ?? $c, $s->social_categories);
            $checks[] = $this->rule(
                'Category',
                $f['social'] ? in_array($f['social'], $s->social_categories, true) : null,
                implode(', ', $labels) . ' students',
                $f['social'] ? 'You: ' . (Options::SOCIAL_CATEGORIES[$f['social']] ?? $f['social']) : 'Add your social category'
            );
        }
        if ($s->min_percentage !== null) {
            $checks[] = $this->rule(
                'Marks',
                $f['percentage'] !== null ? $f['percentage'] >= $s->min_percentage : null,
                'At least ' . rtrim(rtrim(number_format($s->min_percentage, 2), '0'), '.') . '% in previous exam',
                $f['percentage'] !== null ? 'You: ' . rtrim(rtrim(number_format($f['percentage'], 2), '0'), '.') . '%' : 'Add your percentage'
            );
        }
        if ($s->own_students_only && in_array($s->type, ['university', 'institute'], true)) {
            $ok = $s->type === 'university'
                ? $f['university_id'] && (int) $f['university_id'] === (int) $s->university_id
                : $f['institute_id'] && (int) $f['institute_id'] === (int) $s->institute_id;
            $checks[] = $this->rule(
                $s->type === 'university' ? 'University' : 'Institute',
                ($f['university_id'] || $f['institute_id']) ? $ok : null,
                'Only for students of ' . ($s->type === 'university' ? $s->university?->name : $s->institute?->name),
                ($f['university_id'] || $f['institute_id']) ? ($ok ? 'You study here' : 'You study elsewhere') : 'Add your university / institute'
            );
        }

        $failed = collect($checks)->contains(fn ($c) => $c['status'] === 'fail');
        $unknown = collect($checks)->contains(fn ($c) => $c['status'] === 'unknown');

        return [
            'eligible' => !$failed,
            'complete' => !$unknown,
            'checks' => $checks,
        ];
    }

    private function rule(string $label, ?bool $ok, string $requirement, string $you): array
    {
        return [
            'label' => $label,
            'status' => $ok === null ? 'unknown' : ($ok ? 'pass' : 'fail'),
            'requirement' => $requirement,
            'you' => $you,
        ];
    }
}
