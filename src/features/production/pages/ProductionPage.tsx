import {
    Badge,
    Box,
    Heading,
    HStack,
    IconButton,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { productionService } from "../productionService";
import type { ProductionCapacityItem } from "../types";

function money(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function ProductionPage() {
    const toast = useToast();
    const [items, setItems] = useState<ProductionCapacityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await productionService.listCapacity();
            setItems(data);
        } catch (err: any) {
            toast({
                title: "Error loading production capacity",
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

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="lg">Production Capacity</Heading>
            </HStack>

            <Box position="relative" overflowX="auto" bg="white" borderWidth="1px" borderRadius="8px">
                {loading && (
                    <Spinner position="absolute" top="12px" right="12px" size="sm" />
                )}

                <Table size="sm">
                    <Thead>
                        <Tr>
                            <Th w="40px"></Th>
                            <Th>Product</Th>
                            <Th isNumeric>Unit Price</Th>
                            <Th isNumeric>Max Qty</Th>
                            <Th isNumeric>Total Value</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {items.map((item) => {
                            const isExpanded = expandedId === item.productId;
                            const canProduce = item.maxQuantity > 0;

                            return (
                                <>
                                    <Tr key={item.productId}>
                                        <Td>
                                            <IconButton
                                                aria-label="Expand"
                                                icon={isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setExpandedId(isExpanded ? null : item.productId)}
                                            />
                                        </Td>

                                        <Td>
                                            <Text fontWeight="semibold">
                                                {item.productCode} — {item.productName}
                                            </Text>
                                        </Td>

                                        <Td isNumeric>{money(item.unitPrice)}</Td>
                                        <Td isNumeric>{item.maxQuantity}</Td>
                                        <Td isNumeric>{money(item.totalValue)}</Td>

                                        <Td>
                                            <Badge colorScheme={canProduce ? "green" : "red"}>
                                                {canProduce ? "Available" : "Unavailable"}
                                            </Badge>
                                        </Td>
                                    </Tr>

                                    {isExpanded && (
                                        <Tr>
                                            <Td colSpan={6} bg="gray.50">
                                                <Box p={4}>
                                                    <Heading size="sm" mb={2}>
                                                        Materials
                                                    </Heading>

                                                    {item.materials?.length ? (
                                                        <Table size="sm" bg="white" borderWidth="1px" borderRadius="8px">
                                                            <Thead>
                                                                <Tr>
                                                                    <Th>Code</Th>
                                                                    <Th>Material</Th>
                                                                    <Th isNumeric>Required / Unit</Th>
                                                                    <Th isNumeric>Stock</Th>
                                                                    <Th>Unit</Th>
                                                                    <Th>OK</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {item.materials.map((m) => {
                                                                    const ok = m.stockQuantity >= m.requiredPerUnit && m.requiredPerUnit > 0;
                                                                    return (
                                                                        <Tr key={m.rawMaterialId}>
                                                                            <Td>{m.rawMaterialCode}</Td>
                                                                            <Td>{m.rawMaterialName}</Td>
                                                                            <Td isNumeric>{m.requiredPerUnit}</Td>
                                                                            <Td isNumeric>{m.stockQuantity}</Td>
                                                                            <Td>{m.unit}</Td>
                                                                            <Td>
                                                                                <Badge colorScheme={ok ? "green" : "red"}>
                                                                                    {ok ? "OK" : "Low"}
                                                                                </Badge>
                                                                            </Td>
                                                                        </Tr>
                                                                    );
                                                                })}
                                                            </Tbody>
                                                        </Table>
                                                    ) : (
                                                        <Text color="gray.500">No materials returned by API.</Text>
                                                    )}
                                                </Box>
                                            </Td>
                                        </Tr>
                                    )}
                                </>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
}
