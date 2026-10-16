export type Product = {
  id: string;
  barcode: string;
  name: string;
  category: string;
  priceCents: number;
  active: boolean;
  imageUrl: string | null;
};

export type CreateProduct = {
  barcode: string;
  name: string | string;
  priceCents: number;
  imageUrl?: string | null;
};

export type CartItem = Product & { quantity: number };
