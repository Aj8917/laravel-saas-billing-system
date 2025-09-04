import React, { useState } from 'react';
import axios from 'axios';
import asyncHandler from '../../util/asyncHandler';
import messageHandler from '../../util/messageHandler';
const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [agree, setAgree] = useState('false');
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = asyncHandler(async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {

      setErrors(prev => ({
        ...prev,
        confirmPassword: ['Passwords do not match!']
      }));
      messageHandler("Confirm Password and password dosen't match !", "error");


    } else {
      //console.log('inside'+name,email,password,agree)
      try {
        const response = await axios.post('signup', { name, email, password, company_name, agree })
        messageHandler(response.data.success, "success");
      } catch (error) {
        setErrors(error.response?.data?.errors || {});
        //console.log(error.response?.data?.errors)
      }
    }
  }
  )

  return (
    <section className="signup-wrapper">
      <div className="signup-box">
        <h2 className="text-center mb-4 form-header">Create Your Account</h2>
        <form onSubmit={register}>
          <div className="form-floating-label mb-4">
            <input type="text"
              id="fullName"
              className={`form-input ${errors.name ? 'is-valid' : ''}`}
              value={name}
              onChange={e => {
                setName(e.target.value)
                setErrors(prev => ({ ...prev, name: null }))
              }}
              required />
            <label htmlFor="fullName">Full Name</label>
            {errors.name && <div className="error-text">{errors.name[0]}</div>}
          </div>

          <div className="form-floating-label mb-4">
            <input type="email"
              id="email"
              className={`form-input ${errors.email ? 'is-valid' : ''}`}
              value={email}
              
              onChange={e => {
                setEmail(e.target.value);
                setErrors(prev => ({ ...prev, email: null }));
              }}

              required />
            <label htmlFor="email">Email</label>

            {errors.email && <div className="error-text">{errors.email[0]}</div>}

          </div>

          <div className="form-floating-label mb-4">
            <input type="password"
              id="password"
              className={`form-input ${errors.password ? 'is-valid' : ''}`}
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setErrors(prev => ({ ...prev, password: null }))
              }}
              required />
            <label htmlFor="password">Password</label>

            {errors.password && <div className="error-text">{errors.password[0]}</div>}
          </div>
          <div className="form-floating-label mb-4">
            <input type="password"
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'is-valid' : ''}`}
              value={confirmPassword || ''}
              onChange={e => {
                setConfirmPassword(e.target.value)
                setErrors(prev => ({ ...prev, confirmPassword: null }))
              }}
              required />
            <label htmlFor="confirmPassword">Confirm Password</label>

          </div>
          <div className="form-floating-label mb-4">
            <input
              type="text"
              id="company"
              className={`form-input ${errors.company ? 'is-valid' : ''}`}
              value={company_name}
              onChange={e => {
                setCompanyName(e.target.value)
                setErrors(prev => ({ ...prev, company_name: null }))
              }}
              required />
            <label htmlFor="company">Company Name</label>
            {errors.companyname && <div className="error-text">{errors.companyname[0]}</div>}
          </div>

          <div className="form-check mb-3">
            <input type="checkbox" id="terms" className="form-check-input"
              onChange={e => setAgree(e.target.checked)}
              required />
            <label htmlFor="terms" className="form-check-label">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signup;
