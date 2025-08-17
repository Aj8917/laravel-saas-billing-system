import React from 'react';

const Signup = () => {
  return (
 <section className="signup-wrapper">
      <div className="signup-box">
        <h2 className="text-center mb-4">Create Your Account</h2>
        <form>
          <div className="form-floating-label mb-4">
            <input type="text" id="fullName" className="form-input" required />
            <label htmlFor="fullName">Full Name</label>
          </div>

          <div className="form-floating-label mb-4">
            <input type="email" id="email" className="form-input" required />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-floating-label mb-4">
            <input type="password" id="password" className="form-input" required />
            <label htmlFor="password">Password</label>
          </div>

          <div className="form-floating-label mb-4">
            <input type="text" id="company" className="form-input" />
            <label htmlFor="company">Company Name</label>
          </div>

          <div className="form-check mb-3">
            <input type="checkbox" id="terms" className="form-check-input" required />
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
