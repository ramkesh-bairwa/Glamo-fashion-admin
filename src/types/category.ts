export interface Category {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  parentId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}