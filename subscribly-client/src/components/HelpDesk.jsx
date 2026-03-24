import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import messageHandler from '../util/messageHandler';
import Loader from '../util/Loader';
import axiosAuth from '../api/axiosAuth';
import { Button, Modal } from 'react-bootstrap';

const HelpDesk = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /************************************************************************** */

    const [showReportModal, setShowReportModal] = useState(false);


    const [formData, setFormData] = useState({
        subject: "",
        category: "",
        description: "",
        status: "open",
        priority: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleCloseReportModal = () => setShowReportModal(false);
    const handleOpenReportModal = () => setShowReportModal(true);
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData); // send to API

        // reset form
        setFormData({
            subject: "",
            category: "",
            description: "",
            status: "open",
            priority: ""
        });

        handleCloseReportModal();
    };
    /********************************************************************************************** */
    const fetchticket = async (pageNumber = 1, query = '') => {
        try {
            setLoading(true);
            const response = await axiosAuth.get('/tickets', {
                params: { page: pageNumber, per_page: perPage, search: query }
            });

            const data = response.data.tickets ?? [];
            console.log(data);
            //  Laravel pagination returns { data: [...], last_page: N }
            if (Array.isArray(data?.data) && data.data.length > 0) {
                setList(data.data);
                setTotalPages(data.last_page || 1);
            } else {
                setList([]);
                messageHandler('No tickets found.', 'error');
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

    //  Group by ticket_no (use index if missing)
    const grouped = list.reduce((acc, item, index) => {
        const ticketNo = item.ticket_no && item.ticket_no.trim() !== ''
            ? item.ticket_no
            : `NO-ticket-${index}`;
        if (!acc[ticketNo]) acc[ticketNo] = [];
        acc[ticketNo].push(item);
        return acc;
    }, {});

    const viewticket = (ticketNo) => {
        if (ticketNo.startsWith('NO-ticket')) {
            messageHandler('This record has no ticket number.', 'warning');
            return;
        }
        navigate(`/Printticket/${ticketNo}`);
    };


    return (
        <>
            <Modal show={showReportModal} onHide={handleCloseReportModal}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Raise a Ticket</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <h4 className="text-center mb-4 form-header">New Ticket</h4>

                        {/* Subject */}
                        <div className="mb-3">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                className="form-control"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Category */}
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="billing">Billing</option>
                                <option value="technical">Technical</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Status */}
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-control"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="open" selected>Open</option>
                                {/* <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option> */}
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="mb-3">
                            <label className="form-label">Priority</label>
                            <select
                                name="priority"
                                className="form-control"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
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
            <div className="container mt-4">
                <h2 className="mb-3">Tickets List</h2>
                <div className="d-flex mb-3 p-3 justify-content-end">
                    <Button className="btn btn-sm btn-success" onClick={() => {
                        handleOpenReportModal();

                    }}>New Ticket</Button>
                </div>
                <div className="d-flex mb-3 p-3 justify-content-end">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by Ticket Number..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // reset page when searching
                        }}
                    />
                </div>

                {loading ? (
                    <Loader />
                ) : Object.keys(grouped).length === 0 ? (
                    <p>No tickets found.</p>
                ) : (
                    Object.entries(grouped).map(([ticketNo, items]) => (
                        <div key={ticketNo} className="ticket_list_header mb-4 p-3 border rounded bg-white shadow-sm">
                            <h4
                                className="clickable-ticket text-primary"
                                title={ticketNo.startsWith('NO-ticket') ? 'No ticket Number' : 'Click to view ticket'}
                                style={{ cursor: ticketNo.startsWith('NO-ticket') ? 'not-allowed' : 'pointer' }}
                                onClick={() => viewticket(ticketNo)}
                            >
                                ticket No: {ticketNo.startsWith('NO-ticket') ? '(Not Issued)' : ticketNo}
                            </h4>

                            <p><strong>Date:</strong> {items[0].issued_at}</p>
                            <p><strong>Customer:</strong> {items[0].customer?.name} ({items[0].customer?.mobile})</p>

                            <table className="table table-bordered w-100 mt-3">
                                <thead className="table-light">
                                    <tr>
                                        <th>Subject</th>
                                        <th>Category</th>   {/*billing, technical */}
                                        <th>Description</th>
                                        <th>Status</th>    {/*open, in_progress, resolved, closed */}
                                        <th>Priority</th>    {/*low, medium, high */}
                                        <th>Created at</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.product_name}</td>
                                            <td>{item.sell_quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{item.subtotal}</td>
                                            <td>{item.tax_total}</td>
                                            <td>{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}

                {/* Pagination Controls */}
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
}

export default HelpDesk