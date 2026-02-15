export type ProductionMaterial = {
  rawMaterialId: number;
  rawMaterialCode: string;
  rawMaterialName: string;
  unit: string;
  requiredPerUnit: number;
  stockQuantity: number;
};

export type ProductionCapacityItem = {
  productId: number;
  productCode: string;
  productName: string;
  unitPrice: number;
  maxQuantity: number;
  totalValue: number;
  materials: ProductionMaterial[];
};
