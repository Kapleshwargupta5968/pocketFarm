import axiosInstance from "./axiosInstance";

export const getMyNotifications = async () => {
    try {
        const response = await axiosInstance.get("/notifications");
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const markAsRead = async (notificationId) => {
    try {
        const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const markAllAsRead = async () => {
    try {
        const response = await axiosInstance.put("/notifications/mark-all-read");
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const deleteNotification = async (notificationId) => {
    try {
        const response = await axiosInstance.delete(`/notifications/${notificationId}`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}
