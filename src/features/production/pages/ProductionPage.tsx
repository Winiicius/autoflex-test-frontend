import {
    Badge,
    Box,
    Heading,
    HStack,
    Icon,
    IconButton,
    Input,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useToast,
    Button,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
    FiChevronDown,
    FiChevronRight,
    FiArrowUp,
    FiArrowDown,
} from "react-icons/fi";
import { productionService } from "../productionService";
import type { ProductionCapacityItem } from "../type";
import { formatUnit } from "../../../shared/utils/unit";

function money(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function ProductionPage() {
    const toast = useToast();

    const [items, setItems] = useState<ProductionCapacityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const [filters, setFilters] = useState({ search: "" });
    const [debouncedFilter, setDebouncedFilter] = useState("");

    const [sort, setSort] = useState<{
        field: "productName" | "maxQuantity" | "totalValue";
        direction: "asc" | "desc";
    }>({
        field: "totalValue",
        direction: "desc",
    });

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedFilter(filters.search);
        }, 700);

        return () => clearTimeout(timeout);
    }, [filters.search]);

    const toggleSort = (
        field: "productName" | "maxQuantity" | "totalValue"
    ) => {
        setSort((prev) => {
            if (prev.field === field) {
                return {
                    field,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { field, direction: "asc" };
        });
    };

    const processedItems = useMemo(() => {
        let filtered = items;

        if (debouncedFilter.trim()) {
            const q = debouncedFilter.toLowerCase();
            filtered = filtered.filter(
                (i) =>
                    i.productName.toLowerCase().includes(q) ||
                    i.productCode.toLowerCase().includes(q)
            );
        }

        return [...filtered].sort((a, b) => {
            const field = sort.field;

            const valA = a[field];
            const valB = b[field];

            if (typeof valA === "number" && typeof valB === "number") {
                return sort.direction === "asc" ? valA - valB : valB - valA;
            }

            return sort.direction === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
    }, [items, debouncedFilter, sort]);

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="lg">Production Capacity</Heading>
            </HStack>

            {/* filtros */}
            <HStack spacing={4} mb={4}>
                <Input
                    placeholder="Search by product name or code"
                    value={filters.search}
                    onChange={(e) =>
                        setFilters({ search: e.target.value })
                    }
                />
                <Button variant="outline" onClick={() => setFilters({ search: "" })}>
                    Clear
                </Button>
            </HStack>

            <Box
                position="relative"
                overflowX="auto"
                bg="white"
                borderWidth="1px"
                borderRadius="8px"
            >
                {loading && (
                    <Spinner position="absolute" top="12px" right="12px" size="sm" />
                )}

                <Table size="sm">
                    <Thead>
                        <Tr>
                            <Th w="40px"></Th>

                            <Th cursor="pointer" onClick={() => toggleSort("productName")}>
                                <HStack spacing={1}>
                                    <span>Product</span>
                                    {sort.field === "productName" && (
                                        <Icon
                                            as={
                                                sort.direction === "asc"
                                                    ? FiArrowUp
                                                    : FiArrowDown
                                            }
                                        />
                                    )}
                                </HStack>
                            </Th>

                            <Th isNumeric>Unit Price</Th>

                            <Th
                                isNumeric
                                cursor="pointer"
                                onClick={() => toggleSort("maxQuantity")}
                            >
                                <HStack spacing={1} justify="flex-end">
                                    <span>Max Qty</span>
                                    {sort.field === "maxQuantity" && (
                                        <Icon
                                            as={
                                                sort.direction === "asc"
                                                    ? FiArrowUp
                                                    : FiArrowDown
                                            }
                                        />
                                    )}
                                </HStack>
                            </Th>

                            <Th
                                isNumeric
                                cursor="pointer"
                                onClick={() => toggleSort("totalValue")}
                            >
                                <HStack spacing={1} justify="flex-end">
                                    <span>Total Value</span>
                                    {sort.field === "totalValue" && (
                                        <Icon
                                            as={
                                                sort.direction === "asc"
                                                    ? FiArrowUp
                                                    : FiArrowDown
                                            }
                                        />
                                    )}
                                </HStack>
                            </Th>

                            <Th>Status</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {processedItems.map((item) => {
                            const isExpanded = expandedId === item.productId;
                            const canProduce = item.maxQuantity > 0;

                            return (
                                <>
                                    <Tr key={item.productId}>
                                        <Td>
                                            <IconButton
                                                aria-label="Expand"
                                                icon={
                                                    isExpanded
                                                        ? <FiChevronDown />
                                                        : <FiChevronRight />
                                                }
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    setExpandedId(
                                                        isExpanded ? null : item.productId
                                                    )
                                                }
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
                                                        <Table
                                                            size="sm"
                                                            bg="white"
                                                            borderWidth="1px"
                                                            borderRadius="8px"
                                                        >
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
                                                                    const ok =
                                                                        m.stockQuantity >= m.requiredPerUnit &&
                                                                        m.requiredPerUnit > 0;

                                                                    return (
                                                                        <Tr key={m.rawMaterialId}>
                                                                            <Td>{m.rawMaterialCode}</Td>
                                                                            <Td>{m.rawMaterialName}</Td>
                                                                            <Td isNumeric>
                                                                                {m.requiredPerUnit}
                                                                            </Td>
                                                                            <Td isNumeric>
                                                                                {m.stockQuantity}
                                                                            </Td>
                                                                            <Td>{formatUnit(m.unit)}</Td>
                                                                            <Td>
                                                                                <Badge
                                                                                    colorScheme={ok ? "green" : "red"}
                                                                                >
                                                                                    {ok ? "OK" : "Low"}
                                                                                </Badge>
                                                                            </Td>
                                                                        </Tr>
                                                                    );
                                                                })}
                                                            </Tbody>
                                                        </Table>
                                                    ) : (
                                                        <Text color="gray.500">
                                                            No materials returned by API.
                                                        </Text>
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
