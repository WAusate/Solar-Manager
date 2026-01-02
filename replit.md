# Gestão Solar - Solar Energy Management System

## Overview

This is a solar energy management platform built with a full-stack TypeScript architecture. The system provides dashboards and tools for monitoring solar power generation, managing alerts, and generating reports. It features role-based access control with distinct interfaces for clients (solar plant owners) and administrators.

**Core Purpose:** Enable solar plant monitoring with real-time stats, alert management, and reporting capabilities, differentiated by user roles (admin vs client).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight React router)
- **State Management:** TanStack React Query for server state
- **Styling:** Tailwind CSS with shadcn/ui component library
- **Build Tool:** Vite with custom plugins for Replit integration
- **Charts:** Recharts for data visualization

**Key Design Patterns:**
- Role-based conditional rendering in components (admin vs client menus)
- Protected route wrapper component for authentication
- Custom hooks for data fetching (use-auth, use-alerts, use-reports, use-stats)
- Path aliases configured: `@/` for client/src, `@shared/` for shared code

### Backend Architecture
- **Framework:** Express.js with TypeScript
- **Authentication:** Passport.js with local strategy and session-based auth
- **Session Store:** PostgreSQL-backed sessions via connect-pg-simple
- **API Design:** RESTful endpoints defined in shared/routes.ts with Zod validation

**Key Design Patterns:**
- Shared route definitions between frontend and backend for type safety
- Storage abstraction layer (IStorage interface) for database operations
- Role-based API filtering (admins see all data, clients see only their own)

### Data Storage
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM with drizzle-zod for schema validation
- **Schema Location:** shared/schema.ts (shared between frontend and backend)

**Core Tables:**
- `users` - User accounts with role field (admin/client)
- `alerts` - System alerts linked to users
- `reports` - Generated reports linked to users

### Build & Development
- **Development:** `npm run dev` - runs tsx for hot-reloading
- **Production Build:** `npm run build` - uses custom script that builds both Vite frontend and esbuild backend
- **Database Migrations:** `npm run db:push` - Drizzle Kit push command

## External Dependencies

### Database
- PostgreSQL (required, connection via DATABASE_URL environment variable)
- Drizzle Kit for schema management

### Authentication & Sessions
- Passport.js with passport-local strategy
- express-session with connect-pg-simple for PostgreSQL session storage

### UI Component Library
- shadcn/ui components (Radix UI primitives)
- Configured via components.json with "new-york" style

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation
- `recharts` - Dashboard charts
- `date-fns` - Date formatting
- `wouter` - Client-side routing
- `zod` - Schema validation

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key (defaults to "solar_secret_key" in dev)