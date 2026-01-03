# XOOM MART — TECHNICAL IMPLEMENTATION PLAN (MVP)

**Version:** 1.0
**Date:** 2026-01-03
**Status:** Architecture & Planning Phase

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Database Schema](#3-database-schema)
4. [API Design](#4-api-design)
5. [Frontend Structure](#5-frontend-structure)
6. [Development Phases](#6-development-phases)
7. [MVP vs Future Features](#7-mvp-vs-future-features)
8. [Assumptions & Risks](#8-assumptions--risks)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Overview
Xoom Mart is a hyperlocal commerce & delivery platform for Pakistan, optimized for:
- Cash on Delivery (COD)
- Mobile-first experience
- Guest checkout flow
- Admin-controlled operations
- Quick launch (MVP-first approach)

### 1.2 Technical Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- PWA support (next-pwa)
- Zustand (state management)
- React Query (data fetching)

**Backend:**
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- REST APIs

**Infrastructure:**
- Vercel (Frontend hosting)
- Railway/Render (Backend hosting)
- PostgreSQL (managed database)
- Cloudinary/S3 (image storage)

### 1.3 Core User Flows

1. **Customer Flow:** Browse → Add to Cart → Guest Checkout → Order Tracking
2. **Admin Flow:** Manage Catalog → Configure Pricing → Assign Riders → Track Orders
3. **Rider Flow:** Login → View Assigned Orders → Update Status → Collect COD

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Customer  │  │    Admin    │  │    Rider    │        │
│  │   PWA App   │  │    Panel    │  │   PWA App   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
          ┌─────────────────▼─────────────────┐
          │      API GATEWAY / BACKEND        │
          │         (NestJS REST API)         │
          │  ┌────────────────────────────┐   │
          │  │  Auth Module               │   │
          │  │  Catalog Module            │   │
          │  │  Order Module              │   │
          │  │  Shop Module               │   │
          │  │  Rider Module              │   │
          │  │  Promotion Module          │   │
          │  │  Config Module             │   │
          │  │  Notification Module       │   │
          │  └────────────────────────────┘   │
          └─────────────────┬─────────────────┘
                            │
          ┌─────────────────▼─────────────────┐
          │      DATABASE LAYER               │
          │         (PostgreSQL)              │
          └───────────────────────────────────┘
```

### 2.2 Module Breakdown

**Customer App (Next.js PWA)**
- Public pages (no auth required)
- Guest checkout support
- Order tracking by mobile number + order ID
- Responsive mobile-first design
- Installable PWA

**Admin Panel (Next.js)**
- Protected routes (JWT auth)
- RBAC (Role-Based Access Control)
- Full CRUD operations
- Rich dashboard UI
- Real-time order management

**Rider App (Next.js PWA)**
- Mobile-first minimal UI
- Login via mobile number
- Order assignment view
- Status update interface

**Backend (NestJS)**
- RESTful API architecture
- Modular structure
- JWT authentication
- Role-based guards
- Validation pipes
- Error handling middleware

---

## 3. DATABASE SCHEMA

### 3.1 Entity Relationship Diagram

```
┌────────────┐       ┌──────────────┐       ┌─────────────┐
│  Category  │◄──────│   SubCategory│       │    Item     │
└────────────┘       └──────────────┘       └─────────────┘
                            │                       │
                            └───────────────────────┘
                                       │
┌────────────┐                        │
│    Shop    │                        │
└────────────┘                        │
      │                                │
      │                                │
      ▼                                ▼
┌────────────┐       ┌──────────────┐       ┌─────────────┐
│  ShopItem  │       │  OrderItem   │◄──────│    Order    │
└────────────┘       └──────────────┘       └─────────────┘
                                                    │
                                                    │
                                            ┌───────┴────────┐
                                            │                │
                                            ▼                ▼
                                    ┌─────────────┐  ┌──────────┐
                                    │    Rider    │  │ Customer │
                                    └─────────────┘  └──────────┘
```

### 3.2 Core Tables

#### **users**
```sql
id                  UUID PRIMARY KEY
phone               VARCHAR(20) UNIQUE NOT NULL
name                VARCHAR(255)
email               VARCHAR(255)
role                ENUM('ADMIN', 'RIDER', 'CUSTOMER')
password_hash       VARCHAR(255)
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **categories**
```sql
id                  UUID PRIMARY KEY
name                VARCHAR(255) NOT NULL
slug                VARCHAR(255) UNIQUE NOT NULL
icon_url            VARCHAR(500)
display_order       INTEGER
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **subcategories**
```sql
id                  UUID PRIMARY KEY
category_id         UUID REFERENCES categories(id)
name                VARCHAR(255) NOT NULL
slug                VARCHAR(255) UNIQUE NOT NULL
display_order       INTEGER
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **items**
```sql
id                  UUID PRIMARY KEY
name                VARCHAR(255) NOT NULL
slug                VARCHAR(255) UNIQUE NOT NULL
description         TEXT
subcategory_id      UUID REFERENCES subcategories(id)
price               DECIMAL(10,2) NOT NULL
discount_price      DECIMAL(10,2)
discount_percent    INTEGER
images              JSONB (array of URLs)
is_available        BOOLEAN DEFAULT true
stock_quantity      INTEGER
tags                JSONB (array: ['NEW', 'SALE', 'HOT'])
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **shops**
```sql
id                  UUID PRIMARY KEY
name                VARCHAR(255) NOT NULL
slug                VARCHAR(255) UNIQUE NOT NULL
category            VARCHAR(100)
address             TEXT
location_lat        DECIMAL(10,8)
location_lng        DECIMAL(11,8)
delivery_fee        DECIMAL(10,2)
estimated_delivery  INTEGER (in minutes)
is_open             BOOLEAN DEFAULT true
is_active           BOOLEAN DEFAULT true
banner_url          VARCHAR(500)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **shop_items**
```sql
id                  UUID PRIMARY KEY
shop_id             UUID REFERENCES shops(id)
item_id             UUID REFERENCES items(id)
shop_price          DECIMAL(10,2)
is_available        BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP

UNIQUE(shop_id, item_id)
```

#### **orders**
```sql
id                  UUID PRIMARY KEY
order_number        VARCHAR(50) UNIQUE NOT NULL
customer_phone      VARCHAR(20) NOT NULL
customer_name       VARCHAR(255)
delivery_address    TEXT NOT NULL
shop_id             UUID REFERENCES shops(id) NULL
rider_id            UUID REFERENCES users(id) NULL
status              ENUM('PLACED', 'ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED')
subtotal            DECIMAL(10,2) NOT NULL
delivery_fee        DECIMAL(10,2) NOT NULL
platform_fee        DECIMAL(10,2) DEFAULT 0
tax                 DECIMAL(10,2) DEFAULT 0
total               DECIMAL(10,2) NOT NULL
payment_method      VARCHAR(50) DEFAULT 'COD'
cod_amount          DECIMAL(10,2)
cod_collected       BOOLEAN DEFAULT false
notes               TEXT
created_at          TIMESTAMP
updated_at          TIMESTAMP
delivered_at        TIMESTAMP
```

#### **order_items**
```sql
id                  UUID PRIMARY KEY
order_id            UUID REFERENCES orders(id)
item_id             UUID REFERENCES items(id)
item_name           VARCHAR(255)
quantity            INTEGER NOT NULL
unit_price          DECIMAL(10,2) NOT NULL
total_price         DECIMAL(10,2) NOT NULL
created_at          TIMESTAMP
```

#### **promotions**
```sql
id                  UUID PRIMARY KEY
name                VARCHAR(255) NOT NULL
type                ENUM('PERCENTAGE', 'FIXED', 'BUNDLE')
value               DECIMAL(10,2) NOT NULL
code                VARCHAR(50) UNIQUE
starts_at           TIMESTAMP
ends_at             TIMESTAMP
is_active           BOOLEAN DEFAULT true
applicable_to       JSONB (items, categories, shops)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **banners**
```sql
id                  UUID PRIMARY KEY
title               VARCHAR(255)
image_url           VARCHAR(500) NOT NULL
link_type           ENUM('ITEM', 'CATEGORY', 'SHOP', 'EXTERNAL')
link_id             UUID NULL
display_order       INTEGER
is_active           BOOLEAN DEFAULT true
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **home_sections**
```sql
id                  UUID PRIMARY KEY
section_type        ENUM('HERO', 'CATEGORIES', 'DEALS', 'POPULAR', 'SHOPS')
title               VARCHAR(255)
display_order       INTEGER
is_active           BOOLEAN DEFAULT true
config              JSONB (section-specific settings)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### **feedbacks**
```sql
id                  UUID PRIMARY KEY
order_id            UUID REFERENCES orders(id)
rating              INTEGER (1-5)
comment             TEXT
created_at          TIMESTAMP
```

#### **platform_config**
```sql
id                  UUID PRIMARY KEY
key                 VARCHAR(100) UNIQUE NOT NULL
value               JSONB NOT NULL
description         TEXT
updated_at          TIMESTAMP

-- Examples:
-- key: 'delivery_fee', value: {"default": 50, "free_above": 500}
-- key: 'platform_fee', value: {"percentage": 5}
-- key: 'tax', value: {"percentage": 0}
-- key: 'min_order_value', value: {"amount": 200}
```

---

## 4. API DESIGN

### 4.1 API Structure

**Base URL:** `/api/v1`

### 4.2 Endpoint Groups

#### **Public Endpoints (No Auth)**

**Home & Content**
```
GET    /home                          # Get home page data (sections, banners, deals)
GET    /categories                    # List all active categories
GET    /categories/:slug              # Get category with subcategories
GET    /subcategories/:slug           # Get subcategory with items
```

**Items**
```
GET    /items                         # List items (with filters)
GET    /items/:slug                   # Get single item details
GET    /items/search?q=               # Search items
GET    /items/deals                   # Get deal items
```

**Shops**
```
GET    /shops                         # List all shops
GET    /shops/:slug                   # Get shop details with items
```

**Orders (Guest)**
```
POST   /orders                        # Create order (guest checkout)
GET    /orders/track?phone=&orderId=  # Track order by phone + order number
POST   /orders/:id/feedback           # Submit feedback
```

**Config**
```
GET    /config/public                 # Get public config (delivery fees, etc.)
```

#### **Admin Endpoints (Auth Required)**

**Catalog Management**
```
POST   /admin/categories              # Create category
PUT    /admin/categories/:id          # Update category
DELETE /admin/categories/:id          # Delete category
POST   /admin/subcategories           # Create subcategory
PUT    /admin/subcategories/:id       # Update subcategory
DELETE /admin/subcategories/:id       # Delete subcategory

POST   /admin/items                   # Create item
PUT    /admin/items/:id               # Update item
DELETE /admin/items/:id               # Delete item
POST   /admin/items/bulk-upload       # Bulk upload items (CSV)
```

**Shop Management**
```
POST   /admin/shops                   # Create shop
PUT    /admin/shops/:id               # Update shop
DELETE /admin/shops/:id               # Delete shop
POST   /admin/shops/:id/items         # Add item to shop
DELETE /admin/shops/:id/items/:itemId # Remove item from shop
```

**Promotions**
```
GET    /admin/promotions              # List all promotions
POST   /admin/promotions              # Create promotion
PUT    /admin/promotions/:id          # Update promotion
DELETE /admin/promotions/:id          # Delete promotion
```

**Content Management**
```
GET    /admin/banners                 # List banners
POST   /admin/banners                 # Create banner
PUT    /admin/banners/:id             # Update banner
DELETE /admin/banners/:id             # Delete banner

GET    /admin/home-sections           # List home sections
PUT    /admin/home-sections/:id       # Update section (order, active, config)
```

**Order Management**
```
GET    /admin/orders                  # List all orders (with filters)
GET    /admin/orders/:id              # Get order details
PUT    /admin/orders/:id/status       # Update order status
PUT    /admin/orders/:id/assign-rider # Assign rider to order
GET    /admin/orders/stats            # Order statistics
```

**Rider Management**
```
GET    /admin/riders                  # List all riders
POST   /admin/riders                  # Create rider
PUT    /admin/riders/:id              # Update rider
PUT    /admin/riders/:id/toggle       # Enable/disable rider
```

**Config Management**
```
GET    /admin/config                  # Get all config
PUT    /admin/config/:key             # Update config value
```

**Media Upload**
```
POST   /admin/upload                  # Upload image (returns URL)
```

#### **Rider Endpoints (Auth Required)**

```
GET    /rider/orders                  # Get assigned orders
GET    /rider/orders/:id              # Get order details
PUT    /rider/orders/:id/status       # Update order status
PUT    /rider/orders/:id/collect-cod  # Mark COD collected
```

#### **Auth Endpoints**

```
POST   /auth/admin/login              # Admin login (email + password)
POST   /auth/rider/login              # Rider login (phone + password)
POST   /auth/refresh                  # Refresh JWT token
```

### 4.3 Sample Request/Response

**Example: Create Order (Guest Checkout)**

```
POST /api/v1/orders
Content-Type: application/json

{
  "customerPhone": "+923001234567",
  "customerName": "Ahmed Khan",
  "deliveryAddress": "House 123, Street 5, F-10, Islamabad",
  "shopId": null,  // null for platform items
  "items": [
    {
      "itemId": "uuid-1",
      "quantity": 2
    },
    {
      "itemId": "uuid-2",
      "quantity": 1
    }
  ],
  "notes": "Please ring the bell"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "XM20260103001",
    "status": "PLACED",
    "total": 850,
    "estimatedDelivery": "30-40 minutes"
  }
}
```

---

## 5. FRONTEND STRUCTURE

### 5.1 Application Structure

```
xoom-mart/
├── apps/
│   ├── customer/              # Customer PWA (Next.js)
│   ├── admin/                 # Admin Panel (Next.js)
│   └── rider/                 # Rider PWA (Next.js)
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── types/                 # Shared TypeScript types
│   └── utils/                 # Shared utilities
└── backend/                   # NestJS API
```

### 5.2 Customer App Structure

```
apps/customer/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Home page
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx          # Category page
│   │   ├── items/
│   │   │   └── [slug]/page.tsx          # Item detail page
│   │   ├── shops/
│   │   │   ├── page.tsx                 # Shop listing
│   │   │   └── [slug]/page.tsx          # Shop detail page
│   │   ├── cart/
│   │   │   └── page.tsx                 # Cart page
│   │   ├── checkout/
│   │   │   └── page.tsx                 # Checkout page
│   │   ├── orders/
│   │   │   └── track/page.tsx           # Order tracking
│   │   └── api/                         # API routes (if needed)
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── DealsSection.tsx
│   │   │   ├── PopularItems.tsx
│   │   │   └── ShopsSection.tsx
│   │   ├── catalog/
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemGrid.tsx
│   │   │   └── ItemDetail.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── QuantityControl.tsx
│   │   ├── checkout/
│   │   │   └── CheckoutForm.tsx
│   │   ├── orders/
│   │   │   ├── OrderTracker.tsx
│   │   │   └── OrderStatus.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── SearchBar.tsx
│   │       ├── Footer.tsx
│   │       └── BottomNav.tsx
│   ├── store/
│   │   ├── cartStore.ts                  # Zustand cart state
│   │   └── configStore.ts                # Platform config
│   ├── lib/
│   │   ├── api.ts                        # API client
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── public/
│   ├── manifest.json                     # PWA manifest
│   ├── icons/
│   └── service-worker.js
└── next.config.js
```

### 5.3 Admin Panel Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # Dashboard overview
│   │   │   ├── catalog/
│   │   │   │   ├── categories/page.tsx
│   │   │   │   ├── items/page.tsx
│   │   │   │   └── items/new/page.tsx
│   │   │   ├── shops/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── promotions/
│   │   │   │   └── page.tsx
│   │   │   ├── content/
│   │   │   │   ├── banners/page.tsx
│   │   │   │   └── home-sections/page.tsx
│   │   │   ├── riders/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx             # Platform config
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── Stats.tsx
│   │   ├── catalog/
│   │   │   ├── ItemForm.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   └── ImageUpload.tsx
│   │   ├── orders/
│   │   │   ├── OrderTable.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   └── RiderAssignment.tsx
│   │   └── common/
│   │       ├── DataTable.tsx
│   │       ├── Modal.tsx
│   │       └── ConfirmDialog.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── middleware.ts                     # Auth protection
```

### 5.4 Rider App Structure

```
apps/rider/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx                 # Assigned orders list
│   │   │   └── [id]/page.tsx            # Order detail
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   ├── OrderDetail.tsx
│   │   └── StatusUpdate.tsx
│   └── lib/
│       └── api.ts
```

### 5.5 Key UI Components

**ItemCard.tsx**
```tsx
interface ItemCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  images: string[];
  isAvailable: boolean;
  tags?: string[];
  onAddToCart: (id: string, quantity: number) => void;
}
```

**CartSummary.tsx**
```tsx
interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  tax: number;
  total: number;
}
```

**OrderTracker.tsx**
```tsx
interface OrderTrackerProps {
  status: OrderStatus;
  createdAt: Date;
  assignedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}
```

---

## 6. DEVELOPMENT PHASES

### PHASE 1: PROJECT SETUP & INFRASTRUCTURE (Week 1)

**Tasks:**
1. Initialize monorepo structure (Turborepo or Nx)
2. Set up Next.js apps (customer, admin, rider)
3. Set up NestJS backend
4. Configure PostgreSQL database
5. Set up Prisma ORM with schema
6. Configure TypeScript, ESLint, Prettier
7. Set up Git repository and branching strategy
8. Configure environment variables
9. Set up image upload (Cloudinary/S3)
10. Deploy initial skeleton to staging

**Deliverables:**
- Working development environment
- Database schema migrated
- Basic API health check endpoint
- All 3 apps running locally

---

### PHASE 2: BACKEND API DEVELOPMENT (Week 2-3)

**Priority 1: Core Catalog API**
1. Categories CRUD
2. Subcategories CRUD
3. Items CRUD
4. Image upload endpoint
5. Public catalog endpoints (GET)

**Priority 2: Order API**
1. Create order endpoint
2. Order calculation logic (subtotal, fees, total)
3. Order tracking endpoint
4. Order status update
5. Feedback submission

**Priority 3: Admin API**
1. Admin authentication (JWT)
2. Protected routes with guards
3. Admin-only catalog management
4. Order management endpoints
5. Rider CRUD endpoints

**Priority 4: Shop & Promotion API**
1. Shop CRUD
2. Shop-item associations
3. Promotion CRUD
4. Banner CRUD
5. Home section configuration

**Priority 5: Rider API**
1. Rider authentication
2. Assigned orders endpoint
3. Status update endpoint
4. COD collection endpoint

**Priority 6: Platform Config API**
1. Config CRUD
2. Public config endpoint
3. Dynamic fee calculation

**Deliverables:**
- Complete REST API
- API documentation (Swagger)
- Postman/Insomnia collection

---

### PHASE 3: CUSTOMER APP DEVELOPMENT (Week 4-5)

**Priority 1: Core Browsing**
1. Home page with dynamic sections
2. Category listing and detail pages
3. Item listing and detail pages
4. Search functionality
5. Responsive mobile-first layout

**Priority 2: Shopping Flow**
1. Cart state management (Zustand)
2. Add to cart functionality
3. Quantity controls
4. Cart page with summary
5. Remove from cart

**Priority 3: Checkout & Order**
1. Guest checkout form
2. Mobile number input with validation
3. Delivery address input
4. Order creation flow
5. Order confirmation page

**Priority 4: Order Tracking**
1. Track order page
2. Order status display
3. Feedback form

**Priority 5: Shop Features**
1. Shop listing page
2. Shop detail page
3. Shop-specific items

**Priority 6: PWA Setup**
1. Service worker configuration
2. Manifest.json
3. Install prompt
4. Offline fallback page
5. App icons

**Deliverables:**
- Fully functional customer app
- Installable PWA
- End-to-end order flow working

---

### PHASE 4: ADMIN PANEL DEVELOPMENT (Week 6-7)

**Priority 1: Authentication & Layout**
1. Admin login page
2. Protected routes middleware
3. Dashboard layout (sidebar, topbar)
4. Logout functionality

**Priority 2: Catalog Management**
1. Category management UI
2. Subcategory management UI
3. Item management UI (list, create, edit, delete)
4. Image upload component
5. Bulk actions

**Priority 3: Order Management**
1. Order list with filters
2. Order detail view
3. Status update UI
4. Rider assignment dropdown
5. Order statistics dashboard

**Priority 4: Content Management**
1. Banner management
2. Home section configuration
3. Drag-and-drop section ordering
4. Enable/disable toggles

**Priority 5: Shop & Promotion Management**
1. Shop CRUD UI
2. Promotion CRUD UI
3. Shop-item assignment interface

**Priority 6: Rider Management**
1. Rider list
2. Add/edit rider
3. Enable/disable rider
4. Rider performance view (future)

**Priority 7: Settings & Config**
1. Platform config UI
2. Delivery fee settings
3. Platform fee settings
4. Tax settings
5. Min order value settings

**Deliverables:**
- Fully functional admin panel
- All CRUD operations working
- Order management system

---

### PHASE 5: RIDER APP DEVELOPMENT (Week 8)

**Priority 1: Core Functionality**
1. Rider login page
2. Assigned orders list
3. Order detail view
4. Status update buttons
5. COD collection checkbox

**Priority 2: UI Polish**
1. Mobile-optimized layout
2. Clear action buttons
3. Order information display

**Deliverables:**
- Functional rider app
- Basic PWA support

---

### PHASE 6: TESTING & QA (Week 9)

**Tasks:**
1. End-to-end testing (customer flow)
2. Admin panel testing (all CRUD operations)
3. Rider app testing
4. Mobile device testing (Android/iOS)
5. PWA installation testing
6. Performance testing
7. API load testing
8. Bug fixing
9. Security audit
10. COD flow verification

**Deliverables:**
- Test report
- Bug-free critical flows
- Performance benchmarks

---

### PHASE 7: DEPLOYMENT & LAUNCH (Week 10)

**Tasks:**
1. Set up production environment
2. Configure production database
3. Deploy backend to production
4. Deploy frontend apps to production
5. Configure custom domains
6. SSL certificates
7. Set up monitoring (Sentry, LogRocket)
8. Set up analytics (Google Analytics)
9. Final smoke tests
10. Soft launch with limited users
11. Monitor and fix issues
12. Full launch

**Deliverables:**
- Live production apps
- Monitoring dashboards
- Launch announcement

---

## 7. MVP vs FUTURE FEATURES

### 7.1 MVP SCOPE (Must Have for Launch)

**Customer App:**
- ✅ Browse items by category
- ✅ View item details
- ✅ Add to cart
- ✅ Guest checkout (mobile number only)
- ✅ COD payment only
- ✅ Order tracking by phone + order ID
- ✅ Submit feedback after delivery
- ✅ View shops and shop items
- ✅ PWA installable
- ✅ Responsive mobile-first design

**Admin Panel:**
- ✅ Login with email + password
- ✅ Category/Subcategory CRUD
- ✅ Item CRUD with images
- ✅ Shop CRUD
- ✅ Banner management
- ✅ Home section configuration
- ✅ Order management (view, filter, assign rider)
- ✅ Rider CRUD
- ✅ Platform config (fees, tax, etc.)
- ✅ Promotion management (basic)
- ✅ Manual rider assignment

**Rider App:**
- ✅ Login with mobile + password
- ✅ View assigned orders
- ✅ Update order status
- ✅ Mark COD collected

**Backend:**
- ✅ All CRUD APIs
- ✅ Order calculation logic
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Image upload

---

### 7.2 POST-MVP FEATURES (Phase 2)

**Customer App Enhancements:**
- ⏳ User registration and login
- ⏳ Order history (for logged-in users)
- ⏳ Save multiple addresses
- ⏳ Wishlist
- ⏳ Product reviews
- ⏳ Promo code application
- ⏳ Live order tracking (map view)
- ⏳ Push notifications
- ⏳ In-app chat with support

**Admin Panel Enhancements:**
- ⏳ Advanced analytics dashboard
- ⏳ Sales reports
- ⏳ Inventory management
- ⏳ Low stock alerts
- ⏳ Rider performance analytics
- ⏳ Customer insights
- ⏳ Automated rider assignment (algorithm)
- ⏳ Bulk import/export (Excel)
- ⏳ Email notifications

**Rider App Enhancements:**
- ⏳ GPS tracking
- ⏳ Route optimization
- ⏳ In-app navigation
- ⏳ Earnings dashboard
- ⏳ Order acceptance/rejection
- ⏳ Chat with customer

**Payment Integration:**
- ⏳ Online payment gateway (JazzCash, EasyPaisa)
- ⏳ Wallet system
- ⏳ Credit card payments

**Vendor Dashboard:**
- ⏳ Shop owner portal
- ⏳ Shop owner can manage their items
- ⏳ Shop owner order management
- ⏳ Shop owner analytics

**Advanced Features:**
- ⏳ AI-based product recommendations
- ⏳ Dynamic pricing
- ⏳ Loyalty program
- ⏳ Referral system
- ⏳ Multi-language support (Urdu)
- ⏳ Dark mode

---

## 8. ASSUMPTIONS & RISKS

### 8.1 Key Assumptions

**Business Assumptions:**
1. **COD is sufficient** — Users will accept COD-only payment for MVP
2. **Guest checkout acceptable** — Users don't mind entering phone number each time
3. **Manual operations viable** — Admin can manually assign riders initially
4. **Pakistan focus** — App optimized for Pakistan market only (currency PKR, Urdu names acceptable)
5. **Mobile-first is enough** — Desktop experience secondary to mobile
6. **SMS not required** — No SMS verification for MVP
7. **Inventory assumed unlimited** — Stock management basic, no complex inventory
8. **Single warehouse model** — Platform items shipped from one location
9. **Fixed delivery zones** — No complex distance-based pricing initially
10. **Static delivery time** — Estimated time not real-time calculated

**Technical Assumptions:**
1. **PostgreSQL sufficient** — No need for NoSQL at this scale
2. **REST API sufficient** — GraphQL not needed
3. **Next.js can handle scale** — No microservices needed
4. **Cloudinary/S3 for images** — No CDN optimization needed
5. **Vercel/Railway hosting sufficient** — No Kubernetes/Docker Swarm
6. **JWT auth sufficient** — No OAuth/social login
7. **No real-time features** — WebSockets not needed for MVP
8. **Basic SEO sufficient** — Advanced SEO can wait
9. **No AI/ML features** — Manual curation by admin
10. **English UI acceptable** — Urdu localization post-MVP

**Operational Assumptions:**
1. **Manual rider onboarding** — Admin verifies and adds riders
2. **No rider app for iOS initially** — PWA sufficient
3. **Customer support via WhatsApp** — No in-app chat
4. **Admin monitors orders actively** — No automation needed initially
5. **Refunds handled manually** — No automated refund system

---

### 8.2 Technical Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Database performance degrades with scale** | High | Medium | Use indexing, query optimization, consider read replicas |
| **Image upload slow/fails** | Medium | Medium | Use CDN, compress images, show upload progress |
| **PWA not installable on all devices** | Medium | Low | Test on multiple devices, provide fallback web app |
| **API rate limiting needed** | Medium | Medium | Implement rate limiting middleware early |
| **CORS issues in production** | Low | Low | Configure CORS properly in backend |
| **Session management issues** | Medium | Low | Use secure JWT tokens, implement refresh tokens |
| **Mobile browser compatibility** | Medium | Medium | Test on Chrome, Safari, Samsung Internet |
| **Data migration complexity** | High | Low | Plan schema carefully, avoid breaking changes |

---

### 8.3 Business Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Users abandon due to COD only** | High | Medium | Add payment gateway in Phase 2 |
| **Guest checkout causes duplicate orders** | Medium | Medium | Phone number validation, order confirmation flow |
| **Manual rider assignment doesn't scale** | High | High | Plan automation for Phase 2 |
| **Shop partners demand dashboards** | High | Medium | Communicate timeline, provide manual support |
| **COD collection disputes** | Medium | Medium | Clear UI for COD confirmation, tracking |
| **Delivery time expectations unmet** | High | Medium | Set realistic expectations, over-estimate time |
| **Competitors launch similar app** | High | Low | Focus on execution speed, customer service |
| **Regulatory issues (licensing)** | High | Low | Consult legal team, ensure compliance |

---

### 8.4 Security Considerations

**Implemented in MVP:**
1. JWT authentication for admin/rider
2. Password hashing (bcrypt)
3. HTTPS only in production
4. Input validation on all endpoints
5. SQL injection prevention (Prisma ORM)
6. XSS prevention (React auto-escaping)
7. CORS configuration
8. Rate limiting on public endpoints
9. Role-based access control

**Post-MVP Security:**
1. Two-factor authentication for admin
2. Security headers (helmet.js)
3. API key rotation
4. Audit logging
5. Penetration testing
6. GDPR compliance (if expanding to EU)

---

### 8.5 Performance Targets

**Customer App:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- PWA Lighthouse Score: > 90

**Backend API:**
- Response time (p95): < 200ms
- Response time (p99): < 500ms
- Uptime: > 99.5%

**Database:**
- Query time (p95): < 50ms
- Connection pool: 20-50 connections

---

### 8.6 Scalability Considerations

**Current MVP can handle:**
- ~1,000 daily active users
- ~500 orders per day
- ~100 concurrent users
- ~50 riders
- ~10,000 items

**When to scale (triggers):**
- API response time > 500ms consistently
- Database CPU > 70%
- Order volume > 500/day
- Concurrent users > 100

**Scaling strategy:**
- Horizontal scaling of backend (load balancer)
- Database read replicas
- Redis for caching
- CDN for static assets
- Background job queue (Bull/BullMQ)

---

## NEXT STEPS

### Immediate Actions (Week 1)

1. **Approve this plan** — Review and sign off on architecture
2. **Set up infrastructure:**
   - Create GitHub repository
   - Set up PostgreSQL database (Railway/Supabase)
   - Set up Cloudinary account for images
   - Create Vercel account for frontend hosting

3. **Initialize codebase:**
   - Set up monorepo structure
   - Initialize Next.js apps
   - Initialize NestJS backend
   - Configure Prisma with schema

4. **Team alignment:**
   - Assign roles (if team involved)
   - Set up communication channels
   - Schedule daily standups
   - Set up project management (Linear/Jira)

5. **Begin development:**
   - Start with backend API (Phase 2)
   - Run database migrations
   - Build and test core endpoints

---

## APPENDIX

### A. Tech Stack Justification

**Why Next.js?**
- Server-side rendering for SEO
- Built-in API routes
- Excellent PWA support
- Fast development
- Large community

**Why NestJS?**
- TypeScript native
- Modular architecture
- Built-in dependency injection
- Easy to scale
- Similar to Angular (familiar to many devs)

**Why PostgreSQL?**
- Relational data model fits our use case
- ACID compliance
- JSON support (JSONB for flexible fields)
- Battle-tested
- Free tier available

**Why Prisma?**
- Type-safe database client
- Auto-generated types
- Easy migrations
- Great DX
- Active development

**Why Zustand?**
- Lightweight (< 1KB)
- Simple API
- No boilerplate
- Perfect for cart state

**Why not Redux?**
- Overkill for MVP
- Too much boilerplate
- Zustand sufficient for our needs

---

### B. Folder Structure (Complete)

```
xoom-mart/
├── apps/
│   ├── customer/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.js
│   ├── admin/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.js
│   └── rider/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── next.config.js
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── orders/
│   │   ├── shops/
│   │   ├── riders/
│   │   ├── promotions/
│   │   ├── config/
│   │   ├── upload/
│   │   └── common/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── test/
│   ├── package.json
│   └── nest-cli.json
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   └── package.json
│   ├── types/
│   │   ├── src/
│   │   └── package.json
│   └── utils/
│       ├── src/
│       └── package.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── package.json
├── turbo.json (or nx.json)
├── .gitignore
├── .env.example
├── README.md
└── TECHNICAL_PLAN.md (this file)
```

---

### C. Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@host:5432/xoommart
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_NAME=Xoom Mart
NEXT_PUBLIC_CURRENCY=PKR
```

---

### D. Database Indexes (Performance)

```sql
-- Critical indexes for performance
CREATE INDEX idx_items_subcategory ON items(subcategory_id);
CREATE INDEX idx_items_active ON items(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_rider ON orders(rider_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_shop_items_shop ON shop_items(shop_id);
CREATE INDEX idx_shop_items_item ON shop_items(item_id);
```

---

## CONCLUSION

This technical plan provides a complete roadmap for building and launching Xoom Mart MVP. The architecture is designed for:

- **Speed of development** — 10-week timeline
- **Scalability** — Can grow to 10x current targets
- **Flexibility** — Easy to add features post-launch
- **Maintainability** — Clean code, modular structure
- **Cost-effectiveness** — Uses free tiers where possible

**Key Success Factors:**
1. Stick to MVP scope — no scope creep
2. Prioritize customer flow over admin features
3. Test on real mobile devices early
4. Get feedback from real users in Pakistan
5. Launch imperfectly, iterate quickly

**Estimated Costs (Monthly):**
- Database hosting: $10-20 (Railway/Supabase)
- Backend hosting: $0-10 (Railway free tier)
- Frontend hosting: $0 (Vercel free tier)
- Image storage: $0-10 (Cloudinary free tier)
- **Total: $10-40/month for MVP**

**Ready to build!** 🚀

---

**Document Version:** 1.0
**Last Updated:** 2026-01-03
**Next Review:** After Phase 1 completion
