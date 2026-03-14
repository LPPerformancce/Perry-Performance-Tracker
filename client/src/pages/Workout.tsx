import { Plus, Play, History, CheckCircle2, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Workout() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2">
        <h1 className="text-2xl font-display font-semibold text-primary">Workout</h1>
        <p className="text-sm text-muted-foreground mt-1">Start a scheduled session or choose a routine</p>
      </header>

      <Button 
        onClick={() => setLocation('/workout/active/new')}
        className="w-full h-14 text-sm font-semibold gap-2 bg-card text-primary border border-border shadow-sm hover:bg-secondary transition-colors"
      >
        <Plus className="w-5 h-5" /> Start Empty Session
      </Button>

      <section className="space-y-4 pt-2">
        <h2 className="text-lg font-semibold text-foreground">Your Assigned Program</h2>
        
        <Card className="border-border shadow-md border-l-4 border-l-primary overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1 block">Up Next</span>
                  <h3 className="font-display font-semibold text-xl">Foundation: Full Body</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Focus on controlled eccentrics. Keep RPE around 7-8 for all working sets.
              </p>
              <Button 
                onClick={() => setLocation('/workout/active/foundation-1')}
                className="w-full bg-primary text-primary-foreground font-medium shadow-sm"
              >
                Start Assigned Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Other Routines</h2>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search routines..." 
            className="pl-9 bg-card border-border shadow-sm"
          />
        </div>

        <div className="grid gap-3">
          {[
            { id: 'upper', name: "Upper Body Focus", target: "Chest, Back, Arms", last: "2 days ago", exercises: 6 },
            { id: 'lower', name: "Lower Body & Core", target: "Quads, Hamstrings, Abs", last: "4 days ago", exercises: 5 },
            { id: 'mobility', name: "Desk Relief Mobility", target: "Hips, Shoulders, Spine", last: "Yesterday", exercises: 8 }
          ].map((routine, i) => (
            <Card key={i} className="bg-card border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer group" onClick={() => setLocation(`/workout/active/${routine.id}`)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-base">{routine.name}</h3>
                  <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors -mt-1 -mr-1">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{routine.target}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> {routine.last}
                  </span>
                  <span className="flex items-center gap-1 text-primary/80">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {routine.exercises} Exercises
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}