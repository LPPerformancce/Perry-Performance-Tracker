import { Activity, TrendingUp, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Lee Perry</h1>
          <p className="text-sm text-muted-foreground font-medium tracking-wide">PERFORMANCE</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border shadow-sm">
          <span className="font-display font-semibold text-primary">LP</span>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Protocol</h2>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary font-medium">
            View Calendar <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <Card className="bg-white border-border shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-primary/80 tracking-wider uppercase mb-1 block">Scheduled</span>
                <h3 className="text-xl font-display font-bold text-foreground">Foundation: Full Body</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              5 Exercises • ~45 mins • Steady Pace
            </div>
            <Button 
              onClick={() => setLocation('/workout/active/foundation-1')}
              className="w-full font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
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
            <div className="text-2xl font-display font-semibold text-foreground">8</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Sessions</div>
            <div className="text-[10px] text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-1">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-display font-semibold text-foreground">18k</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Volume (lbs)</div>
            <div className="text-[10px] text-muted-foreground">This Week</div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { name: "Foundation: Upper", time: "Yesterday", duration: "45m", vol: "8,500 lbs" },
            { name: "Mobility & Core", time: "Wed", duration: "20m", vol: "Bodyweight" },
            { name: "Foundation: Lower", time: "Mon", duration: "50m", vol: "12,200 lbs" }
          ].map((activity, i) => (
            <Card key={i} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-muted-foreground border border-border">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">{activity.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time} • {activity.duration} • {activity.vol}</p>
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