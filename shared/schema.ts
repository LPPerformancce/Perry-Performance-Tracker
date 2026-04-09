import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("client"),
  avatarInitials: text("avatar_initials"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  goal: text("goal"),
  experienceLevel: text("experience_level"),
  trainingFrequency: text("training_frequency"),
  injuries: text("injuries"),
  equipmentAccess: text("equipment_access"),
  dietaryPreferences: text("dietary_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  target: text("target").notNull(),
  category: text("category").notNull(),
  equipment: text("equipment").notNull(),
  description: text("description").notNull(),
  isCustom: boolean("is_custom").notNull().default(false),
  createdBy: integer("created_by").references(() => users.id),
});

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  daysPerWeek: integer("days_per_week").notNull().default(3),
  durationWeeks: integer("duration_weeks").notNull().default(8),
  coachId: integer("coach_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const programDays = pgTable("program_days", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => programs.id),
  dayName: text("day_name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const programDayExercises = pgTable("program_day_exercises", {
  id: serial("id").primaryKey(),
  programDayId: integer("program_day_id").notNull().references(() => programDays.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  sets: integer("sets").notNull().default(3),
  repsMin: integer("reps_min").notNull().default(8),
  repsMax: integer("reps_max").notNull().default(12),
  rpeTarget: integer("rpe_target").default(7),
  notes: text("notes"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const clientAssignments = pgTable("client_assignments", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => users.id),
  programId: integer("program_id").references(() => programs.id),
  active: boolean("active").notNull().default(true),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  programId: integer("program_id").references(() => programs.id),
  title: text("title").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  durationSeconds: integer("duration_seconds"),
  totalVolume: integer("total_volume").default(0),
  notes: text("notes"),
});

export const workoutSets = pgTable("workout_sets", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => workoutSessions.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  setNumber: integer("set_number").notNull(),
  weight: integer("weight").default(0),
  reps: integer("reps").default(0),
  rpe: integer("rpe"),
  completed: boolean("completed").notNull().default(false),
  exerciseOrder: integer("exercise_order").notNull().default(0),
});

export const nutritionPlans = pgTable("nutrition_plans", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  caloriesTarget: integer("calories_target").notNull().default(2400),
  proteinTarget: integer("protein_target").notNull().default(180),
  carbsTarget: integer("carbs_target").notNull().default(220),
  fatsTarget: integer("fats_target").notNull().default(70),
  guidance: text("guidance"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientNutritionAssignments = pgTable("client_nutrition_assignments", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => users.id),
  nutritionPlanId: integer("nutrition_plan_id").notNull().references(() => nutritionPlans.id),
  active: boolean("active").notNull().default(true),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const checkIns = pgTable("check_ins", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => users.id),
  coachId: integer("coach_id").notNull().references(() => users.id),
  summary: text("summary").notNull(),
  energy: integer("energy").notNull().default(3),
  sleep: integer("sleep").notNull().default(3),
  adherence: integer("adherence").notNull().default(3),
  bodyWeight: text("body_weight"),
  notes: text("notes"),
  coachReply: text("coach_reply"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertProgramSchema = createInsertSchema(programs).omit({ id: true, createdAt: true });
export const insertProgramDaySchema = createInsertSchema(programDays).omit({ id: true });
export const insertProgramDayExerciseSchema = createInsertSchema(programDayExercises).omit({ id: true });
export const insertClientAssignmentSchema = createInsertSchema(clientAssignments).omit({ id: true, assignedAt: true });
export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({ id: true, startedAt: true });
export const insertWorkoutSetSchema = createInsertSchema(workoutSets).omit({ id: true });
export const insertNutritionPlanSchema = createInsertSchema(nutritionPlans).omit({ id: true, createdAt: true });
export const insertClientNutritionAssignmentSchema = createInsertSchema(clientNutritionAssignments).omit({ id: true, assignedAt: true });
export const insertCheckInSchema = createInsertSchema(checkIns).omit({ id: true, coachReply: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;
export type InsertProgramDay = z.infer<typeof insertProgramDaySchema>;
export type ProgramDay = typeof programDays.$inferSelect;
export type InsertProgramDayExercise = z.infer<typeof insertProgramDayExerciseSchema>;
export type ProgramDayExercise = typeof programDayExercises.$inferSelect;
export type InsertClientAssignment = z.infer<typeof insertClientAssignmentSchema>;
export type ClientAssignment = typeof clientAssignments.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSet = z.infer<typeof insertWorkoutSetSchema>;
export type WorkoutSet = typeof workoutSets.$inferSelect;
export type InsertNutritionPlan = z.infer<typeof insertNutritionPlanSchema>;
export type NutritionPlan = typeof nutritionPlans.$inferSelect;
export type InsertClientNutritionAssignment = z.infer<typeof insertClientNutritionAssignmentSchema>;
export type ClientNutritionAssignment = typeof clientNutritionAssignments.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type CheckIn = typeof checkIns.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
