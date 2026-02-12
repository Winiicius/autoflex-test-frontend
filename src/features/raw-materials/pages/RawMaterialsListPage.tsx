import {
    Box,
    Button,
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
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { rawMaterialService } from "../rawMaterialService";
import type { RawMaterial } from "../types";

export function RawMaterialsListPage() {
    const toast = useToast();

    const [items, setItems] = useState<RawMaterial[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await rawMaterialService.list();
            setItems(data);
        } catch (err: any) {
            toast({
                title: "Error loading raw materials",
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

    const onDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await rawMaterialService.remove(id);
            toast({ title: "Deleted successfully", status: "success" });
            load();
        } catch (err: any) {
            toast({
                title: "Error deleting",
                description: err?.message,
                status: "error",
            });
        }
    };

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="lg">Raw Materials</Heading>

                <Button
                    as={Link}
                    to="/raw-materials/new"
                    leftIcon={<FiPlus />}
                >
                    New Raw Material
                </Button>
            </HStack>

            {loading ? (
                <Spinner />
            ) : (
                <Box overflowX="auto" bg="white" borderWidth="1px" borderRadius="8px">
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>Code</Th>
                                <Th>Name</Th>
                                <Th>Unit</Th>
                                <Th isNumeric>Stock</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {items.map((item) => (
                                <Tr key={item.id}>
                                    <Td>{item.code}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>{item.unit}</Td>
                                    <Td isNumeric>{item.stockQuantity}</Td>

                                    <Td>
                                        <HStack justify="flex-end">
                                            <IconButton
                                                aria-label="Edit"
                                                icon={<FiEdit />}
                                                as={Link}
                                                to={`/raw-materials/${item.id}`}
                                                size="sm"
                                                variant="ghost"
                                            />

                                            <IconButton
                                                aria-label="Delete"
                                                icon={<FiTrash />}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => onDelete(item.id)}
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            )}
        </Box>
    );
}
