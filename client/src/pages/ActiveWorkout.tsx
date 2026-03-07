import { useState } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, Check, Timer, X, MoreHorizontal, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ActiveWorkout() {
  const [, setLocation] = useLocation();
  const [activeSet, setActiveSet] = useState<{ exercise: number, set: number }>({ exercise: 0, set: 0 });
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  const workoutData = {
    title: "Full Body Foundation",
    duration: "45-55 min",
    exercises: [
      {
        id: 1,
        name: "Dumbbell Goblet Squat",
        target: "Quads, Core",
        notes: "Keep chest up and elbows tucked.",
        sets: [
          { reps: "10", weight: "40", rpe: "7" },
          { reps: "10", weight: "40", rpe: "7" },
          { reps: "10", weight: "45", rpe: "8" },
        ]
      },
      {
        id: 2,
        name: "Incline Dumbbell Press",
        target: "Chest, Shoulders",
        notes: "Control the eccentric (lowering) phase.",
        sets: [
          { reps: "8-10", weight: "35", rpe: "8" },
          { reps: "8-10", weight: "35", rpe: "8" },
          { reps: "8-10", weight: "35", rpe: "9" },
        ]
      },
      {
        id: 3,
        name: "Seated Cable Row",
        target: "Back, Biceps",
        notes: "Squeeze shoulder blades together.",
        sets: [
          { reps: "12", weight: "80", rpe: "8" },
          { reps: "12", weight: "80", rpe: "8" },
        ]
      }
    ]
  };

  const toggleSet = (exIndex: number, setIndex: number) => {
    const key = `${exIndex}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const finishWorkout = () => {
    toast.success("Workout Complete!", {
      description: "Great job logging your session."
    });
    setLocation("/");
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
              <Timer className="w-3 h-3" /> 00:14:32 elapsed
            </div>
          </div>
        </div>
        <Button variant="default" size="sm" onClick={finishWorkout} className="font-medium bg-primary text-primary-foreground">
          Finish
        </Button>
      </header>

      <div className="p-4 space-y-6">
        {workoutData.exercises.map((exercise, exIndex) => (
          <Card key={exercise.id} className="border-border shadow-sm overflow-hidden bg-card">
            <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg text-primary">{exercise.name}</h2>
                <p className="text-sm text-muted-foreground">{exercise.target}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground -mr-2">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="px-4 py-2 bg-blue-50/50 flex items-start gap-2 text-sm text-primary/80">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{exercise.notes}</p>
            </div>

            <div className="p-0">
              <div className="grid grid-cols-[1fr_2fr_2fr_2fr_auto] gap-2 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <div className="text-center">Set</div>
                <div className="text-center">lbs</div>
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
                    className={`grid grid-cols-[1fr_2fr_2fr_2fr_auto] gap-2 px-4 py-3 items-center border-b border-border/50 last:border-0 transition-colors
                      ${isCompleted ? 'bg-secondary/40' : isActive ? 'bg-primary/5' : ''}
                    `}
                    onClick={() => !isCompleted && setActiveSet({ exercise: exIndex, set: setIndex })}
                  >
                    <div className="text-center font-medium text-muted-foreground">
                      {setIndex + 1}
                    </div>
                    <div>
                      <Input 
                        defaultValue={set.weight} 
                        className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background'}`}
                        readOnly={isCompleted}
                      />
                    </div>
                    <div>
                      <Input 
                        defaultValue={set.reps} 
                        className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background'}`}
                        readOnly={isCompleted}
                      />
                    </div>
                    <div>
                      <Input 
                        defaultValue={set.rpe} 
                        className={`h-9 text-center font-semibold ${isCompleted ? 'bg-transparent border-transparent text-muted-foreground' : 'bg-background'}`}
                        readOnly={isCompleted}
                      />
                    </div>
                    <Button 
                      size="icon" 
                      variant={isCompleted ? "default" : "outline"}
                      className={`h-9 w-9 rounded-md transition-colors ${
                        isCompleted 
                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
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
            
            <div className="p-3 border-t border-border bg-muted/10">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary/80 font-medium">
                + Add Set
              </Button>
            </div>
          </Card>
        ))}
        
        <Button variant="outline" className="w-full h-12 border-dashed border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          + Add Exercise
        </Button>
      </div>
    </div>
  );
}