<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'provider',
        'type',
        'university_id',
        'institute_id',
        'deadline',
        'description',
        'eligibility',
        'start_date',
        'apply_link',
        'created_by',
        'RecStatus',
        'award_amount',
        'award_frequency',
        'benefits',
        'education_levels',
        'max_family_income',
        'min_percentage',
        'gender',
        'social_categories',
        'state',
        'own_students_only',
        'documents_required',
    ];

    protected $casts = [
        'deadline' => 'date',
        'start_date' => 'date',
        'award_amount' => 'integer',
        'max_family_income' => 'integer',
        'min_percentage' => 'float',
        'own_students_only' => 'boolean',
        'education_levels' => \App\Casts\CommaList::class,
        'social_categories' => \App\Casts\CommaList::class,
    ];

    /** "₹12,000 per year" or null */
    public function awardLabel(): ?string
    {
        if (!$this->award_amount) {
            return null;
        }
        $freq = \App\Support\Options::AWARD_FREQUENCIES[$this->award_frequency] ?? null;

        return \App\Support\Options::rupees($this->award_amount) . ($freq ? ' ' . $freq : '');
    }

    public function educationLevelLabels(): array
    {
        return array_map(fn ($l) => \App\Support\Options::EDUCATION_LEVELS[$l] ?? $l, $this->education_levels);
    }

    // Relationships
    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function applications()
    {
        return $this->hasMany(ScholarshipApplication::class);
    }

    public function isOpen(): bool
    {
        $today = now()->startOfDay();
        $started = !$this->start_date || $this->start_date->lte($today);
        return $this->RecStatus === 'active' && $started && $this->deadline && $this->deadline->gte($today);
    }

    public function daysLeft(): ?int
    {
        if (!$this->deadline) {
            return null;
        }
        return (int) now()->startOfDay()->diffInDays($this->deadline, false);
    }

    public function providerName(): string
    {
        return $this->provider ?: ($this->institute->name ?? $this->university->name ?? ucfirst($this->type) . ' scheme');
    }

}