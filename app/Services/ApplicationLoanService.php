<?php

namespace App\Services;

use App\Jobs\SendNotification;
use App\Models\ApplicationLoan;
use Illuminate\Support\Facades\Log;

class ApplicationLoanService
{
    public function list(array $filters = [])
    {
        $query = ApplicationLoan::query();

        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('first_name', 'like', "%{$searchTerm}%")
                    ->orWhere('last_name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        if (!empty($filters['employment_type'])) {
            $query->where('employment_type', $filters['employment_type']);
        }

        if (!empty($filters['risk_level'])) {
            if ($filters['risk_level'] === 'high') {
                $query->where('is_high_risk', true);
            } elseif ($filters['risk_level'] === 'low') {
                $query->where('is_high_risk', false);
            }
        }

        return $query->orderBy('created_at', 'desc')->paginate($filters['per_page'] ?? 10);
    }
    public function create(array $data): ApplicationLoan
    {
        if (($data['amount'] / $data['monthly_income']) >= 2) {
            // Log a warning if the loan amount is unusually high
            $data['is_high_risk'] = true;
            $data['risk_reason'] = 'Loan amount is more than 2 times monthly income';
        } else if ($data['employment_type'] === 'self_employed') {
            // Log a warning if the applicant is unemployed
            $data['is_high_risk'] = true;
            $data['risk_reason'] = 'Applicant is self-employed, which may indicate unstable income';
        }

        $applicationLoan = ApplicationLoan::create($data);

        if (isset($data['is_high_risk']) && $data['is_high_risk']) {
            Log::warning("High risk application detected: ID {$applicationLoan->id}, Reason: {$data['risk_reason']}");
            SendNotification::dispatch($applicationLoan->id);
        }

        return $applicationLoan;
    }
}
