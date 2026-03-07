export interface Exercise {
  id: string;
  name: string;
  target: string;
  category: "Compound" | "Isolation" | "Mobility" | "Cardio";
  equipment: "Barbell" | "Dumbbell" | "Machine" | "Cable" | "Bodyweight" | "Kettlebell" | "Bands";
  mechanic: "Push" | "Pull" | "Hinge" | "Squat" | "Lunge" | "Carry" | "Core";
  description: string;
  imagePlaceholder: string;
}

export const exercisesDatabase: Exercise[] = [
  // Chest
  { id: "e1", name: "Barbell Bench Press", target: "Chest", category: "Compound", equipment: "Barbell", mechanic: "Push", description: "Lie on a flat bench, grip the barbell slightly wider than shoulder-width, lower it to your mid-chest, and press it back up.", imagePlaceholder: "BB" },
  { id: "e2", name: "Incline Dumbbell Press", target: "Upper Chest", category: "Compound", equipment: "Dumbbell", mechanic: "Push", description: "Set bench to 30-45 degrees, press dumbbells upward from shoulder level until arms are fully extended.", imagePlaceholder: "ID" },
  { id: "e3", name: "Cable Crossover", target: "Chest", category: "Isolation", equipment: "Cable", mechanic: "Push", description: "Stand between two pulleys, bring handles together in front of your chest with a slight bend in your elbows.", imagePlaceholder: "CC" },
  { id: "e4", name: "Push-ups", target: "Chest", category: "Compound", equipment: "Bodyweight", mechanic: "Push", description: "Start in a plank position, lower your body until your chest nearly touches the floor, and push back up.", imagePlaceholder: "PU" },
  { id: "e5", name: "Pec Deck Fly", target: "Chest", category: "Isolation", equipment: "Machine", mechanic: "Push", description: "Sit on the machine, place forearms on pads, and squeeze arms together in front of your chest.", imagePlaceholder: "PD" },
  
  // Back
  { id: "e6", name: "Barbell Deadlift", target: "Lower Back", category: "Compound", equipment: "Barbell", mechanic: "Hinge", description: "Stand with mid-foot under the bar, hinge at hips to grip the bar, keep back straight, and stand up by extending hips and knees.", imagePlaceholder: "DL" },
  { id: "e7", name: "Pull-ups", target: "Lats", category: "Compound", equipment: "Bodyweight", mechanic: "Pull", description: "Hang from a bar with palms facing away, pull yourself up until your chin clears the bar, and lower back down.", imagePlaceholder: "PU" },
  { id: "e8", name: "Seated Cable Row", target: "Mid Back", category: "Compound", equipment: "Cable", mechanic: "Pull", description: "Sit at a cable row machine, grasp the handle, pull it towards your abdomen while squeezing shoulder blades together.", imagePlaceholder: "SR" },
  { id: "e9", name: "Dumbbell Row", target: "Lats", category: "Compound", equipment: "Dumbbell", mechanic: "Pull", description: "Support one knee and hand on a bench, pull a dumbbell up to your torso with the other arm, keeping your back flat.", imagePlaceholder: "DR" },
  { id: "e10", name: "Lat Pulldown", target: "Lats", category: "Compound", equipment: "Machine", mechanic: "Pull", description: "Sit at a pulldown machine, grip the wide bar, and pull it down to your upper chest while leaning slightly back.", imagePlaceholder: "LP" },

  // Legs (Quads)
  { id: "e11", name: "Barbell Back Squat", target: "Quads", category: "Compound", equipment: "Barbell", mechanic: "Squat", description: "Rest barbell on your upper back, squat down until thighs are parallel to the floor, and push back up.", imagePlaceholder: "SQ" },
  { id: "e12", name: "Leg Press", target: "Quads", category: "Compound", equipment: "Machine", mechanic: "Push", description: "Sit in a leg press machine, place feet shoulder-width apart on the sled, and press the weight away by extending your knees.", imagePlaceholder: "LP" },
  { id: "e13", name: "Dumbbell Lunge", target: "Quads", category: "Compound", equipment: "Dumbbell", mechanic: "Lunge", description: "Hold dumbbells at your sides, step forward with one leg, and lower your hips until both knees are bent at a 90-degree angle.", imagePlaceholder: "DL" },
  { id: "e14", name: "Leg Extension", target: "Quads", category: "Isolation", equipment: "Machine", mechanic: "Push", description: "Sit on the machine with legs under the pad, extend your legs fully, and lower back down under control.", imagePlaceholder: "LE" },
  { id: "e15", name: "Goblet Squat", target: "Quads", category: "Compound", equipment: "Dumbbell", mechanic: "Squat", description: "Hold a dumbbell vertically against your chest, squat down keeping your torso upright, and stand back up.", imagePlaceholder: "GS" },

  // Legs (Hamstrings/Glutes)
  { id: "e16", name: "Romanian Deadlift", target: "Hamstrings", category: "Compound", equipment: "Barbell", mechanic: "Hinge", description: "Hold a barbell at hip level, hinge forward at the hips while keeping legs relatively straight, then return to standing.", imagePlaceholder: "RD" },
  { id: "e17", name: "Lying Leg Curl", target: "Hamstrings", category: "Isolation", equipment: "Machine", mechanic: "Pull", description: "Lie face down on the machine, curl your legs towards your glutes, and slowly return to the starting position.", imagePlaceholder: "LC" },
  { id: "e18", name: "Glute Bridge", target: "Glutes", category: "Compound", equipment: "Bodyweight", mechanic: "Hinge", description: "Lie on your back with knees bent and feet flat, thrust your hips upward, squeezing glutes at the top.", imagePlaceholder: "GB" },

  // Shoulders
  { id: "e19", name: "Overhead Press", target: "Shoulders", category: "Compound", equipment: "Barbell", mechanic: "Push", description: "Stand and press a barbell from shoulder level straight overhead until your arms are fully extended.", imagePlaceholder: "OP" },
  { id: "e20", name: "Lateral Raise", target: "Side Delts", category: "Isolation", equipment: "Dumbbell", mechanic: "Push", description: "Stand holding dumbbells at your sides, raise your arms out to the sides until they are parallel with the floor.", imagePlaceholder: "LR" },
  { id: "e21", name: "Face Pull", target: "Rear Delts", category: "Isolation", equipment: "Cable", mechanic: "Pull", description: "Attach a rope to a high pulley, pull the rope towards your face, pulling the handles apart as they get close to you.", imagePlaceholder: "FP" },

  // Arms (Biceps/Triceps)
  { id: "e22", name: "Barbell Curl", target: "Biceps", category: "Isolation", equipment: "Barbell", mechanic: "Pull", description: "Stand holding a barbell with an underhand grip, curl the bar up towards your chest, and lower it down.", imagePlaceholder: "BC" },
  { id: "e23", name: "Tricep Pushdown", target: "Triceps", category: "Isolation", equipment: "Cable", mechanic: "Push", description: "Attach a rope or straight bar to a high pulley, push it down until arms are fully extended, keeping elbows tucked in.", imagePlaceholder: "TP" },
  { id: "e24", name: "Hammer Curl", target: "Biceps", category: "Isolation", equipment: "Dumbbell", mechanic: "Pull", description: "Stand holding dumbbells with a neutral grip (palms facing each other), curl them up towards your shoulders.", imagePlaceholder: "HC" },
  { id: "e25", name: "Overhead Tricep Extension", target: "Triceps", category: "Isolation", equipment: "Dumbbell", mechanic: "Push", description: "Hold a dumbbell overhead with both hands, lower it behind your head by bending your elbows, then press it back up.", imagePlaceholder: "TE" },

  // Core
  { id: "e26", name: "Plank", target: "Core", category: "Isolation", equipment: "Bodyweight", mechanic: "Core", description: "Hold a push-up position resting on your forearms, keeping your body in a straight line from head to heels.", imagePlaceholder: "PL" },
  { id: "e27", name: "Cable Crunch", target: "Core", category: "Isolation", equipment: "Cable", mechanic: "Core", description: "Kneel facing a cable machine, hold the rope attachment behind your neck, and crunch your torso downward.", imagePlaceholder: "CC" },
  { id: "e28", name: "Hanging Leg Raise", target: "Lower Abs", category: "Isolation", equipment: "Bodyweight", mechanic: "Core", description: "Hang from a pull-up bar, raise your legs straight out in front of you until they are parallel with the floor.", imagePlaceholder: "HL" }
];