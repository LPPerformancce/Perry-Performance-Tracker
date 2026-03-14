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

## Pages

Home(Dashboard) | Workout | ActiveWorkout | WorkoutSummary | Exercises | Nutrition | Community | Challenges | Bootcamps | Friends | Messages | Progress | Profile | CoachDashboard | Calendar

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
