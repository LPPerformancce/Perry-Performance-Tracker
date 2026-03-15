import { Activity, TrendingUp, Calendar as CalendarIcon, ChevronRight, AlertCircle, Bell, Sparkles, Clock, Apple, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useCurrentUser } from "@/lib/userContext";
import { useQuery } from "@tanstack/react-query";
import type { WorkoutSession } from "@shared/schema";
import { LPLogo } from "@/components/ui/LPLogo";
import AnatomyBodyMap from "@/components/ui/AnatomyBodyMap";
import { useState, useEffect } from "react";

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

  const [dismissedTips, setDismissedTips] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("lpp-dismissed-tips") || "[]"); } catch { return []; }
  });

  const notifications = [
    { id: "morning-stretch", icon: Clock, color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/30",
      title: "Morning Mobility Reminder", description: "5 minutes of hip openers and thoracic rotations can undo 8 hours of desk damage. Try it before your coffee.", time: "8:00 AM" },
    { id: "hydration", icon: Activity, color: "text-cyan-400", bgColor: "bg-cyan-500/10 border-cyan-500/30",
      title: "Hydration Check", description: "You're 3 glasses behind your daily target. Dehydration reduces strength output by up to 25%.", time: "2:00 PM" },
    { id: "workout-reminder", icon: Bell, color: "text-primary", bgColor: "bg-primary/10 border-primary/30",
      title: "Workout Scheduled Today", description: "Foundation: Full Body is on the plan. Your best sessions happen when you start by 6 PM.", time: "4:00 PM" },
  ].filter(n => !dismissedTips.includes(n.id));

  const dailyTip = [
    "Desk warriors: Set a 45-minute timer. Stand, do 10 bodyweight squats, sit back down. Your lower back will thank you.",
    "Sleep is your #1 supplement. Aim for 7-9 hours — poor sleep can reduce testosterone by up to 15%.",
    "Protein timing matters less than total daily intake. Hit your target across all meals, don't stress about the 'anabolic window'.",
    "Walking 10 minutes after meals improves insulin sensitivity more than any supplement on the market.",
  ][new Date().getDay() % 4];

  const dismissTip = (id: string) => {
    const updated = [...dismissedTips, id];
    setDismissedTips(updated);
    localStorage.setItem("lpp-dismissed-tips", JSON.stringify(updated));
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

      {notifications.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" /> Reminders
            </h2>
            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-medium">{notifications.length}</span>
          </div>
          {notifications.map(n => (
            <Card key={n.id} className={`${n.bgColor} shadow-sm`} data-testid={`card-notification-${n.id}`}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${n.color} bg-background/30 border border-white/10`}>
                  <n.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-foreground">{n.title}</h4>
                    <button className="text-[10px] text-muted-foreground hover:text-foreground" onClick={() => dismissTip(n.id)}>✕</button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-primary uppercase tracking-wider">Coach's Daily Tip</h4>
            <p className="text-sm text-foreground/80 mt-1">{dailyTip}</p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="text-xs text-primary h-6 px-2" onClick={() => setLocation('/workout-history')} data-testid="link-workout-history">
            <History className="w-3 h-3 mr-1" /> View All
          </Button>
        </div>
        <div className="space-y-3">
          <Card className="bg-amber-500/10 border-amber-500/30 shadow-sm cursor-pointer" onClick={() => setLocation('/nutrition')}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-600 border border-amber-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">Nutrition Tracking Paused</h4>
                <p className="text-xs text-muted-foreground mt-0.5">You haven't logged meals in 3 days. Tap to scan a meal or repeat your favourites.</p>
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
