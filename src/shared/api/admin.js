import { axiosAdmin } from "./api";

// Obtener todos los productos
export const getProducts = async () => {
  try {
    // Intenta múltiples rutas posibles, priorizando "/productos" (que es el endpoint del admin)
    try {
      const response = await axiosAdmin.get("/productos");
      return response.data;
    } catch (err0) {
      try {
        const response = await axiosAdmin.get("/api/v1/products");
        return response.data;
      } catch (error1) {
        try {
          const response = await axiosAdmin.get("/products");
          return response.data;
        } catch (error2) {
          const response = await axiosAdmin.get("/api/products");
          return response.data;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    try {
      const response = await axiosAdmin.get(`/productos/${id}`);
      return response.data;
    } catch (err) {
      const response = await axiosAdmin.get(`/api/v1/products/${id}`);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Crear un producto (solo admin)
export const createProduct = async (productData) => {
  try {
    const response = await axiosAdmin.post("/api/v1/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Actualizar un producto (solo admin)
export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosAdmin.put(`/api/v1/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Eliminar un producto (solo admin)
export const deleteProduct = async (id) => {
  try {
    const response = await axiosAdmin.delete(`/api/v1/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
