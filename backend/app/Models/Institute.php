<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'university_id',
        'type',
        'status',
        'email',
        'phone',
        'website',
        'address',
        'description',
        'established',
        'accreditation',
        'students',
        'scholarships_count',
        'rating',
        'contact_person',
        'contact_phone',
    ];

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    protected $casts = [
        'rating' => 'decimal:1',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function scholarships()
    {
        return $this->hasMany(Scholarship::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}