import { http } from "../../shared/api/http";
import type { LoginRequest, LoginResponse } from "./types";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterRequest) => {
    const { data } = await http.post("/auth/register", payload);
    return data;
  },
};
