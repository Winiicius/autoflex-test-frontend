export type UserRole = "ADMIN" | "USER";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
