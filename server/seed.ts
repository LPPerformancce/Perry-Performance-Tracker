import { db } from "./db";
import { users, exercises, programs, programDays, programDayExercises, clientAssignments, friendships, bodyMetrics, communityPosts, workoutSessions, workoutSets } from "@shared/schema";

const exerciseData = [
  { name: "Barbell Bench Press", target: "Chest", category: "Compound", equipment: "Barbell", mechanic: "Push", description: "Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower it to your mid-chest, and press it back up.", imagePlaceholder: "BB" },
  { name: "Incline Dumbbell Press", target: "Upper Chest", category: "Compound", equipment: "Dumbbell", mechanic: "Push", description: "Set bench to 30-45 degrees, press dumbbells upward from shoulder level until arms are fully extended.", imagePlaceholder: "ID" },
  { name: "Cable Crossover", target: "Chest", category: "Isolation", equipment: "Cable", mechanic: "Push", description: "Stand between two pulleys, bring handles together in front of your chest with a slight bend in your elbows.", imagePlaceholder: "CC" },
  { name: "Push-ups", target: "Chest", category: "Compound", equipment: "Bodyweight", mechanic: "Push", description: "Start in a plank position, lower your body until your chest nearly touches the floor, and push back up.", imagePlaceholder: "PU" },
  { name: "Pec Deck Fly", target: "Chest", category: "Isolation", equipment: "Machine", mechanic: "Push", description: "Sit on the machine, place forearms on pads, and squeeze arms together in front of your chest.", imagePlaceholder: "PD" },
  { name: "Barbell Deadlift", target: "Lower Back", category: "Compound", equipment: "Barbell", mechanic: "Hinge", description: "Stand with mid-foot under the bar, hinge at hips to grip the bar, keep back straight, and stand up by extending hips and knees.", imagePlaceholder: "DL" },
  { name: "Pull-ups", target: "Lats", category: "Compound", equipment: "Bodyweight", mechanic: "Pull", description: "Hang from a bar with palms facing away, pull yourself up until your chin clears the bar, and lower back down.", imagePlaceholder: "PU" },
  { name: "Seated Cable Row", target: "Mid Back", category: "Compound", equipment: "Cable", mechanic: "Pull", description: "Sit at a cable row machine, grasp the handle, pull it towards your abdomen while squeezing shoulder blades together.", imagePlaceholder: "SR" },
  { name: "Dumbbell Row", target: "Lats", category: "Compound", equipment: "Dumbbell", mechanic: "Pull", description: "Support one knee and hand on a bench, pull a dumbbell up to your torso with the other arm, keeping your back flat.", imagePlaceholder: "DR" },
  { name: "Lat Pulldown", target: "Lats", category: "Compound", equipment: "Machine", mechanic: "Pull", description: "Sit at a pulldown machine, grip the wide bar, and pull it down to your upper chest while leaning slightly back.", imagePlaceholder: "LP" },
  { name: "Barbell Back Squat", target: "Quads", category: "Compound", equipment: "Barbell", mechanic: "Squat", description: "Rest barbell on your upper back, squat down until thighs are parallel to the floor, and push back up.", imagePlaceholder: "SQ" },
  { name: "Leg Press", target: "Quads", category: "Compound", equipment: "Machine", mechanic: "Push", description: "Sit in a leg press machine, place feet shoulder-width apart on the sled, and press the weight away by extending your knees.", imagePlaceholder: "LP" },
  { name: "Dumbbell Lunge", target: "Quads", category: "Compound", equipment: "Dumbbell", mechanic: "Lunge", description: "Hold dumbbells at your sides, step forward with one leg, and lower your hips until both knees are bent at a 90-degree angle.", imagePlaceholder: "DL" },
  { name: "Leg Extension", target: "Quads", category: "Isolation", equipment: "Machine", mechanic: "Push", description: "Sit on the machine with legs under the pad, extend your legs fully, and lower back down under control.", imagePlaceholder: "LE" },
  { name: "Goblet Squat", target: "Quads", category: "Compound", equipment: "Dumbbell", mechanic: "Squat", description: "Hold a dumbbell vertically against your chest, squat down keeping your torso upright, and stand back up.", imagePlaceholder: "GS" },
  { name: "Romanian Deadlift", target: "Hamstrings", category: "Compound", equipment: "Barbell", mechanic: "Hinge", description: "Hold a barbell at hip level, hinge forward at the hips while keeping legs relatively straight, then return to standing.", imagePlaceholder: "RD" },
  { name: "Lying Leg Curl", target: "Hamstrings", category: "Isolation", equipment: "Machine", mechanic: "Pull", description: "Lie face down on the machine, curl your legs towards your glutes, and slowly return to the starting position.", imagePlaceholder: "LC" },
  { name: "Glute Bridge", target: "Glutes", category: "Compound", equipment: "Bodyweight", mechanic: "Hinge", description: "Lie on your back with knees bent and feet flat, thrust your hips upward, squeezing glutes at the top.", imagePlaceholder: "GB" },
  { name: "Overhead Press", target: "Shoulders", category: "Compound", equipment: "Barbell", mechanic: "Push", description: "Stand and press a barbell from shoulder level straight overhead until your arms are fully extended.", imagePlaceholder: "OP" },
  { name: "Lateral Raise", target: "Side Delts", category: "Isolation", equipment: "Dumbbell", mechanic: "Push", description: "Stand holding dumbbells at your sides, raise your arms out to the sides until they are parallel with the floor.", imagePlaceholder: "LR" },
  { name: "Face Pull", target: "Rear Delts", category: "Isolation", equipment: "Cable", mechanic: "Pull", description: "Attach a rope to a high pulley, pull the rope towards your face, pulling the handles apart as they get close to you.", imagePlaceholder: "FP" },
  { name: "Barbell Curl", target: "Biceps", category: "Isolation", equipment: "Barbell", mechanic: "Pull", description: "Stand holding a barbell with an underhand grip, curl the bar up towards your chest, and lower it down.", imagePlaceholder: "BC" },
  { name: "Tricep Pushdown", target: "Triceps", category: "Isolation", equipment: "Cable", mechanic: "Push", description: "Attach a rope or straight bar to a high pulley, push it down until arms are fully extended, keeping elbows tucked in.", imagePlaceholder: "TP" },
  { name: "Hammer Curl", target: "Biceps", category: "Isolation", equipment: "Dumbbell", mechanic: "Pull", description: "Stand holding dumbbells with a neutral grip (palms facing each other), curl them up towards your shoulders.", imagePlaceholder: "HC" },
  { name: "Overhead Tricep Extension", target: "Triceps", category: "Isolation", equipment: "Dumbbell", mechanic: "Push", description: "Hold a dumbbell overhead with both hands, lower it behind your head by bending your elbows, then press it back up.", imagePlaceholder: "TE" },
  { name: "Plank", target: "Core", category: "Isolation", equipment: "Bodyweight", mechanic: "Core", description: "Hold a push-up position resting on your forearms, keeping your body in a straight line from head to heels.", imagePlaceholder: "PL" },
  { name: "Cable Crunch", target: "Core", category: "Isolation", equipment: "Cable", mechanic: "Core", description: "Kneel facing a cable machine, hold the rope attachment behind your neck, and crunch your torso downward.", imagePlaceholder: "CC" },
  { name: "Hanging Leg Raise", target: "Lower Abs", category: "Isolation", equipment: "Bodyweight", mechanic: "Core", description: "Hang from a pull-up bar, raise your legs straight out in front of you until they are parallel with the floor.", imagePlaceholder: "HL" },
];

