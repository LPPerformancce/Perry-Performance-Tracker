import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check, Timer, X, MoreHorizontal, Info, GripVertical, Plus, Play, History, Droplet, Moon, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { exercisesDatabase, Exercise } from "@/lib/exercises";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ActiveWorkout() {
  const [, setLocation] = useLocation();
  const [activeSet, setActiveSet] = useState<{ exercise: number, set: number }>({ exercise: 0, set: 0 });
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showVideoDemo, setShowVideoDemo] = useState<Exercise | null>(null);
  const [replacingExerciseIndex, setReplacingExerciseIndex] = useState<number | null>(null);
  
  // Timer State
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const defaultRestSeconds = 60;
  
  // Feedback State
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      if (restTimer !== null && restTimer > 0) {
        setRestTimer(prev => prev! - 1);
      } else if (restTimer === 0) {
        setRestTimer(null);
        toast.info("Rest complete!", { description: "Time for your next set." });
        // In a real app we'd play an audio sound here
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [restTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Generate an initial weight based on last session (mocking the "intelligent load recommendation")
  const suggestWeight = (baseWeight: string) => {
    const num = parseInt(baseWeight);
    if (isNaN(num)) return baseWeight;
    // Suggest 5lbs more than the base weight 
    return (num + 5).toString();
  };

  const [workoutData, setWorkoutData] = useState({
    title: "Foundation: Full Body",
    duration: "45-55 min",
    exercises: [
      {
        id: 1,
        exerciseId: "e11",
        name: "Barbell Back Squat",
        target: "Quads",
        notes: "Focus on depth and driving through the mid-foot.",
        sets: [
          { reps: "8-10", weight: suggestWeight("135"), rpe: "7", previousWeight: "135" },
          { reps: "8-10", weight: suggestWeight("135"), rpe: "7", previousWeight: "135" },
          { reps: "8-10", weight: suggestWeight("135"), rpe: "8", previousWeight: "135" },
        ]
      },
      {
        id: 2,
        exerciseId: "e2",
        name: "Incline Dumbbell Press",
        target: "Chest, Shoulders",
        notes: "Control the eccentric (lowering) phase.",
        sets: [
          { reps: "8-10", weight: suggestWeight("40"), rpe: "8", previousWeight: "40" },
          { reps: "8-10", weight: suggestWeight("40"), rpe: "8", previousWeight: "40" },
          { reps: "8-10", weight: suggestWeight("40"), rpe: "9", previousWeight: "40" },
        ]
      },
      {
        id: 3,
        exerciseId: "e8",
        name: "Seated Cable Row",
        target: "Back, Biceps",
        notes: "Squeeze shoulder blades together.",
        sets: [
          { reps: "12", weight: suggestWeight("100"), rpe: "8", previousWeight: "100" },
          { reps: "12", weight: suggestWeight("100"), rpe: "8", previousWeight: "100" },
        ]
      }
    ]
  });

  const toggleSet = (exIndex: number, setIndex: number) => {
    const key = `${exIndex}-${setIndex}`;
    const willBeCompleted = !completedSets[key];
    
    setCompletedSets(prev => ({
      ...prev,
      [key]: willBeCompleted
    }));

    if (willBeCompleted) {
      setRestTimer(defaultRestSeconds);
    }
  };

  const finishWorkout = () => {
    const totalSets = workoutData.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSetsCount = Object.values(completedSets).filter(Boolean).length;
    
    if (completedSetsCount < totalSets) {
      if (!window.confirm(`You still have ${totalSets - completedSetsCount} sets remaining. Are you sure you want to finish the session?`)) {
        return;
      }
    }
    
    setShowFeedback(true);
  };

  const completeWorkoutWithFeedback = () => {
    toast.success("Workout Complete!", {
      description: "Great job logging your session."
    });
    setLocation("/workout/summary/1");
  };

  const swapExercise = (newExercise: Exercise) => {
    if (replacingExerciseIndex === null) {
      // Adding a new exercise
      const newExData = {
        id: Date.now(),
        exerciseId: newExercise.id,
        name: newExercise.name,
        target: newExercise.target,
        notes: newExercise.description,
        sets: [
          { reps: "10", weight: "0", rpe: "7", previousWeight: "0" },
          { reps: "10", weight: "0", rpe: "7", previousWeight: "0" },
          { reps: "10", weight: "0", rpe: "8", previousWeight: "0" },
        ]
      };
      setWorkoutData({
        ...workoutData,
        exercises: [...workoutData.exercises, newExData]
      });
    } else {
      // Replacing an existing exercise
      const newExercises = [...workoutData.exercises];
      newExercises[replacingExerciseIndex] = {
        ...newExercises[replacingExerciseIndex],
        exerciseId: newExercise.id,
        name: newExercise.name,
        target: newExercise.target,
        notes: newExercise.description
      };
      setWorkoutData({
        ...workoutData,
        exercises: newExercises
      });
      toast.success("Exercise swapped");
    }
    setShowExerciseLibrary(false);
    setReplacingExerciseIndex(null);
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === workoutData.exercises.length - 1)
    ) return;

    const newExercises = [...workoutData.exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newExercises[index];
    newExercises[index] = newExercises[targetIndex];
    newExercises[targetIndex] = temp;
    
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const removeSet = (exIndex: number) => {
    if (window.confirm("Are you sure you want to remove this set?")) {
      const newExercises = [...workoutData.exercises];
      if (newExercises[exIndex].sets.length > 1) {
        newExercises[exIndex].sets.pop();
        setWorkoutData({ ...workoutData, exercises: newExercises });
      } else {
        toast.error("Cannot remove the last set");
      }
    }
  };

  const addSet = (exIndex: number) => {
    const newExercises = [...workoutData.exercises];
    const lastSet = newExercises[exIndex].sets[newExercises[exIndex].sets.length - 1];
    newExercises[exIndex].sets.push({
      ...lastSet,
      weight: lastSet.weight || "0",
      reps: lastSet.reps || "10",
      rpe: lastSet.rpe || "7",
      previousWeight: lastSet.previousWeight || "0"
    });
    setWorkoutData({ ...workoutData, exercises: newExercises });
    toast.success("Set added");
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Clear value on focus to make entry easier, user can type new value immediately
    e.target.value = '';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>, originalValue: string) => {
    // Restore original value if they leave it empty
    if (e.target.value === '') {
      e.target.value = originalValue;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-300">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/workout")} className="h-8 w-8 text-muted-foreground">
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-primary">{workoutData.title}</h1>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Timer className="w-3 h-3" /> {formatTime(timeElapsed)} elapsed
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {restTimer !== null && restTimer > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-md text-xs font-semibold mr-1 animate-pulse">
              <History className="w-3.5 h-3.5" />
              {formatTime(restTimer)}
            </div>
          )}
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)} 
            className="font-medium h-8"
          >
            {isEditing ? "Save Edits" : "Edit Plan"}
          </Button>
          {!isEditing && (
            <Button variant="default" size="sm" onClick={finishWorkout} className="font-medium bg-primary text-primary-foreground h-8">
              Finish Session
            </Button>
          )}
        </div>
      </header>

      <div className="p-4 space-y-6">
        {workoutData.exercises.map((exercise, exIndex) => (
          <Card key={exercise.id} className={`border-border shadow-sm overflow-hidden bg-card ${isEditing ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
            <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-start">
              <div className="flex gap-3 items-start">
                {isEditing && (
                  <div className="flex flex-col gap-1 mt-1 text-muted-foreground">
                    <button onClick={() => moveExercise(exIndex, 'up')} disabled={exIndex === 0} className="disabled:opacity-30">
                      <GripVertical className="w-4 h-4 rotate-90" />
                    </button>
                    <button onClick={() => moveExercise(exIndex, 'down')} disabled={exIndex === workoutData.exercises.length - 1} className="disabled:opacity-30">
                      <GripVertical className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg text-primary">{exercise.name}</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-primary hover:bg-primary/20 rounded-full"
                      onClick={() => {
                        const fullEx = exercisesDatabase.find(e => e.id === exercise.exerciseId);
                        if (fullEx) setShowVideoDemo(fullEx);
                      }}
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{exercise.target}</p>
                </div>
              </div>
              
              {isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs bg-card"
                  onClick={() => {
                    setReplacingExerciseIndex(exIndex);
                    setShowExerciseLibrary(true);
                  }}
                >
                  Swap
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground -mr-2">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Exercise Actions</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => {
                        const fullEx = exercisesDatabase.find(e => e.id === exercise.exerciseId);
                        if (fullEx) setShowVideoDemo(fullEx);
                      }}
                      className="cursor-pointer gap-2"
                    >
                      <Play className="w-4 h-4 text-primary" /> View Demonstration
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        // In a real app, this would query a backend for alternative exercises using different equipment
                        toast.info("Showing alternative setup...", { description: "Searching for DB/Bodyweight variations." });
                      }}
                      className="cursor-pointer gap-2"
                    >
                      <History className="w-4 h-4 text-muted-foreground" /> Equipment Alternative
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      onClick={() => {
                        setReplacingExerciseIndex(exIndex);
                        setShowExerciseLibrary(true);
                      }}
                      className="cursor-pointer gap-2"
                    >
                      <Plus className="w-4 h-4" /> Swap Exercise
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addSet(exIndex)} className="cursor-pointer gap-2">
                      <Plus className="w-4 h-4" /> Add Set
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => removeSet(exIndex)} className="cursor-pointer text-destructive gap-2 focus:bg-destructive/10">
                      <X className="w-4 h-4" /> Remove Set
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <div className="px-4 py-2 bg-blue-50/50 flex items-start gap-2 text-sm text-primary/80">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{exercise.notes}</p>
            </div>

            <div className="p-0">
              <div className="grid grid-cols-[1fr_2fr_2fr_2fr_auto] gap-2 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <div className="text-center">Set</div>
                <div className="text-center flex flex-col items-center">
                  <span>lbs</span>
                  <span className="text-[9px] text-primary-foreground font-semibold bg-primary/80 px-1 rounded block mt-0.5">Sug: +5</span>
                </div>
                <div className="text-center">Reps</div>
                <div className="text-center">RPE</div>
                <div className="w-8"></div>
              </div>

              {exercise.sets.map((set, setIndex) => {
                const isCompleted = completedSets[`${exIndex}-${setIndex}`];
                const isActive = activeSet.exercise === exIndex && activeSet.set === setIndex;
                
                return (
                  <div 
                    key={setIndex} 
                    className={`grid grid-cols-[1fr_2fr_2fr_2fr_auto] gap-2 px-4 py-3 items-center border-b border-border/50 last:border-0 transition-colors relative
                      ${isCompleted ? 'bg-secondary/40' : isActive ? 'bg-primary/5' : ''}
                    `}
                    onClick={() => !isCompleted && setActiveSet({ exercise: exIndex, set: setIndex })}
                  >
                    <div className="text-center font-medium text-muted-foreground">
                      <div className="text-xs">{setIndex + 1}</div>
                      <div className="text-[9px] text-muted-foreground/70 mt-0.5">Prev: {set.previousWeight}</div>
                    </div>
                    <div>
                      <Input 
                        defaultValue={set.weight} 
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, set.weight)}
                        className={`h-9 text-center font-semibold ${
                          isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 
                          set.weight !== set.previousWeight ? 'border-primary/50 bg-primary/5 focus-visible:ring-primary/50' : 'bg-background focus-visible:ring-primary/50'
                        }`}
                        readOnly={isCompleted}
                        type="number"
                        inputMode="decimal"
                      />
                    </div>
                    <div>
                      <Input 
                        defaultValue={set.reps} 
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, set.reps)}
                        className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background focus-visible:ring-primary/50'}`}
                        readOnly={isCompleted}
                        type="text"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <Input 
                        defaultValue={set.rpe} 
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, set.rpe)}
                        className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background focus-visible:ring-primary/50'}`}
                        readOnly={isCompleted}
                        type="number"
                        inputMode="decimal"
                      />
                    </div>
                    <Button 
                      size="icon" 
                      variant={isCompleted ? "default" : "outline"}
                      className={`h-9 w-9 rounded-md transition-colors ${
                        isCompleted 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary' 
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSet(exIndex, setIndex);
                        if (!isCompleted) {
                          // Advance active set
                          if (setIndex + 1 < exercise.sets.length) {
                            setActiveSet({ exercise: exIndex, set: setIndex + 1 });
                          } else {
                            setActiveSet({ exercise: exIndex + 1, set: 0 });
                          }
                        }
                      }}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                  </div>
                );
              })}
            </div>
            
            {isEditing && (
              <div className="p-3 border-t border-border bg-muted/10">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary/80 font-medium" onClick={() => addSet(exIndex)}>
                  + Add Set
                </Button>
              </div>
            )}
          </Card>
        ))}
        
        {isEditing && (
          <Button 
            variant="outline" 
            className="w-full h-12 border-dashed border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            onClick={() => {
              setReplacingExerciseIndex(null);
              setShowExerciseLibrary(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" /> Add Exercise
          </Button>
        )}
      </div>

      <Dialog open={showExerciseLibrary} onOpenChange={setShowExerciseLibrary}>
        <DialogContent className="max-w-md w-[95vw] h-[80vh] flex flex-col p-0 gap-0 rounded-xl overflow-hidden">
          <DialogHeader className="p-4 border-b border-border bg-background flex-shrink-0">
            <DialogTitle>
              {replacingExerciseIndex !== null ? `Swap Exercise (Showing ${workoutData.exercises[replacingExerciseIndex].target} alternatives)` : "Add Exercise"}
            </DialogTitle>
            <div className="pt-3">
              <Input placeholder="Search exercises..." className="bg-card" />
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-secondary/30">
            {exercisesDatabase
              .filter(ex => replacingExerciseIndex === null || workoutData.exercises[replacingExerciseIndex].target.includes(ex.target))
              .map((ex) => (
              <Card 
                key={ex.id} 
                className="border-border shadow-sm hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => swapExercise(ex)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center font-display font-bold text-primary/40 border border-border">
                    {ex.imagePlaceholder}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{ex.name}</h4>
                    <p className="text-xs text-muted-foreground">{ex.target} • {ex.equipment}</p>
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
            <img 
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop" 
              alt="Coach demonstrating exercise" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button size="icon" className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary border-2 border-white/20">
                <Play className="w-6 h-6 ml-1 fill-current" />
              </Button>
            </div>
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={() => setShowVideoDemo(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 text-white">
              <div className="flex gap-1 text-xs">
                <span className="bg-black/50 px-2 py-0.5 rounded">0:00 / 0:45</span>
              </div>
              <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded font-medium text-primary">Coach Demo</span>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-xl font-display font-semibold text-foreground">{showVideoDemo?.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">{showVideoDemo?.target}</span>
                <span className="bg-secondary text-secondary-foreground border border-border px-2 py-1 rounded text-xs font-medium">{showVideoDemo?.equipment}</span>
                <span className="bg-secondary text-secondary-foreground border border-border px-2 py-1 rounded text-xs font-medium">{showVideoDemo?.mechanic}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">How to Perform</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {showVideoDemo?.description}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-md w-[95vw] rounded-xl p-5">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-center text-xl font-display text-primary">Session Complete</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/30">
                <Check className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-display font-bold text-foreground">{formatTime(timeElapsed)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Duration</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-display font-bold text-foreground">8.2k</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Volume (lbs)</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">How did it feel?</label>
              <div className="flex gap-2 justify-between">
                {['Easy', 'Good', 'Hard', 'Brutal'].map((rating) => (
                  <Button key={rating} variant="outline" className="flex-1 border-border shadow-sm bg-card hover:border-primary/50 text-xs h-9">
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Coach Notes (Optional)</label>
              <Textarea 
                placeholder="Any pain? Form breakdowns? Let Coach Lee know..."
                className="resize-none bg-card"
                rows={3}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-12 text-md font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={completeWorkoutWithFeedback}
            >
              Save Session & View Recovery
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}