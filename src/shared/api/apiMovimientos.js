import { axiosUser } from "./api";

// Cuentas
export const getMisCuentas = async () => {
    return await axiosUser.get("/cuentas/mis-cuentas");
};

// Contactos (Cuentas Destino)
export const getMisContactos = async () => {
    return await axiosUser.get("/contactos");
};

export const agregarContacto = async (data) => {
    return await axiosUser.post("/contactos", data);
};

export const eliminarContacto = async (id) => {
    return await axiosUser.delete(`/contactos/${id}`);
};

// Transacciones
export const realizarTransferencia = async (numeroCuentaOrigen, data) => {
    return await axiosUser.post(`/transacciones/transferir/${numeroCuentaOrigen}`, data);
};

export const getMisTransacciones = async () => {
    return await axiosUser.get("/transacciones/mis-transacciones");
};

// Retiros
export const realizarRetiro = async (data) => {
    return await axiosUser.post(`/retiros`, data);
};

// Depósitos
export const realizarDeposito = async (data) => {
    return await axiosUser.post(`/depositos`, data);
};

export const getMisRetiros = async () => {
    return await axiosUser.get('/retiros/mis-retiros');
}

export const getMisDepositos = async () => {
    return await axiosUser.get('/depositos/mis-depositos');
}
