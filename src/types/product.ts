export interface Product {
  id: string;
  title: string;
  shortDesc: string;
  price: number;
  category: string;
  brand: string;
  image: string; // changed from images to image
  slug: string;
  affiliateUrl: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}