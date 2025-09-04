import { useState } from 'react';
import asyncHandler from '../../util/asyncHandler';
import messageHandler from '../../util/messageHandler';
import axios from 'axios';

const CompanyDetails = () => {
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    industry: '',
    gstin: '',
    pan: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    website: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = asyncHandler(async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/company-details', formData);
      messageHandler('success', 'Company details submitted successfully!');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        messageHandler('error', 'Please correct the errors.');
      } else {
        messageHandler('error', error.message || 'Something went wrong.');
      }
    }
  });

  return (
   <section className="form-wrapper">
      <div className="form-box">
      <h2 className="text-center mb-4 form-header">Company Details</h2>
      <form onSubmit={handleSubmit}>

        {/* Company Name */}
        <div className="form-floating-label mb-4">
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${errors.name ? 'is-valid' : ''}`}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name">Company Name</label>
          {errors.name && <div className="error-text">{errors.name[0]}</div>}
        </div>

        {/* Business Type */}
        <div className="form-floating-label mb-4">
          <select
            id="businessType"
            name="businessType"
            className={`form-input ${errors.businessType ? 'is-valid' : ''}`}
            value={formData.businessType}
            onChange={handleChange}
            required
          >
            <option value="">Select Business Type</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <label htmlFor="businessType">Business Type</label>
          {errors.businessType && <div className="error-text">{errors.businessType[0]}</div>}
        </div>

        {/* Industry */}
        <div className="form-floating-label mb-4">
          <input
            type="text"
            id="industry"
            name="industry"
            className={`form-input ${errors.industry ? 'is-valid' : ''}`}
            value={formData.industry}
            onChange={handleChange}
            required
          />
          <label htmlFor="industry">Industry Type</label>
          {errors.industry && <div className="error-text">{errors.industry[0]}</div>}
        </div>

        {/* GSTIN */}
        <div className="form-floating-label mb-4">
          <input
            type="text"
            id="gstin"
            name="gstin"
            className="form-input"
            value={formData.gstin}
            onChange={handleChange}
          />
          <label htmlFor="gstin">GSTIN (Optional)</label>
        </div>

        {/* PAN */}
        <div className="form-floating-label mb-4">
          <input
            type="text"
            id="pan"
            name="pan"
            className={`form-input ${errors.pan ? 'is-valid' : ''}`}
            value={formData.pan}
            onChange={handleChange}
            required
          />
          <label htmlFor="pan">PAN</label>
          {errors.pan && <div className="error-text">{errors.pan[0]}</div>}
        </div>

        {/* Address */}
        <div className="form-floating-label mb-4">
          <textarea
            id="address"
            name="address"
            className={`form-input ${errors.address ? 'is-valid' : ''}`}
            value={formData.address}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
          <label htmlFor="address">Address</label>
          {errors.address && <div className="error-text">{errors.address[0]}</div>}
        </div>

        {/* State */}
        <div className="form-floating-label mb-4">
          <input
            type="text"
            id="state"
            name="state"
            className={`form-input ${errors.state ? 'is-valid' : ''}`}
            value={formData.state}
            onChange={handleChange}
            required
          />
          <label htmlFor="state">State</label>
          {errors.state && <div className="error-text">{errors.state[0]}</div>}
        </div>

        {/* City */}
        <div className="form-floating-label mb-4">
          <input
            type="text"
            id="city"
            name="city"
            className={`form-input ${errors.city ? 'is-valid' : ''}`}
            value={formData.city}
            onChange={handleChange}
            required
          />
          <label htmlFor="city">City</label>
          {errors.city && <div className="error-text">{errors.city[0]}</div>}
        </div>

        {/* PIN Code */}
        <div className="form-floating-label mb-4">
          <input
            type="text"
            id="pincode"
            name="pincode"
            className={`form-input ${errors.pincode ? 'is-valid' : ''}`}
            value={formData.pincode}
            onChange={handleChange}
            required
          />
          <label htmlFor="pincode">PIN Code</label>
          {errors.pincode && <div className="error-text">{errors.pincode[0]}</div>}
        </div>

        {/* Website */}
        <div className="form-floating-label mb-4">
          <input
            type="url"
            id="website"
            name="website"
            className="form-input"
            value={formData.website}
            onChange={handleChange}
          />
          <label htmlFor="website">Website (Optional)</label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit Company Details
        </button>
      </form>
    </div>
    </section>
  );
};

export default CompanyDetails;
