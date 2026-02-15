import { Navigate } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "../../features/auth/AuthContext";

type Props = { children: React.ReactNode };

export function AdminRoute({ children }: Props) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Center minH="100vh">
                <Spinner size="lg" />
            </Center>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== "ADMIN") return <Navigate to="/forbidden" replace />;

    return <>{children}</>;
}
