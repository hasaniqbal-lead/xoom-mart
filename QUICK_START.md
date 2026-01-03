# Xoom Mart - Quick Start Guide

**Get Xoom Mart running in 5 minutes!**

---

## Prerequisites

✅ Node.js 18+ installed
✅ PostgreSQL 14+ running
✅ 10 minutes of your time

---

## Step 1: Install Dependencies

```bash
cd xoom-mart
npm install
```

---

## Step 2: Set Up Database

### Option A: Local PostgreSQL

```bash
# Create database
createdb xoommart

# Update backend/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/xoommart
```

### Option B: Free Cloud Database (Recommended)

**Using Railway.app (Free):**

1. Go to https://railway.app
2. Create new project → PostgreSQL
3. Copy connection string
4. Paste into `backend/.env` as `DATABASE_URL`

---

## Step 3: Configure Environment

```bash
# Copy example env
cp .env.example backend/.env

# Edit backend/.env with your values:
DATABASE_URL=your-database-url-here
JWT_SECRET=any-random-secret-key
CLOUDINARY_CLOUD_NAME=demo  # Use 'demo' for testing
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo
```

---

## Step 4: Initialize Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npm run prisma:seed
```

**✅ You now have:**
- Admin user: `admin@xoommart.com` / `Admin@123`
- Rider user: `+923009876543` / `Rider@123`
- Sample categories and items
- Platform configuration

---

## Step 5: Start Backend

```bash
# Still in backend directory
npm run start:dev
```

**✅ Backend running at:** http://localhost:3001
**✅ API Docs at:** http://localhost:3001/api

---

## Step 6: Create Frontend Apps (Temporary Setup)

Since the full Next.js apps require manual setup, here's the fastest way to test the backend:

### Option A: Use API Documentation (Fastest)

1. Open http://localhost:3001/api
2. Test all endpoints directly in Swagger UI
3. No frontend needed!

### Option B: Use Postman

1. Import the API base URL: `http://localhost:3001/api/v1`
2. Test endpoints:
   - GET `/home` - Get home data
   - GET `/categories` - List categories
   - GET `/items` - List items
   - POST `/orders` - Create order

### Option C: Build Full Frontend (30 min)

Follow the detailed instructions in [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md) to create the complete Next.js apps.

---

## Testing the System

### 1. View Database

```bash
cd backend
npx prisma studio
```

Opens GUI at http://localhost:5555

### 2. Test Creating an Order

Using Swagger UI (http://localhost:3001/api):

1. Go to "Orders" section
2. Click "POST /orders"
3. Try it out with this JSON:

```json
{
  "customerPhone": "+923001234567",
  "customerName": "Test Customer",
  "deliveryAddress": "123 Test Street, Islamabad",
  "items": [
    {
      "itemId": "get-from-items-endpoint",
      "quantity": 2
    }
  ]
}
```

### 3. Admin Login Test

1. POST `/auth/admin/login`
2. Body:
```json
{
  "email": "admin@xoommart.com",
  "password": "Admin@123"
}
```
3. Copy the `accessToken` from response
4. Click "Authorize" at top of Swagger UI
5. Paste token
6. Now you can test admin endpoints!

---

## Common Issues

### "Port 3001 already in use"

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### "Cannot connect to database"

1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `backend/.env`
3. Try: `psql $DATABASE_URL`

### "Prisma Client not generated"

```bash
cd backend
npx prisma generate
```

---

## What's Working Right Now

✅ Complete backend API with 60+ endpoints
✅ PostgreSQL database with sample data
✅ JWT authentication
✅ Admin & Rider roles
✅ Order management system
✅ Catalog management
✅ Swagger documentation

---

## Next Steps

### For Backend Development:
1. Explore API at http://localhost:3001/api
2. Test all endpoints
3. View database with Prisma Studio
4. Add more sample data via seed script

### For Frontend Development:
1. Read [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md)
2. Create Next.js apps for customer, admin, rider
3. Implement pages and components
4. Connect to backend API

### For Production:
1. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full details
2. Deploy backend to Railway/Render
3. Deploy frontends to Vercel
4. Set up production database

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│       FRONTEND (To Be Built)        │
│  Customer App | Admin | Rider App   │
│     (Next.js PWAs)                  │
└─────────────┬───────────────────────┘
              │ HTTP/REST API
              ▼
┌─────────────────────────────────────┐
│       BACKEND ✅ READY              │
│         (NestJS)                    │
│  ┌──────────────────────────────┐   │
│  │ Auth  │ Catalog │ Orders     │   │
│  │ Shops │ Riders  │ Promotions │   │
│  │ Config│ Upload  │ Home       │   │
│  └──────────────────────────────┘   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│     DATABASE ✅ READY               │
│        (PostgreSQL)                 │
│     12 tables with sample data      │
└─────────────────────────────────────┘
```

---

## Resources

- **Technical Plan:** [TECHNICAL_PLAN.md](./TECHNICAL_PLAN.md)
- **Full Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Frontend Guide:** [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md)
- **MVP Checklist:** [MVP_CHECKLIST.md](./MVP_CHECKLIST.md)

---

## Support

**Backend is fully functional and ready to use!**

The frontend apps need to be created using the guides provided. The backend API is production-ready and can be tested immediately.

**Happy building!** 🚀
