import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { Axios } from 'axios';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

export const signin = createAsyncThunk(
    'auth/signin',

    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post('/signin', { email, password });
            return response.data; // expected: { user, token }
        } catch (error) {
           
            return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
        }
    }
)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signout : (state) => {
            state.user = null;
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

export const {signout } = authSlice.actions;
export default authSlice.reducer;