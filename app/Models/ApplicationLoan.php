<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationLoan extends Model
{
    /** @use HasFactory<\Database\Factories\ApplicationLoanFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'amount',
        'employment_type',
        'monthly_income',
        'is_high_risk',
        'risk_reason',
        'consent_to_be_contacted',
    ];
}
