export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  parentId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}