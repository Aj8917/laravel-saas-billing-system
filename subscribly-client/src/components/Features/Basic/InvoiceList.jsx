import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../../../api/axiosAuth';
import messageHandler from '../../../util/messageHandler';

const InvoiceList = () => {
    const [list, setList] = useState([]);
    const navigate=useNavigate()
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axiosAuth('invoices');
                if (response?.data?.invoices?.length > 0) {
                    setList(response.data.invoices);
                } else {
                    messageHandler('No Invoices found.', 'error');
                }
            } catch (error) {
                messageHandler('Failed to load invoice.', 'error');
            }
        };

        fetchInvoice();
    }, []);

    // Group items by invoice_no
    const grouped = list.reduce((acc, item) => {
        const { invoice_no } = item;
        if (!acc[invoice_no]) acc[invoice_no] = [];
        acc[invoice_no].push(item);
        return acc;
    }, {});

    const viewInvoice = ({invoiceNo})=>{
       navigate(`/PrintInvoice/${invoiceNo}`);
    }
    return (
        <div>
            <h2>Invoice List</h2>
            {Object.entries(grouped).map(([invoiceNo, items]) => (
                <div key={invoiceNo} className="invoice_list_header" >
                    <h3  className="clickable-invoice" title="Click To Print Invoice" onClick={()=>viewInvoice({invoiceNo})}>Invoice No: {invoiceNo}</h3>
                    <p>Date: {items[0].issued_at}</p>
                    <p>Customer: {items[0].customer?.name} ({items[0].customer?.mobile})</p>

                    <table border="1" cellPadding="5" className="invoice_list_table">
                        <thead>
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
                                    <td>{item.price}</td>
                                    <td>{item.subtotal}</td>
                                    <td>{item.tax_total}</td>
                                    <td>{item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default InvoiceList;
