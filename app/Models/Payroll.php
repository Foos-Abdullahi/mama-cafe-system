<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'waitress_id',
        'period_start',
        'period_end',
        'total_orders',
        'total_sales',
        'commission_rate',
        'commission_amount',
        'status',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'paid_at' => 'datetime',
        'total_sales' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
    ];

    public function waitress(): BelongsTo
    {
        return $this->belongsTo(Waitress::class);
    }
}
