import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Select,
    Spinner,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../productService";
import { rawMaterialService } from "../../raw-materials/rawMaterialService";
import type { ProductRequest } from "../types";
import type { RawMaterial } from "../../raw-materials/types";

export function ProductFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const toast = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState<ProductRequest>({
        code: "",
        name: "",
        price: 0,
        materials: [],
    });

    const [allMaterials, setAllMaterials] = useState<RawMaterial[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const rawMaterials = await rawMaterialService.list();
                setAllMaterials(rawMaterials);

                if (isEdit) {
                    const product = await productService.getById(Number(id));

                    setForm({
                        code: product.code,
                        name: product.name,
                        price: product.price,
                        materials:
                            product.materials?.map((m) => ({
                                rawMaterialId: m.rawMaterialId,
                                quantity: m.quantity,
                            })) ?? [],
                    });
                }
            } catch (err: any) {
                toast({
                    title: "Error loading data",
                    description: err?.message,
                    status: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, isEdit, toast]);

    const onChange = (field: keyof ProductRequest, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateMaterial = (index: number, field: string, value: any) => {
        const updated = [...(form.materials ?? [])];
        updated[index] = { ...updated[index], [field]: value };
        setForm((prev) => ({ ...prev, materials: updated }));
    };

    const addMaterial = () => {
        setForm((prev) => ({
            ...prev,
            materials: [...(prev.materials ?? []), { rawMaterialId: 0, quantity: 0 }],
        }));
    };

    const removeMaterial = (index: number) => {
        const updated = [...(form.materials ?? [])];
        updated.splice(index, 1);
        setForm((prev) => ({ ...prev, materials: updated }));
    };

    const validate = () => {
        if (!form.code || !form.name) {
            toast({ title: "Code and name are required", status: "warning" });
            return false;
        }

        if (!form.materials || form.materials.length === 0) {
            toast({ title: "At least one material is required", status: "warning" });
            return false;
        }

        for (const mat of form.materials) {
            if (!mat.rawMaterialId || mat.quantity <= 0) {
                toast({
                    title: "Each material must have valid material and quantity > 0",
                    status: "warning",
                });
                return false;
            }
        }

        return true;
    };

    const onSubmit = async () => {
        if (!validate()) return;

        setSaving(true);

        try {
            if (isEdit) {
                await productService.update(Number(id), form);
                toast({ title: "Product updated", status: "success" });
            } else {
                await productService.create(form);
                toast({ title: "Product created", status: "success" });
            }

            navigate("/products");
        } catch (err: any) {
            toast({
                title: "Error saving product",
                description: err?.message,
                status: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <Box maxW="800px">
            <Heading size="lg" mb={4}>
                {isEdit ? "Edit Product" : "New Product"}
            </Heading>

            <Stack spacing={4}>
                <FormControl>
                    <FormLabel>Code</FormLabel>
                    <Input
                        value={form.code}
                        onChange={(e) => onChange("code", e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                        type="number"
                        value={form.price}
                        onChange={(e) => onChange("price", Number(e.target.value))}
                    />
                </FormControl>

                {/* MATERIALS SECTION */}

                <Box borderWidth="1px" borderRadius="8px" p={4}>
                    <Heading size="md" mb={3}>
                        Materials
                    </Heading>

                    <Stack spacing={3}>
                        {form.materials?.map((mat, index) => (
                            <HStack key={index}>
                                <Select
                                    value={mat.rawMaterialId}
                                    onChange={(e) =>
                                        updateMaterial(index, "rawMaterialId", Number(e.target.value))
                                    }
                                >
                                    <option value="">Select material</option>
                                    {allMaterials.map((rm) => (
                                        <option key={rm.id} value={rm.id}>
                                            {rm.name}
                                        </option>
                                    ))}
                                </Select>

                                <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={mat.quantity}
                                    onChange={(e) =>
                                        updateMaterial(index, "quantity", Number(e.target.value))
                                    }
                                />

                                <Button
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => removeMaterial(index)}
                                >
                                    Remove
                                </Button>
                            </HStack>
                        ))}

                        <Button variant="outline" onClick={addMaterial}>
                            Add Material
                        </Button>
                    </Stack>
                </Box>

                <HStack justify="flex-end">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>

                    <Button onClick={onSubmit} isLoading={saving}>
                        Save
                    </Button>
                </HStack>
            </Stack>
        </Box>
    );
}
