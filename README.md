# Income Agent Platform

AI-powered autonomous agent platform that generates consistent income through automated tasks. Premium dark-themed SaaS with OPay payment integration.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Features

- 🤖 **Autonomous AI Agents** - Income-generating tasks that run 24/7
- 💰 **Real Earnings Tracking** - Dashboard with detailed analytics
- 💳 **OPay Integration** - Secure payment with instant activation
- 📊 **Premium Analytics** - Charts, logs, and performance metrics
- 🎨 **Modern UI** - Dark theme with emerald/cyan accents
- 📱 **Fully Responsive** - Works on desktop and mobile

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + custom dark theme
- **UI Components:** shadcn/ui + Radix UI
- **Animations:** Framer Motion
- **Database:** Prisma + PostgreSQL (Neon)
- **Auth:** NextAuth.js
- **Charts:** Recharts
- **State:** Zustand

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- Neon account (free tier)

### Installation

```bash
# Install dependencies
npm install

# Set up environment (see Environment Variables section below)
# Create .env file with DATABASE_URL from Neon

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database (from Neon)
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # Change to your production URL
```

To generate a secret key, run:
```bash
openssl rand -base64 32
```

## Deployment to Vercel

### Step 1: Prepare Your Code

1. Make sure all changes are committed to git
2. Ensure `postinstall` script is in package.json (already included)

### Step 2: Create Vercel Project

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Framework Preset: **Next.js** (auto-detected)

### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string (get from Neon dashboard) |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel project URL (e.g., `https://your-project.vercel.app`) |

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for build to complete (Vercel will run `prisma generate` via postinstall)
3. Your app is live!

### Step 5: Set Up Admin User (Optional)

To access payment verification:
1. Register a user via the app
2. Go to Neon Console → your database
3. Run SQL to make yourself admin:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Database Schema

```
Users → UserProducts → Products
  ↓
Payments
  ↓
AgentLogs → Earnings
```

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Landing page (premium design)
│   ├── login/            # Authentication
│   ├── register/
│   └── dashboard/        # Protected dashboard
│       ├── products/     # Agent selection
│       ├── payment/      # OPay payment flow
│       ├── monitor/      # Activity tracking
│       ├── admin/        # Admin payment verification
│       └── settings/     # User settings
├── components/           # React components
├── lib/                  # Core utilities
│   ├── db.ts             # Prisma client
│   ├── auth.ts            # NextAuth config
│   ├── agent.ts           # Agent task logic
│   └── utils.ts           # Helper functions
├── stores/               # Zustand state
└── types/                # TypeScript types
```

## Income-Generating Products

| Product | Price | Est. Weekly Earnings |
|---------|-------|---------------------|
| Content Creation | ₦5,000 | Up to ₦15,000 |
| Lead Generation | ₦7,500 | Up to ₦25,000 |
| Social Media Automation | ₦4,000 | Up to ₦10,000 |
| AI Image Generation | ₦6,000 | Up to ₦20,000 |
| Resume Optimization | ₦3,500 | Up to ₦8,000 |
| WhatsApp Business Bot | ₦8,000 | Up to ₦30,000 |

## Payment Flow

1. Browse products on `/dashboard/products`
2. Click "Activate Agent" on desired product
3. Transfer exact amount to OPay (8121161202)
4. Enter transaction reference on payment page
5. Wait for verification (manual for MVP)
6. Agent activates and starts earning

## API Endpoints

- `GET /api/products/active` - User's active products
- `POST /api/payments/create` - Submit payment proof
- `POST /api/auth/register` - User registration
- `GET /api/admin/payments` - Admin view all payments
- `POST /api/admin/payments/[id]/verify` - Verify payment & activate

## Docker

```bash
# Start with Docker
docker-compose up -d
```

## Security

- NextAuth.js authentication
- Passwords hashed with bcrypt
- Zod validation on all inputs
- Protected dashboard routes
- Secure payment handling
- Row Level Security via Prisma

## License

MIT