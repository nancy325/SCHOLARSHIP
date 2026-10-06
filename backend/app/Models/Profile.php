<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Student details used for eligibility matching (education level lives on users.category).
 */
class Profile extends Model
{
    protected $fillable = [
        'user_id', 'dob', 'gender', 'social_category', 'state', 'phone', 'disability',
        'parent_occupation', 'annual_family_income', 'course', 'current_year', 'study_mode',
        'institution', 'previous_percentage', 'cgpa', 'has_other_scholarship', 'career_goal',
    ];

    protected $casts = [
        'dob' => 'date',
        'annual_family_income' => 'integer',
        'previous_percentage' => 'float',
        'cgpa' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
