import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import messageHandler from '../util/messageHandler';
import Loader from '../util/Loader';
import axiosAuth from '../api/axiosAuth';
import { Button, Modal } from 'react-bootstrap';
import asyncHandler from '../util/asyncHandler';

const HelpDesk = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [showReportModal, setShowReportModal] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        category: "",
        description: "",
        status: "open",
        priority: ""
    });

    // ================= FORM HANDLERS =================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleCloseReportModal = () => {
        setErrors({});
        setFormData({
            subject: "",
            category: "",
            description: "",
            status: "open",
            priority: ""
        });
        setShowReportModal(false);
    };

    const handleOpenReportModal = () => setShowReportModal(true);

    const handleSubmit = asyncHandler(async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.priority) newErrors.priority = "Priority is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await axiosAuth.post('/tickets', formData);

            messageHandler('Ticket created successfully!', 'success');

            handleCloseReportModal(); //  only close on success
            fetchticket(page, search);

        } catch (error) {
            const backendMessage =
                error.response?.data?.message || 'Failed to create Ticket.';
            messageHandler(backendMessage, 'error');
        }
    });

    // ================= FETCH =================

    const fetchticket = async (pageNumber = 1, query = '') => {
        try {
            setLoading(true);

            const response = await axiosAuth.get('/tickets', {
                params: { page: pageNumber, per_page: perPage, search: query }
            });

            const data = response.data;

            if (Array.isArray(data.data)) {
                setList(data.data);
                setTotalPages(data.last_page || 1);
            } else {
                setList([]);
            }

        } catch (error) {
            console.error(error);
            messageHandler('Failed to load tickets.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchticket(page, search);
        }, 400);

        return () => clearTimeout(timeout);
    }, [page, search]);

    // ================= GROUPING =================

    const grouped = list.reduce((acc, item, index) => {
        const ticketNo =
            item.ticket_no && item.ticket_no.trim() !== ''
                ? item.ticket_no
                : `NO-ticket-${index}`;

        if (!acc[ticketNo]) acc[ticketNo] = [];
        acc[ticketNo].push(item);

        return acc;
    }, {});

    // ================= UI =================

    return (
        <>
            {/* ================= MODAL ================= */}
            <Modal show={showReportModal} onHide={handleCloseReportModal}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Raise a Ticket</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <h4 className="text-center mb-4">New Ticket</h4>

                        {/* Subject */}
                        <div className="mb-3">
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                value={formData.subject}
                                onChange={handleChange}
                            />
                            {errors.subject && (
                                <div className="invalid-feedback">{errors.subject}</div>
                            )}
                        </div>

                        {/* Category */}
                        <div className="mb-3">
                            <label>Category</label>
                            <select
                                name="category"
                                className={`form-control ${errors.category ? "is-invalid" : ""}`}
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                <option value="billing">Billing</option>
                                <option value="technical">Technical</option>
                            </select>
                            {errors.category && (
                                <div className="invalid-feedback">{errors.category}</div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea
                                name="description"
                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            {errors.description && (
                                <div className="invalid-feedback">{errors.description}</div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="mb-3">
                            <label>Status</label>
                            <select
                                name="status"
                                className="form-control"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="open">Open</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="mb-3">
                            <label>Priority</label>
                            <select
                                name="priority"
                                className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            {errors.priority && (
                                <div className="invalid-feedback">{errors.priority}</div>
                            )}
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseReportModal}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary">
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* ================= MAIN ================= */}
            <div className="container mt-4">
                <h2>Tickets List</h2>

                <div className="d-flex justify-content-end mb-3">
                    <Button size="sm" variant="success" onClick={handleOpenReportModal}>
                        New Ticket
                    </Button>
                </div>

                <div className="d-flex justify-content-end mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by Ticket Number..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Ticket No</th>
                            <th>Subject</th>
                            <th>Created At</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : Object.keys(grouped).length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No tickets found.
                                </td>
                            </tr>
                        ) : (
                            Object.entries(grouped).map(([ticketNo, items]) =>
                                items.map((item, index) => (
                                    <tr key={`${ticketNo}-${index}`}>
                                        <td>
                                            {ticketNo.startsWith('NO-ticket')
                                                ? '(Not Issued)'
                                                : ticketNo}
                                        </td>
                                        <td>{item.subject}</td>
                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                        <td>{item.category}</td>
                                        <td>{item.description}</td>
                                        <td>{item.priority}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button
                            className="btn btn-outline-secondary"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </button>

                        <span>Page {page} of {totalPages}</span>

                        <button
                            className="btn btn-outline-secondary"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default HelpDesk;