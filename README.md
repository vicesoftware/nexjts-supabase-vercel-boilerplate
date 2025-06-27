# NextJS + Supabase Vercel Boilerplate <!-- omit in toc -->

A production-ready boilerplate featuring **Next.js 15**, **Supabase**, and **feature-based architecture** with real-time health monitoring and activity tracking.

- [🔧 Developer Environment Setup](#-developer-environment-setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone and Install Dependencies](#1-clone-and-install-dependencies)
  - [2. What You Get Automatically](#2-what-you-get-automatically)
  - [3. Setup Local Supabase](#3-setup-local-supabase)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Run Database Migrations](#5-run-database-migrations)
  - [6. Start Development Server](#6-start-development-server)
  - [7. Verify Your Setup (Optional)](#7-verify-your-setup-optional)
  - [🎯 Daily Development Workflow](#-daily-development-workflow)
  - [🚫 Troubleshooting](#-troubleshooting)
- [✨ Features](#-features)
- [🏗️ Project Structure](#️-project-structure)
- [🎯 Features Overview](#-features-overview)
  - [🏥 Health Check (`/features/health-check/`) - Traditional API Pattern](#-health-check-featureshealth-check---traditional-api-pattern)
  - [🎯 Activity Feed (`/features/activities/`) - Direct Supabase Pattern](#-activity-feed-featuresactivities---direct-supabase-pattern)
  - [🎨 Architecture Showcase](#-architecture-showcase)
- [📜 Available Scripts](#-available-scripts)
- [🏛️ Architecture Principles](#️-architecture-principles)
- [📦 Barrel Export Strategy](#-barrel-export-strategy)
  - [What are Barrel Exports?](#what-are-barrel-exports)
  - [Our Barrel Export Standards](#our-barrel-export-standards)
  - [Benefits](#benefits)
  - [Tree Shaking Compatibility](#tree-shaking-compatibility)
  - [Avoiding Circular References](#avoiding-circular-references)
  - [Import Hierarchy](#import-hierarchy)
- [➕ Adding New Features](#-adding-new-features)
- [🐳 Custom Port Configuration](#-custom-port-configuration)
- [🚀 Deploy on Vercel](#-deploy-on-vercel)
- [🛠️ Tech Stack](#️-tech-stack)
- [📚 Learn More](#-learn-more)

## 🔧 Developer Environment Setup

### Prerequisites

- **Node.js 18+** and **pnpm**
- **Docker** (for local Supabase)

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd nextjs-supabase-vercel-boilerplate
pnpm install
```

✨ **That's it!** Pre-commit hooks are automatically installed and configured during `pnpm install`.

### 2. What You Get Automatically

When you run `pnpm install`, the following are automatically set up:

- 🎨 **Pre-commit formatting** - Code is auto-formatted with Prettier on every commit
- 🔍 **Auto-linting** - ESLint fixes issues automatically where possible
- 🚫 **Quality gates** - Commits fail if there are unfixable linting errors
- ⚡ **Fast processing** - Only staged files are processed (super quick!)

### 3. Setup Local Supabase

```bash
# Start local Supabase instance (first time will download Docker images)
pnpm supabase:start

# You'll see output like this - COPY these values:
# API URL: http://127.0.0.1:54341
# anon key: eyJ0eXAiOiJKV1QiLCJhbGciOiJI...
# service_role key: eyJ0eXAiOiJKV1QiLCJhbGciOiJI...
```

### 4. Configure Environment Variables

```bash
# Create your environment file
cp .env.example .env.local

# Add the values from step 3:
cat >> .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54341
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_step_3
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_step_3
EOF
```

### 5. Run Database Migrations

```bash
# Apply database migrations (creates activities table with sample data)
pnpm supabase:migrate

# Alternatively, reset the entire database (if needed)
pnpm supabase:reset
```

### 6. Start Development Server

```bash
# Start Next.js on port 3020 (custom port to avoid conflicts)
pnpm dev

# Open http://localhost:3020 and verify both features work:
# - Health check widget shows "healthy" status
# - Activity feed displays sample activities
# - Add activity form creates new entries in real-time!
```

### 7. Verify Your Setup (Optional)

Everything should work automatically, but you can verify with these commands:

```bash
# Check code quality tools
pnpm validate         # Lint + format check + circular deps
pnpm check-circular   # Should show "✓ No circular dependencies found!"

# Your first commit will automatically trigger formatting and linting
git add -A
git commit -m "Initial setup"  # Watch the magic happen!
```

### 🎯 Daily Development Workflow

```bash
# Start your development environment
pnpm supabase:start   # Start Supabase (if not running)
pnpm dev              # Start Next.js at http://localhost:3020

# Code away!
# Your commits will automatically be formatted and linted ✨

# Optional: Run quality checks manually
pnpm validate         # Check lint + format + circular deps

# End of day cleanup
pnpm supabase:stop    # Stop Supabase to free resources
```

### 🚫 Troubleshooting

**Issue: Pre-commit hook not running**

```bash
# Reinstall hooks (rare but possible)
pnpm prepare
```

**Issue: Supabase won't start**

```bash
# Reset Docker and try again
docker system prune -f
pnpm supabase:start
```

**Issue: ESLint errors during commit**

```bash
# Fix errors manually, then commit
pnpm lint:fix  # Auto-fix what's possible
pnpm lint      # Check remaining errors
```

---

## ✨ Features

- 🏗️ **Feature-based architecture** for scalable code organization
- ⚡ **Next.js 15** with App Router and Turbopack
- 🗄️ **Supabase** for database, auth, and real-time features
- 📊 **Real-time health monitoring** widget with SWR
- 🎯 **Activity tracking** with real-time feeds and direct database operations
- 🔧 **TypeScript** with comprehensive type safety
- 🎨 **Tailwind CSS** for modern styling
- 🚀 **Vercel-ready** deployment configuration

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes (must stay here per Next.js)
│   │   └── health-check/  # Health check endpoint
│   ├── layout.tsx
│   └── page.tsx
├── features/              # Feature-based modules
│   ├── health-check/      # Health monitoring feature
│   │   ├── components/    # Feature-specific components
│   │   ├── types.ts       # Feature-specific types
│   │   └── index.ts       # Barrel exports
│   └── activities/        # Activity tracking feature
│       ├── components/    # Activity feed & form components
│       ├── types.ts       # Activity-related types
│       └── index.ts       # Barrel exports
├── lib/                   # Shared utilities
│   └── database/          # Database clients and utilities
└── components/            # Shared UI components (when needed)
```

## 🎯 Features Overview

This boilerplate demonstrates **two complementary patterns** for building features with Supabase:

### 🏥 Health Check (`/features/health-check/`) - Traditional API Pattern

A real-time health monitoring system that showcases traditional API-based architecture:

- ✅ **Custom API endpoints** with Next.js route handlers
- ✅ **SWR for data fetching** with automatic polling and caching
- ✅ **Server-side logic** for system health checks
- ✅ **Real-time polling** with configurable intervals

**Components:**

- `HealthCheckWidget` - Main UI component with polling controls

**API:**

- `GET /api/health-check` - Returns system health status

**Types:**

- `HealthStatus` - Basic health check response
- `HealthCheckResponse` - Extended response with check details

**Pattern:** Traditional client → API → database flow

---

### 🎯 Activity Feed (`/features/activities/`) - Direct Supabase Pattern

A real-time activity tracking system that demonstrates Supabase's "free CRUD" capabilities:

- ✅ **Direct database operations** - No custom API routes needed
- ✅ **Real-time subscriptions** via WebSocket for instant updates
- ✅ **Client-side CRUD** with immediate UI feedback
- ✅ **Form handling** with optimistic updates

**Components:**

- `ActivityFeed` - Real-time activity list with live subscriptions
- `AddActivityForm` - Create new activities with validation

**Database:**

- `activities` table with RLS policies enabled
- Real-time subscriptions for INSERT/UPDATE/DELETE operations
- 12 domain-focused seed activities (User actions, system events, data changes)

**Types:**

- `Activity` - Main activity record interface
- `ActivityType` - Union type for activity categories
- `CreateActivityRequest` - Activity creation payload

**Pattern:** Client → Supabase directly (bypassing custom APIs)

---

### 🎨 Architecture Showcase

The boilerplate demonstrates both patterns to show when to use each:

**Use Custom APIs (Health Check) when:**

- Complex server-side logic required
- Need to aggregate data from multiple sources
- System monitoring and diagnostics
- Authentication and authorization logic

**Use Direct Supabase (Activities) when:**

- Simple CRUD operations
- Real-time data synchronization needed
- Form submissions and user interactions
- Rapid prototyping and development

**Result:** You get the "20% skill that covers 80% of features" for both AI Agents and developers!

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start Next.js on port 3020
pnpm dev:full         # Start both Supabase + Next.js

# Supabase Management
pnpm supabase:start   # Start local Supabase
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:status  # Check Supabase status
pnpm supabase:migrate # Apply database migrations
pnpm supabase:reset   # Reset database (destructive)

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality & Linting
pnpm lint             # Run ESLint (check only)
pnpm lint:fix         # Run ESLint and fix issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check if code is formatted (CI)
pnpm validate         # Run all checks: lint + format + circular deps
pnpm fix              # Fix all auto-fixable issues: lint + format

# Dependency Analysis
pnpm check-circular   # Check for circular dependencies (madge)
pnpm deps             # Export dependencies as JSON
pnpm prepare          # Setup husky git hooks (automatic on install)
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
