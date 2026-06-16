import { useAuthStore } from "../store/authStore";

export const useRegisterUser = () => {
    const register = useAuthStore(state => state.register);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    const registerUser = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("address", data.address);
        formData.append("password", data.password);
        formData.append("phone", data.phone);
        formData.append("dpi", data.dpi);
        formData.append("jobName", data.jobName);
        formData.append("monthlyIncome", data.monthlyIncome);
        formData.append("birthDate", data.birthDate);
        return await register(formData);
    }

    return { registerUser, loading, error };
}
