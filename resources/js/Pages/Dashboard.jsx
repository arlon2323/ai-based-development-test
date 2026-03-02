import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Chip,
    CircularProgress,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    MenuItem,
} from "@mui/material";

export default function LoanApplicationsIndex(props) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState(""); // 🔎 search state
    const [employmentType, setEmploymentType] = useState(""); // 🔎 search state
    const [riskLevel, setRiskLevel] = useState(""); // 🔎 search state

    const fetchApplications = async (
        pageNumber = 1,
        searchValue = search,
        employmentTypeValue = employmentType,
        riskLevelValue = riskLevel
    ) => {
        setLoading(true);

        try {
            const response = await fetch(
                `/application-loans?page=${pageNumber}&per_page=${rowsPerPage}&search=${encodeURIComponent(
                    searchValue
                )}&employment_type=${encodeURIComponent(employmentTypeValue)}&risk_level=${encodeURIComponent(riskLevelValue)}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const data = await response.json();

            setApplications(data.data);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    // ✅ First request already includes search
    useEffect(() => {
        fetchApplications(page + 1, search, employmentType, riskLevel);
    }, [page, rowsPerPage, search, employmentType, riskLevel]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0); // reset page when searching
    };

    const handleEmploymentTypeChange = (event) => {
        setEmploymentType(event.target.value);
        setPage(0); // reset page when filtering
    };

    const handleRiskLevelChange = (event) => {
        setRiskLevel(event.target.value);
        setPage(0); // reset page when filtering
    };

    return (
        <AuthenticatedLayout user={props.auth.user}>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Loan Applications
                        </Typography>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                            {/* 🔎 Search Field */}
                            <TextField
                                fullWidth
                                label="Search by name or email"
                                variant="outlined"
                                value={search}
                                onChange={handleSearchChange}
                                // sx={{ mb: 3 }}
                            />
                            <TextField
                                fullWidth
                                // margin="normal"
                                select
                                label="Employment Type"
                                name="employmentType"
                                value={employmentType}
                                onChange={handleEmploymentTypeChange}
                            >
                                <MenuItem value="salaried">Salaried</MenuItem>
                                <MenuItem value="self_employed">Self-employed</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                // margin="normal"
                                select
                                label="Risk Level"
                                name="riskLevel"
                                value={riskLevel}
                                onChange={handleRiskLevelChange}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="low">Normal</MenuItem>
                                <MenuItem value="high">High Risk</MenuItem>
                            </TextField>
                        </div>
                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    p: 4,
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Loan Amount</TableCell>
                                                <TableCell>Income</TableCell>
                                                <TableCell>Employment</TableCell>
                                                <TableCell>Risk</TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {applications.map((app) => (
                                                <TableRow key={app.id}>
                                                    <TableCell>
                                                        {app.first_name} {app.last_name}
                                                    </TableCell>
                                                    <TableCell>{app.email}</TableCell>
                                                    <TableCell>
                                                        ${Number(app.amount).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        ${Number(app.monthly_income).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {app.employment_type === "self_employed"
                                                            ? "Self-employed"
                                                            : "Salaried"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {app.is_high_risk ? (
                                                            <Chip
                                                                label="High Risk"
                                                                color="error"
                                                                size="small"
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label="Normal"
                                                                color="success"
                                                                size="small"
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(app.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TablePagination
                                    component="div"
                                    count={total}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[1, 5, 10, 25, 50]}
                                />
                            </>
                        )}
                    </Box>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}