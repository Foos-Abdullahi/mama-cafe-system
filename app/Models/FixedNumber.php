<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FixedNumber extends Model
{
    use HasFactory;

    protected $fillable = [
        'waitress_id',
        'range_start',
        'range_end',
        'current_number',
        'status',
        'assigned_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
    ];

    public function waitress(): BelongsTo
    {
        return $this->belongsTo(Waitress::class);
    }
}
