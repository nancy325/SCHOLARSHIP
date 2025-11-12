<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
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
    ];

    protected $casts = [
        'deadline' => 'date',
        'start_date' => 'date',
    ];

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

}