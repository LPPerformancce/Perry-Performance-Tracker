import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema, insertExerciseSchema, insertProgramSchema,
  insertProgramDaySchema, insertProgramDayExerciseSchema,
  insertWorkoutSessionSchema, insertWorkoutSetSchema,
  insertBodyMetricSchema, insertCommunityPostSchema,
  insertClientAssignmentSchema, insertFriendshipSchema
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ── Users ──
  app.get("/api/users", async (_req, res) => {
    const users = await storage.getAllUsers();
    res.json(users.map(u => ({ ...u, password: undefined })));
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ ...user, password: undefined });
  });

  app.post("/api/users", async (req, res) => {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const user = await storage.createUser(parsed.data);
    res.status(201).json({ ...user, password: undefined });
  });

  app.patch("/api/users/:id", async (req, res) => {
    const user = await storage.updateUser(Number(req.params.id), req.body);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ ...user, password: undefined });
  });

  // ── Exercises ──
  app.get("/api/exercises", async (_req, res) => {
    const exercises = await storage.getExercises();
    res.json(exercises);
  });

  app.get("/api/exercises/:id", async (req, res) => {
    const exercise = await storage.getExercise(Number(req.params.id));
    if (!exercise) return res.status(404).json({ message: "Exercise not found" });
    res.json(exercise);
  });

  app.post("/api/exercises", async (req, res) => {
    const parsed = insertExerciseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const exercise = await storage.createExercise(parsed.data);
    res.status(201).json(exercise);
  });

  // ── Programs ──
  app.get("/api/programs", async (_req, res) => {
    const programs = await storage.getPrograms();
    res.json(programs);
  });

  app.get("/api/programs/:id", async (req, res) => {
    const program = await storage.getProgram(Number(req.params.id));
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  });

  app.post("/api/programs", async (req, res) => {
    const parsed = insertProgramSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const program = await storage.createProgram(parsed.data);
    res.status(201).json(program);
  });

  app.patch("/api/programs/:id", async (req, res) => {
    const program = await storage.updateProgram(Number(req.params.id), req.body);
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  });

  app.delete("/api/programs/:id", async (req, res) => {
    await storage.deleteProgram(Number(req.params.id));
    res.status(204).send();
  });

  app.get("/api/programs/coach/:coachId", async (req, res) => {
    const programs = await storage.getProgramsByCoach(Number(req.params.coachId));
    res.json(programs);
  });

  // ── Program Days ──
  app.get("/api/programs/:programId/days", async (req, res) => {
    const days = await storage.getProgramDays(Number(req.params.programId));
    res.json(days);
  });

  app.post("/api/program-days", async (req, res) => {
    const parsed = insertProgramDaySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const day = await storage.createProgramDay(parsed.data);
    res.status(201).json(day);
  });

  app.patch("/api/program-days/:id", async (req, res) => {
    const day = await storage.updateProgramDay(Number(req.params.id), req.body);
    if (!day) return res.status(404).json({ message: "Day not found" });
    res.json(day);
  });

  app.delete("/api/program-days/:id", async (req, res) => {
    await storage.deleteProgramDay(Number(req.params.id));
    res.status(204).send();
  });

  // ── Program Day Exercises ──
  app.get("/api/program-days/:dayId/exercises", async (req, res) => {
    const exercises = await storage.getProgramDayExercises(Number(req.params.dayId));
    res.json(exercises);
  });

  app.post("/api/program-day-exercises", async (req, res) => {
    const parsed = insertProgramDayExerciseSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const exercise = await storage.createProgramDayExercise(parsed.data);
    res.status(201).json(exercise);
  });

  app.delete("/api/program-day-exercises/:id", async (req, res) => {
    await storage.deleteProgramDayExercise(Number(req.params.id));
    res.status(204).send();
  });

  // ── Workout Sessions ──
  app.get("/api/workout-sessions/user/:userId", async (req, res) => {
    const sessions = await storage.getWorkoutSessions(Number(req.params.userId));
    res.json(sessions);
  });

  app.get("/api/workout-sessions/:id", async (req, res) => {
    const session = await storage.getWorkoutSession(Number(req.params.id));
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  });

  app.post("/api/workout-sessions", async (req, res) => {
    const parsed = insertWorkoutSessionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const session = await storage.createWorkoutSession(parsed.data);
    res.status(201).json(session);
  });

  app.patch("/api/workout-sessions/:id", async (req, res) => {
    const session = await storage.updateWorkoutSession(Number(req.params.id), req.body);
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  });

  // ── Workout Sets ──
  app.get("/api/workout-sets/session/:sessionId", async (req, res) => {
    const sets = await storage.getWorkoutSets(Number(req.params.sessionId));
    res.json(sets);
  });

  app.post("/api/workout-sets", async (req, res) => {
    const parsed = insertWorkoutSetSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const set = await storage.createWorkoutSet(parsed.data);
    res.status(201).json(set);
  });

  app.patch("/api/workout-sets/:id", async (req, res) => {
    const set = await storage.updateWorkoutSet(Number(req.params.id), req.body);
    if (!set) return res.status(404).json({ message: "Set not found" });
    res.json(set);
  });

  // ── Body Metrics ──
  app.get("/api/body-metrics/user/:userId", async (req, res) => {
    const metrics = await storage.getBodyMetrics(Number(req.params.userId));
    res.json(metrics);
  });

  app.post("/api/body-metrics", async (req, res) => {
    const parsed = insertBodyMetricSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const metric = await storage.createBodyMetric(parsed.data);
    res.status(201).json(metric);
  });

  // ── Community Posts ──
  app.get("/api/community-posts", async (_req, res) => {
    const posts = await storage.getCommunityPosts();
    res.json(posts);
  });

  app.post("/api/community-posts", async (req, res) => {
    const parsed = insertCommunityPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const post = await storage.createCommunityPost(parsed.data);
    res.status(201).json(post);
  });

  app.patch("/api/community-posts/:id", async (req, res) => {
    const post = await storage.updateCommunityPost(Number(req.params.id), req.body);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  // ── Client Assignments ──
  app.get("/api/client-assignments/coach/:coachId", async (req, res) => {
    const assignments = await storage.getClientAssignments(Number(req.params.coachId));
    res.json(assignments);
  });

  app.post("/api/client-assignments", async (req, res) => {
    const parsed = insertClientAssignmentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const assignment = await storage.createClientAssignment(parsed.data);
    res.status(201).json(assignment);
  });

  app.delete("/api/client-assignments/:id", async (req, res) => {
    await storage.deleteClientAssignment(Number(req.params.id));
    res.status(204).send();
  });

  // ── Friendships ──
  app.get("/api/friendships/user/:userId", async (req, res) => {
    const friends = await storage.getFriendships(Number(req.params.userId));
    res.json(friends);
  });

  app.post("/api/friendships", async (req, res) => {
    const parsed = insertFriendshipSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const friendship = await storage.createFriendship(parsed.data);
    res.status(201).json(friendship);
  });

  app.patch("/api/friendships/:id", async (req, res) => {
    const friendship = await storage.updateFriendship(Number(req.params.id), req.body);
    if (!friendship) return res.status(404).json({ message: "Friendship not found" });
    res.json(friendship);
  });

  return httpServer;
}
