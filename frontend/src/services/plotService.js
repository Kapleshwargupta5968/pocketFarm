import axiosInstance from "./axiosInstance";

export const createPlot = async (plotData) => {
    try{
        const response = await axiosInstance.post("/plots", plotData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const getMyPlots = async () => {
    try{
        const response = await axiosInstance.get("/plots/my-plots");
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const getAllPlots = async () => {
    try{
        const response = await axiosInstance.get("/plots");
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const getPlotById = async (plotId) => {
    try{
        const response = await axiosInstance.get(`/plots/${plotId}`);
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const updatePlot = async (plotId, plotData) => {
    try{
        const response = await axiosInstance.put(`/plots/${plotId}`, plotData);
        return response?.data;
    }catch(error){
        throw error;
    }
};

export const deletePlot = async (plotId) => {
    try{
        const response = await axiosInstance.delete(`/plots/${plotId}`);
        return response?.data;
    }catch(error){
        throw error;
    }
};


export const searchPlots = async (params) => {
    try{
        const response = await axiosInstance.get("/plots/search", { params });
        return response?.data;
    }catch(error){
        throw error;
    }
};