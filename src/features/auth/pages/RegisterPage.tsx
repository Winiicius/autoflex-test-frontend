import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { authService } from "../authService";
import { registerSchema } from "../register.schema";
import type { RegisterFormValues } from "../register.schema";

export function RegisterPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const { user } = useAuth();

    if (user) return <Navigate to="/dashboard" replace />;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            await authService.register({
                name: values.name,
                email: values.email,
                password: values.password,
            });

            toast({
                title: "Account created",
                description: "You can now sign in.",
                status: "success",
                isClosable: true,
            });

            navigate("/login", { replace: true });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast({
                title: "Registration failed",
                description: err?.message || "Please try again.",
                status: "error",
                isClosable: true,
            });
        }
    };

    return (
        <Box minH="100vh" display="grid" placeItems="center" p={6}>
            <Box w="100%" maxW="460px" bg="white" p={8} borderWidth="1px" borderRadius="10px">
                <Stack spacing={4}>
                    <Heading size="md">Create account</Heading>
                    <Text color="gray.600">Fill in the details to register</Text>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel>Name</FormLabel>
                                <Input placeholder="Your name" {...register("name")} />
                                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel>Email</FormLabel>
                                <Input placeholder="Email" type="email" {...register("email")} />
                                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.password}>
                                <FormLabel>Password</FormLabel>
                                <Input placeholder="Password" type="password" {...register("password")} />
                                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.confirmPassword}>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input
                                    placeholder="Confirm password"
                                    type="password"
                                    {...register("confirmPassword")}
                                />
                                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
                            </FormControl>

                            <Button type="submit" w="100%" isLoading={isSubmitting}>
                                Create account
                            </Button>

                            <Text fontSize="sm" color="gray.600">
                                Already have an account?{" "}
                                <Text as={Link} to="/login" color="blue.600" fontWeight="semibold">
                                    Sign in
                                </Text>
                            </Text>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </Box>
    );
}
