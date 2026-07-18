import React, { useEffect, useState } from 'react'
import messageHandler from '../../util/messageHandler';
import Loader from '../../util/Loader';
import axiosAuth from '../../api/axiosAuth';
import asyncHandler from '../../util/asyncHandler';

const ContactUs = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // ================= FETCH =================

    const fetchContacts = async (pageNumber = 1, query = '') => {
        try {
            setLoading(true);

            const response = await axiosAuth.get('/contacts', {
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
            messageHandler('Failed to load contact list .', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchContacts(page, search);
        }, 400);

        return () => clearTimeout(timeout);
    }, [page, search]);

    const handleStatusChange = asyncHandler(async (id, newStatus) => {

        try {

            await axiosAuth.put(`/contacts/${id}`, {
                status: newStatus
            });

            messageHandler('Status updated successfully!', 'success');
            fetchContacts(page, search);

        } catch (error) {
            const backendMessage =
                error.response?.data?.message || 'Failed to update Ticket.';
            messageHandler(backendMessage, 'error');
        }
    });
    return (
        <>


            {/* ================= MAIN ================= */}
            <div className="container mt-4">
                <h2>Contacts List</h2>

                <div className="d-flex justify-content-end mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by Mobile Number..."
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
                            <th>No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>Enquire Date</th>
                            <th>status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : (

                            list.map((item, index) => (
                                <tr key={`${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.mobile_number}</td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Converted</option>
                                            <option value="closed">Closed – Not Converted</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )
                        }
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
    )
}

export default ContactUs