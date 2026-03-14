import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("user"),
  avatarInitials: text("avatar_initials"),
  program: text("program"),
  shareActivity: boolean("share_activity").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  target: text("target").notNull(),
  category: text("category").notNull(),
  equipment: text("equipment").notNull(),
  mechanic: text("mechanic").notNull(),
  description: text("description").notNull(),
  imagePlaceholder: text("image_placeholder").notNull().default(""),
  isCustom: boolean("is_custom").notNull().default(false),
  createdBy: integer("created_by").references(() => users.id),
});

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  daysPerWeek: integer("days_per_week"),
  durationWeeks: integer("duration_weeks"),
  coachId: integer("coach_id").references(() => users.id),
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
  sortOrder: integer("sort_order").notNull().default(0),
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
  feelingRating: integer("feeling_rating"),
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

export const bodyMetrics = pgTable("body_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  metricType: text("metric_type").notNull(),
  value: text("value").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  postType: text("post_type").notNull().default("update"),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientAssignments = pgTable("client_assignments", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => users.id),
  clientId: integer("client_id").notNull().references(() => users.id),
  programId: integer("program_id").references(() => programs.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  friendId: integer("friend_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertProgramSchema = createInsertSchema(programs).omit({ id: true, createdAt: true });
export const insertProgramDaySchema = createInsertSchema(programDays).omit({ id: true });
export const insertProgramDayExerciseSchema = createInsertSchema(programDayExercises).omit({ id: true });
export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({ id: true, startedAt: true });
export const insertWorkoutSetSchema = createInsertSchema(workoutSets).omit({ id: true });
export const insertBodyMetricSchema = createInsertSchema(bodyMetrics).omit({ id: true, recordedAt: true });
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, createdAt: true, likes: true, comments: true });
export const insertClientAssignmentSchema = createInsertSchema(clientAssignments).omit({ id: true, assignedAt: true });
export const insertFriendshipSchema = createInsertSchema(friendships).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type ProgramDay = typeof programDays.$inferSelect;
export type InsertProgramDay = z.infer<typeof insertProgramDaySchema>;
export type ProgramDayExercise = typeof programDayExercises.$inferSelect;
export type InsertProgramDayExercise = z.infer<typeof insertProgramDayExerciseSchema>;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
export type WorkoutSet = typeof workoutSets.$inferSelect;
export type InsertWorkoutSet = z.infer<typeof insertWorkoutSetSchema>;
export type BodyMetric = typeof bodyMetrics.$inferSelect;
export type InsertBodyMetric = z.infer<typeof insertBodyMetricSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type ClientAssignment = typeof clientAssignments.$inferSelect;
export type InsertClientAssignment = z.infer<typeof insertClientAssignmentSchema>;
export type Friendship = typeof friendships.$inferSelect;
export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
