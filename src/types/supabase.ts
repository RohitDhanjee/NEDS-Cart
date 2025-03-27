// Custom types for Supabase tables
// These complement the auto-generated types

// Product type
export interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  category_id: string;
  price: number;
  image: string | null;
  created_at: string;
  updated_at: string;
  is_featured: boolean | null;
}

// Product variation type
export interface ProductVariation {
  id: string;
  product_id: string;
  duration: string;
  price_modifier: number;
  created_at: string;
  updated_at: string;
}

// Product feature type
export interface ProductFeature {
  id: string;
  product_id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

// Order type
export interface Order {
  id: string;
  user_id: string | null;
  status: string;
  total_amount: number;
  payment_id: string | null;
  billing_email: string;
  billing_name: string;
  billing_address: string | null;
  created_at: string;
  updated_at: string;
}

// Order item type
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variation_id: string | null;
  quantity: number;
  price: number;
  created_at: string;
}

// User role type
export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

// Profile type
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
