import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
    Paper,
} from "@mui/material";

const LoanApplicationPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        loanAmount: "",
        employmentType: "",
        monthlyIncome: "",
        consent: false,
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let tempErrors = {};

        if (!formData.firstName) tempErrors.firstName = "First name is required";
        if (!formData.lastName) tempErrors.lastName = "Last name is required";

        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Invalid email format";
        }

        if (!formData.phone) tempErrors.phone = "Phone number is required";

        if (!formData.loanAmount) {
            tempErrors.loanAmount = "Loan amount is required";
        } else if (formData.loanAmount <= 0) {
            tempErrors.loanAmount = "Loan amount must be greater than 0";
        }

        if (!formData.employmentType)
            tempErrors.employmentType = "Employment type is required";

        if (!formData.monthlyIncome) {
            tempErrors.monthlyIncome = "Monthly income is required";
        } else if (formData.monthlyIncome < 0) {
            tempErrors.monthlyIncome = "Monthly income cannot be negative";
        }

        if (!formData.consent)
            tempErrors.consent = "You must consent to be contacted";

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);

        if (!validate()) return;

        setLoading(true);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            const form = new FormData();
            form.append("first_name", formData.firstName);
            form.append("last_name", formData.lastName);
            form.append("email", formData.email);
            form.append("phone_number", formData.phone);
            form.append("amount", formData.loanAmount);
            form.append("employment_type", formData.employmentType);
            form.append("monthly_income", formData.monthlyIncome);
            form.append("consent", formData.consent ? 1 : 0);

            const response = await fetch("/application-loans", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setLoading(false);
                console.error(errorData);
                return;
            }

            setSuccess(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                loanAmount: "",
                employmentType: "",
                monthlyIncome: "",
                consent: false,
            });
        } catch (error) {
            console.error("Submission error:", error);
            setLoading(false);
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 6 }}>
                <Typography variant="h4" gutterBottom>
                    Personal Loan Application
                </Typography>

                {success === true && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Your application has been submitted successfully. Our team will
                        contact you soon.
                    </Alert>
                )}
                {success === false && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        There was an error submitting your application. Please try again.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Loan Amount"
                        name="loanAmount"
                        type="number"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        error={!!errors.loanAmount}
                        helperText={errors.loanAmount}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        select
                        label="Employment Type"
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        error={!!errors.employmentType}
                        helperText={errors.employmentType}
                    >
                        <MenuItem value="salaried">Salaried</MenuItem>
                        <MenuItem value="self_employed">Self-employed</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Monthly Income"
                        name="monthlyIncome"
                        type="number"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                        error={!!errors.monthlyIncome}
                        helperText={errors.monthlyIncome}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                            />
                        }
                        label="I agree to be contacted regarding my loan application."
                    />
                    {errors.consent && (
                        <Typography color="error" variant="body2">
                            {errors.consent}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoanApplicationPage;