<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>High Risk Loan Application</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:30px 0;">
        <tr>
            <td>

                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#d32f2f; color:#ffffff; padding:20px; text-align:center;">
                            <h2 style="margin:0;">⚠ High Risk Loan Application</h2>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:25px; color:#333333;">

                            <p style="font-size:16px;">
                                A new <strong>high-risk loan application</strong> has been submitted.
                            </p>

                            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; margin-top:15px;">

                                <tr style="background:#f2f2f2;">
                                    <td><strong>Applicant Name</strong></td>
                                    <td>{{ $application->first_name }} {{ $application->last_name }}</td>
                                </tr>

                                <tr>
                                    <td><strong>Email</strong></td>
                                    <td>{{ $application->email }}</td>
                                </tr>

                                <tr style="background:#f2f2f2;">
                                    <td><strong>Phone</strong></td>
                                    <td>{{ $application->phone }}</td>
                                </tr>

                                <tr>
                                    <td><strong>Loan Amount</strong></td>
                                    <td>${{ number_format($application->amount, 2) }}</td>
                                </tr>

                                <tr style="background:#f2f2f2;">
                                    <td><strong>Monthly Income</strong></td>
                                    <td>${{ number_format($application->monthly_income, 2) }}</td>
                                </tr>

                                <tr>
                                    <td><strong>Employment Type</strong></td>
                                    <td>
                                        {{ $application->employment_type === 'self_employed'
                                        ? 'Self-employed'
                                        : 'Salaried' }}
                                    </td>
                                </tr>

                                <tr style="background:#fdecea;">
                                    <td><strong>Risk Status</strong></td>
                                    <td style="color:#d32f2f; font-weight:bold;">
                                        HIGH RISK
                                    </td>
                                </tr>

                                @if(!empty($application->risk_reason))
                                <tr>
                                    <td><strong>Risk Reason</strong></td>
                                    <td>{{ $application->risk_reason }}</td>
                                </tr>
                                @endif

                                <tr style="background:#f2f2f2;">
                                    <td><strong>Submitted At</strong></td>
                                    <td>{{ $application->created_at->format('Y-m-d H:i') }}</td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#fafafa; padding:15px; text-align:center; font-size:12px; color:#777;">
                            This is an automated notification from the Loan System.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
