import { useState } from 'react'
import asyncHandler from '../../util/asyncHandler';
import axios, { Axios } from 'axios';
import messageHandler from '../../util/messageHandler';



const Signin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});


    const login = asyncHandler(async (e) => {
        e.preventDefault()
        //  console.log("login", email, password);

        try {
            const response = await axios.post('/signin', { email, password });
           // console.log("response", response.data);
            messageHandler("Login Successfully! " + response.user, "success");
        } catch (error) {
            console.log("error response", error.response);
            if (error.response && error.response.status === 401) {
                messageHandler( error.response.data.errors,"error");
            } else {
                messageHandler( error.message || "Something went wrong","error");
            }
        }

    });
    return (
        <div>
            <section className="signup-wrapper">
                <div className="signup-box">
                    <h2 className="text-center mb-4 form-header">Signin</h2>
                    <form onSubmit={login}>

                        <div className="form-floating-label mb-4">
                            <input
                                type="email"
                                id="email"
                                className={`form-input ${errors.email ? 'is-valid' : ''}`}
                                value={email || " "}
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

                        <button type="submit" className="btn btn-primary w-100">
                            Sign In
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Signin