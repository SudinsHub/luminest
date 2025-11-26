export interface Product {
  id: string
  title: string
  description: string
  price: number
  stock_quantity: number
  images: string[]
  average_rating: number
  total_reviews: number
  created_at: string
  updated_at: string
  categories: string[]
  tags: string[]
  reviews?: Review[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product_id: string
  title: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  customer_name: string
  delivery_address: string
  customer_contact: string
  customer_email: string
  subtotal: number
  delivery_charge: number
  discount_amount: number
  coupon_id: string | null
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  notes: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  product_id: string
  title: string
  image: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Review {
  id: string
  product_id: string
  rating: number
  comment: string
  created_at: string
  customer_name: string
}

export interface Customer {
  id: string
  name: string
  address: string
  contact_no: string
  email: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface CarouselImage {
  id: string
  image_url: string
  link_url: string | null
  alt_text: string | null
  display_order: number
  is_active?: boolean
}

export interface Banner {
  id: string
  message: string
  is_active: boolean
}

export interface Coupon {
  id: string
  code: string
  type: string
  value: number
  max_discount: number | null
  min_order_amount: number
  category_id: string | null
  product_id: string | null
  is_active: boolean
  valid_from: string
  valid_until: string | null
  usage_limit: number | null
  used_count: number
}

export interface Tag {
  tag_name: string;
}

export interface ProductTag {
  id: string;
  tag_name: string;
}
 
