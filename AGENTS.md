# AGENTS.md

## Project: Income Agent Platform (Next.js 15 + TypeScript)

## Tech Stack
- Next.js 15 (App Router) + React 19
- TypeScript (strict mode)
- Tailwind CSS + custom theme (dark mode with emerald/cyan accents)
- shadcn/ui components
- Framer Motion for animations
- Prisma + PostgreSQL
- NextAuth.js (credentials auth)
- Zustand (client state)
- Recharts (charts)
- Sonner (toasts)

## Developer Commands

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Lint & typecheck:
```bash
npm run lint
npm run typecheck
```

Database:
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to DB
npm run db:studio     # Open Prisma Studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page (premium design)
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── dashboard/          # Protected dashboard
│   │   ├── page.tsx        # Overview/earnings
│   │   ├── products/       # Product selection
│   │   ├── payment/        # OPay payment flow
│   │   ├── monitor/        # Agent monitoring
│   │   └── settings/       # User settings
│   └── api/                # API routes
│       ├── auth/           # NextAuth + register
│       ├── products/       # Product endpoints
│       └── payments/       # Payment endpoints
├── components/             # React components
│   ├── ui/                # shadcn/ui base components
│   └── dashboard/         # Dashboard layout
├── lib/                   # Core utilities
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # NextAuth config
│   ├── agent.ts           # Agent task logic
│   └── utils.ts           # Helper functions + products data
└── types/                 # TypeScript types
```

## Key Endpoints

- `GET /api/products/active` - Get user's active products
- `POST /api/payments/create` - Create payment with transaction ref
- `POST /api/agent/run` - Execute agent task
- `POST /api/agent/stop` - Stop running agent
- `GET /api/agent/run` - Get agent status & logs
- `POST /api/auth/register` - User registration

## Income-Generating Products

1. **Content Creation** - ₦5,000 - AI generates SEO articles
2. **Lead Generation** - ₦7,500 - Scrapes and verifies leads
3. **Social Media Automation** - ₦4,000 - Auto posting & engagement
4. **AI Image Generation** - ₦6,000 - Custom images for clients
5. **Resume Optimization** - ₦3,500 - AI resume rewriting
6. **WhatsApp Business Bot** - ₦8,000 - Automated customer support

## Payment Details

- Bank: OPay
- Account: 8121161202
- Name: Oladotun Alabi
- Users enter transaction reference after payment

## Database Schema

- Users, Products, UserProducts, Payments, AgentLogs, Earnings
- All tables have userId for multi-tenant isolation

## Notes

- Premium dark theme with emerald (#10b981) and cyan (#06b6d4) accents
- Landing page uses Framer Motion for smooth animations
- Products are defined in lib/utils.ts - easy to add more
- Payment flow stores transaction references for manual verification
- Agent runs mock implementations - replace with real LLM API in lib/agent.ts