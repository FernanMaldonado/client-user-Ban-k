import { axiosAuth } from "./api";

export const login = async (data) => {
    return await axiosAuth.post("/api/v1/auth/login", data);
};

export const register = async (data) => {
    return await axiosAuth.post("/api/v1/auth/register", data);
};

export const forgotPassword = async (email) => {
    return await axiosAuth.post("/api/v1/auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
    return await axiosAuth.post("/api/v1/auth/reset-password", { token, newPassword }); 
};

export const verifyEmail = async (token) => {
    return await axiosAuth.post("/api/v1/auth/verify-email", { token });
}