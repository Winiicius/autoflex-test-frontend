import { Box, Heading, Text, HStack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import type { ProductionCapacityItem } from "../../production/type";

type Props = {
    items: ProductionCapacityItem[];
};

export function ProductionCapacityChart({ items }: Props) {
    const data = [...items]
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 10)
        .map((p) => ({
            name: p.productName,
            code: p.productCode,
            totalValue: p.totalValue,
            maxQuantity: p.maxQuantity,
        }));

    return (
        <Box bg="white" borderWidth="1px" borderRadius="8px" p={4}>
            <HStack justify="space-between" mb={3}>
                <Heading size="sm">Top 10 by Potential Value</Heading>

                <Button
                    as={Link}
                    to="/production"
                    size="sm"
                    variant="ghost"
                >
                    More details
                </Button>
            </HStack>

            {!data.length ? (
                <Text color="gray.600">No data available.</Text>
            ) : (
                <Box width="100%" height="320px">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalValue" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
}
