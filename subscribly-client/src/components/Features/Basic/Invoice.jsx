import React, { useState } from 'react';
import asyncHandler from '../../../util/asyncHandler';

const Invoice = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [errors, setErrors] = useState({});

    const createInvoice = asyncHandler(async (e) => {
        e.preventDefault();
        console.log('Invoice submitted');

        // Example validation (you can expand this)
        const newErrors = {};
        if (!productName.trim()) newErrors.productName = ['Product name is required'];
        if (!price || price < 1 || price > 5000) {
            newErrors.price = ['Price must be between 1 and 5000'];
        }

        if (!quantity || quantity < 1 || quantity > 100) {
            newErrors.quantity = ['Quantity must be between 1 and 100'];
        }



        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit logic here (e.g., send to backend)
        console.log({ productName, price, quantity });

        // Reset form
        setProductName('');
        setPrice('');
        setQuantity('');
        setErrors({});
    });

    return (
        <section className="py-1">
            <div className="container">
                <section className="dash-form-wrapper">
                    <div className="form-box">
                        <h2 className="text-center mb-4 form-header">Invoice</h2>

                        <form onSubmit={createInvoice}>
                            {/* Product Name */}
                            <div className="form-floating-label mb-4">
                                <input
                                    type="text"
                                    id="productName"
                                    className={`form-input ${errors.productName ? 'is-invalid' : ''}`}
                                    value={productName}
                                    onChange={(e) => {
                                        setProductName(e.target.value);
                                        setErrors(prev => ({ ...prev, productName: null }));
                                    }}
                                    required
                                />
                                <label htmlFor="productName">Product Name</label>
                                {errors.productName && (
                                    <div className="error-text">{errors.productName[0]}</div>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="form-floating-label mb-4">
                                <input
                                    type="number"
                                    id="quantity"
                                    className={`form-input ${errors.quantity ? 'is-invalid' : ''}`}
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(e.target.value);
                                        setErrors(prev => ({ ...prev, quantity: null }));
                                    }}
                                    min={1}
                                    max={50}
                                    required
                                />
                                <label htmlFor="quantity">Quantity</label>
                                {errors.quantity && (
                                    <div className="error-text">{errors.quantity[0]}</div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="form-floating-label mb-4">
                                <input
                                    type="number"
                                    id="price"
                                    min={1}
                                    max={1000}

                                    className={`form-input ${errors.price ? 'is-invalid' : ''}`}
                                    value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                        setErrors(prev => ({ ...prev, price: null }));
                                    }}

                                    required
                                />
                                <label htmlFor="price">Price</label>
                                {errors.price && (
                                    <div className="error-text">{errors.price[0]}</div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-green w-100">
                                Submit
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default Invoice;
