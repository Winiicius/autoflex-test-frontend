import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function ForbiddenPage() {
    return (
        <Box minH="70vh" display="flex" alignItems="center" justifyContent="center" p={6}>
            <VStack spacing={4} textAlign="center">
                <Heading size="lg">Access denied</Heading>
                <Text color="gray.600">
                    You don&apos;t have permission to access this page.
                </Text>
                <Button as={Link} to="/dashboard">
                    Back to Dashboard
                </Button>
            </VStack>
        </Box>
    );
}
