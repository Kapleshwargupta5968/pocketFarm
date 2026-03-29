import axiosInstance from "./axiosInstance";


export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post("/payment/create-order", orderData);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const verifyPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post("/payment/verify-payment", paymentData);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const getMyPayment = async () => {
    try {
        const response = await axiosInstance.get("/payment");
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const getPaymentById = async (paymentId) => {
    try {
        const response = await axiosInstance.get(`/payment/${paymentId}`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const retryPayment = async (paymentId) => {
    try {
        const response = await axiosInstance.post(`/payment/retry/${paymentId}`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}