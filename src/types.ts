export type ShoeCategory =
  | 'TASSELS'
  | 'LOAFERS'
  | 'CHELSEA BOOT'
  | 'PREMIUM CHELSEA'
  | 'PREMIUM SHOES'
  | 'SNEAKERS'
  | 'CHANKY SHOES'
  | "Men's Wallet";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ShoeCategory;
  categorySlug: string;
  price: number;
  discountPrice?: number;
  mainImage: string;
  otherImages?: string[];
  sizes: number[];
  colors: string[];
  material: string;
  soleType: string;
  description: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  stockQuantity: number;
  rating: number;
  totalReviews: number;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: number;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  district: string;
  postalCode: string;
  specialInstructions?: string;
}

export type PaymentMethod = 'cash_on_delivery' | 'bkash' | 'sslcommerz' | 'card';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  size: number;
  color: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedBuyer: boolean;
  createdAt: string;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedSize: number | null;
  selectedColor: string | null;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface AIStylingRecommendation {
  shoeIds: string[];
  styleTitle: string;
  stylingAdvice: string;
  recommendedOutfit: string;
  careTips: string;
}

export interface AISizeAdvice {
  recommendedSize: number;
  confidenceScore: number; // e.g. 95%
  fitDetails: string;
  notes: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrderAmount?: number;
}
