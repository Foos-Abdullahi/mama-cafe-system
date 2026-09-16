<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'item',
        'category',
        'amount',
        'purchased_at',
        'vendor',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'purchased_at' => 'date',
    ];
}
