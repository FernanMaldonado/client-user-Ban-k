import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    login as loginRequest,
    register as registerRequest,
} from "../../../shared/api/auth.js"
import toast from "react-hot-toast";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            loading: false,
            error: null,
            isLoadingAuth: true,
            isAuthenticated: false,

            checkAuth: () => {
                const token = get().token;
                const role = get().user?.role;
                const isUser = role === "USER_ROLE";

                if (token && !isUser) {
                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        expiresAt: null,
                        isAuthenticated: false,
                        isLoadingAuth: true,
                        error: "No tienes permiso para acceder como usuario"
                    })
                }
            },
            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    expiresAt: null,
                    isAuthenticated: false,
                })
            },
            login: async ({ emailOrUsername, password }) => {

                set({ loading: true })
                try {

                    const { data } = await loginRequest({ emailOrUsername, password })

                    // Solo usuarios pueden iniciar sesion en client-user

                    const role = data?.userDetails?.role;
                    if (role !== "USER_ROLE") {
                        const message = "Eres un usuario con permisos administrativos. Por favor, inicia sesión en la plataforma de administración.";
                        set({
                            user: null,
                            token: null,
                            refreshToken: null,
                            expiresAt: null,
                            isAuthenticated: false,
                            loading: false,
                            error: message,
                        });

                        toast.error(message);
                        return { success: false, error: message };
                    }

                    set({
                        user: data.userDetails,
                        token: data.accessToken || data.token,
                        refreshToken: data.refreshToken,
                        expiresAt: data.expiresIn || data.expiresAt,
                        isAuthenticated: true,
                        loading: false,
                    })

                    return { success: true, user: data.userDetails };
                } catch (error) {
                    const errorMsg = error.response?.data?.message || "Error de conexion";
                    set({
                        loading: false,
                        error: errorMsg,
                    })
                    toast.error(errorMsg);
                    return { success: false, error: errorMsg };
                }
            },
            register: async (formData) => {
            try {
                set({ loading: true, error: null });
                const { data } = await registerRequest(formData);
                set({ loading: false });
                return {
                    success: true,
                    emailVerificationRequired: data?.emailVerificationRequired,
                    data,
                    };
                } catch (err) {
                    const message = err.response?.data?.message || "Error al registrarse";
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
        }
        }),
        { name: "auth-store" }
    )
);