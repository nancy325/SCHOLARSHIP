<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'institute_id',
        'type',
        'status',
        'amount',
        'currency',
        'deadline',
        'max_applications',
        'field',
        'level',
        'description',
        'requirements',
        'eligibility',
        'documents',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'deadline' => 'date',
    ];

    // Relationships
    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    // Accessor for applications count
    public function getApplicationsCountAttribute()
    {
        return $this->applications()->count();
    }
}