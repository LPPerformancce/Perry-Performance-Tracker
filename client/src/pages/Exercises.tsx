import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Exercises() {
  const bodyParts = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-2">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-foreground">Exercises</h1>
        <p className="text-sm text-muted-foreground">Browse and search movement library</p>
      </header>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search exercises..." 
            className="pl-9 bg-card border-border focus-visible:ring-primary h-12"
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 border-border bg-card">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 scrollbar-none">
        {bodyParts.map((part, i) => (
          <Button 
            key={part} 
            variant={i === 0 ? "default" : "outline"}
            className={`rounded-full px-5 h-8 text-xs font-medium whitespace-nowrap ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-card border-border text-foreground hover:bg-secondary'}`}
          >
            {part}
          </Button>
        ))}
      </div>

      <div className="space-y-1 mt-4">
        {["Barbell Bench Press", "Incline Dumbbell Press", "Cable Crossover", "Push-ups", "Pec Deck Fly"].map((exercise, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border-b border-border last:border-0 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded bg-card flex items-center justify-center border border-border">
              {/* Placeholder for exercise image */}
              <div className="w-8 h-8 rounded-full bg-primary/10" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{exercise}</h4>
              <p className="text-xs text-muted-foreground">Chest • Compound</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}