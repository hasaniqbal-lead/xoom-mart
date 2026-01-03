# Xoom Mart - Setup Guide

This guide will help you set up and run Xoom Mart locally.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **PostgreSQL** 14+ installed and running
- **npm** 9+ (comes with Node.js)
- **Git** installed

---

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd xoom-mart
```

---

## Step 2: Install Dependencies

Install all workspace dependencies:

```bash
npm install
```

This will install dependencies for:
- Root workspace
- Backend
- All frontend apps (customer, admin, rider)
- Shared packages

---

## Step 3: Set Up Environment Variables

### Backend Environment

Create `backend/.env`:

```bash
cd backend
cp ../.env.example .env
```

Edit `backend/.env` with your values:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/xoommart
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3002,http://localhost:3003
```

### Frontend Environment

Create `.env.local` in each frontend app:

**apps/customer/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_NAME=Xoom Mart
NEXT_PUBLIC_CURRENCY=PKR
```

**apps/admin/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_NAME=Xoom Mart Admin
```

**apps/rider/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_NAME=Xoom Mart Rider
```

---

## Step 4: Set Up PostgreSQL Database

### Option 1: Local PostgreSQL

```bash
# Create database
createdb xoommart

# Or using psql
psql -U postgres
CREATE DATABASE xoommart;
\q
```

### Option 2: Use Docker

```bash
docker run --name xoommart-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=xoommart \
  -p 5432:5432 \
  -d postgres:14
```

### Option 3: Use Cloud Service

- **Railway**: railway.app (free PostgreSQL)
- **Supabase**: supabase.com (free PostgreSQL)
- **Neon**: neon.tech (free serverless PostgreSQL)

Update `DATABASE_URL` in `backend/.env` with your connection string.

---

## Step 5: Run Database Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with initial data
npm run prisma:seed
```

This will:
- Create all database tables
- Create admin user (email: admin@xoommart.com, password: Admin@123)
- Create test rider (phone: +923009876543, password: Rider@123)
- Create sample categories, items, and platform config

---

## Step 6: Start Development Servers

### Option 1: Start All Apps at Once (Recommended)

From root directory:

```bash
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Customer App: http://localhost:3000
- Admin Panel: http://localhost:3002
- Rider App: http://localhost:3003

### Option 2: Start Individually

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Customer App:**
```bash
cd apps/customer
npm run dev
```

**Terminal 3 - Admin Panel:**
```bash
cd apps/admin
npm run dev
```

**Terminal 4 - Rider App:**
```bash
cd apps/rider
npm run dev
```

---

## Step 7: Access Applications

### Customer App
- URL: http://localhost:3000
- No login required (guest checkout)
- Browse items, add to cart, place orders

### Admin Panel
- URL: http://localhost:3002
- Email: `admin@xoommart.com`
- Password: `Admin@123`
- Manage catalog, orders, riders, etc.

### Rider App
- URL: http://localhost:3003
- Phone: `+923009876543`
- Password: `Rider@123`
- View assigned orders, update status

### API Documentation
- URL: http://localhost:3001/api
- Swagger/OpenAPI documentation
- Test all endpoints

---

## Step 8: Database Management

### View Database (Prisma Studio)

```bash
cd backend
npx prisma studio
```

Opens GUI at http://localhost:5555

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

This will:
- Drop database
- Recreate all tables
- Run seed script

---

## Common Issues & Solutions

### Port Already in Use

If port 3000, 3001, 3002, or 3003 is in use:

```bash
# Find process
lsof -ti:3001

# Kill process
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error

1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list

   # Ubuntu/Linux
   sudo systemctl status postgresql
   ```

2. Verify `DATABASE_URL` in `backend/.env`

3. Test connection:
   ```bash
   cd backend
   npx prisma db push
   ```

### Prisma Client Not Generated

```bash
cd backend
npx prisma generate
```

### Module Not Found Errors

```bash
# Clean install
npm run clean
npm install
cd backend && npx prisma generate
```

---

## Development Workflow

### Making Database Changes

1. Edit `backend/prisma/schema.prisma`
2. Create migration:
   ```bash
   cd backend
   npx prisma migrate dev --name your_migration_name
   ```
3. Prisma client auto-regenerates

### Adding New Seed Data

1. Edit `backend/prisma/seed.ts`
2. Run:
   ```bash
   cd backend
   npm run prisma:seed
   ```

### Testing API Endpoints

1. Visit http://localhost:3001/api
2. Use Swagger UI to test endpoints
3. Or use Postman/Insomnia

---

## Building for Production

### Build All Apps

```bash
npm run build
```

### Build Individual Apps

```bash
# Backend
cd backend
npm run build

# Customer App
cd apps/customer
npm run build

# Admin Panel
cd apps/admin
npm run build

# Rider App
cd apps/rider
npm run build
```

---

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment instructions.

---

## Additional Tools

### Format Code

```bash
npm run format
```

### Lint Code

```bash
npm run lint
```

### Run Tests (when implemented)

```bash
npm run test
```

---

## Getting Help

- Check API documentation: http://localhost:3001/api
- Review technical plan: [TECHNICAL_PLAN.md](./TECHNICAL_PLAN.md)
- Check MVP checklist: [MVP_CHECKLIST.md](./MVP_CHECKLIST.md)

---

## Next Steps

1. ✅ Backend is running
2. ✅ Database is seeded
3. ✅ Admin panel accessible
4. → Start building your catalog in Admin Panel
5. → Add categories and items
6. → Create test orders from Customer App
7. → Assign orders to riders in Admin Panel

**Happy coding!** 🚀
