import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../../../api/axiosAuth';
import messageHandler from '../../../util/messageHandler';

const ProInvoiceList = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //  Fetch invoices with pagination & search
    const fetchInvoices = async (pageNumber = 1, query = '') => {
        try {
            setLoading(true);
            const response = await axiosAuth.get('/pro-invoices', {
                params: { page: pageNumber, per_page: perPage, search: query }
            });

            const data = response.data;
            
            //  Laravel returns paginated data as data.data
            if (Array.isArray(data?.data) && data.data.length > 0) {
                setList(data.data);
                setTotalPages(data.last_page || 1);
            } else {
                setList([]);
                messageHandler('No invoices found.', 'error');
            }
        } catch (error) {
            console.error(error);
            messageHandler('Failed to load invoices.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when search/page changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchInvoices(page, search);
        }, 400); // debounce
        return () => clearTimeout(timeout);
    }, [page, search]);

    //  Group items by invoice_no (combine products under same invoice)
    const grouped = list.reduce((acc, item, index) => {
        const invoiceNo =
            item.invoice_no && item.invoice_no.trim() !== ''
                ? item.invoice_no
                : `NO-INVOICE-${index}`; // handle blank invoice_no
        if (!acc[invoiceNo]) acc[invoiceNo] = [];
        acc[invoiceNo].push(item);
        return acc;
    }, {});

    const viewInvoice = (invoiceNo) => {
        if (invoiceNo.startsWith('NO-INVOICE')) {
            messageHandler('This record has no invoice number.', 'warning');
            return;
        }
        navigate(`/PrintInvoice/${invoiceNo}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Proforma Invoices List</h2>

            {/* 🔍 Search bar */}
            <div className="d-flex mb-3 p-3 justify-content-end">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search by Invoice Number..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {/*  Invoice List */}
            {loading ? (
                <p>Loading invoices...</p>
            ) : Object.keys(grouped).length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <>
                    {Object.entries(grouped).map(([invoiceNo, items]) => (
                        <div
                            key={invoiceNo}
                            className="invoice_list_header mb-4 p-3 border rounded shadow-sm bg-white"
                        >
                            <h4
                                className="clickable-invoice text-primary"
                                title={invoiceNo.startsWith('NO-INVOICE') ? 'No Invoice Number' : 'Click to view or print invoice'}
                                onClick={() => viewInvoice(invoiceNo)}
                                style={{ cursor: invoiceNo.startsWith('NO-INVOICE') ? 'not-allowed' : 'pointer' }}
                            >
                                Invoice No: {invoiceNo.startsWith('NO-INVOICE') ? '(Not Issued)' : invoiceNo}
                            </h4>

                            <p><strong>Date:</strong> {items[0].issued_at}</p>
                            <p>
                                <strong>Customer:</strong> {items[0].name} ({items[0].mobile})
                            </p>

                            <table
                                border="1"
                                cellPadding="6"
                                className="invoice_list_table table table-bordered w-100 mt-3"
                            >
                                <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                        <th>Tax</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.product_name}</td>
                                            <td>{item.sell_quantity}</td>
                                            <td>₹ {item.price}</td>
                                            <td>₹ {item.subtotal}</td>
                                            <td>₹ {item.tax_total}</td>
                                            <td><strong>₹ {item.total}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {/* 📄 Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                            <button
                                className="btn btn-outline-primary"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </button>

                            <span>
                                Page {page} of {totalPages}
                            </span>

                            <button
                                className="btn btn-outline-primary"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProInvoiceList;
