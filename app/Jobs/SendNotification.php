<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendNotification implements ShouldQueue
{
    use Queueable;

    private $applicationId;

    /**
     * Create a new job instance.
     */
    public function __construct($applicationId)
    {
        $this->applicationId = $applicationId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $users = User::all();
        Log::info("Dispatching high risk notification for application ID: {$this->applicationId} to " . $users->count() . " users.");
        foreach ($users as $user) {
            Mail::to($user->email)->send(new \App\Mail\HighRiskNotification($this->applicationId));
        }
    }
}
