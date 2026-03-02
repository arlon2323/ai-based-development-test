<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationLoanRequest;
use App\Http\Requests\UpdateApplicationLoanRequest;
use App\Models\ApplicationLoan;
use App\Services\ApplicationLoanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;

class ApplicationLoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $applicationLoanService = new ApplicationLoanService();
        $applicationLoan = $applicationLoanService->list($request->all());

        return response()->json($applicationLoan);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ApplicationLoanForm');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApplicationLoanRequest $request)
    {
        $data = $request->validated();

        // Create the application loan using the service
        $applicationLoanService = new ApplicationLoanService();
        $applicationLoan = $applicationLoanService->create($data);

        return response()->json($applicationLoan, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ApplicationLoan $applicationLoan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ApplicationLoan $applicationLoan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicationLoanRequest $request, ApplicationLoan $applicationLoan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ApplicationLoan $applicationLoan)
    {
        //
    }
}
