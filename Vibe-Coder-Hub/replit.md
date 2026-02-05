# Vibe Coder Portfolio

## Overview

This is an indie hacker portfolio application that showcases SaaS projects with live revenue tracking. The app displays projects in a Product Hunt-style card format with integrated Stripe revenue charts. Built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for revenue visualization

The frontend follows a component-based architecture with pages in `client/src/pages/` and reusable components in `client/src/components/`. UI primitives from shadcn/ui are stored in `client/src/components/ui/`.

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints under `/api` prefix
- **Build System**: Vite for frontend, esbuild for server bundling

The server uses a storage abstraction pattern (`IStorage` interface in `server/storage.ts`) for database operations, making it easy to swap implementations.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: 
  - `users` - User accounts with Stripe customer/subscription IDs
  - `projects` - Portfolio projects with Product Hunt URLs, categories, and ordering

Schema is shared between frontend and backend via the `@shared` path alias.

### Build & Development
- **Development**: `npm run dev` runs Vite dev server with HMR
- **Production Build**: `npm run build` bundles client with Vite and server with esbuild
- **Database Migrations**: `npm run db:push` uses Drizzle Kit to push schema changes

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Schema migrations and database management

### Payment Processing
- **Stripe**: Direct API integration for revenue tracking
- **Usage**: Fetches charges and customer data to display revenue charts and stats
- **Configuration**: Manual `STRIPE_SECRET_KEY` secret (Live mode) - set in Replit Secrets
- **Per-Product Revenue**: Each project has a `stripeProductId` field that filters revenue to only that product

### Adding New Products
To add a new product to the portfolio:

1. Edit `server/seed.ts` and add to the `realProjects` array:
```typescript
{
  name: "Product Name",
  tagline: "Short tagline",
  description: "Description",
  productHuntUrl: "https://www.producthunt.com/products/...",
  websiteUrl: "https://yoursite.com",
  stripeProductId: "prod_XXXXXX",  // Your Stripe product ID
  category: "Category",
  featured: true,
  order: 1,  // Display order (0 = first)
}
```
2. Restart the app - new product appears with its own revenue chart

**Current Products:**
- Copy Agency Pro: `prod_TtUZxA8pNmQQRN`

### Third-Party Services
- **Product Hunt**: External links to product launches (no API integration)
- **Google Fonts**: Space Grotesk, Geist Mono, and other typography

## Netlify Deployment

This project is configured for GitHub + Netlify deployment with serverless functions.

### Key Files
- `netlify.toml` - Build configuration and redirects
- `netlify/functions/` - Serverless functions for Stripe API calls
- `DEPLOY.md` - Full deployment instructions

### How It Works
1. Push code to GitHub
2. Netlify builds the static frontend with Vite
3. API calls are redirected to Netlify Functions (serverless)
4. Set `STRIPE_SECRET_KEY` in Netlify environment variables

### Adding Products for Netlify
When deploying to Netlify, update `netlify/functions/projects.ts` and `netlify/functions/stats.ts` with new products (not server/seed.ts which is for Replit only).