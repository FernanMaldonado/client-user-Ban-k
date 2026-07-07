import { axiosUser } from "./api";

export const getMisCuentas = async () => {
    return await axiosUser.get("/cuentas/mis-cuentas");
};
