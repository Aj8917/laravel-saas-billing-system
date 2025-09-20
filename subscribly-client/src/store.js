import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/components/Auth/authSlice';

export const store =configureStore({
    reducer :{
        auth: authReducer,
    },
})