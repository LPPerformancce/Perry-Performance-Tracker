import { Activity, TrendingUp, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold uppercase tracking-wider text-primary">Lee Perry</h1>
          <p className="text-sm text-muted-foreground font-medium tracking-wide">PERFORMANCE</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-primary/30">
          <span className="font-display font-bold text-primary">LP</span>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Protocol</h2>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary">
            View Calendar <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <Card className="bg-gradient-to-br from-card to-background border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase mb-1 block">Scheduled</span>
                <h3 className="text-xl font-display font-bold">Hypertrophy: Pull</h3>
              </div>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              6 Exercises • ~65 mins • RPE 8 Target
            </div>
            <Button className="w-full font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90">
              Start Workout
            </Button>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-1">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold">12</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Workouts</div>
            <div className="text-[10px] text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-1">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold">24.5k</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Volume (lbs)</div>
            <div className="text-[10px] text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold font-display text-lg leading-tight">Strength: Push</h4>
                  <p className="text-xs text-muted-foreground">Yesterday • 1h 15m • 18,200 lbs</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}