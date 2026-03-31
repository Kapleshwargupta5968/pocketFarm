import axiosInstance from "./axiosInstance";

export const getDashboardStats = async () => {
    try{
        const response = await axiosInstance.get("/dashboard");
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const getEarningData = async () => {
    try{
        const response = await axiosInstance.get("/dashboard/earnings");
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const getDashboardTable = async (type) => {
    try{
        const response = await axiosInstance.get('/dashboard/table');
        return response?.data;
    }catch(error){
        throw error;
    }
};
