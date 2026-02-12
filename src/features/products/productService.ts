import { http } from "../../shared/api/http";
import type { Product, ProductMaterialsRequest, ProductRequest } from "./types";

export const productService = {
  list: async (params?: {
    name?: string;
    code?: string;
  }): Promise<Product[]> => {
    const { data } = await http.get<Product[]>("/products", {
      params,
    });
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await http.get<Product>(`/products/${id}`);
    return data;
  },

  create: async (payload: ProductRequest): Promise<Product> => {
    const { data } = await http.post<Product>("/products", payload);
    return data;
  },

  update: async (id: number, payload: ProductRequest): Promise<Product> => {
    const { data } = await http.put<Product>(`/products/${id}`, payload);
    return data;
  },

  updateMaterials: async (
    id: number,
    payload: ProductMaterialsRequest,
  ): Promise<Product> => {
    const { data } = await http.put<Product>(
      `/products/${id}/materials`,
      payload,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await http.delete(`/products/${id}`);
  },
};
