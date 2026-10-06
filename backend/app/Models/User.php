<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** ..use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * ..var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'category',
        'role',
        'institute_id',
        'university_id',
        'RecStatus',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * ..var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * ..return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function applications()
    {
        return $this->hasMany(ScholarshipApplication::class);
    }

    public const ADMIN_ROLES = ['super_admin', 'admin', 'university_admin', 'institute_admin'];

    public function isAdmin(): bool
    {
        return in_array($this->role, self::ADMIN_ROLES, true);
    }

    /** super_admin / admin: full platform access */
    public function isPlatformAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin'], true);
    }

    public function roleLabel(): string
    {
        return ucwords(str_replace('_', ' ', $this->role ?? 'student'));
    }
}
