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
- `user_profiles` - Onboarding data (goals, experience, injuries, barriers, body metrics, schedule)
- `meal_logs` - Scanned/logged meal entries with macro data

Push schema: `npm run db:push`

## Key Files

- `shared/schema.ts` - Drizzle schema, insert schemas, types
- `server/db.ts` - Database connection pool
- `server/storage.ts` - IStorage interface + DatabaseStorage implementation
- `server/routes.ts` - REST API endpoints
- `server/seed.ts` - Demo data seeding (runs on startup, idempotent)
- `client/src/lib/userContext.tsx` - Current user context (defaults to James Davis, id=2)
- `client/src/lib/queryClient.ts` - TanStack Query config + apiRequest helper
- `client/src/App.tsx` - Router with all page routes + onboarding gate
- `client/src/components/ui/LPLogo.tsx` - LP monogram logo (sizes: xs/sm/md/lg/xl/watermark, variants: gold/white/muted)

## Pages

Dashboard | Workout | ActiveWorkout | WorkoutSummary | Exercises | Nutrition | MealPlan | MealScanner | Community | Challenges | Bootcamps | Friends | Messages | Progress | Profile | CoachDashboard | Calendar | Onboarding | WorkoutHistory

## Onboarding

- 8-step wizard: Welcome, Goals, Experience, Injuries, Barriers, Body Metrics, Schedule, Summary
- Saves to `user_profiles` table via API
- `OnboardingGate` in App.tsx checks `localStorage.getItem("lpp-onboarding-complete")`
- New users see onboarding before accessing any other page

## ActiveWorkout Features

- **Warm-Up Phase**: 7 curated mobility movements with countdown timers (arm circles, leg swings, hip circles, cat-cow, band pull-aparts, bodyweight squats, inchworms). Skip available.
- **Workout Phase**: Full exercise tracking with session-only management
- **Cool-Down Phase**: 6 stretches with timers (quad stretch, hamstring, chest, child's pose, cat-cow, deep breathing). Transitions to feedback.
- **Auto-Adjust Suggestions**: RPE-based weight suggestions after completing a set (RPE ≤ 6: +5 lbs, RPE ≥ 9: -5 lbs, otherwise maintain). Inline "Apply" button.
- Session-only exercise management (add/remove/swap) — programme is never modified
- Superset linking via 3-dot menu (two-step: select first exercise, then link partner)
- Add Set button below each exercise's final set
- Swipe-left gestures to remove sets/exercises (80px threshold)
- Undo toast with 5-second window after any deletion
- Rest timer popup with progress bar, +30s/+60s/skip controls
- Web Audio API beep alarm on rest timer completion
- Exercise "Demo" button next to each exercise name

## Notifications & Reminders (Dashboard)

- Dismissible notification cards: Morning Mobility, Hydration Check, Workout Scheduled
- Coach's Daily Tip: rotating lifestyle/training tips for desk professionals
- Dismissed tips persist in localStorage (`lpp-dismissed-tips`)

## AI Meal Scanner

- Chat-based interface at `/meal-scanner`
- Photo upload with mock AI macro analysis (demo mode)
- Nutrition Q&A chatbot with predefined responses
- "Log This Meal" button saves to `meal_logs` table
- Linked from Nutrition page header button and AI Scanner card

## Workout History

- Session log with date/duration/volume/feeling rating
- Weekly volume trend bar chart (8-week view)
- Time range filters: This Week / This Month / All Time
- Performance insights (rest day patterns, mid-week performance, volume trends)
- Linked from Dashboard "View All" button

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
- User Profiles: GET/POST/PATCH by userId
- Meal Logs: GET by user, POST
