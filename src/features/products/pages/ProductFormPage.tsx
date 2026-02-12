import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Spinner,
    Stack,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../productService";
import type { ProductRequest } from "../types";

export function ProductFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const toast = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState<ProductRequest>({
        code: "",
        name: "",
        price: 0,
    });

    useEffect(() => {
        if (!isEdit) return;

        const load = async () => {
            try {
                const data = await productService.getById(Number(id));

                setForm({
                    code: data.code,
                    name: data.name,
                    price: data.price,
                });
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

    const onSubmit = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                await productService.update(Number(id), form);
                toast({ title: "Updated successfully", status: "success" });
            } else {
                await productService.create(form);
                toast({ title: "Created successfully", status: "success" });
            }
            navigate("/products");
        } catch (err: any) {
            toast({
                title: "Error saving",
                description: err?.message,
                status: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <Box maxW="700px">
            <Heading size="lg" mb={4}>
                {isEdit ? "Edit Product" : "New Product"}
            </Heading>

            <Stack spacing={4}>
                <FormControl>
                    <FormLabel>Code</FormLabel>
                    <Input value={form.code} onChange={(e) => onChange("code", e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} />
                </FormControl>

                <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                        type="number"
                        value={form.price}
                        onChange={(e) => onChange("price", Number(e.target.value))}
                    />
                </FormControl>

                {/* Next step: Materials section will be inserted here */}

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
