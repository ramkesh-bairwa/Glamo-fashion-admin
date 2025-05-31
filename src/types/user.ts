export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'manager';
  status: 'active' | 'inactive' | 'banned';
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  lastLoginAt?: string;
}