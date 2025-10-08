import axios from "axios";
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

export default axiosAuth;