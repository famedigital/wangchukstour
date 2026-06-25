# Wangchuk Tour - Agent Memory

## Project Context
- **Client**: Wangchuk Tour (Bhutanese tourism company)
- **Project Location**: `D:\VS STUDIO PROJECT\wangchuk-tour`
- **Tech Stack**: Next.js 16 (App Router), Supabase, Cloudinary, Vercel
- **Design Theme**: Red (#DC2626 - oklch(0.55 0.22 25)) primary with Deep Blue (#1E3A5F - oklch(0.35 0.08 264)) secondary

## Key Requirements
- **Inline editing CMS**: Edit directly on page preview (NOT form-based like HMT)
- **Multi-role auth**: Three roles (Superadmin, Content Editor, Operations Manager)
- **Tour Types**: Fixed Packages + Custom Tours
- **CRM Features**: Bookings Management, Itinerary Builder, Invoice System, Operations

## Critical Differences from HMT
1. **Design**: Red theme (vs HMT's amber/orange)
2. **CMS**: Inline editing (vs HMT's form-based admin panel)
3. **Auth**: Multi-role system (vs HMT's single admin)
4. **Tours**: Focus on Fixed + Custom (vs HMT's broader approach)

## Design System

### Colors
```css
/* Primary - Red */
--primary: oklch(0.55 0.22 25);  /* #DC2626 */

/* Secondary - Deep Blue */
--secondary: oklch(0.35 0.08 264);  /* #1E3A5F */

/* Accent - Gold/Amber */
--accent: oklch(0.65 0.15 65);  /* #D97706 */
```

### Typography
- **Headings**: Plus Jakarta Sans (`--font-jakarta`)
- **Body**: Inter (`--font-inter`)
- **Accents**: Playfair Display (`--font-playfair`)

## Environment Setup
Fill these in when setting up services:

### Supabase
- Project URL:
- Anon Key:
- Service Role Key:

### Cloudinary
- Cloud Name:
- API Key:
- API Secret:

### Initial Admin Users
- Superadmin Email:
- Content Editor Email:
- Operations Manager Email:

---

## Quick Reference for Agents

### When Working on This Project:

1. **Always read AGENT_MEMORY.md first** to understand project context
2. **Check PROJECT_STATUS.md** to see what's been completed
3. **Use the design system colors** defined above
4. **Remember: Inline editing CMS** - this is different from HMT
5. **Multi-role permissions** - not all admins have full access

### File Structure Notes
```
wangchuk-tour/
├── app/
│   ├── (auth)/          # Auth routes (login)
│   ├── (public)/        # Public pages
│   ├── admin/           # Protected admin routes
│   └── api/             # API routes
├── components/
│   ├── admin/           # Admin-specific components
│   ├── cms/             # CMS inline editing components
│   ├── public/          # Public page components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── supabase/        # Supabase clients & types
│   ├── cms/             # CMS utilities
│   └── utils.ts         # General utilities
├── AGENT_MEMORY.md      # This file
└── PROJECT_STATUS.md    # Progress tracking
```

### Important Implementation Notes
- **Do NOT copy HMT's design** - similar architecture, but different visual approach
- **Inline editing means**: Admin clicks on page elements to edit them directly
- **Role-based access**: Check user role before showing admin features
- **Sample itineraries**: Create 3 placeholder itineraries as per plan

### Current Session Status (2024-11-20)
- Phase 0 (Foundation) - COMPLETED
- Phase 4 (Public Pages) - COMPLETED
- All public pages created and functional
- Dev server running on http://localhost:3002
- Next: Phase 1 (Database) or continue with Phase 6 (Admin Panel)

### Completed Components
- Navigation (components/public/Navigation.tsx)
- Footer (components/public/Footer.tsx)
- Homepage (app/page.tsx)
- Tours listing (app/tours/page.tsx) with filters
- Tour detail (app/tours/[slug]/page.tsx)
- About page (app/about/page.tsx)
- Blog listing (app/blog/page.tsx)
- Blog detail (app/blog/[slug]/page.tsx)
- Contact page (app/contact/page.tsx)
- Mock data (lib/mock-data/tours.ts, lib/mock-data/blogs.ts)

### Important Notes for Next Session
- Next.js 16 uses async params in dynamic routes - must use `await params`
- Use `Button asChild` with `Link` components, not `<a>` tags
- Social icons: MessageCircle (Facebook), Camera (Instagram), Video (YouTube)
- Turbopack initial panic is known issue, pages load after first compilation
