import { useState } from "react";
import { ArrowLeft, Trophy, CheckCircle2, Circle, Plus, Edit2, Trash2, X, Calendar, Target } from "lucide-react";
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

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  target: number;
  unit: string;
  progress: number;
  status: "active" | "completed" | "missed" | "upcoming";
  startDate: string;
  endDate: string;
  participants: number;
}

const INITIAL_CHALLENGES: Challenge[] = [
  { id: 1, title: "The Core Consistency", description: "Complete 3 dedicated core sessions this week (min 10 mins each). Building a strong foundation prevents desk-job back pain.", type: "weekly", target: 3, unit: "Sessions", progress: 2, status: "active", startDate: "This Week", endDate: "Sunday", participants: 28 },
  { id: 2, title: "Daily 10K Steps", description: "Hit 10,000 steps every day this week. Counteract sitting all day by staying active throughout.", type: "daily", target: 10000, unit: "Steps", progress: 7500, status: "active", startDate: "Today", endDate: "Tonight", participants: 42 },
  { id: 3, title: "Monthly Protein Goal", description: "Hit your protein target (at least 80% of goal) for 25 out of 30 days this month.", type: "monthly", target: 25, unit: "Days", progress: 14, status: "active", startDate: "March 1", endDate: "March 31", participants: 35 },
  { id: 4, title: "Hydration Hero", description: "Drink 3L of water for 7 consecutive days. Staying hydrated improves focus and recovery.", type: "weekly", target: 7, unit: "Days", progress: 7, status: "completed", startDate: "Last Week", endDate: "Completed", participants: 31 },
  { id: 5, title: "Mobility Master", description: "Complete a 15-minute mobility routine every day for a week. Target hips, thoracic spine, and ankles.", type: "weekly", target: 7, unit: "Days", progress: 7, status: "completed", startDate: "2 Weeks Ago", endDate: "Completed", participants: 25 },
  { id: 6, title: "Sleep Optimiser", description: "Get 7+ hours of sleep for 5 out of 7 days this week. Track using your phone's bedtime feature.", type: "weekly", target: 5, unit: "Days", progress: 3, status: "missed", startDate: "3 Weeks Ago", endDate: "Missed", participants: 20 },
  { id: 7, title: "Push-Up Progress", description: "Do 100 push-ups total across the week. Any variation counts — standard, incline, knee, diamond.", type: "weekly", target: 100, unit: "Push-ups", progress: 0, status: "upcoming", startDate: "Next Week", endDate: "Next Sunday", participants: 0 },
];

