<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    public const TYPES = ['general', 'issue', 'suggestion'];

    protected $table = 'feedback';

    protected $fillable = ['user_id', 'name', 'email', 'feedback_type', 'message'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
