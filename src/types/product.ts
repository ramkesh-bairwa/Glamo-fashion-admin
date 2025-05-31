export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  brandId: string;
  images: string[];
  stock: number;
  sku: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}