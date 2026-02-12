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
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import { productService } from "../productService";
import type { Product } from "../types";
import { useAuth } from "../../auth/AuthContext";
import { isAdmin } from "../../auth/permissions";

export function ProductsListPage() {
    const toast = useToast();

    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const { user } = useAuth();
    const canManage = isAdmin(user);


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
            )}
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
                            <strong>{selectedProduct?.name}</strong>?
                            This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={handleCloseDelete}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleConfirmDelete}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </Box>
    );
}
