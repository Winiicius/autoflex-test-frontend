import { http } from "../../shared/api/http";
import type { RawMaterial, RawMaterialRequest } from "./types";

export const rawMaterialService = {
  list: async (): Promise<RawMaterial[]> => {
    const { data } = await http.get<RawMaterial[]>("/raw-materials");
    return data;
  },

  getById: async (id: number): Promise<RawMaterial> => {
    const { data } = await http.get<RawMaterial>(`/raw-materials/${id}`);
    return data;
  },

  create: async (payload: RawMaterialRequest): Promise<RawMaterial> => {
    const { data } = await http.post<RawMaterial>("/raw-materials", payload);
    return data;
  },

  update: async (
    id: number,
    payload: RawMaterialRequest,
  ): Promise<RawMaterial> => {
    const { data } = await http.put<RawMaterial>(
      `/raw-materials/${id}`,
      payload,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await http.delete(`/raw-materials/${id}`);
  },
};
