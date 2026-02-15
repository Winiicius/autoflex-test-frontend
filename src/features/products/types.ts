export type ProductMaterial = {
  rawMaterialId: number;
  rawMaterialName?: string;
  quantity: number;
  unit?: string;
};

export type Product = {
  id: number;
  code: string;
  name: string;
  price: number;
  materials?: ProductMaterial[];
};

export type ProductRequest = {
  code: string;
  name: string;
  price: number;
  materials?: Array<{ rawMaterialId: number; quantity: number }>;
};

export type ProductMaterialsRequest = Array<{
  rawMaterialId: number;
  quantity: number;
}>;
