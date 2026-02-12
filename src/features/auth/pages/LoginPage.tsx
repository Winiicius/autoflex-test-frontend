import {
    Box,
    Button,
    Heading,
    Input,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "../authService";

export function LoginPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const [email, setEmail] = useState("admin@autoflex.com");
    const [password, setPassword] = useState("autoflex");
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/dashboard" replace />;

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await authService.login({ email, password });

            login(response);

            navigate("/dashboard", { replace: true });
        } catch (err: any) {
            toast({
                title: "Login failed",
                description:
                    err?.message || "Check your credentials and try again.",
                status: "error",
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minH="100vh" display="grid" placeItems="center" p={6}>
            <Box
                w="100%"
                maxW="420px"
                bg="white"
                p={8}
                borderWidth="1px"
                borderRadius="10px"
            >
                <Stack spacing={4}>
                    <Heading size="md">Autoflex Inventory</Heading>
                    <Text color="gray.600">Sign in to continue</Text>

                    <Stack spacing={3}>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                        />
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                        />
                    </Stack>

                    <Button w="100%" onClick={onSubmit} isLoading={loading}>
                        Sign in
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
