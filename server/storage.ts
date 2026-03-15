import { eq, desc, and } from "drizzle-orm";
import { db } from "./db";
import {
  users, exercises, programs, programDays, programDayExercises,
  workoutSessions, workoutSets, bodyMetrics, communityPosts,
  clientAssignments, friendships, userProfiles, mealLogs,
  type InsertUser, type User,
  type InsertExercise, type Exercise,
  type InsertProgram, type Program,
  type InsertProgramDay, type ProgramDay,
  type InsertProgramDayExercise, type ProgramDayExercise,
  type InsertWorkoutSession, type WorkoutSession,
  type InsertWorkoutSet, type WorkoutSet,
  type InsertBodyMetric, type BodyMetric,
  type InsertCommunityPost, type CommunityPost,
  type InsertClientAssignment, type ClientAssignment,
  type InsertFriendship, type Friendship,
  type InsertUserProfile, type UserProfile,
  type InsertMealLog, type MealLog,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Exercises
  getExercises(): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Programs
  getPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, data: Partial<InsertProgram>): Promise<Program | undefined>;
  deleteProgram(id: number): Promise<void>;
  getProgramsByCoach(coachId: number): Promise<Program[]>;

  // Program Days
  getProgramDays(programId: number): Promise<ProgramDay[]>;
  createProgramDay(day: InsertProgramDay): Promise<ProgramDay>;
  updateProgramDay(id: number, data: Partial<InsertProgramDay>): Promise<ProgramDay | undefined>;
  deleteProgramDay(id: number): Promise<void>;

  // Program Day Exercises
  getProgramDayExercises(dayId: number): Promise<ProgramDayExercise[]>;
  createProgramDayExercise(exercise: InsertProgramDayExercise): Promise<ProgramDayExercise>;
  deleteProgramDayExercise(id: number): Promise<void>;

  // Workout Sessions
  getWorkoutSessions(userId: number): Promise<WorkoutSession[]>;
  getWorkoutSession(id: number): Promise<WorkoutSession | undefined>;
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  updateWorkoutSession(id: number, data: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined>;

  // Workout Sets
  getWorkoutSets(sessionId: number): Promise<WorkoutSet[]>;
  createWorkoutSet(set: InsertWorkoutSet): Promise<WorkoutSet>;
  updateWorkoutSet(id: number, data: Partial<InsertWorkoutSet>): Promise<WorkoutSet | undefined>;

  // Body Metrics
  getBodyMetrics(userId: number): Promise<BodyMetric[]>;
  createBodyMetric(metric: InsertBodyMetric): Promise<BodyMetric>;

  // Community Posts
  getCommunityPosts(): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: number, data: Partial<InsertCommunityPost>): Promise<CommunityPost | undefined>;

  // Client Assignments
  getClientAssignments(coachId: number): Promise<ClientAssignment[]>;
  createClientAssignment(assignment: InsertClientAssignment): Promise<ClientAssignment>;
  deleteClientAssignment(id: number): Promise<void>;

  // Friendships
  getFriendships(userId: number): Promise<Friendship[]>;
  createFriendship(friendship: InsertFriendship): Promise<Friendship>;
  updateFriendship(id: number, data: Partial<InsertFriendship>): Promise<Friendship | undefined>;

  // User Profiles
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;

  // Meal Logs
  getMealLogs(userId: number): Promise<MealLog[]>;
  createMealLog(log: InsertMealLog): Promise<MealLog>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Exercises
  async getExercises(): Promise<Exercise[]> {
    return db.select().from(exercises);
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [created] = await db.insert(exercises).values(exercise).returning();
    return created;
  }

  // Programs
  async getPrograms(): Promise<Program[]> {
    return db.select().from(programs);
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async createProgram(program: InsertProgram): Promise<Program> {
    const [created] = await db.insert(programs).values(program).returning();
    return created;
  }

  async updateProgram(id: number, data: Partial<InsertProgram>): Promise<Program | undefined> {
    const [updated] = await db.update(programs).set(data).where(eq(programs.id, id)).returning();
    return updated;
  }

  async deleteProgram(id: number): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  async getProgramsByCoach(coachId: number): Promise<Program[]> {
    return db.select().from(programs).where(eq(programs.coachId, coachId));
  }

  // Program Days
  async getProgramDays(programId: number): Promise<ProgramDay[]> {
    return db.select().from(programDays).where(eq(programDays.programId, programId));
  }

  async createProgramDay(day: InsertProgramDay): Promise<ProgramDay> {
    const [created] = await db.insert(programDays).values(day).returning();
    return created;
  }

  async updateProgramDay(id: number, data: Partial<InsertProgramDay>): Promise<ProgramDay | undefined> {
    const [updated] = await db.update(programDays).set(data).where(eq(programDays.id, id)).returning();
    return updated;
  }

  async deleteProgramDay(id: number): Promise<void> {
    await db.delete(programDayExercises).where(eq(programDayExercises.programDayId, id));
    await db.delete(programDays).where(eq(programDays.id, id));
  }

  // Program Day Exercises
  async getProgramDayExercises(dayId: number): Promise<ProgramDayExercise[]> {
    return db.select().from(programDayExercises).where(eq(programDayExercises.programDayId, dayId));
  }

  async createProgramDayExercise(exercise: InsertProgramDayExercise): Promise<ProgramDayExercise> {
    const [created] = await db.insert(programDayExercises).values(exercise).returning();
    return created;
  }

  async deleteProgramDayExercise(id: number): Promise<void> {
    await db.delete(programDayExercises).where(eq(programDayExercises.id, id));
  }

  // Workout Sessions
  async getWorkoutSessions(userId: number): Promise<WorkoutSession[]> {
    return db.select().from(workoutSessions).where(eq(workoutSessions.userId, userId)).orderBy(desc(workoutSessions.startedAt));
  }

  async getWorkoutSession(id: number): Promise<WorkoutSession | undefined> {
    const [session] = await db.select().from(workoutSessions).where(eq(workoutSessions.id, id));
    return session;
  }

  async createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession> {
    const [created] = await db.insert(workoutSessions).values(session).returning();
    return created;
  }

  async updateWorkoutSession(id: number, data: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined> {
    const [updated] = await db.update(workoutSessions).set(data).where(eq(workoutSessions.id, id)).returning();
    return updated;
  }

  // Workout Sets
  async getWorkoutSets(sessionId: number): Promise<WorkoutSet[]> {
    return db.select().from(workoutSets).where(eq(workoutSets.sessionId, sessionId));
  }

  async createWorkoutSet(set: InsertWorkoutSet): Promise<WorkoutSet> {
    const [created] = await db.insert(workoutSets).values(set).returning();
    return created;
  }

  async updateWorkoutSet(id: number, data: Partial<InsertWorkoutSet>): Promise<WorkoutSet | undefined> {
    const [updated] = await db.update(workoutSets).set(data).where(eq(workoutSets.id, id)).returning();
    return updated;
  }

  // Body Metrics
  async getBodyMetrics(userId: number): Promise<BodyMetric[]> {
    return db.select().from(bodyMetrics).where(eq(bodyMetrics.userId, userId)).orderBy(desc(bodyMetrics.recordedAt));
  }

  async createBodyMetric(metric: InsertBodyMetric): Promise<BodyMetric> {
    const [created] = await db.insert(bodyMetrics).values(metric).returning();
    return created;
  }

  // Community Posts
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt));
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [created] = await db.insert(communityPosts).values(post).returning();
    return created;
  }

  async updateCommunityPost(id: number, data: Partial<InsertCommunityPost>): Promise<CommunityPost | undefined> {
    const [updated] = await db.update(communityPosts).set(data).where(eq(communityPosts.id, id)).returning();
    return updated;
  }

  // Client Assignments
  async getClientAssignments(coachId: number): Promise<ClientAssignment[]> {
    return db.select().from(clientAssignments).where(eq(clientAssignments.coachId, coachId));
  }

  async createClientAssignment(assignment: InsertClientAssignment): Promise<ClientAssignment> {
    const [created] = await db.insert(clientAssignments).values(assignment).returning();
    return created;
  }

  async deleteClientAssignment(id: number): Promise<void> {
    await db.delete(clientAssignments).where(eq(clientAssignments.id, id));
  }

  // Friendships
  async getFriendships(userId: number): Promise<Friendship[]> {
    return db.select().from(friendships).where(eq(friendships.userId, userId));
  }

  async createFriendship(friendship: InsertFriendship): Promise<Friendship> {
    const [created] = await db.insert(friendships).values(friendship).returning();
    return created;
  }

  async updateFriendship(id: number, data: Partial<InsertFriendship>): Promise<Friendship | undefined> {
    const [updated] = await db.update(friendships).set(data).where(eq(friendships.id, id)).returning();
    return updated;
  }
  // User Profiles
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  async updateUserProfile(userId: number, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updated] = await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId)).returning();
    return updated;
  }

  // Meal Logs
  async getMealLogs(userId: number): Promise<MealLog[]> {
    return db.select().from(mealLogs).where(eq(mealLogs.userId, userId)).orderBy(desc(mealLogs.loggedAt));
  }

  async createMealLog(log: InsertMealLog): Promise<MealLog> {
    const [created] = await db.insert(mealLogs).values(log).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
