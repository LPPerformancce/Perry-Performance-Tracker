import { useState } from "react";
import { ArrowLeft, Target, Users, Calendar, Plus, Edit2, Trash2, CheckCircle2, Clock, Dumbbell, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCurrentUser } from "@/lib/userContext";
import { toast } from "sonner";

interface Bootcamp {
  id: number;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  status: "active" | "upcoming" | "completed";
  progress: number;
  members: number;
  maxMembers: number;
  schedule: string[];
  features: string[];
  coachNote: string;
}

const INITIAL_BOOTCAMPS: Bootcamp[] = [
  { id: 1, title: "Summer Prep '24", description: "8-week intensive focusing on leaning out while maintaining the strength we built over winter. Combines metabolic conditioning with structured strength work.", duration: "8 weeks", startDate: "June 1", status: "active", progress: 35, members: 42, maxMembers: 50, schedule: ["Mon: Upper Body Strength", "Tue: HIIT Conditioning", "Wed: Lower Body Strength", "Thu: Active Recovery / Yoga", "Fri: Full Body Power", "Sat: Outdoor Group Session", "Sun: Rest"], features: ["Custom nutrition plan", "Weekly check-ins with Coach Lee", "Private group chat", "Progress photos tracking", "Supplement guidance"], coachNote: "We're in the sweet spot now. Weeks 3-5 are where the real changes happen. Stay consistent, trust the process." },
  { id: 2, title: "Autumn Strength Phase", description: "Transition back to heavy lifting. Focus on the big three lifts and building dense muscle. Progressive overload with periodised programming.", duration: "12 weeks", startDate: "September 1", status: "upcoming", progress: 0, members: 18, maxMembers: 40, schedule: ["Mon: Squat Focus", "Tue: Bench Focus", "Wed: Active Recovery", "Thu: Deadlift Focus", "Fri: Accessories & Weak Points", "Sat: Optional Conditioning", "Sun: Rest"], features: ["Personalised 1RM progression", "Technique video reviews", "Monthly strength tests", "Nutrition for strength gains", "Deload week guidance"], coachNote: "This one's for anyone who wants to get seriously strong. We'll build up gradually — no ego lifting." },
  { id: 3, title: "Winter Wellness Block", description: "6-week programme focused on building healthy habits during the darker months. Combines training with sleep optimisation and stress management.", duration: "6 weeks", startDate: "November 15", status: "upcoming", progress: 0, members: 8, maxMembers: 30, schedule: ["Mon: Strength A", "Tue: Mobility & Breathwork", "Wed: Strength B", "Thu: Rest", "Fri: Strength C", "Sat: Outdoor Walk/Hike", "Sun: Rest"], features: ["Sleep tracking protocols", "Stress management tools", "Vitamin D & seasonal nutrition", "Accountability partner system", "Weekly mindset coaching"], coachNote: "This isn't just about training — it's about thriving when most people slow down. Mental game is everything." },
];

