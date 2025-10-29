import React, { useEffect, useState } from 'react'
import messageHandler from '../../../util/messageHandler';
import { useParams } from 'react-router-dom';
import axiosAuth from '../../../api/axiosAuth';

const InvoicePrint = () => {
    const { invoiceNo } = useParams(); // Get encrypted ID from URL
    const [invoice, setInvoice] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchInvoice = async () => {
            if (!invoiceNo) {
                console.error('No invoice ID found in route');
                return;
            }
            try {
                const response = await axiosAuth.get(`/invoice/${invoiceNo}`);
                 //console.log(response.data.customer);
                setCustomerName(response.data.customer.name);
                setCustomerMobile(response.data.customer.mobile);
                setInvoice(response.data.invoice);
              
            } catch (err) {
                messageHandler('Failed to load invoice.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [invoiceNo]);
   
    if (loading) return <p>Loading invoice...</p>;


    const calculateSubtotal = (item) => item.quantity * item.price;

    //const subtotal = invoice.reduce((sum, item) => sum + calculateSubtotal(item), 0);
    let allsubtotal = 0;
    invoice.forEach((item) => {
        allsubtotal += Number(item.subtotal); // make sure subtotal is a number
    });

    const taxRate = 0.18;
    const totaltax = allsubtotal * taxRate;
    const Finaltotal = allsubtotal + totaltax;


    return (
        <div className="invoice">


            <h1 className="invoice__header">Invoice </h1>
            
            <div className="invoice__customer-info">
                <p><strong>Customer Name:</strong> {customerName}</p>
                <p><strong>Mobile Number:</strong> {customerMobile}</p>
                <p><strong>Invoice Number:</strong>  {invoiceNo}</p>
            </div>

            <table className="invoice__table">
                <thead>
                    <tr>
                        <th className="invoice__table-header">Product</th>
                        <th className="invoice__table-header">Quantity</th>
                        <th className="invoice__table-header">Price</th>
                        <th className="invoice__table-header">Subtotal</th>
                        <th className="invoice__table-header">Tax</th>
                         <th className="invoice__table-header">Total</th>

                    </tr>
                </thead>
                <tbody>
                    {invoice.map((item, index) => (
                        <tr key={index}>
                            <td className="invoice__table-cell">{item.product_name}</td>
                            <td className="invoice__table-cell">{item.sell_quantity}</td>
                            <td className="invoice__table-cell">${Number(item.price).toFixed(2)}</td>
                            <td className="invoice__table-cell">${Number(item.subtotal).toFixed(2)}</td>
                            <td className="invoice__table-cell">${Number(item.tax_total).toFixed(2)}</td>
                            <td className="invoice__table-cell">${Number(item.total).toFixed(2)}</td>
                        </tr>
                    ))}
                   
                    <tr>
                        <td colSpan="5" className="invoice__table-cell"><strong>Subtotal</strong></td>
                        <td className="invoice__table-cell">${Number(allsubtotal).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="5" className="invoice__table-cell"><strong>Tax</strong></td>
                        <td className="invoice__table-cell">${Number(totaltax).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="5" className="invoice__table-cell"><strong>Total</strong></td>
                        <td className="invoice__table-cell">${Number(Finaltotal).toFixed(2)}</td>
                    </tr>
                </tbody>

            </table>

            <div className="invoice__totals">
                <p><strong>Subtotal:</strong> ${allsubtotal.toFixed(2)}</p>
                <p><strong>Tax (18%):</strong> ${totaltax.toFixed(2)}</p>
                <p><strong>Total:</strong> ${Number(Finaltotal).toFixed(2)}</p>
            </div>
            <button onClick={() => window.print()} className="invoice__print-button">Print Invoice</button>
        </div>


    );
};



export default InvoicePrint