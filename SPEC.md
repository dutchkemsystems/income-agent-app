# Income Agent Platform - Detailed Specification

## Architecture Overview

### Design Direction
- **Primary Colors**: Deep indigo (#1e1b4b) + Emerald green (#10b981) for money/trust feel
- **Accent**: Vibrant cyan (#06b6d4) for CTAs
- **Background**: Rich dark mode (#0a0a0f) with subtle gradients
- **Typography**: Inter for body, Space Grotesk for headlines (premium feel)
- **Animations**: Framer Motion for smooth transitions, hover effects

### Folder Structure
```
income-agent-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout
│   │   ├── login/page.tsx           # Login page
│   │   ├── register/page.tsx        # Register page
│   │   ├── dashboard/               # Protected dashboard
│   │   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   │   ├── page.tsx            # Overview/earnings
│   │   │   ├── products/page.tsx   # Product selection
│   │   │   ├── payment/page.tsx    # Payment flow
│   │   │   ├── monitor/page.tsx    # Agent monitoring
│   │   │   └── settings/page.tsx   # Settings
│   │   └── api/                    # API routes
│   ├── components/
│   │   ├── ui/                     # shadcn components
│   │   ├── landing/                # Landing page components
│   │   ├── dashboard/              # Dashboard components
│   │   └── payment/                # Payment components
│   ├── lib/                       # Core utilities
│   ├── stores/                    # Zustand stores
│   └── types/                     # TypeScript types
├── prisma/
│   └── schema.prisma              # Database schema
└── public/                        # Static assets
```

## Database Schema

### Users
- id (UUID, PK)
- email (unique)
- name
- passwordHash
- role (USER, ADMIN)
- balance (Decimal) - earned money
- createdAt
- updatedAt

### Products (Income-Generating Tasks)
- id (UUID, PK)
- name (e.g., "Content Creation", "Lead Generation")
- description
- icon
- price (Decimal) - cost to activate
- earningPotential (Decimal) - estimated weekly earnings
- category
- isActive (Boolean)
- createdAt

### Payments
- id (UUID, PK)
- userId (FK)
- productId (FK)
- amount (Decimal)
- transactionRef (String) - from user
- proofImage (String) - upload path
- status (PENDING, VERIFIED, REJECTED)
- createdAt
- verifiedAt

### AgentLogs
- id (UUID, PK)
- userId (FK)
- productId (FK)
- taskType
- input (JSON)
- output (JSON)
- cost (Decimal)
- revenue (Decimal)
- status (PENDING, RUNNING, SUCCESS, FAILED)
- createdAt

### Earnings
- id (UUID, PK)
- userId (FK)
- amount (Decimal)
- source (String)
- description
- createdAt

## UI Flow

### 1. Landing Page
- Hero: "Let Our AI Agent Earn Money For You While You Relax"
- Subtext: "Deploy autonomous AI agents that generate consistent income. Content creation, lead generation, social automation - your personal money-making machine."
- Live counter showing: "$24,847+ earned by users this month"
- CTA: "Start Earning Now" → /register
- Social proof: Fake testimonials with avatars
- How it works: 3-step visual flow
- Features grid with icons

### 2. Auth Pages
- Clean, centered card design
- Email + password registration
- Terms acceptance checkbox
- Social login placeholders

### 3. Dashboard (Overview)
- Welcome message with user's name
- Stats cards: Total Earnings, Today's Earnings, Active Tasks, Success Rate
- Earnings chart (7-day trend)
- Recent activity feed
- Quick action: "Browse Products" button

### 4. Products Page
- Grid of available income-generating products
- Each card shows:
  - Icon + Name
  - Description
  - Price to activate
  - Estimated weekly earnings
  - "Activate" button
- Filter by category

### 5. Payment Page
- Product summary
- OPay payment details displayed prominently:
  - Bank: OPay
  - Account: 8121161202
  - Name: Oladotun Alabi
- Instruction text
- Transaction reference input
- Proof of payment upload
- Submit button → pending status

### 6. Monitor Page
- Agent status indicator (running/stopped)
- Active task progress
- Logs table with filters
- Performance metrics
- Export functionality

## Key Components to Build

1. **Navbar** - Logo, nav links, login/signup buttons
2. **HeroSection** - Headline, subtext, CTAs, animated background
3. **FeatureCard** - Icon, title, description with hover effects
4. **StatsCounter** - Animated number counter
5. **TestimonialCard** - Avatar, name, quote, rating
6. **ProductCard** - Icon, name, price, earnings estimate, CTA
7. **PaymentForm** - Bank details, reference input, file upload
8. **EarningsChart** - Line/bar chart with Recharts
9. **ActivityFeed** - Timeline of agent activities
10. **Sidebar** - Navigation with icons, user info

## Animations

- Page load: Staggered fade-in from bottom
- Cards: Scale up slightly on hover
- Buttons: Smooth background color transition
- Numbers: Count-up animation for stats
- Charts: Draw-in animation
- Sidebar: Slide in/out on mobile

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px