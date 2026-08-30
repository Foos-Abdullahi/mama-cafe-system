<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyClosing extends Model
{
    use HasFactory;

    protected $fillable = [
        'closing_date',
        'total_orders',
        'total_sales',
        'cash_expected',
        'cash_actual',
        'mobile_money_total',
        'card_total',
        'credit_total',
        'variance',
        'notes',
        'closed_by_user_id',
    ];

    protected $casts = [
        'closing_date' => 'date',
        'total_sales' => 'decimal:2',
        'cash_expected' => 'decimal:2',
        'cash_actual' => 'decimal:2',
        'mobile_money_total' => 'decimal:2',
        'card_total' => 'decimal:2',
        'credit_total' => 'decimal:2',
        'variance' => 'decimal:2',
    ];

    public function closedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by_user_id');
    }
}
