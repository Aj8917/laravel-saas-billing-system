import React, { useState } from 'react';
import asyncHandler from '../../../util/asyncHandler';
import axios from 'axios';

const Invoice = () => {
    const token = localStorage.getItem('token');
    const [customerName, setCustomerName] = useState('');
    const [customerMobile, setCustomerMobile] = useState('');
    const [products, setProducts] = useState([
        { productName: '', quantity: 1, price: '' }
    ]);
    const [errors, setErrors] = useState({});

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);

        setErrors(prev => ({
            ...prev,
            [`${field}-${index}`]: null
        }));
    };

    const handleAddProduct = () => {
        setProducts([...products, { productName: '', quantity: 1, price: '' }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    const createInvoice = asyncHandler(async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!customerName.trim()) {
            newErrors.customerName = ['Customer name is required'];
        }

        if (!/^[6-9]\d{9}$/.test(customerMobile)) {
            newErrors.customerMobile = ['Enter a valid 10-digit Indian mobile number'];
        }

        products.forEach((p, index) => {
            if (!p.productName.trim()) {
                newErrors[`productName-${index}`] = ['Product name is required'];
            }
            if (!p.quantity || p.quantity < 1 || p.quantity > 100) {
                newErrors[`quantity-${index}`] = ['Quantity must be between 1 and 100'];
            }
            if (!p.price || p.price < 1 || p.price > 5000) {
                newErrors[`price-${index}`] = ['Price must be between 1 and 5000'];
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit logic here
        // console.log({
        //     customerName,
        //     customerMobile,
        //     products
        // });
        const data = {
            customerName,
            customerMobile,
            products
        };
        const response = await axios.post('/basic-invoice', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response);
        // Reset
        setCustomerName('');
        setCustomerMobile('');
        setProducts([{ productName: '', quantity: 1, price: '' }]);
        setErrors({});
    });
    const calculateTotals = () => {
        let subTotal = 0;

        products.forEach(p => {
            const quantity = parseFloat(p.quantity) || 0;
            const price = parseFloat(p.price) || 0;
            subTotal += quantity * price;
        });

        const tax = +(subTotal * 0.18).toFixed(2);  // 18% GST
        const total = +(subTotal + tax).toFixed(2);

        return {
            subTotal: subTotal.toFixed(2),
            tax,
            total
        };
    };

    return (
        <section className="py-1">
            <div className="container">
                <section className="dash-form-wrapper">
                    <div className="form-box">
                        <h2 className="text-center mb-4 form-header">Invoice</h2>

                        <form onSubmit={createInvoice}>
                            {/* Customer Name */}
                            <div className="form-floating-label mb-4">
                                <input
                                    type="text"
                                    id="customerName"
                                    className={`form-input ${errors.customerName ? 'is-invalid' : ''}`}
                                    value={customerName}
                                    onChange={(e) => {
                                        setCustomerName(e.target.value);
                                        setErrors(prev => ({ ...prev, customerName: null }));
                                    }}
                                    required
                                />
                                <label htmlFor="customerName">Customer Name</label>
                                {errors.customerName && (
                                    <div className="error-text">{errors.customerName[0]}</div>
                                )}
                            </div>

                            {/* Mobile */}
                            <div className="form-floating-label mb-4">
                                <input
                                    type="number"
                                    id="customerMobile"
                                    className={`form-input ${errors.customerMobile ? 'is-invalid' : ''}`}
                                    value={customerMobile}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (!/^\d*$/.test(value)) return;
                                        if (value.length <= 10) {
                                            setCustomerMobile(value);
                                            setErrors(prev => ({ ...prev, customerMobile: null }));
                                        }
                                    }}
                                    required
                                />
                                <label htmlFor="customerMobile">Mobile</label>
                                {errors.customerMobile && (
                                    <div className="error-text">{errors.customerMobile[0]}</div>
                                )}
                            </div>

                            {/* Dynamic Product Fields */}
                            <div className="product-section mb-4">
                                {products.map((product, index) => (
                                    <div key={index} className="mb-4 p-3 border rounded position-relative">
                                        <div className="form-floating-label mb-3">
                                            <input
                                                type="text"
                                                id={`productName-${index}`}
                                                className={`form-input ${errors[`productName-${index}`] ? 'is-invalid' : ''}`}
                                                value={product.productName}
                                                onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                                                required
                                            />
                                            <label htmlFor={`productName-${index}`}>Product Name</label>
                                            {errors[`productName-${index}`] && (
                                                <div className="error-text">{errors[`productName-${index}`][0]}</div>
                                            )}
                                        </div>

                                        <div className="form-floating-label mb-3">
                                            <input
                                                type="number"
                                                id={`quantity-${index}`}
                                                className={`form-input ${errors[`quantity-${index}`] ? 'is-invalid' : ''}`}
                                                value={product.quantity}
                                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                min={1}
                                                max={100}
                                                required
                                            />
                                            <label htmlFor={`quantity-${index}`}>Quantity</label>
                                            {errors[`quantity-${index}`] && (
                                                <div className="error-text">{errors[`quantity-${index}`][0]}</div>
                                            )}
                                        </div>

                                        <div className="form-floating-label mb-3">
                                            <input
                                                type="number"
                                                id={`price-${index}`}
                                                className={`form-input ${errors[`price-${index}`] ? 'is-invalid' : ''}`}
                                                value={product.price}
                                                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                                min={1}
                                                max={5000}
                                                required
                                            />
                                            <label htmlFor={`price-${index}`}>Price</label>
                                            {errors[`price-${index}`] && (
                                                <div className="error-text">{errors[`price-${index}`][0]}</div>
                                            )}
                                        </div>

                                        {/* Remove product button */}
                                        {products.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm position-absolute"
                                                style={{ top: '10px', right: '10px' }}
                                                onClick={() => handleRemoveProduct(index)}
                                            >
                                                <i class="bi bi-dash-circle-fill"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Add new product */}
                                <button
                                    type="button"
                                    className="btn btn-secondary mt-2 d-flex align-items-center gap-2"
                                    onClick={handleAddProduct}
                                >
                                    <i className="bi bi-plus-circle"></i>
                                    Add Another Product
                                </button>

                            </div>
                            {/* Invoice Summary */}
                            <div className="invoice-summary p-3 mb-4 border rounded bg-light">
                                <h5 className="mb-3">Invoice Summary</h5>
                                {(() => {
                                    const { subTotal, tax, total } = calculateTotals();
                                    return (
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <span>Subtotal:</span>
                                                <strong>₹ {subTotal}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span>Tax (18%):</span>
                                                <strong>₹ {tax}</strong>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-between fs-5">
                                                <span>Total:</span>
                                                <strong>₹ {total}</strong>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <button type="submit" className="btn btn-green w-100">
                                Submit Invoice
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default Invoice;
