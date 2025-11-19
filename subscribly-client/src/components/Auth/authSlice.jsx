import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ---------------------------------------------
// Load From LocalStorage Only Once (Best Practice)
// ---------------------------------------------
const storedUser = JSON.parse(localStorage.getItem("user")) || null;
const storedPermissions = JSON.parse(localStorage.getItem("permissions")) || [];
const storedToken = localStorage.getItem("token") || null;
const storedPlan = localStorage.getItem("plan") || null;
const storedAuth = localStorage.getItem("isAuthenticated") === "true";

const initialState = {
    userData: {
        user: storedUser,
        permissions: storedPermissions,
    },
    token: storedToken,
    isAuthenticated: storedAuth,
    plan: storedPlan,
    loading: false,
    error: null,
};

// ---------------------------------------------
// Login Thunk
// ---------------------------------------------
export const signin = createAsyncThunk(
    "auth/signin",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post("/signin", { email, password });

            const userData = {
                name: response.data.user,
                role: response.data.role,
                permissions: response.data.permissions,
            };

            const token = response.data.access_token;
            const plan = response.data.plan;

            // Store in localStorage once user logs in
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("permissions", JSON.stringify(userData.permissions));
            localStorage.setItem("plan", plan);
            localStorage.setItem("isAuthenticated", "true");

            return { userData, token, plan };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

// ---------------------------------------------
// Auth Slice
// ---------------------------------------------
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signout: (state) => {
            // Clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("permissions");
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("plan");
            localStorage.removeItem("active_plan");
            localStorage.removeItem("tenantId");

            // Clear Redux state
            state.userData.user = null;
            state.userData.permissions = [];
            state.token = null;
            state.plan = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(signin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.userData;
                state.token = action.payload.token;
                state.plan = action.payload.plan;
                state.isAuthenticated = true;
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { signout } = authSlice.actions;
export default authSlice.reducer;
