export type RawMaterial = {
  id: number;
  code: string;
  name: string;
  unit: string;
  stockQuantity: number;
};

export type RawMaterialRequest = {
  code: string;
  name: string;
  unit: string;
  stockQuantity: number;
};
