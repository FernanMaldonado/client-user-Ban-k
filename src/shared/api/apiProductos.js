import { axiosAdmin } from "./api";

// Obtener todos los productos
export const getProducts = async () => {
  return await axiosAdmin.get("/productos");
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  return await axiosAdmin.get(`/productos/${id}`);
};

export const updateProduct = async (id, productData) => {
  return await axiosUser.put(`/productos/${id}`, productData);
};