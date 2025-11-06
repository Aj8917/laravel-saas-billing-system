import React, { useEffect, useState } from 'react';
import asyncHandler from '../../../util/asyncHandler';
import axiosAuth from '../../../api/axiosAuth';
import messageHandler from '../../../util/messageHandler';
import { Row, Col, Card, Spinner } from 'react-bootstrap';

const Account = () => {
    const [company, setCompany] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        asyncHandler(async () => {
            try {
                const response = await axiosAuth.get('/company-details');
                if (response?.data?.details) {
                    setCompany(response.data.details);
                }
            } catch (error) {
                console.log(`Error fetching company details: ${error.message}`);
            }
        })();
    }, []);

    const handleSubmit = asyncHandler(async (e) => {
        e.preventDefault();
        let valid = true;
        const newErrors = {};

        if (!name) {
            newErrors.name = "Name is required";
            valid = false;
        }

        if (!email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
            valid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            setLoading(true);
            try {
                const response = await axiosAuth.post('/sub-vendors', { name, email, password,confirmPassword });
                if (response?.data?.success) {
                    messageHandler(response.data.success, "success");
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setErrors({});
                }
            } catch (error) {
                if (error.response?.status === 422) {
                    setErrors(error.response?.data?.errors || {});
                } else {
                    messageHandler(error.response?.data?.message || "Something went wrong", "error");
                }
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <section className="py-1">
            <div className="container">
                <section className="dash-form-wrapper">
                    <div className="form-box">
                        <h2 className="text-center mb-4 form-header">Account</h2>
                        <Row className="justify-content-start mt-4">
                            {/* Company Details */}
                            <Col md={5} sm={10}>
                                <Card className="company-card shadow-lg rounded-4 p-4">
                                    <Card.Body>
                                        <i className="bi bi-buildings"></i>
                                        <h5 className="card-title mb-4">Company Details</h5>
                                        {!company ? (
                                            <div className="text-center py-4">
                                                <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                                                <span className="fw-semibold text-muted">Loading company details...</span>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-column gap-3">
                                                <div className="field-row">
                                                    <span className="label">Business Name:</span>
                                                    <span className="value">{company.business_name}</span>
                                                </div>
                                                <div className="field-row">
                                                    <span className="label">Address:</span>
                                                    <span className="value">{company.address}</span>
                                                </div>
                                                <div className="field-row">
                                                    <span className="label">GSTIN:</span>
                                                    <span className="value">{company.gstin}</span>
                                                </div>
                                                <div className="field-row">
                                                    <span className="label">PAN:</span>
                                                    <span className="value">{company.pan}</span>
                                                </div>
                                                <div className="field-row">
                                                    <span className="label">Pincode:</span>
                                                    <span className="value">{company.pincode}</span>
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Add Sub-Vendor or Show Existing */}
                            <Col md={7} sm={10}>
                                <Card className="shadow-lg border-0 rounded-4 p-4 khakibg">
                                    <Card.Body>
                                        <div className="signup-box">
                                            {!company || !company.subVendors || Object.keys(company.subVendors).length < 2 ? (
                                                <>
                                                    <h5 className="mb-2 fw-bold text-dark">Add User</h5>
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="form-floating-label mb-4">
                                                            <input
                                                                type="text"
                                                                id="fullName"
                                                                className={`form-input ${errors.name ? 'is-invalid' : ''}`}
                                                                value={name}
                                                                onChange={e => {
                                                                    setName(e.target.value);
                                                                    setErrors(prev => ({ ...prev, name: null }));
                                                                }}
                                                                required
                                                            />
                                                            <label htmlFor="fullName">Full Name</label>
                                                            {errors.name && <div className="error-danger">{errors.name}</div>}
                                                        </div>

                                                        <div className="form-floating-label flex-fill mb-3">
                                                            <input
                                                                type="email"
                                                                id="email"
                                                                className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                                                                value={email}
                                                                onChange={e => {
                                                                    setEmail(e.target.value);
                                                                    setErrors(prev => ({ ...prev, email: null }));
                                                                }}
                                                                required
                                                            />
                                                            <label htmlFor="email">Email</label>
                                                            {errors.email && <small className="text-danger">{errors.email}</small>}
                                                        </div>

                                                        <div className="form-floating-label flex-fill mb-3">
                                                            <input
                                                                type="password"
                                                                id="password"
                                                                className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                                                                value={password}
                                                                onChange={e => {
                                                                    setPassword(e.target.value);
                                                                    setErrors(prev => ({ ...prev, password: null }));
                                                                }}
                                                                required
                                                            />
                                                            <label htmlFor="password">Password</label>
                                                            {errors.password && <small className="text-danger">{errors.password}</small>}
                                                        </div>

                                                        <div className="form-floating-label flex-fill mb-3">
                                                            <input
                                                                type="password"
                                                                id="confirmPassword"
                                                                className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                                value={confirmPassword}
                                                                onChange={e => {
                                                                    setConfirmPassword(e.target.value);
                                                                    setErrors(prev => ({ ...prev, confirmPassword: null }));
                                                                }}
                                                                required
                                                            />
                                                            <label htmlFor="confirmPassword">Confirm Password</label>
                                                            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                                                        </div>

                                                        <button type="submit" className="btn btn-success btn-sm mt-1">
                                                            {loading ? "Saving..." : "Save"}
                                                        </button>
                                                    </form>
                                                </>
                                            ) : (
                                                <>
                                                    <h5 className="mb-2 fw-bold text-dark">Sub-Vendors</h5>
                                                    <div className="d-flex flex-column gap-2">
                                                        {/* Header Row */}
                                                        <div className="d-flex fw-bold border-bottom pb-1">
                                                            <div className="flex-fill label">Name</div>
                                                            <div className="flex-fill label">Email</div>
                                                        </div>

                                                        {/* Sub-Vendor Rows */}
                                                        {Object.values(company.subVendors).map((subVendor, idx) => (
                                                            <div className="d-flex py-1" key={idx}>
                                                                <div className="flex-fill">{subVendor.name}</div>
                                                                <div className="flex-fill">{subVendor.email}</div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                </>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default Account;
