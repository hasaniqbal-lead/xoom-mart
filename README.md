# 🛒 Xoom Mart — Hyperlocal Commerce Platform

**A mobile-first PWA for hyperlocal delivery in Pakistan**

Xoom Mart is a production-ready platform for local commerce and delivery, optimized for Cash on Delivery (COD), guest checkout, and mobile-first usage.

---

## 📋 Project Overview

Xoom Mart enables:
- **Customers** to browse and order items from nearby shops
- **Admins** to manage catalog, orders, and operations
- **Riders** to deliver orders and collect COD

### Key Features
- Mobile-first Progressive Web App (PWA)
- Guest checkout (no forced signup)
- Cash on Delivery only (MVP)
- Admin-controlled catalog and promotions
- Real-time order tracking
- Dynamic home page sections
- Platform + Marketplace model

---

## 🏗️ Architecture

### Monorepo Structure
```
xoom-mart/
├── apps/
│   ├── customer/          # Customer-facing PWA (Next.js)
│   ├── admin/             # Admin panel (Next.js)
│   └── rider/             # Rider app (Next.js)
├── backend/               # API server (NestJS)
├── packages/
│   ├── ui/                # Shared components
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Shared utilities
└── docs/                  # Documentation
```

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Zustand (state management)
- React Query (data fetching)
- PWA support

**Backend:**
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- REST APIs

**Infrastructure:**
- Vercel (Frontend)
- Railway/Render (Backend)
- PostgreSQL (Database)
- Cloudinary (Images)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd xoom-mart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   **Backend (.env):**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/xoommart
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000,http://localhost:3002
   ```

   **Frontend (.env.local):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   NEXT_PUBLIC_SITE_NAME=Xoom Mart
   NEXT_PUBLIC_CURRENCY=PKR
   ```

4. **Set up database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed  # Seed initial data
   ```

5. **Start development servers**

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

### Access Applications

- Customer App: http://localhost:3000
- Admin Panel: http://localhost:3002
- Rider App: http://localhost:3003
- API: http://localhost:3001
- API Docs: http://localhost:3001/api

### Default Admin Credentials
```
Email: admin@xoommart.com
Password: Admin@123
```

---

## 📖 Documentation

- [Technical Plan](./TECHNICAL_PLAN.md) — Complete architecture and implementation guide
- [MVP Checklist](./MVP_CHECKLIST.md) — Task-by-task implementation tracker
- [API Documentation](http://localhost:3001/api) — Swagger docs (when backend running)

---

## 🎯 MVP Scope

### Customer App
- Browse items by category
- Search products
- View shop listings
- Add to cart
- Guest checkout (COD only)
- Order tracking
- Submit feedback

### Admin Panel
- Catalog management (categories, items)
- Shop management
- Order management
- Rider assignment
- Promotions and banners
- Platform configuration
- Home section control

### Rider App
- Login
- View assigned orders
- Update order status
- Mark COD collected

---

## 🛠️ Development

### Project Structure

**Customer App (`apps/customer/`):**
```
src/
├── app/                   # Next.js pages
├── components/            # React components
├── store/                 # Zustand stores
├── lib/                   # Utilities
└── styles/                # Global styles
```

**Backend (`backend/`):**
```
src/
├── auth/                  # Authentication
├── catalog/               # Categories, items
├── orders/                # Order management
├── shops/                 # Shop management
├── riders/                # Rider management
├── promotions/            # Promotions & banners
├── config/                # Platform config
└── common/                # Shared utilities
```

### Commands

**Backend:**
```bash
npm run start:dev          # Development
npm run build              # Production build
npm run start:prod         # Production server
npm run test               # Run tests
npx prisma studio          # Database GUI
npx prisma migrate dev     # Create migration
```

**Frontend Apps:**
```bash
npm run dev                # Development
npm run build              # Production build
npm run start              # Production server
npm run lint               # Lint code
```

### Database Management

**Create migration:**
```bash
cd backend
npx prisma migrate dev --name migration_name
```

**Reset database:**
```bash
npx prisma migrate reset
```

**View database:**
```bash
npx prisma studio
```

---

## 📱 PWA Installation

### Android
1. Open customer app in Chrome
2. Tap menu (⋮) → "Install app" or "Add to Home screen"
3. App installs like native app

### iOS
1. Open customer app in Safari
2. Tap share button
3. Select "Add to Home Screen"
4. Confirm installation

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd apps/customer
npm run test

# E2E tests
npm run test:e2e
```

### Manual Testing Checklist
See [MVP_CHECKLIST.md](./MVP_CHECKLIST.md) Phase 6

---

## 🚢 Deployment

### Backend (Railway/Render)
1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy from `main` branch
5. Run migrations: `npx prisma migrate deploy`

### Frontend (Vercel)
1. Import GitHub repository
2. Select app directory (`apps/customer`, `apps/admin`, `apps/rider`)
3. Set environment variables
4. Deploy

### Database (Supabase/Railway)
1. Create PostgreSQL instance
2. Copy connection string
3. Update `DATABASE_URL` in backend env
4. Run migrations

---

## 📊 MVP Timeline

- **Week 1:** Project setup & infrastructure
- **Week 2-3:** Backend API development
- **Week 4-5:** Customer app development
- **Week 6-7:** Admin panel development
- **Week 8:** Rider app development
- **Week 9:** Testing & QA
- **Week 10:** Deployment & launch

**Total: 10 weeks to launch**

---

## 🔐 Security

- JWT authentication for admin/rider
- Password hashing (bcrypt)
- HTTPS only in production
- Input validation on all endpoints
- SQL injection prevention (Prisma)
- XSS prevention (React)
- CORS configuration
- Rate limiting

---

## 🎨 Design System

### Colors (Tailwind)
```css
primary: #10B981    /* Green */
secondary: #6366F1  /* Indigo */
accent: #F59E0B     /* Amber */
danger: #EF4444     /* Red */
```

### Typography
- Font: Inter (default Next.js font)
- Sizes: text-sm, text-base, text-lg, text-xl, text-2xl

### Mobile Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Reset database
npx prisma migrate reset

# Regenerate Prisma client
npx prisma generate
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### PWA Not Installing
1. Ensure HTTPS in production
2. Check manifest.json is valid
3. Check service worker is registered
4. Clear browser cache

---

## 📝 Contributing

### Branch Strategy
- `main` — Production-ready code
- `develop` — Development branch
- `feature/*` — Feature branches
- `fix/*` — Bug fixes

### Commit Convention
```
feat: add user authentication
fix: resolve cart calculation bug
docs: update README
style: format code
refactor: restructure catalog module
test: add order tests
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes
3. Write/update tests
4. Create PR to `develop`
5. Request review
6. Merge after approval

---

## 🔮 Roadmap

### Phase 1 (MVP) — Current
- Core ordering flow
- Admin control panel
- COD only
- Manual rider assignment

### Phase 2 (Post-MVP)
- User authentication
- Online payments (JazzCash, EasyPaisa)
- Push notifications
- GPS tracking
- Vendor dashboard
- Order history

### Phase 3 (Scale)
- AI recommendations
- Loyalty program
- Multi-language (Urdu)
- Advanced analytics
- Mobile apps (React Native)

---

## 📞 Support

For issues or questions:
- Create GitHub issue
- Email: support@xoommart.com
- WhatsApp: [Business number]

---

## 📄 License

[Your license here]

---

## 👥 Team

**Product:** [Name]
**Engineering:** [Name]
**Design:** [Name]
**Operations:** [Name]

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [NestJS](https://nestjs.com)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)

---

**Last Updated:** 2026-01-03
**Version:** 1.0.0 (MVP)
