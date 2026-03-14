import { useState } from "react";
import { Users, FileText, Plus, Search, Settings, GripVertical, Play, Edit3, Trash2, Video, UploadCloud, Utensils, Camera, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Program, User, ClientAssignment, Exercise } from "@shared/schema";

export default function CoachDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"clients" | "programs" | "library" | "nutrition" | "builder">("programs");

  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const { data: assignments = [] } = useQuery<ClientAssignment[]>({
    queryKey: ["/api/client-assignments/coach/1"],
  });

  const clients = allUsers.filter(u => u.role === "user");

  const getClientProgram = (clientId: number) => {
    const assignment = assignments.find(a => a.clientId === clientId);
    if (assignment?.programId) {
      return programs.find(p => p.id === assignment.programId)?.title || "Unassigned";
    }
    return "Unassigned";
  };

  const [programTitle, setProgramTitle] = useState("New Foundation Plan");
  const [builderDays, setBuilderDays] = useState<{ id: number; name: string; exercises: Exercise[] }[]>([]);

  const createProgramMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/programs", {
        title: programTitle,
        daysPerWeek: builderDays.length,
        durationWeeks: 8,
        coachId: 1,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      toast.success("Program saved!");
      setActiveTab("programs");
    },
  });

  const startBuilder = (program?: Program) => {
    if (program) {
      setProgramTitle(program.title);
    } else {
      setProgramTitle("New Program");
      setBuilderDays([]);
    }
    setActiveTab("builder");
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary" data-testid="text-coach-title">Coach Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage clients and build programs</p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex gap-2 bg-secondary p-1 rounded-lg overflow-x-auto scrollbar-none">
        {(["clients", "programs", "library", "nutrition"] as const).map(tab => (
          <Button 
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"} 
            size="sm" 
            className="flex-1 h-8 text-xs font-medium min-w-[80px]"
            onClick={() => setActiveTab(tab)}
            data-testid={`tab-${tab}`}
          >
            {tab === "library" ? "Media" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {activeTab === "clients" && (
        <section className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Client Management</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => toast.info("Invite dialog", { description: "Coming soon: Generate invite links for new clients." })} data-testid="button-invite-client">
              <Plus className="w-3.5 h-3.5" /> Invite
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search clients..." className="pl-9 bg-card border-border shadow-sm h-10" data-testid="input-search-clients" />
          </div>

          <div className="space-y-2">
            {clients.map((client) => (
              <Card key={client.id} className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer" data-testid={`card-client-${client.id}`}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                        {client.avatarInitials || client.displayName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{client.displayName}</h4>
                      <p className="text-xs text-muted-foreground">{getClientProgram(client.id)}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-xs text-muted-foreground mb-1">Active</div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 bg-secondary text-secondary-foreground" onClick={(e) => { e.stopPropagation(); toast.info("Form check request", { description: "Prompting client for form video." }); }}>
                        <Camera className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] bg-secondary text-secondary-foreground" onClick={(e) => { e.stopPropagation(); toast.info("Client Management", { description: `Opening profile for ${client.displayName}` }); }}>
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
            <Button size="sm" className="h-8 text-xs gap-1 bg-primary text-primary-foreground" onClick={() => startBuilder()} data-testid="button-new-program">
              <Plus className="w-3.5 h-3.5" /> New Program
            </Button>
          </div>

          <div className="grid gap-3">
            {programs.map((program, i) => {
              const assignedCount = assignments.filter(a => a.programId === program.id).length;
              const colors = ["primary", "emerald-500"];
              const color = colors[i % colors.length];
              return (
                <Card key={program.id} className={`border-border border-l-4 border-l-${color} shadow-sm cursor-pointer hover:bg-secondary/20 transition-colors`} onClick={() => startBuilder(program)} data-testid={`card-program-${program.id}`}>
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{program.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{program.daysPerWeek} days/week &bull; {program.durationWeeks} weeks</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Edit3 className="w-4 h-4"/></Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {assignedCount} Client{assignedCount !== 1 ? "s" : ""} Assigned
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); toast.success("Assignment Modal Opened"); }}>Assign</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "library" && (
        <section className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Exercise Media</h2>
            <Button size="sm" className="h-8 text-xs gap-1 bg-primary text-primary-foreground" onClick={() => toast.info("Upload Media", { description: "Opening device file picker..." })} data-testid="button-add-media">
              <Plus className="w-3.5 h-3.5" /> Add New
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">Upload your own videos to act as the primary demonstration for your clients.</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search exercises to add video..." className="pl-9 bg-card border-border shadow-sm h-10" />
          </div>

          <div className="space-y-3">
            {exercises.slice(0, 5).map((ex, i) => (
              <Card key={ex.id} className="border-border shadow-sm overflow-hidden" data-testid={`card-media-${ex.id}`}>
                <CardContent className="p-0 flex items-stretch">
                  <div className="w-24 bg-secondary flex items-center justify-center relative group overflow-hidden">
                    {i < 2 ? (
                      <>
                        <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="demo" />
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
                    <p className="text-xs text-muted-foreground mt-0.5">{ex.target} &bull; {ex.equipment}</p>
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
            <Button size="sm" className="h-8 text-xs gap-1 bg-primary text-primary-foreground" onClick={() => toast.info("Nutrition Builder", { description: "Opening macro template creator..." })} data-testid="button-new-nutrition-plan">
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
                      <p className="text-xs text-muted-foreground mt-0.5">Preset Meal Plan &bull; 2800 kcal</p>
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
              data-testid="input-program-title"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={() => {
                if (window.confirm("Discard unsaved changes?")) {
                  setActiveTab("programs");
                }
              }} data-testid="button-cancel-builder">Cancel</Button>
              <Button size="sm" className="h-8 bg-primary text-primary-foreground" onClick={() => createProgramMutation.mutate()} data-testid="button-save-program">Save</Button>
            </div>
          </div>

          <div className="space-y-6">
            {builderDays.map((day, dayIndex) => (
              <Card key={day.id} className="border-border shadow-sm overflow-hidden">
                <div className="bg-secondary/50 p-3 border-b border-border flex items-center justify-between">
                  <Input 
                    value={day.name}
                    onChange={(e) => {
                      const newDays = [...builderDays];
                      newDays[dayIndex].name = e.target.value;
                      setBuilderDays(newDays);
                    }}
                    className="font-medium text-sm h-8 w-auto border-transparent bg-transparent hover:bg-background/50 focus-visible:ring-1"
                  />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => {
                      if (window.confirm("Are you sure you want to delete this entire training day?")) {
                        const newDays = [...builderDays];
                        newDays.splice(dayIndex, 1);
                        setBuilderDays(newDays);
                      }
                    }}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
                
                <div className="p-2 space-y-2">
                  {day.exercises.map((ex) => (
                    <div key={ex.id} className="flex items-center gap-2 p-2 bg-background border border-border rounded-md group">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{ex.name}</h4>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>3 sets</span>
                          <span>&bull;</span>
                          <span>8-12 reps</span>
                          <span>&bull;</span>
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
                        {exercises.map((ex) => (
                          <div key={ex.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 cursor-pointer" onClick={() => {
                            const newDays = [...builderDays];
                            newDays[dayIndex].exercises.push(ex);
                            setBuilderDays(newDays);
                          }}>
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
              const newId = builderDays.length > 0 ? Math.max(...builderDays.map(d => d.id)) + 1 : 1;
              setBuilderDays([...builderDays, { id: newId, name: `Day ${newId}: New Focus`, exercises: [] }]);
            }} data-testid="button-add-training-day">
              <Plus className="w-5 h-5" /> Add Training Day
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
