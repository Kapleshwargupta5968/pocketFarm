import axiosInstance from "./axiosInstance"

export const subscribeToPlot = async (data) => {
    const response = await axiosInstance.post("/subscriptions/subscribe", data);
    return response.data;
}

export const getMySubscriptions = async () => {
    const response = await axiosInstance.get("/subscriptions/my-subscriptions");
    return response.data;
};

export const getSubscriptionById = async (id) => {
    const response = await axiosInstance.get(`/subscriptions/${id}`);
    return response.data;
}

export const cancelSubscription = async (id) => {
    const response = await axiosInstance.delete(`/subscriptions/${id}`);
    return response.data;
};

export const renewSubscription = async (id, data) => {
    const response = await axiosInstance.post(`/subscriptions/${id}/renew`, data);
    return response.data;
};