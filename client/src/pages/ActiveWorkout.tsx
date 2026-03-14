import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, Timer, X, MoreHorizontal, Info, GripVertical, Plus, Play, History, Droplet, Moon, Apple, Link2, Unlink, Trash2, ArrowUpDown, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/lib/userContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Exercise, WorkoutSession } from "@shared/schema";
import { LPLogoMark } from "@/components/ui/LPLogo";

interface WorkoutExercise {
  id: number;
  exerciseId: number;
  name: string;
  target: string;
  notes: string;
  supersetWith: number | null;
  sets: { reps: string; weight: string; rpe: string; previousWeight: string }[];
}

interface UndoAction {
  type: "remove-exercise" | "remove-set";
  data: any;
  exIndex?: number;
  timeout: ReturnType<typeof setTimeout>;
}

export default function ActiveWorkout() {
  const [, setLocation] = useLocation();
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [activeSet, setActiveSet] = useState<{ exercise: number, set: number }>({ exercise: 0, set: 0 });
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showVideoDemo, setShowVideoDemo] = useState<Exercise | null>(null);
  const [replacingExerciseIndex, setReplacingExerciseIndex] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [showRestPopup, setShowRestPopup] = useState(false);
  const defaultRestSeconds = 90;
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(4);
  const sessionIdRef = useRef<number | null>(null);
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);
  const [supersetLinking, setSupersetLinking] = useState<number | null>(null);
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const swipeRef = useRef<{ startX: number; startY: number; element: HTMLElement | null }>({ startX: 0, startY: 0, element: null });

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  useEffect(() => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgip2teleAPCNNbYqbqJVzVDY6WH2OnJ6UfGVRRkxjd4ePl5OJe3JrZGNna3N8g4iLi4mGgX16eHh5e36BhIaIiIiGhIJ/fXt6ent9f4KEhoiIiIaEgn99e3p6e32AgoSGiIiIhoSCf317enp7fYCChIaIiIiGhIJ/fXt6ent9gIKEhoiIiIaEgn99e3p6e32AgoSGiIiIhoSCf317enp7fYCChIaIiIiGhIJ/fXt6ent9gIKEhg==");
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      if (restTimer !== null && restTimer > 0) {
        setRestTimer(prev => prev! - 1);
      } else if (restTimer === 0) {
        setRestTimer(null);
        setShowRestPopup(false);
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        toast.success("Rest complete!", { description: "Time for your next set." });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [restTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const suggestWeight = (baseWeight: string) => {
    const num = parseInt(baseWeight);
    if (isNaN(num)) return baseWeight;
    return (num + 5).toString();
  };

  const [workoutData, setWorkoutData] = useState<{ title: string; exercises: WorkoutExercise[] }>({
    title: "Foundation: Full Body",
    exercises: [
      {
        id: 1, exerciseId: 11, name: "Barbell Back Squat", target: "Quads",
        notes: "Focus on depth and driving through the mid-foot.", supersetWith: null,
        sets: [
          { reps: "8-10", weight: suggestWeight("135"), rpe: "7", previousWeight: "135" },
          { reps: "8-10", weight: suggestWeight("135"), rpe: "7", previousWeight: "135" },
          { reps: "8-10", weight: suggestWeight("135"), rpe: "8", previousWeight: "135" },
        ]
      },
      {
        id: 2, exerciseId: 2, name: "Incline Dumbbell Press", target: "Chest, Shoulders",
        notes: "Control the eccentric (lowering) phase.", supersetWith: null,
        sets: [
          { reps: "8-10", weight: suggestWeight("40"), rpe: "8", previousWeight: "40" },
          { reps: "8-10", weight: suggestWeight("40"), rpe: "8", previousWeight: "40" },
          { reps: "8-10", weight: suggestWeight("40"), rpe: "9", previousWeight: "40" },
        ]
      },
      {
        id: 3, exerciseId: 8, name: "Seated Cable Row", target: "Back, Biceps",
        notes: "Squeeze shoulder blades together.", supersetWith: null,
        sets: [
          { reps: "12", weight: suggestWeight("100"), rpe: "8", previousWeight: "100" },
          { reps: "12", weight: suggestWeight("100"), rpe: "8", previousWeight: "100" },
        ]
      }
    ]
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/workout-sessions", {
        userId: currentUser?.id,
        title: workoutData.title,
      });
      return res.json() as Promise<WorkoutSession>;
    },
    onSuccess: (session) => {
      sessionIdRef.current = session.id;
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      if (!sessionIdRef.current) return;
      const totalVolume = workoutData.exercises.reduce((acc, ex) => {
        return acc + ex.sets.reduce((setAcc, set) => {
          const w = parseInt(set.weight) || 0;
          const r = parseInt(set.reps) || 0;
          return setAcc + (w * r);
        }, 0);
      }, 0);

      const res = await apiRequest("PATCH", `/api/workout-sessions/${sessionIdRef.current}`, {
        completedAt: new Date().toISOString(),
        durationSeconds: timeElapsed,
        totalVolume,
        feelingRating: feedbackRating,
        notes: feedbackNotes,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-sessions"] });
      toast.success("Workout Complete!", { description: "Great job logging your session." });
      setLocation(`/workout/summary/${sessionIdRef.current}`);
    },
  });

  useEffect(() => {
    if (currentUser && !sessionIdRef.current) {
      createSessionMutation.mutate();
    }
  }, [currentUser]);

  const updateSetValue = (exIndex: number, setIndex: number, field: string, value: string) => {
    const newExercises = [...workoutData.exercises];
    (newExercises[exIndex].sets[setIndex] as any)[field] = value;
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const toggleSet = (exIndex: number, setIndex: number) => {
    const key = `${exIndex}-${setIndex}`;
    const willBeCompleted = !completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: willBeCompleted }));
    if (willBeCompleted) {
      setRestTimer(defaultRestSeconds);
      setShowRestPopup(true);
    }

    if (willBeCompleted && sessionIdRef.current) {
      const exercise = workoutData.exercises[exIndex];
      const set = exercise.sets[setIndex];
      apiRequest("POST", "/api/workout-sets", {
        sessionId: sessionIdRef.current,
        exerciseId: exercise.exerciseId,
        setNumber: setIndex + 1,
        weight: parseInt(set.weight) || 0,
        reps: parseInt(set.reps) || 0,
        rpe: parseInt(set.rpe) || null,
        completed: true,
        exerciseOrder: exIndex,
      }).catch(() => {});
    }
  };

  const finishWorkout = () => {
    const totalSets = workoutData.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSetsCount = Object.values(completedSets).filter(Boolean).length;
    if (completedSetsCount < totalSets) {
      if (!window.confirm(`You still have ${totalSets - completedSetsCount} sets remaining. Are you sure you want to finish the session?`)) return;
    }
    setShowFeedback(true);
  };

  const completeWorkoutWithFeedback = () => {
    completeSessionMutation.mutate();
  };

  const addExerciseToSession = (newExercise: Exercise) => {
    const newExData: WorkoutExercise = {
      id: Date.now(), exerciseId: newExercise.id, name: newExercise.name, target: newExercise.target,
      notes: newExercise.description, supersetWith: null,
      sets: [
        { reps: "10", weight: "0", rpe: "7", previousWeight: "0" },
        { reps: "10", weight: "0", rpe: "7", previousWeight: "0" },
        { reps: "10", weight: "0", rpe: "8", previousWeight: "0" },
      ]
    };
    setWorkoutData({ ...workoutData, exercises: [...workoutData.exercises, newExData] });
    setShowExerciseLibrary(false);
    setExerciseSearchTerm("");
    toast.success(`${newExercise.name} added`, { description: "Session-only change. Your programme is unchanged." });
  };

  const swapExercise = (newExercise: Exercise) => {
    if (replacingExerciseIndex === null) {
      addExerciseToSession(newExercise);
      return;
    }
    const newExercises = [...workoutData.exercises];
    newExercises[replacingExerciseIndex] = {
      ...newExercises[replacingExerciseIndex],
      exerciseId: newExercise.id, name: newExercise.name, target: newExercise.target, notes: newExercise.description
    };
    setWorkoutData({ ...workoutData, exercises: newExercises });
    toast.success("Exercise swapped", { description: "Session-only change. Your programme is unchanged." });
    setShowExerciseLibrary(false);
    setReplacingExerciseIndex(null);
    setExerciseSearchTerm("");
  };

  const removeExercise = (exIndex: number) => {
    const removed = workoutData.exercises[exIndex];
    const newExercises = workoutData.exercises.filter((_, i) => i !== exIndex);
    setWorkoutData({ ...workoutData, exercises: newExercises });

    if (undoAction?.timeout) clearTimeout(undoAction.timeout);
    const timeout = setTimeout(() => setUndoAction(null), 5000);
    setUndoAction({
      type: "remove-exercise",
      data: removed,
      exIndex,
      timeout,
    });
    toast(`${removed.name} removed`, {
      description: "Session-only. Programme unchanged.",
      action: {
        label: "Undo",
        onClick: () => {
          const restored = [...newExercises];
          restored.splice(exIndex, 0, removed);
          setWorkoutData(prev => ({ ...prev, exercises: restored }));
          setUndoAction(null);
        }
      }
    });
  };

  const removeSet = (exIndex: number, setIndex: number) => {
    const exercise = workoutData.exercises[exIndex];
    if (exercise.sets.length <= 1) {
      toast.error("Cannot remove the last set");
      return;
    }
    const removedSet = exercise.sets[setIndex];
    const newExercises = [...workoutData.exercises];
    newExercises[exIndex] = {
      ...newExercises[exIndex],
      sets: exercise.sets.filter((_, i) => i !== setIndex)
    };
    setWorkoutData({ ...workoutData, exercises: newExercises });

    if (undoAction?.timeout) clearTimeout(undoAction.timeout);
    const timeout = setTimeout(() => setUndoAction(null), 5000);
    setUndoAction({
      type: "remove-set",
      data: removedSet,
      exIndex,
      timeout,
    });
    toast("Set removed", {
      action: {
        label: "Undo",
        onClick: () => {
          const restored = [...workoutData.exercises];
          restored[exIndex] = {
            ...restored[exIndex],
            sets: [...restored[exIndex].sets.slice(0, setIndex), removedSet, ...restored[exIndex].sets.slice(setIndex)]
          };
          setWorkoutData(prev => ({ ...prev, exercises: restored }));
          setUndoAction(null);
        }
      }
    });
  };

  const addSet = (exIndex: number) => {
    const newExercises = [...workoutData.exercises];
    const lastSet = newExercises[exIndex].sets[newExercises[exIndex].sets.length - 1];
    newExercises[exIndex].sets.push({ ...lastSet });
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const toggleSuperset = (exIndex: number) => {
    if (supersetLinking !== null) {
      if (supersetLinking === exIndex) {
        setSupersetLinking(null);
        return;
      }
      const newExercises = [...workoutData.exercises];
      newExercises[supersetLinking] = { ...newExercises[supersetLinking], supersetWith: newExercises[exIndex].id };
      newExercises[exIndex] = { ...newExercises[exIndex], supersetWith: newExercises[supersetLinking].id };
      setWorkoutData({ ...workoutData, exercises: newExercises });
      setSupersetLinking(null);
      toast.success("Superset created!", { description: `${newExercises[supersetLinking].name} + ${newExercises[exIndex].name}` });
    } else {
      setSupersetLinking(exIndex);
      toast.info("Select another exercise to superset with", { description: "Tap the superset option on the partner exercise." });
    }
  };

  const unlinkSuperset = (exIndex: number) => {
    const exercise = workoutData.exercises[exIndex];
    const partnerId = exercise.supersetWith;
    const newExercises = workoutData.exercises.map(ex => {
      if (ex.id === exercise.id || ex.id === partnerId) {
        return { ...ex, supersetWith: null };
      }
      return ex;
    });
    setWorkoutData({ ...workoutData, exercises: newExercises });
    toast("Superset unlinked");
  };

  const getSupersetPartner = (exercise: WorkoutExercise) => {
    if (!exercise.supersetWith) return null;
    return workoutData.exercises.find(ex => ex.id === exercise.supersetWith);
  };

  const handleSwipeStart = (e: React.TouchEvent, type: string, exIndex: number, setIndex?: number) => {
    swipeRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      element: e.currentTarget as HTMLElement,
    };
  };

  const handleSwipeEnd = (e: React.TouchEvent, type: string, exIndex: number, setIndex?: number) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = swipeRef.current.startX - endX;
    const diffY = Math.abs(swipeRef.current.startY - endY);

    if (diffX > 80 && diffY < 50) {
      if (type === "set" && setIndex !== undefined) {
        removeSet(exIndex, setIndex);
      } else if (type === "exercise") {
        removeExercise(exIndex);
      }
    }

    if (swipeRef.current.element) {
      swipeRef.current.element.style.transform = "";
      swipeRef.current.element.style.opacity = "";
    }
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diffX = swipeRef.current.startX - currentX;
    const diffY = Math.abs(swipeRef.current.startY - e.touches[0].clientY);
    if (diffX > 10 && diffY < 30 && swipeRef.current.element) {
      const translateX = Math.min(0, -diffX * 0.5);
      swipeRef.current.element.style.transform = `translateX(${translateX}px)`;
      swipeRef.current.element.style.opacity = `${Math.max(0.5, 1 - Math.abs(translateX) / 200)}`;
    }
  };

  const skipRest = () => {
    setRestTimer(null);
    setShowRestPopup(false);
  };

  const addRestTime = (seconds: number) => {
    setRestTimer(prev => (prev || 0) + seconds);
  };

  const filteredLibraryExercises = exercises.filter(ex => {
    if (!exerciseSearchTerm) return true;
    return ex.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
           ex.target.toLowerCase().includes(exerciseSearchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-300">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/workout")} className="h-8 w-8 text-muted-foreground" data-testid="button-close-workout">
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display font-semibold text-primary" data-testid="text-workout-title">{workoutData.title}</h1>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Timer className="w-3 h-3" /> {formatTime(timeElapsed)} elapsed
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {restTimer !== null && restTimer > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRestPopup(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 border-primary/30 text-primary h-8 text-xs font-semibold animate-pulse"
              data-testid="text-rest-timer"
            >
              <History className="w-3.5 h-3.5" />
              {formatTime(restTimer)}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Plus className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Session Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => { setReplacingExerciseIndex(null); setShowExerciseLibrary(true); }} className="cursor-pointer gap-2">
                <Plus className="w-4 h-4 text-primary" /> Add Exercise
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" size="sm" onClick={finishWorkout} className="font-medium bg-primary text-primary-foreground h-8" data-testid="button-finish-session">
            Finish
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {workoutData.exercises.map((exercise, exIndex) => {
          const supersetPartner = getSupersetPartner(exercise);
          const isSupersetTarget = supersetLinking !== null && supersetLinking !== exIndex;

          return (
            <div key={exercise.id}>
              {supersetPartner && workoutData.exercises.findIndex(e => e.id === exercise.supersetWith) < exIndex && (
                <div className="flex items-center justify-center -mb-2 relative z-10">
                  <div className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary/30">
                    <Link2 className="w-3 h-3" /> SUPERSET
                  </div>
                </div>
              )}
              <Card
                className={`border-border shadow-sm overflow-hidden bg-card transition-all ${
                  isSupersetTarget ? 'ring-2 ring-primary/50 border-primary/50' : ''
                } ${supersetPartner ? 'border-l-4 border-l-primary' : ''}`}
                data-testid={`card-workout-exercise-${exIndex}`}
                onTouchStart={(e) => handleSwipeStart(e, "exercise", exIndex)}
                onTouchMove={handleSwipeMove}
                onTouchEnd={(e) => handleSwipeEnd(e, "exercise", exIndex)}
              >
                <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-start">
                  <div className="flex gap-3 items-start flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-lg text-primary truncate">{exercise.name}</h2>
                        <Button variant="ghost" className="h-6 px-1.5 text-primary hover:bg-primary/20 rounded-full text-[10px] font-semibold gap-1 flex-shrink-0" onClick={() => {
                          const fullEx = exercises.find(e => e.id === exercise.exerciseId);
                          if (fullEx) setShowVideoDemo(fullEx);
                        }}>
                          <Play className="w-3 h-3 fill-current" /> Demo
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{exercise.target}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground -mr-2 flex-shrink-0"><MoreHorizontal className="w-5 h-5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 bg-card border-border">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">Exercise Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => { const fullEx = exercises.find(e => e.id === exercise.exerciseId); if (fullEx) setShowVideoDemo(fullEx); }} className="cursor-pointer gap-2">
                        <Play className="w-4 h-4 text-primary" /> View Demo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setReplacingExerciseIndex(exIndex); setShowExerciseLibrary(true); }} className="cursor-pointer gap-2">
                        <ArrowUpDown className="w-4 h-4" /> Swap Exercise
                      </DropdownMenuItem>
                      {exercise.supersetWith ? (
                        <DropdownMenuItem onClick={() => unlinkSuperset(exIndex)} className="cursor-pointer gap-2">
                          <Unlink className="w-4 h-4" /> Unlink Superset
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => toggleSuperset(exIndex)} className="cursor-pointer gap-2">
                          <Link2 className="w-4 h-4 text-primary" /> {supersetLinking !== null ? "Link as Superset" : "Create Superset"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem onClick={() => removeExercise(exIndex)} className="cursor-pointer text-destructive gap-2 focus:bg-destructive/10">
                        <Trash2 className="w-4 h-4" /> Remove from Session
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="px-4 py-2 bg-primary/5 flex items-start gap-2 text-sm text-primary/80">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{exercise.notes}</p>
                </div>

                <div className="p-0">
                  <div className="grid grid-cols-[1fr_2fr_2fr_2fr_auto] gap-2 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                    <div className="text-center">Set</div>
                    <div className="text-center">lbs</div>
                    <div className="text-center">Reps</div>
                    <div className="text-center">RPE</div>
                    <div className="w-9"></div>
                  </div>

                  {exercise.sets.map((set, setIndex) => {
                    const isCompleted = completedSets[`${exIndex}-${setIndex}`];
                    const isActive = activeSet.exercise === exIndex && activeSet.set === setIndex;
                    return (
                      <div
                        key={setIndex}
                        className={`grid grid-cols-[1fr_2fr_2fr_2fr_auto] gap-2 px-4 py-3 items-center border-b border-border/50 last:border-0 transition-all relative ${isCompleted ? 'bg-secondary/40' : isActive ? 'bg-primary/5' : ''}`}
                        onClick={() => !isCompleted && setActiveSet({ exercise: exIndex, set: setIndex })}
                        onTouchStart={(e) => handleSwipeStart(e, "set", exIndex, setIndex)}
                        onTouchMove={handleSwipeMove}
                        onTouchEnd={(e) => handleSwipeEnd(e, "set", exIndex, setIndex)}
                      >
                        <div className="text-center font-medium text-muted-foreground">
                          <div className="text-xs">{setIndex + 1}</div>
                          <div className="text-[9px] text-muted-foreground/70 mt-0.5">Prev: {set.previousWeight}</div>
                        </div>
                        <div>
                          <Input
                            value={set.weight}
                            onChange={(e) => updateSetValue(exIndex, setIndex, "weight", e.target.value)}
                            className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background'}`}
                            readOnly={isCompleted} type="number" inputMode="decimal" data-testid={`input-weight-${exIndex}-${setIndex}`}
                          />
                        </div>
                        <div>
                          <Input
                            value={set.reps}
                            onChange={(e) => updateSetValue(exIndex, setIndex, "reps", e.target.value)}
                            className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background'}`}
                            readOnly={isCompleted} type="text" inputMode="numeric" data-testid={`input-reps-${exIndex}-${setIndex}`}
                          />
                        </div>
                        <div>
                          <Input
                            value={set.rpe}
                            onChange={(e) => updateSetValue(exIndex, setIndex, "rpe", e.target.value)}
                            className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background'}`}
                            readOnly={isCompleted} type="number" inputMode="decimal" data-testid={`input-rpe-${exIndex}-${setIndex}`}
                          />
                        </div>
                        <Button size="icon" variant={isCompleted ? "default" : "outline"}
                          className={`h-9 w-9 rounded-md transition-colors ${isCompleted ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSet(exIndex, setIndex);
                            if (!isCompleted) {
                              if (setIndex + 1 < exercise.sets.length) setActiveSet({ exercise: exIndex, set: setIndex + 1 });
                              else if (exIndex + 1 < workoutData.exercises.length) setActiveSet({ exercise: exIndex + 1, set: 0 });
                            }
                          }}
                          data-testid={`button-complete-set-${exIndex}-${setIndex}`}
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="px-4 py-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-muted-foreground hover:text-primary font-medium h-8"
                    onClick={() => addSet(exIndex)}
                    data-testid={`button-add-set-${exIndex}`}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Set
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
        
        <Button
          variant="outline"
          className="w-full h-12 border-dashed border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          onClick={() => { setReplacingExerciseIndex(null); setShowExerciseLibrary(true); }}
          data-testid="button-add-exercise"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Exercise to Session
        </Button>

        <p className="text-center text-[10px] text-muted-foreground/50 pt-2">
          Swipe left on any set or exercise to remove it
        </p>
      </div>

      <Dialog open={showExerciseLibrary} onOpenChange={(open) => { setShowExerciseLibrary(open); if (!open) { setReplacingExerciseIndex(null); setExerciseSearchTerm(""); } }}>
        <DialogContent className="max-w-md w-[95vw] h-[80vh] flex flex-col p-0 gap-0 rounded-xl overflow-hidden">
          <DialogHeader className="p-4 border-b border-border bg-background flex-shrink-0">
            <DialogTitle>
              {replacingExerciseIndex !== null ? "Swap Exercise" : "Add Exercise"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {replacingExerciseIndex !== null
                ? "Choose a replacement. Your programme stays unchanged."
                : "Add an exercise to this session only."}
            </p>
            <div className="pt-3">
              <Input
                placeholder="Search exercises..."
                className="bg-card"
                value={exerciseSearchTerm}
                onChange={(e) => setExerciseSearchTerm(e.target.value)}
              />
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-secondary/30">
            {filteredLibraryExercises.map((ex) => (
              <Card key={ex.id} className="border-border shadow-sm hover:border-primary/50 cursor-pointer transition-colors" onClick={() => swapExercise(ex)}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center font-display font-bold text-primary/40 border border-border">{ex.imagePlaceholder}</div>
                  <div>
                    <h4 className="font-semibold text-sm">{ex.name}</h4>
                    <p className="text-xs text-muted-foreground">{ex.target} &bull; {ex.equipment}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showVideoDemo} onOpenChange={(open) => !open && setShowVideoDemo(null)}>
        <DialogContent className="max-w-md w-[95vw] p-0 overflow-hidden rounded-xl border-border">
          <div className="relative aspect-video bg-black flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop" alt="Coach demonstrating exercise" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button size="icon" className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary border-2 border-white/20"><Play className="w-6 h-6 ml-1 fill-current" /></Button>
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-xl font-display font-semibold">{showVideoDemo?.name}</h2>
            <p className="text-sm text-muted-foreground mt-2">{showVideoDemo?.description}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRestPopup} onOpenChange={setShowRestPopup}>
        <DialogContent className="max-w-sm w-[90vw] rounded-2xl p-0 overflow-hidden border-primary/30">
          <div className="bg-gradient-to-b from-primary/20 to-background p-8 flex flex-col items-center text-center">
            <LPLogoMark className="w-8 h-8 mb-4 opacity-40" />
            <h2 className="text-lg font-display font-bold text-foreground mb-1">Rest Period</h2>
            <p className="text-xs text-muted-foreground mb-6">Recovery is part of the work</p>
            <div className="text-6xl font-display font-bold text-primary tabular-nums mb-6">
              {formatTime(restTimer || 0)}
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${((restTimer || 0) / defaultRestSeconds) * 100}%` }}
              />
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => addRestTime(30)}>
                +30s
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => addRestTime(60)}>
                +60s
              </Button>
              <Button className="flex-1 text-xs bg-primary text-primary-foreground" onClick={skipRest}>
                Skip Rest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-md w-[95vw] rounded-xl p-5">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-display">How was your session?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(r => (
                <Button key={r} variant={feedbackRating === r ? "default" : "outline"} size="icon" className={`w-12 h-12 rounded-full text-lg ${feedbackRating === r ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => setFeedbackRating(r)} data-testid={`button-rating-${r}`}>
                  {r}
                </Button>
              ))}
            </div>
            <div className="text-center text-xs text-muted-foreground">
              {feedbackRating <= 2 ? "Struggled today" : feedbackRating === 3 ? "Average session" : feedbackRating === 4 ? "Felt strong" : "Crushed it!"}
            </div>
            <Textarea placeholder="Any notes about today's session..." value={feedbackNotes} onChange={(e) => setFeedbackNotes(e.target.value)} className="resize-none" rows={3} data-testid="input-feedback-notes" />
            <Button className="w-full bg-primary text-primary-foreground" onClick={completeWorkoutWithFeedback} data-testid="button-complete-workout">
              Complete &amp; Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
