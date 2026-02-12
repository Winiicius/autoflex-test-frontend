import { Box, Button, Card, CardBody, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function DashboardPage() {
    return (
        <Box p={6}>
            <Heading size="lg" mb={4}>Dashboard</Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                <Card>
                    <CardBody>
                        <Text color="gray.600">Products</Text>
                        <Heading size="md">0</Heading>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Text color="gray.600">Raw materials</Text>
                        <Heading size="md">0</Heading>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Text color="gray.600">Capacity</Text>
                        <Heading size="md">—</Heading>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Text color="gray.600">Status</Text>
                        <Heading size="md" color="success.500">OK</Heading>
                    </CardBody>
                </Card>
            </SimpleGrid>

            <Box mt={6}>
                <Button as={Link} to="/login" variant="outline">
                    Go to login
                </Button>
            </Box>
        </Box>
    );
}
