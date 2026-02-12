import { http } from "../../shared/api/http";
import type { LoginRequest, LoginResponse } from "./types";

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  },
};
