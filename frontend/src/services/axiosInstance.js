import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"http://localhost:5000/api",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
    }
});

axiosInstance.interceptors.request.use((config)=>{
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
        const publicPaths = ['/signin', '/signup'];
        const isAuthEndpoint = originalRequest.url && originalRequest.url.includes('/auth/me');
        const isRefreshEndpoint = originalRequest.url && originalRequest.url.includes('/auth/refreshToken');
        
        if (isRefreshEndpoint) {
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.replace("/signin");
            }
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        try {
            await axios.post("http://localhost:5000/api/auth/refreshToken", {}, { withCredentials: true });
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            if (!publicPaths.includes(window.location.pathname) && !isAuthEndpoint) {
                 window.location.replace("/signin");
            }
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default axiosInstance