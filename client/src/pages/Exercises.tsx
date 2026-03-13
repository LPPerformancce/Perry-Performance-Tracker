import { useState } from "react";
import { Search, Filter, Play, X, Video, Plus, Edit2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exercisesDatabase, Exercise } from "@/lib/exercises";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Exercises() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [exercises, setExercises] = useState(exercisesDatabase);

  const [newExData, setNewExData] = useState({
    name: "",
    target: "Chest",
    equipment: "Dumbbell",
    description: ""
  });

  const handleCreateExercise = () => {
    if (!newExData.name) return;
    
    const newEx: Exercise = {
      id: `custom-${Date.now()}`,
      name: newExData.name,
      target: newExData.target,
      equipment: newExData.equipment as any,
      category: "Compound",
      mechanic: "Push",
      description: newExData.description,
      imagePlaceholder: newExData.name.substring(0, 2).toUpperCase()
    };
    
    setExercises([newEx, ...exercises]);
    setShowCreateDialog(false);
    setNewExData({ name: "", target: "Chest", equipment: "Dumbbell", description: "" });
  };

  const bodyParts = ["All", "Chest", "Back", "Quads", "Hamstrings", "Shoulders", "Biceps", "Triceps", "Core"];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || ex.target.includes(activeFilter) || (activeFilter === "Quads" || activeFilter === "Hamstrings" ? ex.target.includes(activeFilter) : false);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Exercise Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and search movement mechanics</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Plus className="w-4 h-4" /> Create
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-[95vw] rounded-xl p-5">
            <DialogHeader className="mb-4">
              <DialogTitle>Create Custom Exercise</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Exercise Name</Label>
                <Input 
                  placeholder="e.g. Deficit Reverse Lunge" 
                  value={newExData.name}
                  onChange={(e) => setNewExData({...newExData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Target</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newExData.target}
                    onChange={(e) => setNewExData({...newExData, target: e.target.value})}
                  >
                    {bodyParts.filter(p => p !== "All").map(part => (
                      <option key={part} value={part}>{part}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Equipment</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newExData.equipment}
                    onChange={(e) => setNewExData({...newExData, equipment: e.target.value})}
                  >
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Dumbbell">Dumbbell</option>
                    <option value="Barbell">Barbell</option>
                    <option value="Machine">Machine</option>
                    <option value="Cable">Cable</option>
                    <option value="Kettlebell">Kettlebell</option>
                    <option value="Bands">Bands</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes & Instructions (Optional)</Label>
                <Textarea 
                  placeholder="Personal cues or setup instructions..." 
                  className="resize-none" 
                  rows={3}
                  value={newExData.description}
                  onChange={(e) => setNewExData({...newExData, description: e.target.value})}
                />
              </div>
              <Button className="w-full mt-2 bg-primary text-primary-foreground" onClick={handleCreateExercise}>
                Save Custom Exercise
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search exercises..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border shadow-sm h-11 rounded-lg"
          />
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11 border-border shadow-sm bg-card">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 scrollbar-none">
        {bodyParts.map((part) => (
          <Button 
            key={part} 
            variant={activeFilter === part ? "default" : "outline"}
            onClick={() => setActiveFilter(part)}
            className={`rounded-full px-4 h-8 text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === part 
                ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                : 'bg-card border-border text-foreground hover:bg-secondary/80'
            }`}
          >
            {part}
          </Button>
        ))}
      </div>

      <div className="space-y-3 mt-4">
        {filteredExercises.map((exercise) => (
          <Card 
            key={exercise.id} 
            className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer group"
            onClick={() => setSelectedExercise(exercise)}
          >
            <CardContent className="p-3 flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center border border-border shadow-inner text-primary/40 font-display font-bold text-xl flex-shrink-0 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                {exercise.imagePlaceholder}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-primary fill-primary/20" />
                </div>
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <h4 className="font-semibold text-sm text-foreground truncate">{exercise.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 mb-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">{exercise.target}</span>
                  <span className="bg-secondary text-secondary-foreground border border-border px-1.5 py-0.5 rounded text-[10px] font-medium">{exercise.equipment}</span>
                  <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5"><Video className="w-3 h-3" /> Video</span>
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">{exercise.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredExercises.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-sm">No exercises found.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)}>
        <DialogContent className="max-w-md w-[95vw] p-0 overflow-hidden rounded-xl border-border">
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {/* Mock video player showing the coach */}
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
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={() => setSelectedExercise(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 text-white">
              <div className="flex gap-1 text-xs">
                <span className="bg-black/50 px-2 py-0.5 rounded">0:00 / 0:45</span>
              </div>
              <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded font-medium text-emerald-400">Coach Demo</span>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-xl font-display font-semibold text-foreground">{selectedExercise?.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">{selectedExercise?.target}</span>
                <span className="bg-secondary text-secondary-foreground border border-border px-2 py-1 rounded text-xs font-medium">{selectedExercise?.equipment}</span>
                <span className="bg-secondary text-secondary-foreground border border-border px-2 py-1 rounded text-xs font-medium">{selectedExercise?.mechanic}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">How to Perform</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedExercise?.description}
              </p>
            </div>
            
            <div className="space-y-2 pt-2 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground">Coach Notes</h3>
              <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-sm text-blue-900/80 italic">
                "Keep the movement controlled. Don't rush the eccentric phase. If you feel this in your lower back, stop and check your form."
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}