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
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { productService } from "../ProductService";
import type { Product } from "../types";

export function ProductsListPage() {
    const toast = useToast();

    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await productService.list();

            setItems(data);
        } catch (err: any) {
            toast({
                title: "Error loading products",
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
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await productService.remove(id);
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
                <Heading size="lg">Products</Heading>

                <Button as={Link} to="/products/new" leftIcon={<FiPlus />}>
                    New Product
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
                                <Th isNumeric>Price</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {items.map((item) => (
                                <Tr key={item.id}>
                                    <Td>{item.code}</Td>
                                    <Td>{item.name}</Td>
                                    <Td isNumeric>{item.price.toFixed(2)}</Td>

                                    <Td>
                                        <HStack justify="flex-end">
                                            <IconButton
                                                aria-label="Edit"
                                                icon={<FiEdit />}
                                                as={Link}
                                                to={`/products/${item.id}`}
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
