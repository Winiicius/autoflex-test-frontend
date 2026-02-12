import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Input,
    Spinner,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { isAdmin } from "../../auth/permissions";
import { productService } from "../productService";
import type { Product } from "../types";

export function ProductsListPage() {
    const toast = useToast();

    const { user } = useAuth();
    const canManage = isAdmin(user);

    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({ name: "", code: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const buildParams = () => {
        const params: Record<string, any> = {};

        if (debouncedFilters.code.trim()) params.code = debouncedFilters.code.trim();
        if (debouncedFilters.name.trim()) params.name = debouncedFilters.name.trim();

        return params;
    };

    const load = async () => {
        setLoading(true);
        try {
            const params = buildParams();
            const data = await productService.list(params);
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
        const timeout = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 700);

        return () => clearTimeout(timeout);
    }, [filters]);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilters]);

    const handleOpenDelete = (product: Product) => {
        setSelectedProduct(product);
        setIsOpen(true);
    };

    const handleCloseDelete = () => {
        setIsOpen(false);
        setSelectedProduct(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            await productService.remove(selectedProduct.id);
            toast({ title: "Deleted successfully", status: "success" });
            load();
        } catch (err: any) {
            toast({
                title: "Error deleting",
                description: err?.message,
                status: "error",
            });
        } finally {
            handleCloseDelete();
        }
    };

    return (
        <Box>
            <HStack justify="space-between" mb={4}>
                <Heading size="lg">Products</Heading>

                {canManage && (
                    <Button as={Link} to="/products/new" leftIcon={<FiPlus />}>
                        New Product
                    </Button>
                )}
            </HStack>

            <HStack spacing={4} mb={4}>
                <Input
                    placeholder="Search by code"
                    value={filters.code}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, code: e.target.value }))
                    }
                />

                <Input
                    placeholder="Search by name"
                    value={filters.name}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, name: e.target.value }))
                    }
                />

                <Button
                    variant="outline"
                    onClick={() => setFilters({ name: "", code: "" })}
                >
                    Clear
                </Button>
            </HStack>

            <Box mt={2} />

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
                                    {canManage && (
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
                                                onClick={() => handleOpenDelete(item)}
                                            />
                                        </HStack>
                                    )}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={handleCloseDelete}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Product
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete{" "}
                            <strong>{selectedProduct?.name}</strong>? This action cannot be
                            undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={handleCloseDelete}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}
