import { useState } from "react";
import { Users, FileText, Plus, Search, Settings, GripVertical, Play, Edit3, Trash2, Video, UploadCloud, Utensils, Camera, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exercisesDatabase, Exercise } from "@/lib/exercises";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState<"clients" | "programs" | "library" | "nutrition" | "builder">("programs");

  
  // Program Builder State
  const [programTitle, setProgramTitle] = useState("New Foundation Plan");
  const [programDays, setProgramDays] = useState([
    { id: 1, name: "Day 1: Upper Focus", exercises: [exercisesDatabase[0], exercisesDatabase[1], exercisesDatabase[6]] },
    { id: 2, name: "Day 2: Lower Focus", exercises: [exercisesDatabase[10], exercisesDatabase[15], exercisesDatabase[25]] },
  ]);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Coach Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage clients and build programs</p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex gap-2 bg-secondary p-1 rounded-lg overflow-x-auto scrollbar-none">
        <Button 
          variant={activeTab === "clients" ? "default" : "ghost"} 
          size="sm" 
          className="flex-1 h-8 text-xs font-medium min-w-[80px]"
          onClick={() => setActiveTab("clients")}
        >
          Clients
        </Button>
        <Button 
          variant={activeTab === "programs" ? "default" : "ghost"} 
          size="sm" 
          className="flex-1 h-8 text-xs font-medium min-w-[80px]"
          onClick={() => setActiveTab("programs")}
        >
          Programs
        </Button>
        <Button 
          variant={activeTab === "library" ? "default" : "ghost"} 
          size="sm" 
          className="flex-1 h-8 text-xs font-medium min-w-[80px]"
          onClick={() => setActiveTab("library")}
        >
          Media
        </Button>
        <Button 
          variant={activeTab === "nutrition" ? "default" : "ghost"} 
          size="sm" 
          className="flex-1 h-8 text-xs font-medium min-w-[80px]"
          onClick={() => setActiveTab("nutrition")}
        >
          Nutrition
        </Button>
      </div>

      {activeTab === "clients" && (
        <section className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Client Management</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => toast.info("Invite dialog", { description: "Coming soon: Generate invite links for new clients." })}>
              <Plus className="w-3.5 h-3.5" /> Invite
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search clients..." 
              className="pl-9 bg-card border-border shadow-sm h-10"
            />
          </div>

          <div className="space-y-2">
            {[
              { name: "Sarah Jenkins", plan: "Foundation v2", lastActive: "Today", status: "good" },
              { name: "Michael Chen", plan: "Summer Prep '24", lastActive: "Yesterday", status: "good" },
              { name: "Emma Watson", plan: "Hypertrophy PPL", lastActive: "3 days ago", status: "warning" },
            ].map((client, i) => (
              <Card key={i} className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{client.name}</h4>
                      <p className="text-xs text-muted-foreground">{client.plan}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-xs text-muted-foreground mb-1">Active {client.lastActive}</div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary text-secondary-foreground" onClick={(e) => { e.stopPropagation(); toast.info("Form check request", { description: "Prompting client for form video." }); }}>
                        <Camera className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] bg-secondary text-secondary-foreground" onClick={(e) => { e.stopPropagation(); toast.info("Client Management", { description: `Opening profile for ${client.name}` }); }}>
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeTab === "programs" && (
        <section className="space-y-4 animate-in slide-in-from-left-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Program Library</h2>
            <Button size="sm" className="h-8 text-xs gap-1 bg-primary text-primary-foreground" onClick={() => setActiveTab("builder")}>
              <Plus className="w-3.5 h-3.5" /> New Program
            </Button>
          </div>

          <div className="grid gap-3">
            <Card className="border-border border-l-4 border-l-primary shadow-sm cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => setActiveTab("builder")}>
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Foundation for Professionals</h3>
                    <p className="text-xs text-muted-foreground mt-1">3 days/week • 8 weeks</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit3 className="w-4 h-4"/></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    14 Clients Assigned
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); toast.success("Assignment Modal Opened"); }}>Assign</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border border-l-4 border-l-emerald-500 shadow-sm cursor-pointer hover:bg-secondary/20 transition-colors">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Desk-Worker Posture Fix</h3>
                    <p className="text-xs text-muted-foreground mt-1">2 days/week • Mobility focus</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit3 className="w-4 h-4"/></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                    8 Clients Assigned
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); toast.success("Assignment Modal Opened"); }}>Assign</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {activeTab === "library" && (
        <section className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Exercise Media</h2>
            <Button size="sm" className="h-8 text-xs gap-1 bg-primary text-primary-foreground" onClick={() => toast.info("Upload Media", { description: "Opening device file picker..." })}>
              <Plus className="w-3.5 h-3.5" /> Add New
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">Upload your own videos to act as the primary demonstration for your clients.</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search exercises to add video..." 
              className="pl-9 bg-card border-border shadow-sm h-10"
            />
          </div>

          <div className="space-y-3">
            {exercisesDatabase.slice(0, 5).map((ex, i) => (
              <Card key={ex.id} className="border-border shadow-sm overflow-hidden">
                <CardContent className="p-0 flex items-stretch">
                  <div className="w-24 bg-secondary flex items-center justify-center relative group overflow-hidden">
                    {i < 2 ? (
                      <>
                        <img src={`https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop`} className="w-full h-full object-cover opacity-60" alt="demo" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <span className="text-xs text-white font-medium">Replace</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground cursor-pointer hover:text-primary transition-colors p-2 text-center">
                        <UploadCloud className="w-6 h-6" />
                        <span className="text-[10px] font-medium leading-tight">Upload<br/>Video</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-center">
                    <h4 className="font-semibold text-sm text-foreground">{ex.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{ex.target} • {ex.equipment}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {i < 2 ? (
                        <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-100">
                          <Video className="w-3 h-3" /> Custom Video Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
                          No Custom Video
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeTab === "nutrition" && (
        <section className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Nutrition Resources</h2>
            <Button size="sm" className="h-8 text-xs gap-1 bg-primary text-primary-foreground" onClick={() => toast.info("Nutrition Builder", { description: "Opening macro template creator..." })}>
              <Plus className="w-3.5 h-3.5" /> New Plan
            </Button>
          </div>
          
          <div className="grid gap-3">
            <Card className="border-border shadow-sm cursor-pointer hover:bg-secondary/20 transition-colors">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">LP High-Protein Lean Bulk</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Preset Meal Plan • 2800 kcal</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit3 className="w-4 h-4"/></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm cursor-pointer hover:bg-secondary/20 transition-colors">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Review Community Recipes</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">4 new submissions pending</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ChevronRight className="w-4 h-4"/></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {activeTab === "builder" && (
        <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border shadow-sm sticky top-16 z-20">
            <Input 
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="font-semibold text-base border-transparent bg-transparent hover:bg-secondary focus-visible:ring-1 focus-visible:bg-background px-2"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={() => {
                if (window.confirm("Discard unsaved changes?")) {
                  setActiveTab("programs");
                }
              }}>Cancel</Button>
              <Button size="sm" className="h-8 bg-primary text-primary-foreground" onClick={() => setActiveTab("programs")}>Save</Button>
            </div>
          </div>

          <div className="space-y-6">
            {programDays.map((day, dayIndex) => (
              <Card key={day.id} className="border-border shadow-sm overflow-hidden">
                <div className="bg-secondary/50 p-3 border-b border-border flex items-center justify-between">
                  <Input 
                    value={day.name}
                    onChange={(e) => {
                      const newDays = [...programDays];
                      newDays[dayIndex].name = e.target.value;
                      setProgramDays(newDays);
                    }}
                    className="font-medium text-sm h-8 w-auto border-transparent bg-transparent hover:bg-background/50 focus-visible:ring-1"
                  />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => {
                      if (window.confirm("Are you sure you want to delete this entire training day?")) {
                        const newDays = [...programDays];
                        newDays.splice(dayIndex, 1);
                        setProgramDays(newDays);
                      }
                    }}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
                
                <div className="p-2 space-y-2">
                  {day.exercises.map((ex, exIndex) => (
                    <div key={ex.id} className="flex items-center gap-2 p-2 bg-background border border-border rounded-md group">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{ex.name}</h4>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>3 sets</span>
                          <span>•</span>
                          <span>8-12 reps</span>
                          <span>•</span>
                          <span>RPE 7-8</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-50 group-hover:opacity-100">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-10 border-dashed border-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors text-xs font-medium">
                        <Plus className="w-4 h-4 mr-1" /> Add Exercise
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md w-[95vw] h-[80vh] flex flex-col p-0 gap-0">
                      <DialogHeader className="p-4 border-b border-border bg-background">
                        <DialogTitle>Add to {day.name}</DialogTitle>
                        <Input placeholder="Search exercises..." className="mt-2" />
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {exercisesDatabase.map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 cursor-pointer">
                            <div>
                              <h4 className="font-semibold text-sm">{ex.name}</h4>
                              <p className="text-xs text-muted-foreground">{ex.target}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-7">Add</Button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full bg-card h-12 shadow-sm gap-2 text-muted-foreground hover:text-foreground" onClick={() => {
              const newId = programDays.length > 0 ? Math.max(...programDays.map(d => d.id)) + 1 : 1;
              setProgramDays([...programDays, { id: newId, name: `Day ${newId}: New Focus`, exercises: [] }]);
            }}>
              <Plus className="w-5 h-5" /> Add Training Day
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}