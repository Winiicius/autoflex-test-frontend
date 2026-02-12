import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "./types";
import { authService } from "./authService";
import type { LoginRequest } from "./types";
import { http } from "../../shared/api/http";

type AuthState = {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (payload: LoginRequest) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "autoflex.auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw) as { token: string; user: User };
            setToken(parsed.token);
            setUser(parsed.user);
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (token) {
            http.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete http.defaults.headers.common.Authorization;
        }
    }, [token]);

    const login = async (payload: LoginRequest) => {
        const res = await authService.login(payload);
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = useMemo(
        () => ({
            token,
            user,
            isAuthenticated: Boolean(token),
            login,
            logout,
        }),
        [token, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
