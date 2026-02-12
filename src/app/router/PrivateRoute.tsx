import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export function PrivateRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}
