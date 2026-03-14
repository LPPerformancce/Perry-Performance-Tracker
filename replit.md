# Lee Perry Performance

Comprehensive strength training mobile app for desk-based professionals returning to strength training.

## Architecture

- **Frontend**: React + Vite + TypeScript, Tailwind CSS, shadcn/ui, wouter routing, TanStack React Query
- **Backend**: Express.js + TypeScript, Drizzle ORM, PostgreSQL
- **Shared**: Schema definitions in `shared/schema.ts` using Drizzle + drizzle-zod

## Design System

- Black & gold premium aesthetic: `--primary: 45 90% 55%` (gold), `--background: 0 0% 5%` (near-black)
- Dark mode default via ThemeProvider
- Fonts: Plus Jakarta Sans (headings) + Inter (body)
- LP monogram logo: `LPLogo` and `LPLogoMark` components in `client/src/components/ui/LPLogo.tsx`
- All pages use opacity variants (e.g. `bg-primary/5`, `bg-emerald-500/10`) instead of hardcoded light-mode colors

## Database

PostgreSQL with Drizzle ORM. Tables:
- `users` - User accounts with roles (user/coach)
- `exercises` - Exercise library (28 seeded + custom)
- `programs`, `program_days`, `program_day_exercises` - Program builder hierarchy
- `workout_sessions`, `workout_sets` - Workout logging
- `body_metrics` - Weight, body fat, measurements
- `community_posts` - Social feed
- `client_assignments` - Coach-client relationships
- `friendships` - User connections

Push schema: `npm run db:push`

## Key Files

- `shared/schema.ts` - Drizzle schema, insert schemas, types
- `server/db.ts` - Database connection pool
- `server/storage.ts` - IStorage interface + DatabaseStorage implementation
- `server/routes.ts` - REST API endpoints
- `server/seed.ts` - Demo data seeding (runs on startup, idempotent)
- `client/src/lib/userContext.tsx` - Current user context (defaults to James Davis, id=2)
- `client/src/lib/queryClient.ts` - TanStack Query config + apiRequest helper
- `client/src/App.tsx` - Router with all page routes
- `client/src/components/ui/LPLogo.tsx` - LP monogram logo (sizes: xs/sm/md/lg/xl/watermark, variants: gold/white/muted)

## Pages

Home(Dashboard) | Workout | ActiveWorkout | WorkoutSummary | Exercises | Nutrition | MealPlan | Community | Challenges | Bootcamps | Friends | Messages | Progress | Profile | CoachDashboard | Calendar

## ActiveWorkout Features

- Session-only exercise management (add/remove/swap) — programme is never modified
- Superset linking via 3-dot menu (two-step: select first exercise, then link partner)
- Add Set button below each exercise's final set
- Swipe-left gestures to remove sets/exercises (80px threshold)
- Undo toast with 5-second window after any deletion
- Rest timer popup with progress bar, +30s/+60s/skip controls
- Web Audio API beep alarm on rest timer completion
- Exercise "Demo" button next to each exercise name

## Meal Plan

- Full 7-day meal plan page at `/meal-plan` with day selector
- 4 meals per day with detailed items, macros, prep times
- Meal logging checkboxes with daily progress tracking
- Linked from Nutrition page's "Your Meal Plan" card

## Integration Honesty

- Profile and Calendar pages show integrations with honest statuses
- "Demo Mode" badge on integration sections
- External integrations (Apple Health, Google Fit, MyFitnessPal, calendar sync) marked "Not available" with explanation that native app APIs are required

## Users (Seeded)

1. Coach Lee Perry (id=1, role=coach, username=coach_lee)
2. James Davis (id=2, role=user, username=james_davis) - default active user
3. Sarah Jenkins (id=3), Michael Chen (id=4), Emma Watson (id=5) - demo clients

## API Routes

All prefixed `/api/`:
- Users: GET/POST/PATCH
- Exercises: GET/POST
- Programs: GET/POST/PATCH/DELETE, nested days/exercises
- Workout Sessions: GET by user, POST, PATCH
- Workout Sets: GET by session, POST, PATCH
- Body Metrics: GET by user, POST
- Community Posts: GET/POST/PATCH
- Client Assignments: GET by coach, POST, DELETE
- Friendships: GET by user, POST, PATCH
