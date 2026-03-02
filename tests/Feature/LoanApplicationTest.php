<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use App\Jobs\SendNotification;
use PHPUnit\Framework\Attributes\Test;

class LoanApplicationTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_submit_a_loan_application()
    {
        $response = $this->post('/application-loans', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@test.com',
            'phone_number' => '123456789',
            'amount' => 10000,
            'employment_type' => 'salaried',
            'monthly_income' => 50000,
            'consent' => true,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('application_loans', [
            'email' => 'john@test.com',
        ]);
    }

    #[Test]
    public function validation_errors_are_returned_when_fields_missing()
    {
        $response = $this->post('/application-loans', []);

        $response->assertSessionHasErrors([
            'first_name',
            'email',
            'amount',
        ]);
    }

    #[Test]
    public function high_risk_application_is_flagged()
    {
        $this->post('/application-loans', [
            'first_name' => 'Risk',
            'last_name' => 'User',
            'email' => 'risk@test.com',
            'phone_number' => '999999',
            'amount' => 60000,
            'employment_type' => 'salaried',
            'monthly_income' => 20000,
            'consent' => true,
        ]);

        $this->assertDatabaseHas('application_loans', [
            'email' => 'risk@test.com',
            'is_high_risk' => true,
        ]);
    }

    #[Test]
    public function high_risk_application_dispatches_notification_job()
    {
        Bus::fake();

        $this->post('/application-loans', [
            'first_name' => 'High',
            'last_name' => 'Risk',
            'email' => 'risk@test.com',
            'phone_number' => '999999',
            'amount' => 70000,
            'employment_type' => 'self_employed',
            'monthly_income' => 15000,
            'consent' => true,
        ]);

        Bus::assertDispatched(SendNotification::class);
    }

    #[Test]
    public function normal_application_does_not_dispatch_notification_job()
    {
        Bus::fake();

        $this->post('/application-loans', [
            'first_name' => 'Safe',
            'last_name' => 'User',
            'email' => 'safe@test.com',
            'phone_number' => '111111',
            'amount' => 10000,
            'employment_type' => 'salaried',
            'monthly_income' => 60000,
            'consent' => true,
        ]);

        Bus::assertNotDispatched(SendNotification::class);
    }
}