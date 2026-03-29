import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    loading:false,
    error:null
};

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },

        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
});

export const {loginStart, loginSuccess, loginFailure, logout} = authSlice.actions;

export default authSlice.reducer;