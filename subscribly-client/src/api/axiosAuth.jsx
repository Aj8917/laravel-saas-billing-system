import axios from "axios";
import { signout } from '../components/Auth/authSlice';
import { store } from '../store';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000/api';

const axiosAuth=axios.create({
    headers:{
        'Content-Type':'application/json',
        Accept:'application/json'
    },
});

axiosAuth.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');

    if(token)
    {
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});
// Handle expired/invalid authentication
axiosAuth.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
              store.dispatch(signout());
            
            window.location.href = '/signin';
        }

        return Promise.reject(error);
    }
);
export default axiosAuth;