import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <Box
            minH="70vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <VStack spacing={6}>
                <Heading size="2xl">404</Heading>

                <Text fontSize="lg" color="gray.600">
                    The page you are looking for does not exist.
                </Text>

                <Button as={Link} to="/dashboard">
                    Go to Dashboard
                </Button>
            </VStack>
        </Box>
    );
}
