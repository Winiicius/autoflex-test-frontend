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
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rawMaterialService } from "../rawMaterialService";
import type { RawMaterialRequest } from "../types";

export function RawMaterialFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const toast = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState<RawMaterialRequest>({
        code: "",
        name: "",
        unit: "KG",
        stockQuantity: 0,
    });

    useEffect(() => {
        if (!isEdit) return;

        const load = async () => {
            try {
                const data = await rawMaterialService.getById(Number(id));
                setForm({
                    code: data.code,
                    name: data.name,
                    unit: data.unit,
                    stockQuantity: data.stockQuantity,
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

    const onChange = (field: keyof RawMaterialRequest, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const onSubmit = async () => {
        setSaving(true);

        try {
            if (isEdit) {
                await rawMaterialService.update(Number(id), form);
                toast({ title: "Updated successfully", status: "success" });
            } else {
                await rawMaterialService.create(form);
                toast({ title: "Created successfully", status: "success" });
            }

            navigate("/raw-materials");
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
        <Box maxW="600px">
            <Heading size="lg" mb={4}>
                {isEdit ? "Edit Raw Material" : "New Raw Material"}
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
                    <FormLabel>Unit</FormLabel>
                    <Select
                        value={form.unit}
                        onChange={(e) => onChange("unit", e.target.value)}
                    >
                        <option value="KG">KG</option>
                        <option value="UNIT">UNIT</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Stock Quantity</FormLabel>
                    <Input
                        type="number"
                        value={form.stockQuantity}
                        onChange={(e) =>
                            onChange("stockQuantity", Number(e.target.value))
                        }
                    />
                </FormControl>

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
