import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {
    try{
        const response = await axiosInstance.post("/auth/signup", userData);
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const loginUser = async (userData) => {
    try{
        const response = await axiosInstance.post("/auth/signin", userData);
        return response?.data
    }catch(error){
        throw error;
    }
};

export const getMe = async () => {
    try{
        const response = await axiosInstance.get("/auth/me");
        return response?.data?.user;
    }catch(error){
        throw error;
    }
};

export const logoutUser = async () => {
    try{
        const response = await axiosInstance.post("/auth/logout");
        return response?.data;
    }catch(error){
        throw error;
    }
};