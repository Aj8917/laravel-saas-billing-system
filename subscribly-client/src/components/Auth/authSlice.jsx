import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { Axios } from 'axios';

const initialState = {
    userData: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        permissions: JSON.parse(localStorage.getItem('permissions')) || [], // ✅ store permissions
    },
    token: localStorage.getItem('token') || null,
    isAuthenticated: localStorage.getItem('isAuthenticated') || false,
    loading: false,
    plan:localStorage.getItem('plan')|| null,
    error: null
};

export const signin = createAsyncThunk(
    'auth/signin',

    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post('/signin', { email, password });
            const userData = {
                name: response.data.user,
                role: response.data.role,
                permissions: response.data.permissions, // ✅ store permissions
            };
            const token = response.data.access_token;
            const plan =response.data.plan;
            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('permissions', JSON.stringify(userData.permissions));
            localStorage.setItem('plan', plan);
            localStorage.setItem('isAuthenticated', 'true');

            // Return to reducer
            return { userData, token, plan };
        } catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
        }
    }
)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tenantId');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('plan');
            localStorage.removeItem('active_plan');
            
            state.userData.user = null;
            state.token = null;
            state.plan = null;
            state.isAuthenticated = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.permissions = action.payload.userData.permissions; // ✅ set permissions
                state.token = action.payload.token;
                state.plan = action.payload.plan;
                state.isAuthenticated = true;
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            });

    }
});

export const { signout } = authSlice.actions;
export default authSlice.reducer;