<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('application_loans', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone_number');
            $table->decimal('amount', 15, 2);
            $table->string('employment_type');
            $table->decimal('monthly_income', 15, 2);
            $table->boolean('consent_to_be_contacted')->default(false);
            $table->boolean('is_high_risk')->default(false);
            $table->string('risk_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_loans');
    }
};
