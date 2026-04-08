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
        state.notifications = action.payload.notifications || [];
        state.count = action.payload.count || 0;
    },
    addNotification:(state, action) => {
        const exists = state.notifications.some((n) => n._id === action.payload._id);
        if (!exists) {
            state.notifications.unshift(action.payload);
            if (!action.payload.isRead) {
                state.count += 1;
            }
        }
    },
    updateNotificationRead:(state, action) => {
        const notification = state.notifications.find((n) => n._id === action.payload);
        if (notification && !notification.isRead) {
            notification.isRead = true;
            state.count = Math.max(0, state.count - 1);
        }
    },
    removeNotification:(state, action) => {
        const notification = state.notifications.find((n) => n._id === action.payload);
        if (notification) {
            state.notifications = state.notifications.filter((n) => n._id !== action.payload);
            if (!notification.isRead) {
                state.count = Math.max(0, state.count - 1);
            }
        }
    }
  }
});

export const {setNotifications, addNotification, updateNotificationRead, removeNotification} = notificationSlice.actions;

export default notificationSlice.reducer;