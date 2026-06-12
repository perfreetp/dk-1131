export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  style: string;
  format: string;
  color: string;
  industry: string;
  price: number;
  license_info: string;
  preview_url: string;
  file_url: string;
  downloads: number;
  likes: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  creator?: User;
}

export interface CartItem {
  id: string;
  asset_id: string;
  asset: Asset;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'paid' | 'completed' | 'refunded';
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  asset_id: string;
  price: number;
  quantity: number;
  asset?: Asset;
}

export interface Favorite {
  id: string;
  user_id: string;
  asset_id: string;
  asset?: Asset;
  created_at: string;
}

export interface Follower {
  id: string;
  follower_id: string;
  followed_id: string;
  created_at: string;
}

export interface RefundRequest {
  id: string;
  order_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface FilterOptions {
  category?: string;
  style?: string;
  format?: string;
  color?: string;
  industry?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'sales' | 'date';
  sortOrder?: 'asc' | 'desc';
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
