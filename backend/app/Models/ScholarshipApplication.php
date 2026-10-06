<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScholarshipApplication extends Model
{
    public const STATUSES = ['pending', 'approved', 'rejected', 'withdrawn'];

    protected $fillable = [
        'user_id',
        'scholarship_id',
        'application_status',
        'application_date',
        'status_updated_at',
        'notes',
        'admin_remarks',
        'reviewed_by',
    ];

    protected $casts = [
        'application_date' => 'datetime',
        'status_updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scholarship()
    {
        return $this->belongsTo(Scholarship::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isPending(): bool
    {
        return $this->application_status === 'pending';
    }
}
