import React, { useEffect, useState } from 'react';
import asyncHandler from '../../../util/asyncHandler';
import axiosAuth from '../../../api/axiosAuth';
import Select from 'react-select';
import messageHandler from '../../../util/messageHandler';

const ProInvoice = () => {
  const [productOptions, setProductOptions] = useState([]);
  const [invoiceProducts, setInvoiceProducts] = useState([
    { uuid: '', quantity: 1, sku: '', stock: '', price: '', productLabel: '' }
  ]);

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch product options
  useEffect(() => {
    asyncHandler(async () => {
      const response = await axiosAuth("/products");
      const products = response?.data?.products;

      if (Array.isArray(products)) {
        const formatted = products.map((item) => ({
          value: item.uuid,
          label: item.product,
          sku: item.sku,
          price: item.price,
          stock: item.stock
        }));
        setProductOptions(formatted);
      }
    })();
  }, []);

  const handleProductSelect = (index, selectedOption) => {
    const updatedProducts = [...invoiceProducts];
    if (selectedOption) {
      updatedProducts[index] = {
        uuid: selectedOption.value,
        sku: selectedOption.sku || '',
        stock: selectedOption.stock || 0,
        price: selectedOption.price || 0,
        productLabel: selectedOption.label,
        quantity: updatedProducts[index].quantity || 1
      };
    } else {
      updatedProducts[index] = { uuid: '', quantity: 1, sku: '', stock: '', price: '', productLabel: '' };
    }
    setInvoiceProducts(updatedProducts);
    setErrors(prev => ({ ...prev, [`product-${index}`]: null }));
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...invoiceProducts];
    updatedProducts[index].quantity = Number(value);
    setInvoiceProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setInvoiceProducts([
      ...invoiceProducts,
      { uuid: '', quantity: 1, sku: '', stock: '', price: '', productLabel: '' }
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...invoiceProducts];
    updatedProducts.splice(index, 1);
    setInvoiceProducts(updatedProducts);
  };

  const handleSubmit = asyncHandler(async (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    // Customer validations
    if (!customerName.trim()) {
      newErrors.customerName = ['Customer name is required.'];
      hasError = true;
    }

    if (!customerMobile || customerMobile.length !== 10) {
      newErrors.customerMobile = ['Mobile number must be 10 digits.'];
      hasError = true;
    }

    // Product validations
    invoiceProducts.forEach((p, i) => {
      if (!p.uuid) {
        newErrors[`product-${i}`] = ['Product is required.'];
        hasError = true;
      }
      if (!p.quantity || p.quantity < 1) {
        newErrors[`quantity-${i}`] = ['Quantity must be at least 1.'];
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      customerName: customerName,
      customerMobile: customerMobile,
      products: invoiceProducts.map(p => ({
        uuid: p.uuid,
        quantity: p.quantity
      }))
    };

    try {
      await axiosAuth.post('/pro-invoice', payload);
      messageHandler('Invoice created successfully!', 'success');

      // Reset form
      setInvoiceProducts([{ uuid: '', quantity: 1, sku: '', stock: '', price: '', productLabel: '' }]);
      setCustomerName('');
      setCustomerMobile('');
      setErrors({});
    } catch (error) {
      // console.error(error);
      // Check if backend returned a message
      const backendMessage = error.response?.data?.message || 'Failed to create invoice.';
      messageHandler(backendMessage, 'error');
    }
  });
  const calculateTotals = () => {
    let subTotal = 0;

    invoiceProducts.forEach(p => {
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
            <h2 className="text-center mb-4 form-header">Create Purchase Invoice</h2>

            <form onSubmit={handleSubmit}>
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
                {errors.customerName && <div className="error-text">{errors.customerName[0]}</div>}
              </div>

              {/* Mobile */}
              <div className="form-floating-label mb-4">
                <input
                  type="number"
                  id="customerMobile"
                  className={`form-input ${errors.customerMobile ? 'is-invalid' : ''}`}
                  value={customerMobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
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

              {/* Products Section */}
              {invoiceProducts.map((product, index) => (
                <div key={index} className="mb-4 p-3 border rounded position-relative">
                  <div className="mb-3">
                    <label className="form-label">Select Product</label>
                    <Select
                      options={productOptions
                        .filter(
                        (opt) => !invoiceProducts.some((p, i) => i !== index && p.uuid === opt.value)
                      )}
                      value={
                        product.uuid
                          ? {
                            value: product.uuid,
                            label: product.productLabel
                          }
                          : null
                      }
                      onChange={(selected) => handleProductSelect(index, selected)}
                      isClearable
                      placeholder="Search and select a product..."
                    />
                    {errors[`product-${index}`] && (
                      <div className="error-text">{errors[`product-${index}`][0]}</div>
                    )}
                  </div>

                  {product.uuid && (
                    <div className="d-flex gap-3 mb-3">
                      <div className="form-floating-label flex-fill">
                        <input
                          type="text"
                          className="form-input"
                          value={product.sku || 'N/A'}
                          readOnly
                        />
                        <label>SKU</label>
                      </div>
                      <div className="form-floating-label flex-fill">
                        <input
                          type="number"
                          className="form-input"
                          value={product.price || 0}
                          readOnly
                        />
                        <label>Price</label>
                      </div>
                      <div className="form-floating-label flex-fill">
                        <input
                          type="number"
                          className={`form-input ${product.stock === 0 ? 'text-danger fw-bold':''}` }
                         value={product.stock === 0 ? 'Out of Stock' : product.stock}
                          readOnly
                        />
                        <label>Stock</label>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className={`form-control ${errors[`quantity-${index}`] ? 'is-invalid' : ''}`}
                      min="1"
                      value={product.quantity}
                       disabled={product.stock === 0} // 🔹 Disable if out of stock
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      required
                    />
                    {errors[`quantity-${index}`] && (
                      <div className="error-text">{errors[`quantity-${index}`][0]}</div>
                    )}
                  </div>

                  {invoiceProducts.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute"
                      style={{ top: '10px', right: '10px' }}
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <i className="bi bi-dash-circle-fill"></i>
                    </button>
                  )}
                </div>
              ))}
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

              {/* Add product button */}
              <button
                type="button"
                className="btn btn-secondary mt-2 d-flex align-items-center gap-2"
                onClick={handleAddProduct}
              >
                <i className="bi bi-plus-circle"></i>
                Add Another Product
              </button>

              {/* Submit */}
              <button type="submit" className="btn btn-green w-100 mt-4">
                Save Invoice
              </button>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProInvoice;
