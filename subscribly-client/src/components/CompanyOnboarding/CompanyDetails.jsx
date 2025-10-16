import { useEffect, useState } from 'react';
import asyncHandler from '../../util/asyncHandler';
import messageHandler from '../../util/messageHandler';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const CompanyDetails = () => {
  const [formData, setFormData] = useState({
    businessType: '',
    industry: '',
    gstin: '',
    pan: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    website: '',
  });

  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const naviagte=useNavigate();
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.post('/states', { country: 'India' });
        setStates(response.data);
        setFormData((prev) => ({ ...prev, state: '', city: '' }));
        setCities([]);
      } catch (error) {
        messageHandler(error.message || 'Failed to fetch states', 'error');
      }
    };

    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.state) return;

      try {
        const response = await axios.post('/cities', {
          country: 'India',
          state: formData.state,
        });
        setCities(response.data);
        setFormData((prev) => ({ ...prev, city: '' }));
      } catch (error) {
        messageHandler(error.message || 'Failed to fetch cities', 'error');
      }
    };

    fetchCities();
  }, [formData.state]);

  // Submit handler
  const handleSubmit = asyncHandler(async (e) => {
    e.preventDefault();

    try {
      const tenant_id = localStorage.getItem('tenantId');

      if (!tenant_id) {
        messageHandler('Tenant ID is missing. Please log in again.', 'error');
        return;
      }

      const payload = {
        ...formData,
        tenant_id,
      };

      await axios.post('/company-details', payload);

      messageHandler('Company details submitted successfully!', 'success');
      naviagte('/VendorDashboard');
      setErrors({}); // clear previous errors
      
      // Optionally reset form
      // setFormData(initialState);

    } catch (error) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setErrors(error.response.data.errors);
        messageHandler(errorMessages[0] || 'Please fix the form errors.', 'error');
      } else {
        messageHandler(error.message || 'Something went wrong.', 'error');
      }
    }
  });

  return (
    <section className="form-wrapper">
      <div className="form-box">
        <h2 className="text-center mb-4 form-header">Company Details</h2>

        <form onSubmit={handleSubmit}>

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
              maxLength={15}
              className={`form-input ${errors.gstin ? 'is-valid' : ''}`}
              value={formData.gstin}
              onChange={handleChange}
            />
            <label htmlFor="gstin">GSTIN</label>
            {errors.gstin && <div className="error-text">{errors.gstin[0]}</div>}
          </div>

          {/* PAN */}
          <div className="form-floating-label mb-4">
            <input
              type="text"
              id="pan"
              name="pan"
              maxLength={10}
              className={`form-input ${errors.pan ? 'is-valid' : ''}`}
              value={formData.pan}
              onChange={handleChange}
              required
            />
            <label htmlFor="pan">PAN</label>
            {errors.pan && <div className="error-text">{errors.pan[0]}</div>}
          </div>

          {/* State */}
          <div className="form-floating-label mb-4">
            <select
              id="state"
              name="state"
              className={`form-input ${errors.state ? 'is-valid' : ''}`}
              value={formData.state}
              onChange={handleChange}
              required
              disabled={!states.length}
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <label htmlFor="state">State</label>
            {errors.state && <div className="error-text">{errors.state[0]}</div>}
          </div>

          {/* City */}
          <div className="form-floating-label mb-4">
            <select
              id="city"
              name="city"
              className={`form-input ${errors.city ? 'is-valid' : ''}`}
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!cities.length}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <label htmlFor="city">City</label>
            {errors.city && <div className="error-text">{errors.city[0]}</div>}
          </div>

          {/* Address */}
          <div className="form-floating-label mb-4">
            <input
              type="text"
              id="address"
              name="address"
              className={`form-input ${errors.address ? 'is-valid' : ''}`}
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label htmlFor="address">Address</label>
            {errors.address && <div className="error-text">{errors.address[0]}</div>}
          </div>

          {/* Pincode */}
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
              className={`form-input ${errors.website ? 'is-valid' : ''}`}
              value={formData.website}
              onChange={handleChange}
            />
            <label htmlFor="website">Website</label>
            {errors.website && <div className="error-text">{errors.website[0]}</div>}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100">
            Submit Company Details
          </button>
        </form>
      </div>
    </section>
  );
};

export default CompanyDetails;
