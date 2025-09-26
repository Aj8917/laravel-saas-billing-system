import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { Axios } from 'axios';

const initialState = {
    userData: {
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    token: localStorage.getItem('token') || null,
    isAuthenticated: localStorage.getItem('isAuthenticated') || false,
    loading: false,
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
            };
            const token = response.data.access_token;
            // Store token and user in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('isAuthenticated', 'true');

            // Return to reducer
            return { userData, token };
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

            state.userData.user = null;
            state.token = null;
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
                state.token = action.payload.token;
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