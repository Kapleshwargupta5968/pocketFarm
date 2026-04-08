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
        authStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        authSuccess: (state, action) => {
            state.loading = false;
            // Normalize user object to use _id instead of id for consistency
            const userData = action.payload;
            state.user = {
                ...userData,
                _id: userData.id || userData._id
            };
        },

        authFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
});

export const {authStart, authSuccess, authFailure, logout} = authSlice.actions;

export default authSlice.reducer;