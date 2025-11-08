import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../Auth/authSlice';
import { useNavigate } from 'react-router-dom';
import messageHandler from '../../util/messageHandler';

const Signin = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const naviagte=useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(signin({ email, password }));

        if (signin.fulfilled.match(result)) {
            messageHandler('Login Successfully!', 'success');
            naviagte('/VendorDashboard');
        } else {
            const serverErrors = result.payload?.errors;
            if (serverErrors) {
                setErrors(serverErrors); // Backend errors like: { email: ['Required'], password: ['Invalid'] }
               //messageHandler('Login failed: ' + Object.values(serverErrors).flat().join(', '), 'error');
               messageHandler('Login failed: '+serverErrors, 'error');
            } else {
                messageHandler(result.payload || 'Login failed', 'error');
            }
        }
    };

    return (
        <div>
            <section className="signup-wrapper">
                <div className="signup-box">
                    <h2 className="text-center mb-4 form-header">Signin</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating-label mb-4">
                            <input
                                type="email"
                                id="email"
                                className={`form-input ${errors.email ? 'is-valid' : ''}`}
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                    setErrors(prev => ({ ...prev, email: null }));
                                }}
                                required
                            />
                            <label htmlFor="email">Email</label>
                            {errors.email && <div className="error-text">{errors.email[0]}</div>}
                        </div>

                        <div className="form-floating-label mb-4">
                            <input
                                type="password"
                                id="password"
                                className={`form-input ${errors.password ? 'is-valid' : ''}`}
                                value={password}
                                onChange={e => {
                                    setPassword(e.target.value);
                                    setErrors(prev => ({ ...prev, password: null }));
                                }}
                                required
                            />
                            <label htmlFor="password">Password</label>
                            {errors.password && <div className="error-text">{errors.password[0]}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Signin;
