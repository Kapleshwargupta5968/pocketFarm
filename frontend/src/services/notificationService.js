import axiosInstance from "./axiosInstance";

export const getMyNotifications = async () => {
    try {
        console.log("🌐 API call: GET /notifications");
        const response = await axiosInstance.get("/notifications");
        console.log("✅ Response received:", response?.data);
        return response?.data;
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        throw error;
    }
}

export const markAsRead = async (notificationId) => {
    try {
        console.log("🌐 API call: PUT /notifications/:id/read");
        const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const markAllAsRead = async () => {
    try {
        console.log("🌐 API call: PUT /notifications/mark-all-read");
        const response = await axiosInstance.put("/notifications/mark-all-read");
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const deleteNotification = async (notificationId) => {
    try {
        console.log("🌐 API call: DELETE /notifications/:id");
        const response = await axiosInstance.delete(`/notifications/${notificationId}`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}
