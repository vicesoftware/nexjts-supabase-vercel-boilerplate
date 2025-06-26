# NextJS + Supabase Vercel Boilerplate

A production-ready boilerplate featuring **Next.js 15**, **Supabase**, and **feature-based architecture** with real-time health monitoring.

## ✨ Features

- 🏗️ **Feature-based architecture** for scalable code organization
- ⚡ **Next.js 15** with App Router and Turbopack
- 🗄️ **Supabase** for database, auth, and real-time features
- 📊 **Real-time health monitoring** widget with SWR
- 🔧 **TypeScript** with comprehensive type safety
- 🎨 **Tailwind CSS** for modern styling
- 🚀 **Vercel-ready** deployment configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Docker (for local Supabase)

### 1. Clone and Install

```bash
git clone <your-repo>
cd nextjs-supabase-vercel-boilerplate
pnpm install
```

### 2. Setup Supabase Locally

```bash
# Initialize Supabase (first time only)
npx supabase init

# Start local Supabase instance
npx supabase start
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# The .env.local should contain (update with your Supabase output):
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54341
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Start Development

```bash
# Start Next.js on port 3020
pnpm dev

# Or start both Supabase + Next.js together
pnpm dev:full
```

Visit **http://localhost:3020** to see your app with the health check widget!

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes (must stay here per Next.js)
│   │   └── health-check/  # Health check endpoint
│   ├── layout.tsx
│   └── page.tsx
├── features/              # Feature-based modules
│   └── health-check/      # Health monitoring feature
│       ├── components/    # Feature-specific components
│       ├── types.ts       # Feature-specific types
│       └── index.ts       # Barrel exports
├── lib/                   # Shared utilities
│   └── database/          # Database clients and utilities
└── components/            # Shared UI components (when needed)
```

## 🎯 Features Overview

### Health Check (`/features/health-check/`)

A real-time health monitoring system that:

- ✅ Checks database connectivity
- ✅ Provides API endpoint status
- ✅ Offers real-time polling with SWR
- ✅ Shows response times and environment info

**Components:**

- `HealthCheckWidget` - Main UI component with polling controls

**API:**

- `GET /api/health-check` - Returns system health status

**Types:**

- `HealthStatus` - Basic health check response
- `HealthCheckResponse` - Extended response with check details

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start Next.js on port 3020
pnpm dev:full         # Start both Supabase + Next.js

# Supabase Management
pnpm supabase:start   # Start local Supabase
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:status  # Check Supabase status

# Production
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Code Quality
pnpm check-circular   # Check for circular dependencies (madge)
pnpm deps-tree        # Show dependency tree structure
pnpm deps             # Export dependencies as JSON
```

## 🏛️ Architecture Principles

1. **Feature Colocation** - Keep related code together
2. **Barrel Exports** - Clean imports with `index.ts` files
3. **Type Safety** - Comprehensive TypeScript types
4. **Separation of Concerns** - Clear boundaries between features
5. **Real-time First** - Built with live data in mind

## 📦 Barrel Export Strategy

### What are Barrel Exports?

Barrel exports are `index.ts` files that re-export modules from a directory, providing a clean import interface:

```typescript
// ❌ Without barrels (messy imports)
import { HealthCheckWidget } from '@/features/health-check/components/health-check-widget';
import { HealthStatus } from '@/features/health-check/types';

// ✅ With barrels (clean imports)
import { HealthCheckWidget, HealthStatus } from '@/features/health-check';
```

### Our Barrel Export Standards

Every feature follows this **standardized export shape**:

```typescript
// src/features/[feature-name]/index.ts
// 1. Components (default exports become named)
export { FeatureComponent } from './components/feature-component';
export { FeatureWidget } from './components/feature-widget';

// 2. Hooks (if any)
export { useFeature } from './hooks/use-feature';

// 3. Utils/Services (if any)
export { featureService } from './services/feature-service';

// 4. Types (always use 'type' keyword)
export type { FeatureType, FeatureConfig } from './types';

// 5. Constants (if any)
export { FEATURE_CONSTANTS } from './constants';
```

### Benefits

- ✅ **Clean Imports** - Single import path per feature
- ✅ **Encapsulation** - Internal structure can change without affecting imports
- ✅ **Developer Experience** - Easier to discover feature exports
- ✅ **Consistent Interface** - Standardized export pattern across features

### Tree Shaking Compatibility

Our barrel exports are **tree-shake friendly** because:

- 🌳 **Small & Focused** - Max 5-8 exports per feature
- 🌳 **Explicit Exports** - No `export *` wildcards
- 🌳 **Type Separation** - `export type` for types only
- 🌳 **Modern Tooling** - Next.js 15 + Turbopack handles this perfectly

**Proof**: Our production bundle is only **107 kB** First Load JS!

### Avoiding Circular References

We prevent circular dependencies by following these rules and using **madge** for detection:

```typescript
// ✅ GOOD: Features can import from lib
// src/features/health-check/components/widget.tsx
import { supabase } from '@/lib/database';

// ✅ GOOD: Features can import shared components
// src/features/health-check/components/widget.tsx
import { Button } from '@/components/ui/button';

// ❌ BAD: Features importing other features
// src/features/health-check/index.ts
import { UserWidget } from '@/features/user-management'; // DON'T DO THIS

// ✅ SOLUTION: Use shared lib or lift to parent
// src/lib/shared/feature-communication.ts
export const useFeatureBridge = () => {
  /* shared logic */
};
```

**Automated Detection:**

```bash
# Check for circular dependencies (part of CI/CD)
pnpm check-circular

# View dependency structure
pnpm deps-tree

# Current status: ✅ No circular dependencies found!
```

### Import Hierarchy

```
┌─────────────────┐
│   app/pages     │ ← Can import from features, lib, components
├─────────────────┤
│   features/     │ ← Can import from lib, components (NOT other features)
├─────────────────┤
│   lib/          │ ← Can import from other lib modules
├─────────────────┤
│   components/   │ ← Can import from lib (NOT features)
└─────────────────┘
```

## ➕ Adding New Features

1. Create feature folder: `src/features/your-feature/`
2. Add components: `src/features/your-feature/components/`
3. Define types: `src/features/your-feature/types.ts`
4. Create barrel export: `src/features/your-feature/index.ts`
5. Add API routes: `src/app/api/your-feature/`

**Example:**

```typescript
// src/features/your-feature/index.ts
export { YourComponent } from './components/your-component';
export type { YourType } from './types';

// Usage in app
import { YourComponent } from '@/features/your-feature';
```

## 🐳 Custom Port Configuration

This boilerplate runs on custom ports to avoid conflicts:

- **Next.js:** http://localhost:3020
- **Supabase API:** http://127.0.0.1:54341
- **Supabase Studio:** http://127.0.0.1:54343
- **Database:** postgresql://postgres:postgres@127.0.0.1:54342

## 🚀 Deploy on Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Add your production Supabase environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   ```
4. Deploy!

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Data Fetching:** SWR
- **Package Manager:** pnpm
- **Deployment:** Vercel

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SWR Documentation](https://swr.vercel.app)
