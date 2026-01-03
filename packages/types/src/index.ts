// Shared TypeScript types for Xoom Mart

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  category?: Category;
  items?: Item[];
}

export interface Item {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategoryId: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: string[];
  isAvailable: boolean;
  stockQuantity: number;
  tags: string[];
  isActive: boolean;
  subcategory?: Subcategory;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  category?: string;
  address?: string;
  deliveryFee: number;
  estimatedDelivery: number;
  isOpen: boolean;
  isActive: boolean;
  bannerUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerPhone: string;
  customerName?: string;
  deliveryAddress: string;
  shopId?: string;
  riderId?: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  codAmount?: number;
  codCollected: boolean;
  notes?: string;
  createdAt: Date;
  deliveredAt?: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartItem {
  item: Item;
  quantity: number;
}

export interface User {
  id: string;
  email?: string;
  phone: string;
  name?: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  RIDER = 'RIDER',
  CUSTOMER = 'CUSTOMER',
}

export enum OrderStatus {
  PLACED = 'PLACED',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface PlatformConfig {
  deliveryFee: {
    default: number;
    freeAbove: number;
  };
  platformFee: {
    percentage: number;
  };
  tax: {
    percentage: number;
  };
  minOrderValue: {
    amount: number;
  };
}

export interface Banner {
  id: string;
  title?: string;
  imageUrl: string;
  linkType: string;
  linkId?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface HomeData {
  sections: any[];
  banners: Banner[];
  categories: Category[];
  deals: Item[];
  popular: Item[];
  shops: Shop[];
}
