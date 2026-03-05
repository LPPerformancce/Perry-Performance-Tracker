import { Plus, Play, History, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Workout() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-2">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-foreground">Workout</h1>
        <p className="text-sm text-muted-foreground">Start a session or browse routines</p>
      </header>

      <Button className="w-full h-14 text-lg font-display font-bold uppercase tracking-widest gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-5 h-5" /> Quick Start Empty Workout
      </Button>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Routines</h2>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            See All
          </Button>
        </div>

        <div className="grid gap-3">
          {[
            { name: "Hypertrophy: Pull", target: "Back, Biceps", last: "2 days ago" },
            { name: "Strength: Push", target: "Chest, Shoulders, Triceps", last: "Yesterday" },
            { name: "Lower Body Focus", target: "Quads, Hamstrings, Calves", last: "4 days ago" }
          ].map((routine, i) => (
            <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold text-xl">{routine.name}</h3>
                  <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{routine.target}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> {routine.last}
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 6 Exercises
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