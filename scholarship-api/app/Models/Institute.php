<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
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
}