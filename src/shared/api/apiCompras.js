import { axiosUser } from "./api";

export const realizarCompra = async (compraData) => {
    return await axiosUser.post("/compras", compraData);
};

export const getMisCompras = async () => {
    return await axiosUser.get("/compras/mis-compras");
};
