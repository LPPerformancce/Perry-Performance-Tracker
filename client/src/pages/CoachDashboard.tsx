import { useState } from "react";
import { Users, FileText, Plus, Search, Settings, GripVertical, Play, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { exercisesDatabase, Exercise } from "@/lib/exercises";
import { Textarea } from "@/components/ui/textarea";

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState<"clients" | "programs" | "builder">("programs");
  
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

      <div className="flex gap-2 bg-secondary p-1 rounded-lg">
        <Button 
          variant={activeTab === "clients" ? "default" : "ghost"} 
          size="sm" 
          className="flex-1 h-8 text-xs font-medium"
          onClick={() => setActiveTab("clients")}
        >
          Clients
        </Button>
        <Button 
          variant={activeTab === "programs" ? "default" : "ghost"} 
          size="sm" 
          className="flex-1 h-8 text-xs font-medium"
          onClick={() => setActiveTab("programs")}
        >
          Programs
        </Button>
      </div>

      {activeTab === "clients" && (
        <section className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Client Management</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
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
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Active {client.lastActive}</div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] bg-secondary text-secondary-foreground">
                      Manage
                    </Button>
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
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Assign</Button>
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
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Assign</Button>
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
              <Button variant="outline" size="sm" className="h-8" onClick={() => setActiveTab("programs")}>Cancel</Button>
              <Button size="sm" className="h-8 bg-primary text-primary-foreground" onClick={() => setActiveTab("programs")}>Save</Button>
            </div>
          </div>

          <div className="space-y-6">
            {programDays.map((day, dayIndex) => (
              <Card key={day.id} className="border-border shadow-sm overflow-hidden">
                <div className="bg-secondary/50 p-3 border-b border-border flex items-center justify-between">
                  <Input 
                    value={day.name}
                    className="font-medium text-sm h-8 w-auto border-transparent bg-transparent hover:bg-background/50 focus-visible:ring-1"
                  />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><Trash2 className="w-4 h-4"/></Button>
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

            <Button variant="outline" className="w-full bg-card h-12 shadow-sm gap-2 text-muted-foreground hover:text-foreground">
              <Plus className="w-5 h-5" /> Add Training Day
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}