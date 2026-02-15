import {
    Badge,
    Box,
    Heading,
    SimpleGrid,
    Spinner,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { productionService } from "../../production/productionService";
import type { ProductionCapacityItem } from "../../production/type";
import { ProductionCapacityChart } from "../components/ProductionCapacityChart";

function money(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function DashboardPage() {
    const toast = useToast();
    const [items, setItems] = useState<ProductionCapacityItem[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await productionService.listCapacity();
            setItems(data);
        } catch (err: any) {
            toast({
                title: "Error loading dashboard data",
                description: err?.message,
                status: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const metrics = useMemo(() => {
        const total = items.length;
        const available = items.filter((p) => p.maxQuantity > 0).length;
        const unavailable = total - available;

        const topByValue =
            items.reduce<ProductionCapacityItem | null>((best, cur) => {
                if (!best) return cur;
                return cur.totalValue > best.totalValue ? cur : best;
            }, null) ?? null;

        const topByQuantity =
            items.reduce<ProductionCapacityItem | null>((best, cur) => {
                if (!best) return cur;
                return cur.maxQuantity > best.maxQuantity ? cur : best;
            }, null) ?? null;

        const lowOccurrences = items.reduce((acc, p) => {
            const lows =
                p.materials?.filter(
                    (m) => m.requiredPerUnit > 0 && m.stockQuantity < m.requiredPerUnit
                ).length ?? 0;
            return acc + lows;
        }, 0);

        const productsWithAnyLow = items.filter((p) =>
            (p.materials ?? []).some(
                (m) => m.requiredPerUnit > 0 && m.stockQuantity < m.requiredPerUnit
            )
        ).length;

        return {
            total,
            available,
            unavailable,
            topByValue,
            topByQuantity,
            lowOccurrences,
            productsWithAnyLow,
        };
    }, [items]);

    return (
        <Box>
            <Heading size="lg" mb={4}>
                Dashboard
            </Heading>

            <Box position="relative">
                {loading && (
                    <Spinner position="absolute" top="12px" right="12px" size="sm" />
                )}

                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                    <Box bg="white" borderWidth="1px" borderRadius="8px" p={4}>
                        <Stat>
                            <StatLabel>Total Products</StatLabel>
                            <StatNumber>{metrics.total}</StatNumber>
                            <StatHelpText>Registered in production capacity</StatHelpText>
                        </Stat>
                    </Box>

                    <Box bg="white" borderWidth="1px" borderRadius="8px" p={4}>
                        <Stat>
                            <StatLabel>Available to Produce</StatLabel>
                            <StatNumber>{metrics.available}</StatNumber>
                        </Stat>
                    </Box>

                    <Box bg="white" borderWidth="1px" borderRadius="8px" p={4}>
                        <Stat>
                            <StatLabel>Unavailable</StatLabel>
                            <StatNumber>{metrics.unavailable}</StatNumber>
                        </Stat>
                    </Box>

                    <Box bg="white" borderWidth="1px" borderRadius="8px" p={4}>
                        <Stat>
                            <StatLabel>Top Product by Potential Value</StatLabel>
                            <StatNumber>
                                {metrics.topByValue ? money(metrics.topByValue.totalValue) : "-"}
                            </StatNumber>
                            <StatHelpText>
                                {metrics.topByValue ? (
                                    <Text>
                                        {metrics.topByValue.productCode} — {metrics.topByValue.productName}
                                    </Text>
                                ) : (
                                    "No data"
                                )}
                            </StatHelpText>
                        </Stat>
                    </Box>

                    <Box bg="white" borderWidth="1px" borderRadius="8px" p={4}>
                        <Stat>
                            <StatLabel>Top Product by Max Quantity</StatLabel>
                            <StatNumber>
                                {metrics.topByQuantity ? metrics.topByQuantity.maxQuantity : "-"}
                            </StatNumber>
                            <StatHelpText>
                                {metrics.topByQuantity ? (
                                    <Text>
                                        {metrics.topByQuantity.productCode} — {metrics.topByQuantity.productName}
                                    </Text>
                                ) : (
                                    "No data"
                                )}
                            </StatHelpText>
                        </Stat>
                    </Box>

                    <Box bg="white" borderWidth="1px" borderRadius="8px" p={4}>
                        <Stat>
                            <StatLabel>Low Stock Signals</StatLabel>
                            <StatNumber>{metrics.lowOccurrences}</StatNumber>
                            <StatHelpText>
                                <Text>
                                    Products with any low: <strong>{metrics.productsWithAnyLow}</strong>
                                </Text>
                            </StatHelpText>
                        </Stat>
                    </Box>
                </SimpleGrid>

                <Box mt={4}>
                    <ProductionCapacityChart items={items} />
                </Box>
            </Box>
        </Box>
    );
}
