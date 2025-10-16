import React, { useEffect, useState } from 'react'
import asyncHandler from '../../../util/asyncHandler';
import messageHandler from '../../../util/messageHandler';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../../../api/axiosAuth';
import { Typeahead } from 'react-bootstrap-typeahead';

const Products = () => {

  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [products, setProducts] = useState([
    {
      productName: '',
      quantity: 1,
      price: '',
      stock: '',
      batchNo: '',
      unit: ''
    }
  ]);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    asyncHandler(async () => {
      const response = await axiosAuth('/categories');
      const categories = response?.data?.category;

      if (categories?.length > 0) {
        setOptions(categories);
      }
    })();
  }, []);
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

  const handleCategoryChange = async (selected) => {
    const value = selected[0];

    // If the user entered a new category
    if (value?.customOption) {
      try {
        const res = await axiosAuth.post('categories', { name: value.name });

        if (res?.data?.category) {
          setSelected([res.data.category]); // Set newly created category as selected
          setOptions((prev) => [...prev, res.data.category]); // Add to list
        }
      } catch (error) {
        const errors = error.response?.data?.errors;

        // If it's a duplicate category error from Laravel
        if (errors?.name?.includes("has already been taken")) {
          // Find the existing category in the options
          const existing = options.find(opt =>
            opt.name.toLowerCase() === value.name.toLowerCase()
          );

          if (existing) {
            setSelected([existing]); // Select existing category
          }

          // Optionally show a message to user
          messageHandler(`"${value.name}" category already exists. Selected existing.`, 'error');
        } else {
          messageHandler("Failed to create category.", "error");
          console.error(error);
        }

      }
    } else {
      setSelected(selected);
    }
  };
  const saveProduct = asyncHandler(async (e) => {
    e.preventDefault();

    if (selected.length === 0) {
      return messageHandler("Please select or add a category.", "error");
    }

    // Basic validation (you can make this more robust)
    let hasError = false;
    const newErrors = {};
    products.forEach((product, index) => {
      ['productName', 'quantity', 'price', 'stock', 'batchNo', 'unit'].forEach((field) => {
        if (!product[field]) {
          newErrors[`${field}-${index}`] = [`${field} is required`];
          hasError = true;
        }
      });
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axiosAuth.post('/products', {
        category_id: selected[0]?.id,
        products
      });

      messageHandler('Products saved successfully!', 'success');
      navigate('/products'); // or wherever
    } catch (error) {
      messageHandler('Failed to save products.', 'error');
      console.error(error);
    }
  });

  return (
    <section className="py-1">
      <div className="container">
        <section className="dash-form-wrapper">
          <div className="form-box">
            <h2 className="text-center mb-4 form-header">Add Products</h2>

            <form onSubmit={saveProduct}>

              {/* Dynamic Product Fields */}
              <div className="product-section mb-4">
                {products.map((product, index) => (
                  <div key={index} className="mb-4 p-3 border rounded position-relative">
                    <div className="form-floating-label mb-3">
                      <h5>Category:</h5>

                      <Typeahead
                        id="autocomplete-category"
                        labelKey="name"
                        onChange={handleCategoryChange}
                        options={options}
                        placeholder="Choose or type a category..."
                        selected={selected}
                        allowNew
                        multiple={false}
                        newSelectionPrefix="Add new: "
                      />
                    </div>

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
                    <div className="form-floating-label mb-3">
                      <input
                        type="number"
                        id={`stock-${index}`}
                        className={`form-input ${errors[`stock-${index}`] ? 'is-invalid' : ''}`}
                        value={product.stock}
                        onChange={(e) => handleProductChange(index, 'stock', e.target.value)}
                        min={1}
                        max={5000}
                        required
                      />
                      <label htmlFor={`stock-${index}`}>Stock</label>
                      {errors[`stock-${index}`] && (
                        <div className="error-text">{errors[`stock-${index}`][0]}</div>
                      )}
                    </div>
                    <div className="form-floating-label mb-3">
                      <input
                        type="text"
                        id={`batchNo-${index}`}
                        className={`form-input ${errors[`batchNo-${index}`] ? 'is-invalid' : ''}`}
                        value={product.batchNo}
                        onChange={(e) => handleProductChange(index, 'batchNo', e.target.value)}

                        required
                      />
                      <label htmlFor={`batchNo-${index}`}>Batch No</label>
                      {errors[`batchNo-${index}`] && (
                        <div className="error-text">{errors[`batchNo-${index}`][0]}</div>
                      )}
                    </div>
                    <div className="form-floating-label mb-3">
                      <input
                        type="text"
                        id={`unit-${index}`}
                        className={`form-input ${errors[`unit-${index}`] ? 'is-invalid' : ''}`}
                        value={product.unit}
                        onChange={(e) => handleProductChange(index, 'unit', e.target.value)}

                        required
                      />
                      <label htmlFor={`unit-${index}`}>Unit</label>
                      {errors[`unit-${index}`] && (
                        <div className="error-text">{errors[`unit-${index}`][0]}</div>
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
                        <i className="bi bi-dash-circle-fill"></i>
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


              <button type="submit" className="btn btn-green w-100">
                Save Product
              </button>
            </form>
          </div>
        </section>
      </div>
    </section>
  )
}

export default Products