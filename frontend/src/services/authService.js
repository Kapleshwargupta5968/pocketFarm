import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {
    try{
        const response = await axiosInstance.post("/auth/signup", userData);
        localStorage.setItem("hasSession", "true");
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const loginUser = async (userData) => {
    try{
        const response = await axiosInstance.post("/auth/signin", userData);
        localStorage.setItem("hasSession", "true");
        return response?.data
    }catch(error){
        throw error;
    }
};

export const getMe = async () => {
    try{
        console.log("🔐 Calling /auth/me endpoint...");
        const response = await axiosInstance.get("/auth/me");
        console.log("✅ User fetched:", response?.data?.user);
        return response?.data?.user;
    }catch(error){
        console.error("❌ getMe error:", error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try{
        const response = await axiosInstance.post("/auth/logout");
        localStorage.removeItem("hasSession");
        return response?.data;
    }catch(error){
        localStorage.removeItem("hasSession");
        throw error;
    }
};