export default function Challenges() {
  const { currentUser } = useCurrentUser();
  const isCoach = currentUser?.role === "coach";
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "past" | "upcoming">("active");
  const [formData, setFormData] = useState({ title: "", description: "", type: "weekly" as Challenge["type"], target: "", unit: "", startDate: "", endDate: "" });

  const activeChallenges = challenges.filter(c => c.status === "active");
  const pastChallenges = challenges.filter(c => c.status === "completed" || c.status === "missed");
  const upcomingChallenges = challenges.filter(c => c.status === "upcoming");

  const openEdit = (ch: Challenge) => {
    setEditingChallenge(ch);
    setFormData({ title: ch.title, description: ch.description, type: ch.type, target: String(ch.target), unit: ch.unit, startDate: ch.startDate, endDate: ch.endDate });
    setShowCreateDialog(true);
  };

  const openCreate = () => {
    setEditingChallenge(null);
    setFormData({ title: "", description: "", type: "weekly", target: "", unit: "Sessions", startDate: "", endDate: "" });
    setShowCreateDialog(true);
  };

  const handleSave = () => {
    if (!formData.title.trim()) { toast.error("Give the challenge a name"); return; }
    if (editingChallenge) {
      setChallenges(prev => prev.map(c => c.id === editingChallenge.id ? { ...c, title: formData.title, description: formData.description, type: formData.type, target: Number(formData.target) || c.target, unit: formData.unit || c.unit, startDate: formData.startDate || c.startDate, endDate: formData.endDate || c.endDate } : c));
      toast.success("Challenge updated");
    } else {
      const newCh: Challenge = { id: Date.now(), title: formData.title, description: formData.description, type: formData.type, target: Number(formData.target) || 1, unit: formData.unit || "times", progress: 0, status: "upcoming", startDate: formData.startDate || "Upcoming", endDate: formData.endDate || "TBD", participants: 0 };
      setChallenges(prev => [...prev, newCh]);
      toast.success("Challenge created");
    }
    setShowCreateDialog(false);
  };

  const handleDelete = (id: number) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    toast.success("Challenge removed");
  };

  const renderChallengeCard = (ch: Challenge, showControls = false) => {
    const pct = ch.target > 0 ? Math.round((ch.progress / ch.target) * 100) : 0;
    return (
      <Card key={ch.id} className={`border-border shadow-sm ${ch.status === "active" && ch.type === "weekly" ? "border-t-4 border-t-primary" : ""}`} data-testid={`card-challenge-${ch.id}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  ch.type === "daily" ? "bg-blue-500/20 text-blue-400" :
                  ch.type === "weekly" ? "bg-primary/20 text-primary" :
                  "bg-purple-500/20 text-purple-400"
                }`}>{ch.type}</span>
                {ch.status === "completed" && <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Done</span>}
                {ch.status === "missed" && <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Missed</span>}
                {ch.status === "upcoming" && <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Upcoming</span>}
              </div>
              <h3 className="font-semibold text-sm text-foreground">{ch.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ch.description}</p>
            </div>
            {isCoach && showControls && (
              <div className="flex gap-1 flex-shrink-0 ml-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(ch)} data-testid={`button-edit-challenge-${ch.id}`}><Edit2 className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(ch.id)} data-testid={`button-delete-challenge-${ch.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            )}
          </div>
          {ch.status === "active" && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">{ch.startDate} → {ch.endDate}</span>
                <span>{ch.progress} / {ch.target} {ch.unit}</span>
              </div>
              <Progress value={pct} className="h-2 bg-secondary [&>div]:bg-primary" />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                <span>{ch.participants} participants</span>
                <span>{pct}% complete</span>
              </div>
            </div>
          )}
          {(ch.status === "completed" || ch.status === "missed") && (
            <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
              <span>{ch.startDate}</span>
              <span>{ch.participants} participants</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 space-y-5 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/community"><Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Button></Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-primary">Challenges</h1>
            <p className="text-sm text-muted-foreground">Daily, weekly & monthly goals</p>
          </div>
        </div>
        {isCoach && (
          <Button size="sm" className="bg-primary text-primary-foreground gap-1" onClick={openCreate} data-testid="button-create-challenge">
            <Plus className="w-4 h-4" /> New
          </Button>
        )}
      </header>

      <div className="flex gap-2">
        {(["active", "past", "upcoming"] as const).map(tab => (
          <Button key={tab} variant={activeTab === tab ? "default" : "outline"} size="sm" onClick={() => setActiveTab(tab)} className={`rounded-full text-xs capitalize ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border-border"}`} data-testid={`tab-${tab}`}>
            {tab} {tab === "active" ? `(${activeChallenges.length})` : tab === "past" ? `(${pastChallenges.length})` : `(${upcomingChallenges.length})`}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {activeTab === "active" && activeChallenges.map(ch => renderChallengeCard(ch, true))}
        {activeTab === "past" && pastChallenges.map(ch => renderChallengeCard(ch, true))}
        {activeTab === "upcoming" && upcomingChallenges.map(ch => renderChallengeCard(ch, true))}
        {activeTab === "active" && activeChallenges.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">No active challenges right now.</p>}
        {activeTab === "past" && pastChallenges.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">No past challenges.</p>}
        {activeTab === "upcoming" && upcomingChallenges.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">No upcoming challenges.</p>}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md w-[95vw] rounded-xl p-5">
          <DialogHeader><DialogTitle>{editingChallenge ? "Edit Challenge" : "Create Challenge"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g. Hydration Hero" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} data-testid="input-challenge-title" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What should participants do?" rows={3} className="resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} data-testid="input-challenge-desc" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Type</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as Challenge["type"] })} data-testid="select-challenge-type"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div>
              <div className="space-y-2"><Label>Target</Label><Input type="number" placeholder="3" value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} data-testid="input-challenge-target" /></div>
              <div className="space-y-2"><Label>Unit</Label><Input placeholder="Sessions" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} data-testid="input-challenge-unit" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Start</Label><Input placeholder="e.g. Next Monday" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} data-testid="input-challenge-start" /></div>
              <div className="space-y-2"><Label>End</Label><Input placeholder="e.g. Next Sunday" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} data-testid="input-challenge-end" /></div>
            </div>
            <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave} data-testid="button-save-challenge">{editingChallenge ? "Save Changes" : "Create Challenge"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
