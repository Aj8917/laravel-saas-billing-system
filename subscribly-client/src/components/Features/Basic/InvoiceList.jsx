import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../../../api/axiosAuth';
import messageHandler from '../../../util/messageHandler';
import Loader from '../../../util/Loader';

const InvoiceList = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchInvoice = async (pageNumber = 1, query = '') => {
        try {
            setLoading(true);
            const response = await axiosAuth.get('/invoices', {
                params: { page: pageNumber, per_page: perPage, search: query }
            });

            const data = response.data.invoices ?? [];
            console.log(data);
            // ✅ Laravel pagination returns { data: [...], last_page: N }
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchInvoice(page, search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [page, search]);

    // ✅ Group by invoice_no (use index if missing)
    const grouped = list.reduce((acc, item, index) => {
        const invoiceNo = item.invoice_no && item.invoice_no.trim() !== ''
            ? item.invoice_no
            : `NO-INVOICE-${index}`;
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
            <h2 className="mb-3">Invoice List</h2>

           <div className="d-flex mb-3 p-3 justify-content-end">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search by Invoice Number..."
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
                <p>No invoices found.</p>
            ) : (
                Object.entries(grouped).map(([invoiceNo, items]) => (
                    <div key={invoiceNo} className="invoice_list_header mb-4 p-3 border rounded bg-white shadow-sm">
                        <h4
                            className="clickable-invoice text-primary"
                            title={invoiceNo.startsWith('NO-INVOICE') ? 'No Invoice Number' : 'Click to view invoice'}
                            style={{ cursor: invoiceNo.startsWith('NO-INVOICE') ? 'not-allowed' : 'pointer' }}
                            onClick={() => viewInvoice(invoiceNo)}
                        >
                            Invoice No: {invoiceNo.startsWith('NO-INVOICE') ? '(Not Issued)' : invoiceNo}
                        </h4>

                        <p><strong>Date:</strong> {items[0].issued_at}</p>
                        <p><strong>Customer:</strong> {items[0].customer?.name} ({items[0].customer?.mobile})</p>

                        <table className="table table-bordered w-100 mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
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
    );
};

export default InvoiceList;