export default function Bootcamps() {
  const { currentUser } = useCurrentUser();
  const isCoach = currentUser?.role === "coach";
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>(INITIAL_BOOTCAMPS);
  const [selectedBootcamp, setSelectedBootcamp] = useState<Bootcamp | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set([1]));
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", startDate: "", maxMembers: "", coachNote: "", features: "", schedule: "" });

  const openCreate = () => {
    setEditingBootcamp(null);
    setFormData({ title: "", description: "", duration: "", startDate: "", maxMembers: "", coachNote: "", features: "", schedule: "" });
    setShowCreateDialog(true);
  };

  const openEdit = (bc: Bootcamp) => {
    setEditingBootcamp(bc);
    setFormData({ title: bc.title, description: bc.description, duration: bc.duration, startDate: bc.startDate, maxMembers: String(bc.maxMembers), coachNote: bc.coachNote, features: bc.features.join("\n"), schedule: bc.schedule.join("\n") });
    setShowCreateDialog(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) { toast.error("Give the bootcamp a name"); return; }
    if (editingBootcamp) {
      setBootcamps(prev => prev.map(bc => bc.id === editingBootcamp.id ? { ...bc, title: formData.title, description: formData.description, duration: formData.duration || bc.duration, startDate: formData.startDate || bc.startDate, maxMembers: Number(formData.maxMembers) || bc.maxMembers, coachNote: formData.coachNote, features: formData.features.split("\n").filter(Boolean), schedule: formData.schedule.split("\n").filter(Boolean) } : bc));
      if (selectedBootcamp?.id === editingBootcamp.id) {
        setSelectedBootcamp(prev => prev ? { ...prev, title: formData.title, description: formData.description, duration: formData.duration || prev.duration, startDate: formData.startDate || prev.startDate, coachNote: formData.coachNote, features: formData.features.split("\n").filter(Boolean), schedule: formData.schedule.split("\n").filter(Boolean) } : null);
      }
      toast.success("Bootcamp updated");
    } else {
      const newBc: Bootcamp = { id: Date.now(), title: formData.title, description: formData.description, duration: formData.duration || "8 weeks", startDate: formData.startDate || "TBD", status: "upcoming", progress: 0, members: 0, maxMembers: Number(formData.maxMembers) || 30, schedule: formData.schedule.split("\n").filter(Boolean), features: formData.features.split("\n").filter(Boolean), coachNote: formData.coachNote };
      setBootcamps(prev => [...prev, newBc]);
      toast.success("Bootcamp created");
    }
    setShowCreateDialog(false);
  };

  const handleDelete = (id: number) => {
    setBootcamps(prev => prev.filter(bc => bc.id !== id));
    if (selectedBootcamp?.id === id) setSelectedBootcamp(null);
    toast.success("Bootcamp removed");
  };

  const handleJoin = (id: number) => {
    if (joinedIds.has(id)) {
      setJoinedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      toast.info("You've left the bootcamp");
    } else {
      setJoinedIds(prev => new Set(prev).add(id));
      toast.success("You've joined the waitlist!", { description: "You'll get a notification when it starts." });
    }
  };

  if (selectedBootcamp) {
    const bc = selectedBootcamp;
    const joined = joinedIds.has(bc.id);
    return (
      <div className="p-4 space-y-5 animate-in fade-in duration-300 pb-20">
        <header className="py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => setSelectedBootcamp(null)} data-testid="button-back-bootcamp-detail"><ArrowLeft className="w-5 h-5" /></Button>
            <div>
              <h1 className="text-xl font-display font-semibold text-foreground">{bc.title}</h1>
              <p className="text-xs text-muted-foreground">{bc.duration} • Starts {bc.startDate}</p>
            </div>
          </div>
          {isCoach && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(bc)} data-testid="button-edit-bootcamp-detail"><Edit2 className="w-4 h-4" /></Button>
          )}
        </header>

        {bc.status === "active" && (
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-xs font-medium"><span>Your Progress</span><span>{bc.progress}%</span></div>
              <Progress value={bc.progress} className="h-2 bg-emerald-500/20 [&>div]:bg-emerald-500" />
            </CardContent>
          </Card>
        )}

        <div className="space-y-1">
          <h2 className="font-semibold text-sm text-foreground">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{bc.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border"><CardContent className="p-3 text-center"><Clock className="w-4 h-4 mx-auto text-primary mb-1" /><p className="text-sm font-bold">{bc.duration}</p><p className="text-[10px] text-muted-foreground">Duration</p></CardContent></Card>
          <Card className="border-border"><CardContent className="p-3 text-center"><Users className="w-4 h-4 mx-auto text-primary mb-1" /><p className="text-sm font-bold">{bc.members}/{bc.maxMembers}</p><p className="text-[10px] text-muted-foreground">Members</p></CardContent></Card>
          <Card className="border-border"><CardContent className="p-3 text-center"><Calendar className="w-4 h-4 mx-auto text-primary mb-1" /><p className="text-sm font-bold">{bc.startDate}</p><p className="text-[10px] text-muted-foreground">Starts</p></CardContent></Card>
        </div>

        {bc.schedule.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-semibold text-sm text-foreground">Weekly Schedule</h2>
            <div className="space-y-1.5">
              {bc.schedule.map((day, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 bg-card border border-border rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{i + 1}</div>
                  <span className="text-sm text-foreground">{day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bc.features.length > 0 && (
          <div className="space-y-2">
            <h2 className="font-semibold text-sm text-foreground">What's Included</h2>
            <div className="space-y-1.5">
              {bc.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-foreground">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bc.coachNote && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm text-primary mb-1">Coach Lee's Note</h3>
              <p className="text-sm text-muted-foreground italic leading-relaxed">"{bc.coachNote}"</p>
            </CardContent>
          </Card>
        )}

        <Button className={`w-full h-12 font-semibold ${joined ? "bg-secondary text-foreground border border-border" : "bg-primary text-primary-foreground"}`} onClick={() => handleJoin(bc.id)} data-testid="button-join-bootcamp">
          {joined ? (bc.status === "active" ? "Leave Bootcamp" : "Leave Waitlist") : (bc.status === "active" ? "Join Bootcamp" : "Join Waitlist")}
        </Button>
      </div>
    );
  }

  const activeBootcamps = bootcamps.filter(bc => bc.status === "active");
  const upcomingBootcamps = bootcamps.filter(bc => bc.status === "upcoming");

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/community"><Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-primary">Bootcamps</h1>
            <p className="text-sm text-muted-foreground">Focused seasonal programs</p>
          </div>
        </div>
        {isCoach && (
          <Button size="sm" className="bg-primary text-primary-foreground gap-1" onClick={openCreate} data-testid="button-create-bootcamp">
            <Plus className="w-4 h-4" /> New
          </Button>
        )}
      </header>

      {activeBootcamps.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Currently Active</h2>
          {activeBootcamps.map(bc => (
            <Card key={bc.id} className="border-border shadow-sm overflow-hidden border-t-4 border-t-emerald-500" data-testid={`card-bootcamp-${bc.id}`}>
              <CardContent className="p-0">
                <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-bold text-xl text-foreground">{bc.title}</h3>
                    <div className="flex items-center gap-1">
                      {isCoach && (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(bc)} data-testid={`button-edit-bootcamp-${bc.id}`}><Edit2 className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(bc.id)} data-testid={`button-delete-bootcamp-${bc.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-[90%]">{bc.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-medium text-foreground"><span>Your Progress</span><span>{bc.progress}%</span></div>
                    <Progress value={bc.progress} className="h-2 bg-emerald-500/20 [&>div]:bg-emerald-500" />
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {bc.members} Members</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {bc.duration}</span>
                  </div>
                </div>
                <div className="p-4 bg-card border-t border-border flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (<div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground z-10">User</div>))}
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-[10px] font-medium text-foreground z-0">+{bc.members - 4}</div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs font-medium border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" onClick={() => setSelectedBootcamp(bc)} data-testid={`button-view-bootcamp-${bc.id}`}>View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {upcomingBootcamps.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-border">
          <h2 className="font-semibold text-lg text-foreground">Upcoming Bootcamps</h2>
          {upcomingBootcamps.map(bc => (
            <Card key={bc.id} className="border-border shadow-sm" data-testid={`card-bootcamp-${bc.id}`}>
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><Target className="w-6 h-6" /></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base">{bc.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{bc.description}</p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="font-medium text-primary">Starts {bc.startDate}</span>
                          <span>{bc.duration}</span>
                          <span>{bc.members}/{bc.maxMembers} spots</span>
                        </div>
                      </div>
                      {isCoach && (
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(bc)} data-testid={`button-edit-bootcamp-${bc.id}`}><Edit2 className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(bc.id)} data-testid={`button-delete-bootcamp-${bc.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium" onClick={() => handleJoin(bc.id)} data-testid={`button-join-bootcamp-${bc.id}`}>
                    {joinedIds.has(bc.id) ? "Leave Waitlist" : "Join Waitlist"}
                  </Button>
                  <Button variant="outline" className="border-border" onClick={() => setSelectedBootcamp(bc)} data-testid={`button-view-bootcamp-${bc.id}`}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md w-[95vw] rounded-xl p-5 max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingBootcamp ? "Edit Bootcamp" : "Create Bootcamp"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g. Spring Strength Block" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} data-testid="input-bootcamp-title" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What's this bootcamp about?" rows={3} className="resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} data-testid="input-bootcamp-desc" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Duration</Label><Input placeholder="8 weeks" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} data-testid="input-bootcamp-duration" /></div>
              <div className="space-y-2"><Label>Starts</Label><Input placeholder="Sep 1" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} data-testid="input-bootcamp-start" /></div>
              <div className="space-y-2"><Label>Max</Label><Input type="number" placeholder="40" value={formData.maxMembers} onChange={e => setFormData({ ...formData, maxMembers: e.target.value })} data-testid="input-bootcamp-max" /></div>
            </div>
            <div className="space-y-2"><Label>Weekly Schedule (one day per line)</Label><Textarea placeholder="Mon: Upper Body&#10;Tue: HIIT&#10;Wed: Lower Body" rows={4} className="resize-none" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} data-testid="input-bootcamp-schedule" /></div>
            <div className="space-y-2"><Label>Features (one per line)</Label><Textarea placeholder="Custom nutrition plan&#10;Weekly check-ins&#10;Private group chat" rows={3} className="resize-none" value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })} data-testid="input-bootcamp-features" /></div>
            <div className="space-y-2"><Label>Coach Note</Label><Textarea placeholder="Motivational message for participants..." rows={2} className="resize-none" value={formData.coachNote} onChange={e => setFormData({ ...formData, coachNote: e.target.value })} data-testid="input-bootcamp-note" /></div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave} data-testid="button-save-bootcamp">{editingBootcamp ? "Save Changes" : "Create Bootcamp"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
