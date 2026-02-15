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
    Text,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productService } from "../productService";
import { rawMaterialService } from "../../raw-materials/rawMaterialService";
import type { RawMaterial } from "../../raw-materials/types";

import { useAuth } from "../../auth/AuthContext";
import { isAdmin } from "../../auth/permissions";

import { productSchema } from "../product.schema";
import type { ProductFormValues } from "../product.schema";
import { formatUnit } from "../../../shared/utils/unit";

export function ProductFormPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const toast = useToast();
    const navigate = useNavigate();

    const { user } = useAuth();
    const canManage = isAdmin(user);

    const [loading, setLoading] = useState(true);
    const [allMaterials, setAllMaterials] = useState<RawMaterial[]>([]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            code: "",
            name: "",
            price: 0,
            materials: [{ rawMaterialId: 0, quantity: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "materials",
    });

    useEffect(() => {
        if (!canManage) navigate("/", { replace: true });
    }, [canManage, navigate]);

    useEffect(() => {
        const load = async () => {
            try {
                const rms = await rawMaterialService.list();
                setAllMaterials(rms);

                if (isEdit) {
                    const product = await productService.getById(Number(id));
                    reset({
                        code: product.code,
                        name: product.name,
                        price: product.price,
                        materials:
                            product.materials?.map((m) => ({
                                rawMaterialId: m.rawMaterialId,
                                quantity: m.quantity,
                                unit: m.unit
                            })) ?? [{ rawMaterialId: 0, quantity: 0 }],
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
    }, [id, isEdit, reset, toast]);

    const selectedIds = watch("materials")?.map((m) => Number(m.rawMaterialId)) ?? [];
    const selectedSet = useMemo(() => new Set(selectedIds.filter((x) => x > 0)), [selectedIds]);

    const onSubmit = async (values: ProductFormValues) => {
        try {
            if (isEdit) {
                await productService.update(Number(id), values);
                toast({ title: "Product updated", status: "success" });
            } else {
                await productService.create(values);
                toast({ title: "Product created", status: "success" });
            }
            navigate("/products");
        } catch (err: any) {
            toast({
                title: "Error saving product",
                description: err?.message,
                status: "error",
            });
        }
    };

    if (loading) return <Spinner />;

    return (
        <Box maxW="800px">
            <Heading size="lg" mb={4}>
                {isEdit ? "Edit Product" : "New Product"}
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

                    <FormControl isInvalid={!!errors.price}>
                        <FormLabel>Price</FormLabel>
                        <Input type="number" step="0.01" {...register("price")} />
                        <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                    </FormControl>

                    <Box borderWidth="1px" borderRadius="8px" p={4}>
                        <HStack justify="space-between" mb={2}>
                            <Heading size="md">Materials</Heading>
                            <Button
                                variant="outline"
                                onClick={() => append({ rawMaterialId: 0, quantity: 0 })}
                            >
                                Add
                            </Button>
                        </HStack>

                        {errors.materials?.message && (
                            <Text color="red.500" fontSize="sm" mb={2}>
                                {errors.materials.message as string}
                            </Text>
                        )}

                        <Stack spacing={3}>
                            {fields.map((field, index) => {
                                const rmError = errors.materials?.[index]?.rawMaterialId?.message;
                                const qtyError = errors.materials?.[index]?.quantity?.message;
                                const selectedMaterialId = Number(watch(`materials.${index}.rawMaterialId`));
                                const selectedMaterial = allMaterials.find(
                                    (rm) => rm.id === selectedMaterialId
                                );

                                return (
                                    <HStack key={field.id} align="start">
                                        <FormControl isInvalid={!!rmError}>
                                            <FormLabel fontSize="sm">Material</FormLabel>
                                            <Select {...register(`materials.${index}.rawMaterialId`)}>
                                                <option value={0}>Select material</option>
                                                {allMaterials.map((rm) => {
                                                    const current = Number(selectedIds[index]);
                                                    const disabled = selectedSet.has(rm.id) && rm.id !== current;

                                                    return (
                                                        <option key={rm.id} value={rm.id} disabled={disabled}>
                                                            {rm.code} — {rm.name}
                                                        </option>
                                                    );
                                                })}
                                            </Select>
                                            <FormErrorMessage>{rmError as string}</FormErrorMessage>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="sm">Unit</FormLabel>
                                            <Input
                                                value={formatUnit(selectedMaterial?.unit) ?? ""}
                                                size="sm"
                                                isReadOnly
                                                bg="gray.100"
                                                color="gray.600"
                                                _readOnly={{
                                                    cursor: "not-allowed",
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl isInvalid={!!qtyError}>
                                            <FormLabel fontSize="sm">Quantity</FormLabel>
                                            <Input type="number" step="0.01" {...register(`materials.${index}.quantity`)} />
                                            <FormErrorMessage>{qtyError as string}</FormErrorMessage>
                                        </FormControl>


                                        <Button
                                            mt="28px"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => remove(index)}
                                            isDisabled={fields.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </HStack>
                                );
                            })}
                        </Stack>
                    </Box>

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
