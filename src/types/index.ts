export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  fabric: string | null;
  color: string | null;
  occasion: string | null;
  silkType: string | null;
  weight: string | null;
  dimensions: string | null;
  careInstructions: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  category: Category;
  variants: ProductVariant[];
  reviews: Review[];
  _count?: { reviews: number };
  avgRating?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isVideo: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number | null;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
  _count?: { products: number };
}

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  isVerified: boolean;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

export interface CartItemType {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  savedForLater: boolean;
  product: Product;
  variant: ProductVariant | null;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  createdAt: string;
  items: OrderItem[];
  address: Address;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  position: string;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  fabric?: string;
  color?: string;
  occasion?: string;
  silkType?: string;
  rating?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface JWT {
    id: string;
    role: string;
  }
}
