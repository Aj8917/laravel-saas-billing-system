import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import asyncHandler from '../../../util/asyncHandler';
import axiosAuth from '../../../api/axiosAuth';
import messageHandler from '../../../util/messageHandler';

const StockTopUp = () => {
  const [products, setProducts] = useState([
    { uuid: '', stock: 0, price: '', sku: '', productLabel: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [productOptions, setProductOptions] = useState([]);

  // Fetch products for select dropdown
  useEffect(() => {
    asyncHandler(async () => {
      const response = await axiosAuth('/products');
      const productsData = response?.data?.products || [];

      const formatted = productsData.map((item) => ({
        value: item.uuid,
        label: item.product,
        sku: item.sku,
        stock: item.stock || 0,
      }));
      setProductOptions(formatted);
    })();
  }, []);

  // Add new empty product row
  const handleAddProduct = () => {
    setProducts([
      ...products,
      { uuid: '', stock: 0, price: '', sku: '', productLabel: '' }
    ]);
  };

  // Remove product row
  const handleRemoveProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  // Handle selecting a product from dropdown
  const handleProductSelect = (index, selected) => {
    const updated = [...products];
    if (selected) {
      updated[index] = {
        ...updated[index],
        uuid: selected.value,
        sku: selected.sku || 'N/A',
        productLabel: selected.label,
        stock: selected.stock || 0,
      };
    } else {
      updated[index] = { uuid: '', stock: 0, price: '', sku: '', productLabel: '' };
    }
    setProducts(updated);
    setErrors((prev) => ({ ...prev, [`product-${index}`]: null }));
  };

  // Handle changing stock or price
  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);

    setErrors((prev) => ({ ...prev, [`${field}-${index}`]: null }));
  };

  // Submit stock + price update
  const updateStock = asyncHandler(async (e) => {
    e.preventDefault();

    const payload = {
      products: products.map((p) => ({
        uuid: p.uuid,
        stock: Number(p.stock),
        price: Number(p.price)
      }))
    };

    try {
      const response = await axiosAuth.post('/update-stock', payload);
      messageHandler(response.data.message || 'Stock updated successfully!', 'success');

      // Reset form
      setProducts([{ uuid: '', stock: 0, price: '', sku: '', productLabel: '' }]);
      setErrors({});
    } catch (error) {
      if (error.response?.data?.errors) {
        // Backend validation errors
        const backendErrors = {};
        for (const key in error.response.data.errors) {
          // Transform Laravel style errors to match product index
          const match = key.match(/products\.(\d+)\.(\w+)/);
          if (match) {
            const index = match[1];
            const field = match[2];
            backendErrors[`${field}-${index}`] = error.response.data.errors[key];
          }
        }
        setErrors(backendErrors);
      } else {
        messageHandler(error.response?.data?.message || 'Failed to update stock.', 'error');
      }
    }
  });

  return (
    <section className="py-1">
      <div className="container">
        <section className="dash-form-wrapper">
          <div className="form-box">
            <h2 className="text-center mb-4 form-header">Update Stock & Price</h2>

            <form onSubmit={updateStock}>
              {products.map((product, index) => (
                <div key={index} className="mb-4 p-3 border rounded position-relative">
                  <div className="mb-3">
                    <label className="form-label">Select Product</label>
                    <Select
                      options={productOptions.filter(
                        (opt) => !products.some((p, i) => i !== index && p.uuid === opt.value)
                      )}
                      value={product.uuid ? { value: product.uuid, label: product.productLabel } : null}
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
                        <input type="text" className="form-input" value={product.sku} readOnly disabled />
                        <label>SKU</label>
                      </div>
                      <div className="form-floating-label flex-fill">
                        <input
                          type="number"
                          className={`form-input ${product.stock === 0 ? 'text-danger fw-bold' : ''}`}
                          value={product.stock}
                          readOnly
                          disabled
                        />
                        <label>Available Stock</label>
                      </div>
                    </div>
                  )}

                  {/* Stock & Price Inputs */}
                  {['stock', 'price'].map((field) => (
                    <div className="form-floating-label mb-3" key={field}>
                      <input
                        type="number"
                        className={`form-input ${errors[`${field}-${index}`] ? 'is-invalid' : ''}`}
                        value={product[field]}
                        onChange={(e) => handleProductChange(index, field, e.target.value)}
                        min={0}
                        required
                      />
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      {errors[`${field}-${index}`] && (
                        <div className="error-text">{errors[`${field}-${index}`][0]}</div>
                      )}
                    </div>
                  ))}

                  {/* Remove product button */}
                  {products.length > 1 && (
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

              {/* Add product button */}
              <button
                type="button"
                className="btn btn-secondary mt-2 d-flex align-items-center gap-2"
                onClick={handleAddProduct}
              >
                <i className="bi bi-plus-circle"></i>
                Add Another Product
              </button>

              <button type="submit" className="btn btn-green w-100 mt-3">
                Update Stock & Price
              </button>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
};

export default StockTopUp;
