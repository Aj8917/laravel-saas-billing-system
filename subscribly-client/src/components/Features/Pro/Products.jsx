import React, { useEffect, useState } from 'react';
import asyncHandler from '../../../util/asyncHandler';
import messageHandler from '../../../util/messageHandler';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../../../api/axiosAuth';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const Products = () => {
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [products, setProducts] = useState([
    {
      productName: '',
      quantity: 1,
      price: '',
      stock: '',
      batchNo: '',
      unit: '',
      category: [],
      attributes: [] // ✅ initialize as array
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

  const handleCategoryChange = async (index, selectedCategory) => {
    const value = selectedCategory[0];
    const updatedProducts = [...products];

    if (value?.customOption) {
      try {
        const res = await axiosAuth.post('categories', { name: value.name });
        if (res?.data?.category) {
          updatedProducts[index].category = [res.data.category];
          setProducts(updatedProducts);
          setOptions(prev => [...prev, res.data.category]);
        }
      } catch (error) {
        const errors = error.response?.data?.errors;
        if (errors?.name?.includes("has already been taken")) {
          const existing = options.find(opt =>
            opt.name.toLowerCase() === value.name.toLowerCase()
          );
          if (existing) {
            updatedProducts[index].category = [existing];
            setProducts(updatedProducts);
          }
          messageHandler(`"${value.name}" category already exists. Selected existing.`, 'error');
        } else {
          messageHandler("Failed to create category.", 'error');
          console.error(error);
        }
      }
    } else {
      updatedProducts[index].category = selectedCategory;
      setProducts(updatedProducts);
    }

    setErrors(prev => ({
      ...prev,
      [`category-${index}`]: null
    }));
  };

  const handleAddProduct = () => {
    setProducts([...products, {
      productName: '',
      quantity: 1,
      price: '',
      stock: '',
      batchNo: '',
      unit: '',
      category: [],
      attributes: [] // ✅ add for new product too
    }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const saveProduct = asyncHandler(async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = {};
    products.forEach((product, index) => {
      const requiredFields = ['productName', 'quantity', 'price', 'stock', 'batchNo', 'unit'];
      requiredFields.forEach((field) => {
        if (product[field] === undefined || product[field] === '' || product[field] === null) {
          newErrors[`${field}-${index}`] = [`${field} is required.`];
          hasError = true;
        }
      });

      if (!product.category || product.category.length === 0) {
        newErrors[`category-${index}`] = ['Category is required'];
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const formattedProducts = products.map((product) => ({
        ...product,
        category_id: product.category[0]?.id
      }));

      await axiosAuth.post('/products', {
        products: formattedProducts
      });

      messageHandler('Products saved successfully!', 'success');

      setProducts([{
        productName: '',
        quantity: 1,
        price: '',
        stock: '',
        batchNo: '',
        unit: '',
        category: [],
        attributes: [] // ✅ reset as array
      }]);
      setErrors({});
      navigate('/products');
    } catch (error) {
      messageHandler('Failed to save products.', 'error');
      console.error(error);
    }
  });

  // ✅ ATTRIBUTE HANDLERS
  const addAttribute = (productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].attributes.push({ attribute: '', value: '' });
    setProducts(updatedProducts);
  };

  const removeAttribute = (productIndex, attrIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].attributes = updatedProducts[productIndex].attributes.filter(
      (_, i) => i !== attrIndex
    );
    setProducts(updatedProducts);
  };

  const handleAttributeChange = (productIndex, attrIndex, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].attributes[attrIndex][field] = value;
    setProducts(updatedProducts);
  };

  return (
    <section className="py-1">
      <div className="container">
        <section className="dash-form-wrapper">
          <div className="form-box">
            <h2 className="text-center mb-4 form-header">Add Products</h2>

            <form onSubmit={saveProduct}>
              <div className="product-section mb-4">
                {products.map((product, index) => (
                  <div key={index} className="mb-4 p-3 border rounded position-relative">

                    {/* CATEGORY FIELD */}
                    <div className="form-floating-label mb-3">
                      <h5>Category:</h5>
                      <Typeahead
                        id={`autocomplete-category-${index}`}
                        labelKey="name"
                        onChange={(selected) => handleCategoryChange(index, selected)}
                        options={options}
                        placeholder="Choose or type a category..."
                        selected={product.category}
                        allowNew
                        multiple={false}
                        newSelectionPrefix="Add new: "
                        highlightOnlyResult
                        filterBy={(option, props) =>
                          option.name.toLowerCase().includes(props.text.toLowerCase())
                        }
                        renderMenuItemChildren={(option) => (
                          <span>{option.name}</span>
                        )}
                      />
                      {errors[`category-${index}`] && (
                        <div className="error-text">{errors[`category-${index}`][0]}</div>
                      )}
                    </div>

                    {/* PRODUCT FIELDS */}
                    {['productName', 'quantity', 'price', 'stock', 'batchNo', 'unit'].map((field) => (
                      <div className="form-floating-label mb-3" key={field}>
                        <input
                          type={['quantity', 'price', 'stock'].includes(field) ? 'number' : 'text'}
                          id={`${field}-${index}`}
                          className={`form-input ${errors[`${field}-${index}`] ? 'is-invalid' : ''}`}
                          value={product[field]}
                          onChange={(e) => handleProductChange(index, field, e.target.value)}
                          min={['quantity', 'price', 'stock'].includes(field) ? 1 : undefined}
                          required
                        />
                        <label htmlFor={`${field}-${index}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        {errors[`${field}-${index}`] && (
                          <div className="error-text">{errors[`${field}-${index}`][0]}</div>
                        )}
                      </div>
                    ))}

                    {/* ✅ ATTRIBUTES SECTION */}
                    <h5>Attributes:</h5>
                    {product.attributes.map((attr, attrIndex) => (
                      <div key={attrIndex} className="attribute-group d-flex align-items-start gap-2 mb-2">
                        <div className="form-floating-label flex-fill">
                          <input
                            type="text"
                            className="form-input"
                            value={attr.attribute}
                            onChange={(e) =>
                              handleAttributeChange(index, attrIndex, 'attribute', e.target.value)
                            }
                          />
                          <label htmlFor={`attribute-${attrIndex}`}>Attribute</label>
                        </div>

                        <div className="form-floating-label flex-fill">
                          <input
                            type="text"
                            className="form-input"
                            value={attr.value}
                            onChange={(e) =>
                              handleAttributeChange(index, attrIndex, 'value', e.target.value)
                            }
                          />
                          <label htmlFor={`value-${attrIndex}`}>Value</label>
                        </div>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm mt-1"
                          onClick={() => removeAttribute(index, attrIndex)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm mb-3"
                      onClick={() => addAttribute(index)}
                    >
                      + Add Attribute
                    </button>

                    {/* REMOVE PRODUCT BUTTON */}
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

                {/* ADD PRODUCT BUTTON */}
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
  );
};

export default Products;
