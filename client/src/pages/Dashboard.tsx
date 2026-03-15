import { Activity, TrendingUp, Calendar as CalendarIcon, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCurrentUser } from "@/lib/userContext";
import { useQuery } from "@tanstack/react-query";
import type { WorkoutSession } from "@shared/schema";
import { LPLogo } from "@/components/ui/LPLogo";
import AnatomyBodyMap from "@/components/ui/AnatomyBodyMap";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { currentUser } = useCurrentUser();

  const { data: sessions = [] } = useQuery<WorkoutSession[]>({
    queryKey: ["/api/workout-sessions/user", String(currentUser?.id)],
    enabled: !!currentUser,
  });

  const recentSessions = sessions.slice(0, 3);
  const thisMonthSessions = sessions.filter(s => {
    if (!s.completedAt) return false;
    const d = new Date(s.completedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const weekVolume = sessions
    .filter(s => {
      if (!s.completedAt) return false;
      const d = new Date(s.completedAt);
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      return d >= weekAgo;
    })
    .reduce((acc, s) => acc + (s.totalVolume || 0), 0);

  const formatVolume = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : String(v);

  const formatTimeAgo = (date: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (days < 7) return dayNames[d.getDay()];
    return `${days}d ago`;
  };

  const formatDuration = (s: number | null) => {
    if (!s) return "";
    const m = Math.floor(s / 60);
    return `${m}m`;
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LPLogo size="sm" />
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-primary" data-testid="text-app-title">LP Performance</h1>
            <p className="text-[10px] text-muted-foreground font-semibold tracking-[0.2em] uppercase">Strength for Professionals</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-sm cursor-pointer" onClick={() => setLocation('/profile')} data-testid="link-profile-avatar">
          <span className="font-display font-semibold text-primary">{currentUser?.avatarInitials || "?"}</span>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Protocol</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs text-primary font-medium"
            onClick={() => setLocation('/calendar')}
            data-testid="link-calendar"
          >
            View Calendar <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <Card className="bg-card border-border shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-primary/80 tracking-wider uppercase mb-1 block">Scheduled</span>
                <h3 className="text-xl font-display font-bold text-foreground" data-testid="text-today-workout">Foundation: Full Body</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              5 Exercises &bull; ~45 mins &bull; Steady Pace
            </div>
            <Button 
              onClick={() => setLocation('/workout/active/foundation-1')}
              className="w-full font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              data-testid="button-start-session"
            >
              Start Session
            </Button>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-1">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-display font-semibold text-foreground" data-testid="text-month-sessions">{thisMonthSessions.length || sessions.length}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Sessions</div>
            <div className="text-[10px] text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-1">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-display font-semibold text-foreground" data-testid="text-week-volume">{formatVolume(weekVolume || 8500)}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Volume (lbs)</div>
            <div className="text-[10px] text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Weekly Body Map</h2>
          <Button variant="link" size="sm" className="h-6 px-0 text-[10px] text-primary" onClick={() => setLocation('/workout')}>Target Fresh Muscles →</Button>
        </div>
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <AnatomyBodyMap
              trainedMuscles={["Chest", "Triceps", "Shoulders", "Core"]}
            />
            <div className="flex gap-4 mt-4 pt-3 border-t border-border/50">
              <div className="flex-1">
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Trained This Week</h3>
                <div className="flex flex-wrap gap-1.5">
                  {["Chest", "Triceps", "Shoulders", "Core"].map(m => (
                    <span key={m} className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-medium border border-primary/30">{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fresh</h3>
                <div className="flex flex-wrap gap-1.5">
                  {["Back", "Biceps", "Quads", "Hamstrings", "Glutes"].map(m => (
                    <span key={m} className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-medium border border-border">{m}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <span className="text-[10px] text-muted-foreground">Volume: {formatVolume(weekVolume || 8500)} lbs this week</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          <Card className="bg-amber-500/10 border-amber-500/30 shadow-sm cursor-pointer" onClick={() => setLocation('/nutrition')}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-600 border border-amber-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">Nutrition Tracking Paused</h4>
                <p className="text-xs text-muted-foreground mt-0.5">You haven't logged meals in 3 days. Your last successful tracking streak aligned with great workout performance. Tap to repeat your favorite meals.</p>
              </div>
            </CardContent>
          </Card>

          {(recentSessions.length > 0 ? recentSessions : [
            { id: 0, title: "Foundation: Upper", completedAt: new Date(Date.now() - 86400000).toISOString(), durationSeconds: 2700, totalVolume: 8500 },
            { id: 0, title: "Mobility & Core", completedAt: new Date(Date.now() - 3 * 86400000).toISOString(), durationSeconds: 1200, totalVolume: 0 },
            { id: 0, title: "Foundation: Lower", completedAt: new Date(Date.now() - 5 * 86400000).toISOString(), durationSeconds: 3000, totalVolume: 12200 },
          ] as any[]).map((session: any, i: number) => (
            <Card key={session.id || i} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-session-${session.id || i}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-muted-foreground border border-border">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">{session.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimeAgo(session.completedAt || session.startedAt)} &bull; {formatDuration(session.durationSeconds)} &bull; {session.totalVolume ? `${session.totalVolume.toLocaleString()} lbs` : "Bodyweight"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
