import { axiosUser } from "./api";

export const getMisPrestamos = async () => {
    return await axiosUser.get("/prestamos/mis-prestamos");
};

export const solicitarPrestamo = async (prestamoData) => {
    return await axiosUser.post("/prestamos", prestamoData);
};
