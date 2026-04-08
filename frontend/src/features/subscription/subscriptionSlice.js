import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    subscriptions: [],
    activeCount: 0,
    loading: false,
    error: null
}

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers:{
        setSubscriptions(state, action) {
            state.subscriptions = action.payload;
            state.activeCount = action.payload.filter(sub => sub.status?.toLowerCase() === 'active').length;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        removeSubscription(state, action) {
            const id = action.payload;
            state.subscriptions = state.subscriptions.filter((sub) => sub._id !== id && sub.id !== id);
            state.activeCount = state.subscriptions.filter(sub => sub.status?.toLowerCase() === 'active').length;
        }
    }
});

export const {setSubscriptions, setLoading, removeSubscription} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;