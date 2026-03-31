import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  count: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers:{
    setNotifications:(state, action) => {
        state.notifications = action.payload;
        state.count = action.payload.count || 0;
    }
  }
});

export const {setNotifications} = notificationSlice.actions;

export default notificationSlice.reducer;