import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
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
import { useAuth } from "../../auth/AuthContext";
import { isAdmin } from "../../auth/permissions";
import { rawMaterialSchema } from "../rawMaterial.schema";
import type { RawMaterialFormValues } from "../rawMaterial.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function RawMaterialFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const { user } = useAuth();
    const canManage = isAdmin(user);

    const toast = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEdit);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RawMaterialFormValues>({
        resolver: zodResolver(rawMaterialSchema),
        defaultValues: {
            code: "",
            name: "",
            unit: "KG",
            stockQuantity: 0,
        },
    });

    useEffect(() => {
        if (!canManage) {
            navigate("/", { replace: true });
        }
    }, [canManage, navigate]);

    useEffect(() => {
        if (!isEdit) return;

        const load = async () => {
            try {
                const data = await rawMaterialService.getById(Number(id));

                reset({
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
    }, [id, isEdit, reset, toast]);

    const onSubmit = async (values: RawMaterialFormValues) => {
        try {
            if (isEdit) {
                await rawMaterialService.update(Number(id), values);
                toast({ title: "Updated successfully", status: "success" });
            } else {
                await rawMaterialService.create(values);
                toast({ title: "Created successfully", status: "success" });
            }

            navigate("/raw-materials");
        } catch (err: any) {
            toast({
                title: "Error saving",
                description: err?.message,
                status: "error",
            });
        }
    };

    if (loading) return <Spinner />;

    return (
        <Box maxW="600px">
            <Heading size="lg" mb={4}>
                {isEdit ? "Edit Raw Material" : "New Raw Material"}
            </Heading>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.code}>
                        <FormLabel>Code</FormLabel>
                        <Input {...register("code")} />
                        <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input {...register("name")} />
                        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.unit}>
                        <FormLabel>Unit</FormLabel>
                        <Select {...register("unit")}>
                            <option value="KG">Kilogram</option>
                            <option value="G">Gram</option>
                            <option value="UNIT">Unit</option>
                            <option value="L">Liter</option>
                            <option value="ML">Mililiter</option>
                        </Select>
                        <FormErrorMessage>{errors.unit?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.stockQuantity}>
                        <FormLabel>Stock Quantity</FormLabel>
                        <Input type="number" step="0.01" {...register("stockQuantity")} />
                        <FormErrorMessage>
                            {errors.stockQuantity?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <HStack justify="flex-end">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>

                        <Button type="submit" isLoading={isSubmitting}>
                            Save
                        </Button>
                    </HStack>
                </Stack>
            </form>
        </Box>
    );
}
