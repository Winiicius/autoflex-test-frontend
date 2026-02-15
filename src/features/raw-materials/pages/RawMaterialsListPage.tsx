import {
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
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { rawMaterialService } from "../rawMaterialService";
import type { RawMaterial } from "../types";
import { useAuth } from "../../auth/AuthContext";
import { isAdmin } from "../../auth/permissions";
import { formatUnit } from "../../../shared/utils/unit";

export function RawMaterialsListPage() {
    const toast = useToast();

    const [items, setItems] = useState<RawMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ name: "", code: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const { user } = useAuth();
    const canManage = isAdmin(user);


    const load = async () => {
        setLoading(true);
        try {
            const data = await rawMaterialService.list(debouncedFilters);
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
        const timeout = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 700);

        return () => clearTimeout(timeout);
    }, [filters]);

    useEffect(() => {
        load();
    }, [debouncedFilters]);

    const handleOpenDelete = (id: number) => {
        setSelectedId(id);
        setIsOpen(true);
    };

    const handleCloseDelete = () => {
        setIsOpen(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;

        try {
            await rawMaterialService.remove(selectedId);
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
                <Heading size="lg">Raw Materials</Heading>

                {canManage && (
                    <Button as={Link} to="/raw-materials/new" leftIcon={<FiPlus />}>
                        New Raw Material
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

                <Button variant="outline" onClick={() => setFilters({ name: "", code: "" })}>
                    Clear
                </Button>
            </HStack>

            <Box position="relative" overflowX="auto" bg="white" borderWidth="1px" borderRadius="8px">
                {loading && (
                    <Spinner
                        position="absolute"
                        top="12px"
                        right="12px"
                        size="sm"
                    />
                )}

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
                                <Td>{formatUnit(item.unit)}</Td>
                                <Td isNumeric>{item.stockQuantity}</Td>

                                <Td>
                                    {canManage && (
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
                                                onClick={() => handleOpenDelete(item.id)}
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
                            Delete Raw Material
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? This action cannot be undone.
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
