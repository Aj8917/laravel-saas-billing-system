import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import messageHandler from '../util/messageHandler';

const ContactUs = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(formData)
        try {
            setLoading(true);

            const response = await axios.post('/contact-us', formData);
            console.log(response)
            messageHandler(response?.data?.message, 'success');

            setFormData({
                name: '',
                email: '',
                mobile: '',
            });

            setErrors({});

            navigate('/');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);

                const errorMessages = Object.values(
                    error.response.data.errors
                ).flat();

                messageHandler(
                    errorMessages[0] || 'Please fix the form errors.',
                    'error'
                );
            } else {
                messageHandler(
                    error.response?.data?.message ||
                    'Something went wrong. Please try again.',
                    'error'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="signup-wrapper">
            <div className="signup-box">
                <h2 className="text-center mb-4 form-header">
                    Contact Us
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-floating-label mb-4">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={`form-input ${errors.name ? 'is-invalid' : ''
                                }`}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="name">Name</label>

                        {errors.name && (
                            <div className="error-text">
                                {errors.name[0]}
                            </div>
                        )}
                    </div>

                    <div className="form-floating-label mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'is-invalid' : ''
                                }`}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email</label>

                        {errors.email && (
                            <div className="error-text">
                                {errors.email[0]}
                            </div>
                        )}
                    </div>

                    <div className="form-floating-label mb-4">
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            className={`form-input ${errors.mobile ? 'is-invalid' : ''
                                }`}
                            value={formData.mobile}
                            onChange={handleChange}
                            maxLength={10}
                            required
                        />
                        <label htmlFor="mobile">Mobile Number</label>

                        {errors.mobile && (
                            <div className="error-text">
                                {errors.mobile[0]}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>

                    <div className="text-center mt-3">
                        <a
                            href="/"
                            className="btn btn-warning btn-sm px-3"
                        >
                            Back to Home
                        </a>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactUs;