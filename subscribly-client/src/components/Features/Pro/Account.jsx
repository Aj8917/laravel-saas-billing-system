import React, { useEffect, useState } from 'react';
import asyncHandler from '../../../util/asyncHandler';
import axiosAuth from '../../../api/axiosAuth';
import messageHandler from '../../../util/messageHandler';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Loader from '../../../util/Loader';

const Account = () => {
    const [company, setCompany] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const plan = useSelector((state) => state.auth.plan);
    const [subVendors, setSubVendors] = useState([]);
    
    useEffect(() => {
        asyncHandler(async () => {
            try {
                const response = await axiosAuth.get('/company-details');
                if (response?.data?.details) {
                    const details = response.data.details; setCompany(details);
                    
                    setCompany(details);

                    setSubVendors( 
                                    details?.subVendors ? Object.values(details.subVendors) : [] 
                                 );
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
                const response = await axiosAuth.post('/sub-vendors', { name, email, password, confirmPassword });


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

                    messageHandler(error.response?.data?.errors || 'failed create new user!', 'error');


                } else {
                    messageHandler(error.response?.data?.message || "Something went wrong", "error");
                }
            } finally {
                setLoading(false);
            }
        }
    });

    const handleActivate = asyncHandler(async (subVendorId) => {
        try {
            setLoading(true);
            const response = await axiosAuth.patch(`/sub-vendors/${subVendorId}`);
            if (response.data?.success) {
                messageHandler(response.data.success, "success");
               
            } else {
                messageHandler(response.data?.message || "Unable to activate user.", "error");
            }
        } catch (error) {
            console.error("Activate user error:", error);
            messageHandler(error.response?.data?.message || "Something went wrong while activating the user.", "error");
        }
        finally {
            setLoading(false);
        }
    }
    );

    //const subVendors = company?.subVendors ? Object.values(company.subVendors) : [];
    const activeUsers = subVendors.filter(user => user.status !== "suspended").length;
    const suspendedUsers = subVendors.filter(user => user.status === "suspended").length;
    const planLimit = plan === "Pro" ? 2 : plan === "Premium" ? 5 : 0;
    const canAddUser = activeUsers < planLimit;
    const show= suspendedUsers>0;

    return (
        <section className="py-1">
            <div className="container">
                <section className="dash-form-wrapper">
                    <div className="form-box">
                        <h2 className="text-center mb-4 form-header">Account</h2>

                        {/* Top Section */}
                        <Row className="justify-content-start mt-4">
                            {/* Company Details */}
                            <Col md={5} sm={12} className="mb-4">
                                <Card className="company-card shadow-lg rounded-4 p-4 h-100">
                                    <Card.Body>
                                        <i className="bi bi-buildings"></i>
                                        <h5 className="card-title mb-4">Company Details</h5>

                                        {!company ? (
                                            <div className="text-center py-4">
                                                <Spinner
                                                    animation="border"
                                                    variant="primary"
                                                    size="sm"
                                                    className="me-2"
                                                />
                                                <span className="fw-semibold text-muted">
                                                    Loading company details...
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-column gap-3">
                                                <div className="field-row">
                                                    <span className="label">Business Name:</span>
                                                    <span className="value">
                                                        {company.business_name}
                                                    </span>
                                                </div>

                                                <div className="field-row">
                                                    <span className="label">Address:</span>
                                                    <span className="value">
                                                        {company.address}
                                                    </span>
                                                </div>

                                                <div className="field-row">
                                                    <span className="label">GSTIN:</span>
                                                    <span className="value">
                                                        {company.gstin}
                                                    </span>
                                                </div>

                                                <div className="field-row">
                                                    <span className="label">PAN:</span>
                                                    <span className="value">
                                                        {company.pan}
                                                    </span>
                                                </div>

                                                <div className="field-row">
                                                    <span className="label">Pincode:</span>
                                                    <span className="value">
                                                        {company.pincode}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Add User */}
                            <Col md={7} sm={12} className="mb-4">
                                <Card className="shadow-lg border-0 rounded-4 p-4 khakibg h-100">
                                    <Card.Body>
                                        <div className="signup-box">
                                            {
                                                !show && canAddUser
                                                    ? (
                                                        <>
                                                            <h5 className="mb-2 fw-bold text-dark">
                                                                Add User
                                                            </h5>

                                                            <form onSubmit={handleSubmit}>
                                                                <div className="form-floating-label mb-4">
                                                                    <input
                                                                        type="text"
                                                                        id="fullName"
                                                                        className={`form-input ${errors.name
                                                                            ? "is-invalid"
                                                                            : ""
                                                                            }`}
                                                                        value={name}
                                                                        onChange={(e) => {
                                                                            setName(e.target.value);
                                                                            setErrors((prev) => ({
                                                                                ...prev,
                                                                                name: null,
                                                                            }));
                                                                        }}
                                                                        required
                                                                    />
                                                                    <label htmlFor="fullName">
                                                                        Full Name
                                                                    </label>

                                                                    {errors.name && (
                                                                        <div className="error-danger">
                                                                            {errors.name}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="form-floating-label flex-fill mb-3">
                                                                    <input
                                                                        type="email"
                                                                        id="email"
                                                                        className={`form-input ${errors.email
                                                                            ? "is-invalid"
                                                                            : ""
                                                                            }`}
                                                                        value={email}
                                                                        onChange={(e) => {
                                                                            setEmail(e.target.value);
                                                                            setErrors((prev) => ({
                                                                                ...prev,
                                                                                email: null,
                                                                            }));
                                                                        }}
                                                                        required
                                                                    />
                                                                    <label htmlFor="email">
                                                                        Email
                                                                    </label>

                                                                    {errors.email && (
                                                                        <small className="text-danger">
                                                                            {errors.email}
                                                                        </small>
                                                                    )}
                                                                </div>

                                                                <div className="form-floating-label flex-fill mb-3">
                                                                    <input
                                                                        type="password"
                                                                        id="password"
                                                                        className={`form-input ${errors.password
                                                                            ? "is-invalid"
                                                                            : ""
                                                                            }`}
                                                                        value={password}
                                                                        onChange={(e) => {
                                                                            setPassword(e.target.value);
                                                                            setErrors((prev) => ({
                                                                                ...prev,
                                                                                password: null,
                                                                            }));
                                                                        }}
                                                                        required
                                                                    />
                                                                    <label htmlFor="password">
                                                                        Password
                                                                    </label>

                                                                    {errors.password && (
                                                                        <small className="text-danger">
                                                                            {errors.password}
                                                                        </small>
                                                                    )}
                                                                </div>

                                                                <div className="form-floating-label flex-fill mb-3">
                                                                    <input
                                                                        type="password"
                                                                        id="confirmPassword"
                                                                        className={`form-input ${errors.confirmPassword
                                                                            ? "is-invalid"
                                                                            : ""
                                                                            }`}
                                                                        value={confirmPassword}
                                                                        onChange={(e) => {
                                                                            setConfirmPassword(
                                                                                e.target.value
                                                                            );
                                                                            setErrors((prev) => ({
                                                                                ...prev,
                                                                                confirmPassword: null,
                                                                            }));
                                                                        }}
                                                                        required
                                                                    />
                                                                    <label htmlFor="confirmPassword">
                                                                        Confirm Password
                                                                    </label>

                                                                    {errors.confirmPassword && (
                                                                        <small className="text-danger">
                                                                            {errors.confirmPassword}
                                                                        </small>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-success btn-sm mt-1"
                                                                >
                                                                    {loading ? "Saving..." : "Save"}
                                                                </button>
                                                            </form>
                                                        </>
                                                    )
                                                    : (
                                                        /* ========================= LIMIT REACHED MESSAGE ========================= */
                                                        <div className="text-center py-4 w-100">
                                                            <i className="bi bi-people-fill text-warning" style={{ fontSize: "45px" }} ></i>
                                                            <h5 className="fw-bold mt-3 text-dark"> {plan} Plan User Limit Reached </h5>
                                                            <p className="text-muted mb-2"> Your <strong>{plan}</strong> plan allows a maximum of <strong>{planLimit} active users</strong>.
                                                            </p>
                                                            <div className="small text-muted mb-3">
                                                                <div> Active Users:{" "}
                                                                    <strong> {activeUsers} / {planLimit} </strong>
                                                                </div>
                                                                { show
                                                                    &&
                                                                    (
                                                                        <div className="mt-1">
                                                                            Suspended Users:{" "} <strong>{suspendedUsers}</strong>
                                                                        </div>)}
                                                            </div>
                                                            {
                                                                show ?
                                                                    (
                                                                        <div className="alert alert-warning py-2 px-3 mb-0">
                                                                            <i className="bi bi-info-circle me-2"></i>
                                                                            You can reactivate a suspended user only when an active user slot is available. Your{" "} <strong>{plan}</strong> plan allows{" "}
                                                                            <strong>{planLimit} active users</strong>. </div>) :
                                                                    (
                                                                        <div className="alert alert-info py-2 px-3 mb-0">
                                                                            <i className="bi bi-info-circle me-2"></i>
                                                                            To add another user, please upgrade your plan.

                                                                        </div>
                                                                    )
                                                            }
                                                        </div>

                                                    )
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Sub-Vendors Table - Below Company/User Details */}
                        {
                           
                                <Row className="mt-2">
                                    <Col xs={12}>
                                        <Card className="shadow-lg border-0 rounded-4 p-4 ">
                                            <Card.Body>
                                                <h5 className="mb-4 fw-bold text-dark">
                                                    Sub-Vendors
                                                </h5>

                                                <div className="table-responsive">
                                                    <table className="table table-bordered table-hover align-middle mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {loading ? (
                                                                <tr>
                                                                    <td
                                                                        colSpan="4"
                                                                        className="text-center py-4"
                                                                    >
                                                                        <Loader />
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                subVendors
                                                                    .map((subVendor, idx) => (
                                                                        <tr key={idx}>
                                                                            <td>{idx + 1}</td>
                                                                            <td>{subVendor.name}</td>
                                                                            <td>{subVendor.email}</td>
                                                                            <td>
                                                                                {subVendor.status ===
                                                                                    "suspended" ? (
                                                                                    <i className="bi bi-ban text-danger"
                                                                                        onClick={() => handleActivate(subVendor.id)}
                                                                                          style={{ cursor: "pointer" }}
                                                                                    > {subVendor.status} </i>
                                                                                ) : (
                                                                                    <i className="bi bi-check-circle-fill text-success">{subVendor.status}</i>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            }
                    </div>
                </section>
            </div>
        </section>
    );



}
export default Account;
