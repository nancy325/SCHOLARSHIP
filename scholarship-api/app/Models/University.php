<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class University extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'status',
        'email',
        'phone',
        'website',
        'address',
        'description',
        'established',
        'accreditation',
        'students',
        'rating',
    ];

    public function institutes()
    {
        return $this->hasMany(Institute::class);
    }
}


