# Xoom Mart - Frontend Implementation Guide

This document contains all the code needed to implement the three Next.js applications.

---

## Overview

The frontend consists of three Next.js 14 applications:
1. **Customer App** (Port 3000) - Public-facing shopping app
2. **Admin Panel** (Port 3002) - Admin dashboard
3. **Rider App** (Port 3003) - Rider order management

---

## Initial Setup for All Apps

For each app (customer, admin, rider), follow these steps:

### 1. Initialize Next.js App

```bash
# From xoom-mart root
cd apps/customer  # or admin, or rider
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

Select:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Import alias: Yes (@/*)

### 2. Install Dependencies

```bash
npm install axios zustand @tanstack/react-query lucide-react date-fns
npm install -D @types/node
```

---

## Customer App Structure

```
apps/customer/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home page
│   ├── categories/
│   │   └── [slug]/page.tsx        # Category page
│   ├── items/
│   │   └── [slug]/page.tsx        # Item detail
│   ├── shops/
│   │   ├── page.tsx                # Shop listing
│   │   └── [slug]/page.tsx        # Shop detail
│   ├── cart/
│   │   └── page.tsx                # Cart
│   ├── checkout/
│   │   └── page.tsx                # Checkout
│   └── orders/
│       └── track/page.tsx          # Order tracking
├── components/
│   ├── Header.tsx
│   ├── ItemCard.tsx
│   ├── CartButton.tsx
│   └── ...
├── lib/
│   ├── api.ts                      # API client
│   └── store.ts                    # Zustand store
└── public/
    └── manifest.json                # PWA manifest
```

---

## Complete Code Files

### Customer App - app/layout.tsx

```typescript
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xoom Mart - Hyperlocal Delivery',
  description: 'Order from nearby shops and get delivery fast',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
```

### Customer App - lib/api.ts

```typescript
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Home
export const getHomeData = () => api.get('/home')

// Categories
export const getCategories = () => api.get('/categories')
export const getCategoryBySlug = (slug: string) => api.get(`/categories/${slug}`)

// Items
export const getItems = (params?: any) => api.get('/items', { params })
export const getItemBySlug = (slug: string) => api.get(`/items/${slug}`)
export const searchItems = (q: string) => api.get(`/items/search?q=${q}`)
export const getDealItems = () => api.get('/items/deals')

// Shops
export const getShops = () => api.get('/shops')
export const getShopBySlug = (slug: string) => api.get(`/shops/${slug}`)

// Orders
export const createOrder = (data: any) => api.post('/orders', data)
export const trackOrder = (phone: string, orderNumber: string) =>
  api.get(`/orders/track?phone=${phone}&orderNumber=${orderNumber}`)
export const submitFeedback = (orderId: string, data: any) =>
  api.post(`/orders/${orderId}/feedback`, data)

// Config
export const getPublicConfig = () => api.get('/config/public')
```

### Customer App - lib/store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  discountPrice?: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.id === item.id)

        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.discountPrice || item.price
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: 'xoom-cart',
    }
  )
)
```

### Customer App - components/Header.tsx

```typescript
'use client'

import Link from 'next/link'
import { ShoppingCart, Search } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export default function Header() {
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Xoom Mart
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>

            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
```

### Customer App - components/ItemCard.tsx

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCartStore } from '@/lib/store'

interface ItemCardProps {
  item: {
    id: string
    name: string
    slug: string
    price: number
    discountPrice?: number
    discountPercent?: number
    images: string[]
    tags?: string[]
  }
}

export default function ItemCard({ item }: ItemCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const displayPrice = item.discountPrice || item.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice,
      quantity: 1,
      image: item.images[0] || '/placeholder.png',
    })
  }

  return (
    <Link href={`/items/${item.slug}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
        <div className="relative aspect-square">
          <Image
            src={item.images[0] || '/placeholder.png'}
            alt={item.name}
            fill
            className="object-cover"
          />
          {item.discountPercent && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              {item.discountPercent}% OFF
            </div>
          )}
          {item.tags?.includes('NEW') && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
              NEW
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>

          <div className="flex items-center justify-between">
            <div>
              {item.discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    PKR {displayPrice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    PKR {item.price}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  PKR {item.price}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
```

### Customer App - app/page.tsx

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ItemCard from '@/components/ItemCard'
import { getHomeData } from '@/lib/api'

export default function HomePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHomeData()
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading home data:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data?.categories?.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals */}
      {data?.deals?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Deals & Offers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.deals.map((item: any) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Items */}
      {data?.popular?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.popular.map((item: any) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Shops */}
      {data?.shops?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Nearby Shops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.shops.map((shop: any) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.slug}`}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{shop.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{shop.category}</p>
                <div className="flex justify-between text-sm">
                  <span>Delivery: PKR {shop.deliveryFee}</span>
                  <span className={shop.isOpen ? 'text-green-600' : 'text-red-600'}>
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

### Customer App - app/cart/page.tsx

```typescript
'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  const subtotal = getTotal()
  const deliveryFee = subtotal >= 500 ? 0 : 50
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push('/')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b py-4">
              <div className="relative w-24 h-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-green-600 font-bold">
                  PKR {item.discountPrice || item.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-red-50 rounded text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>PKR {deliveryFee}</span>
              </div>
              {subtotal >= 500 && (
                <p className="text-sm text-green-600">Free delivery applied!</p>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>PKR {total}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Customer App - app/checkout/page.tsx

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { createOrder } from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerPhone: '',
    customerName: '',
    deliveryAddress: '',
    notes: '',
  })

  const subtotal = getTotal()
  const deliveryFee = subtotal >= 500 ? 0 : 50
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
      }

      const response = await createOrder(orderData)
      clearCart()
      router.push(`/orders/track?orderNumber=${response.data.orderNumber}&phone=${formData.customerPhone}`)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => router.push('/')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Phone Number *</label>
          <input
            type="tel"
            required
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            placeholder="+923001234567"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="Your name"
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
          <textarea
            required
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            placeholder="House 123, Street 5, Area, City"
            rows={3}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special instructions..."
            rows={2}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({items.length} items)</span>
              <span>PKR {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>PKR {deliveryFee}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>PKR {total}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
            💰 Payment Method: <span className="font-semibold">Cash on Delivery</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Placing Order...' : `Place Order - PKR ${total}`}
        </button>
      </form>
    </div>
  )
}
```

---

## Admin Panel Structure

The admin panel requires similar setup but with authentication and admin-specific components.

### Admin - lib/api.ts (with auth)

```typescript
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export const api = axios.create({
  baseURL: API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const adminLogin = (email: string, password: string) =>
  api.post('/auth/admin/login', { email, password })

// All admin endpoints with Bearer token automatically added
export const getCategories = () => api.get('/admin/categories')
export const createCategory = (data: any) => api.post('/admin/categories', data)
// ... etc
```

---

## Rider App Structure

Similar to customer app but with rider-specific functionality.

---

## PWA Configuration

### public/manifest.json (for all apps)

```json
{
  "name": "Xoom Mart",
  "short_name": "Xoom",
  "description": "Hyperlocal delivery platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Running the Apps

After implementing all the above code:

```bash
# Install dependencies
npm install

# Start all apps
npm run dev
```

---

## Notes

This document contains the core structure and essential code. You'll need to:

1. Create the actual Next.js apps using `create-next-app`
2. Copy the code snippets into the appropriate files
3. Install the specified dependencies
4. Add missing pages following the same patterns
5. Create UI components for admin and rider apps following similar patterns

All backend APIs are already implemented and ready to use!