export async function seed() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database...");

  const [coach] = await db.insert(users).values({
    username: "coach_lee",
    password: "coach123",
    displayName: "Coach Lee Perry",
    role: "coach",
    avatarInitials: "LP",
    program: null,
  }).returning();

  const [user1] = await db.insert(users).values({
    username: "james_davis",
    password: "user123",
    displayName: "James Davis",
    role: "user",
    avatarInitials: "JD",
    program: "Foundation Program",
  }).returning();

  const [user2] = await db.insert(users).values({
    username: "sarah_jenkins",
    password: "user123",
    displayName: "Sarah Jenkins",
    role: "user",
    avatarInitials: "SJ",
    program: "Foundation v2",
  }).returning();

  const [user3] = await db.insert(users).values({
    username: "michael_chen",
    password: "user123",
    displayName: "Michael Chen",
    role: "user",
    avatarInitials: "MC",
    program: "Summer Prep '24",
  }).returning();

  const [user4] = await db.insert(users).values({
    username: "emma_watson",
    password: "user123",
    displayName: "Emma Watson",
    role: "user",
    avatarInitials: "EW",
    program: "Hypertrophy PPL",
  }).returning();

  const insertedExercises = await db.insert(exercises).values(
    exerciseData.map(e => ({ ...e, isCustom: false }))
  ).returning();

  const [foundationProgram] = await db.insert(programs).values({
    title: "Foundation for Professionals",
    description: "3 days/week • 8 weeks program designed for desk-based professionals returning to strength training.",
    daysPerWeek: 3,
    durationWeeks: 8,
    coachId: coach.id,
  }).returning();

  const [postureProgram] = await db.insert(programs).values({
    title: "Desk-Worker Posture Fix",
    description: "2 days/week • Mobility focus to correct posture issues from desk work.",
    daysPerWeek: 2,
    durationWeeks: 6,
    coachId: coach.id,
  }).returning();

  const [day1] = await db.insert(programDays).values({
    programId: foundationProgram.id,
    dayName: "Day 1: Full Body A",
    sortOrder: 0,
  }).returning();

  const [day2] = await db.insert(programDays).values({
    programId: foundationProgram.id,
    dayName: "Day 2: Full Body B",
    sortOrder: 1,
  }).returning();

  const [day3] = await db.insert(programDays).values({
    programId: foundationProgram.id,
    dayName: "Day 3: Full Body C",
    sortOrder: 2,
  }).returning();

  const squat = insertedExercises.find(e => e.name === "Barbell Back Squat")!;
  const bench = insertedExercises.find(e => e.name === "Barbell Bench Press")!;
  const row = insertedExercises.find(e => e.name === "Seated Cable Row")!;
  const incline = insertedExercises.find(e => e.name === "Incline Dumbbell Press")!;
  const rdl = insertedExercises.find(e => e.name === "Romanian Deadlift")!;
  const pullup = insertedExercises.find(e => e.name === "Pull-ups")!;
  const ohp = insertedExercises.find(e => e.name === "Overhead Press")!;
  const latRaise = insertedExercises.find(e => e.name === "Lateral Raise")!;
  const curl = insertedExercises.find(e => e.name === "Barbell Curl")!;
  const pushdown = insertedExercises.find(e => e.name === "Tricep Pushdown")!;
  const plank = insertedExercises.find(e => e.name === "Plank")!;
  const legPress = insertedExercises.find(e => e.name === "Leg Press")!;

  await db.insert(programDayExercises).values([
    { programDayId: day1.id, exerciseId: squat.id, sets: 3, repsMin: 8, repsMax: 10, rpeTarget: 7, sortOrder: 0 },
    { programDayId: day1.id, exerciseId: incline.id, sets: 3, repsMin: 8, repsMax: 10, rpeTarget: 8, sortOrder: 1 },
    { programDayId: day1.id, exerciseId: row.id, sets: 3, repsMin: 10, repsMax: 12, rpeTarget: 8, sortOrder: 2 },
    { programDayId: day1.id, exerciseId: latRaise.id, sets: 3, repsMin: 12, repsMax: 15, rpeTarget: 8, sortOrder: 3 },
    { programDayId: day1.id, exerciseId: plank.id, sets: 3, repsMin: 30, repsMax: 60, rpeTarget: 7, sortOrder: 4 },

    { programDayId: day2.id, exerciseId: bench.id, sets: 3, repsMin: 8, repsMax: 10, rpeTarget: 8, sortOrder: 0 },
    { programDayId: day2.id, exerciseId: rdl.id, sets: 3, repsMin: 8, repsMax: 10, rpeTarget: 7, sortOrder: 1 },
    { programDayId: day2.id, exerciseId: pullup.id, sets: 3, repsMin: 6, repsMax: 10, rpeTarget: 8, sortOrder: 2 },
    { programDayId: day2.id, exerciseId: ohp.id, sets: 3, repsMin: 8, repsMax: 10, rpeTarget: 7, sortOrder: 3 },
    { programDayId: day2.id, exerciseId: curl.id, sets: 2, repsMin: 10, repsMax: 12, rpeTarget: 7, sortOrder: 4 },

    { programDayId: day3.id, exerciseId: legPress.id, sets: 3, repsMin: 10, repsMax: 12, rpeTarget: 8, sortOrder: 0 },
    { programDayId: day3.id, exerciseId: incline.id, sets: 3, repsMin: 8, repsMax: 10, rpeTarget: 8, sortOrder: 1 },
    { programDayId: day3.id, exerciseId: row.id, sets: 3, repsMin: 10, repsMax: 12, rpeTarget: 8, sortOrder: 2 },
    { programDayId: day3.id, exerciseId: pushdown.id, sets: 2, repsMin: 10, repsMax: 12, rpeTarget: 8, sortOrder: 3 },
  ]);

  await db.insert(clientAssignments).values([
    { coachId: coach.id, clientId: user1.id, programId: foundationProgram.id },
    { coachId: coach.id, clientId: user2.id, programId: foundationProgram.id },
    { coachId: coach.id, clientId: user3.id, programId: postureProgram.id },
    { coachId: coach.id, clientId: user4.id, programId: postureProgram.id },
  ]);

  await db.insert(friendships).values([
    { userId: user1.id, friendId: user2.id, status: "accepted" },
    { userId: user1.id, friendId: user3.id, status: "accepted" },
    { userId: user1.id, friendId: user4.id, status: "accepted" },
  ]);

  await db.insert(communityPosts).values([
    { userId: user1.id, content: "Finally hit a new PR on my deadlift today! 225lbs for 5 reps. It's been a long road back to training after my desk job wrecked my lower back, but the steady progression is working.", postType: "pr", likes: 12, comments: 4 },
    { userId: coach.id, content: "Great work everyone on the mobility challenge this week! A reminder that recovery is just as important as the stimulus. Make sure you're getting your protein in.", postType: "announcement", likes: 24, comments: 8 },
  ]);

  await db.insert(bodyMetrics).values([
    { userId: user1.id, metricType: "weight", value: "186.6" },
    { userId: user1.id, metricType: "weight", value: "185.4" },
    { userId: user1.id, metricType: "body_fat", value: "19.0" },
    { userId: user1.id, metricType: "body_fat", value: "18.5" },
    { userId: user1.id, metricType: "waist", value: "34.5" },
    { userId: user1.id, metricType: "waist", value: "34.0" },
  ]);

  const [session1] = await db.insert(workoutSessions).values({
    userId: user1.id,
    programId: foundationProgram.id,
    title: "Foundation: Full Body A",
    durationSeconds: 2700,
    totalVolume: 8500,
    feelingRating: 4,
    notes: "Felt strong today",
    completedAt: new Date(Date.now() - 86400000),
  }).returning();

  await db.insert(workoutSets).values([
    { sessionId: session1.id, exerciseId: squat.id, setNumber: 1, weight: 135, reps: 10, rpe: 7, completed: true, exerciseOrder: 0 },
    { sessionId: session1.id, exerciseId: squat.id, setNumber: 2, weight: 135, reps: 10, rpe: 7, completed: true, exerciseOrder: 0 },
    { sessionId: session1.id, exerciseId: squat.id, setNumber: 3, weight: 135, reps: 8, rpe: 8, completed: true, exerciseOrder: 0 },
    { sessionId: session1.id, exerciseId: incline.id, setNumber: 1, weight: 40, reps: 10, rpe: 8, completed: true, exerciseOrder: 1 },
    { sessionId: session1.id, exerciseId: incline.id, setNumber: 2, weight: 40, reps: 10, rpe: 8, completed: true, exerciseOrder: 1 },
    { sessionId: session1.id, exerciseId: incline.id, setNumber: 3, weight: 40, reps: 8, rpe: 9, completed: true, exerciseOrder: 1 },
    { sessionId: session1.id, exerciseId: row.id, setNumber: 1, weight: 100, reps: 12, rpe: 8, completed: true, exerciseOrder: 2 },
    { sessionId: session1.id, exerciseId: row.id, setNumber: 2, weight: 100, reps: 12, rpe: 8, completed: true, exerciseOrder: 2 },
  ]);

  console.log("Database seeded successfully!");
}
