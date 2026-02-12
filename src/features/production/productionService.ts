import { http } from "../../shared/api/http";
import type { ProductionCapacityItem } from "./types";

export const productionService = {
  listCapacity: async (): Promise<ProductionCapacityItem[]> => {
    const { data } = await http.get<ProductionCapacityItem[]>("/production");
    return data;
  },
};
