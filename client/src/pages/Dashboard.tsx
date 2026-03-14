import { Activity, TrendingUp, Calendar as CalendarIcon, ChevronRight, AlertCircle } from "lucide-react";
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
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-sm cursor-pointer" onClick={() => setLocation('/profile')}>
          <span className="font-display font-semibold text-primary">LP</span>
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
          >
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

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Weekly Body Map</h2>
        <Card className="bg-card border-border shadow-sm overflow-hidden relative">
          <CardContent className="p-0">
            <div className="flex h-48">
              {/* Abstract minimalist body map representation */}
              <div className="w-1/2 bg-secondary/50 p-4 flex flex-col justify-between border-r border-border">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Trained</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium border border-primary/30">Chest</span>
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium border border-primary/30">Triceps</span>
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium border border-primary/30">Shoulders</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Volume: 8.5k lbs</div>
                </div>
              </div>
              <div className="w-1/2 p-4 flex flex-col justify-between bg-card">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fresh</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium border border-border">Back</span>
                    <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium border border-border">Biceps</span>
                    <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium border border-border">Quads</span>
                    <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium border border-border">Hamstrings</span>
                  </div>
                </div>
                <div className="text-right">
                  <Button variant="link" size="sm" className="h-6 px-0 text-[10px] text-primary" onClick={() => setLocation('/workout')}>Target Fresh Muscles →</Button>
                </div>
              </div>
            </div>
            {/* High Quality Human Body Map */}
            <div className="absolute inset-0 pointer-events-none flex justify-center opacity-30 right-4 top-2 bottom-2">
              <svg viewBox="0 0 200 400" className="h-full w-auto">
                {/* Outline/Base Body - Male presenting, athletic build */}
                <path d="M100 20 C110 20 115 30 115 45 C115 60 108 70 100 70 C92 70 85 60 85 45 C85 30 90 20 100 20 Z" fill="none" stroke="currentColor" strokeWidth="2" /> {/* Head */}
                <path d="M85 70 Q100 80 115 70 L145 80 C155 85 160 95 160 105 L165 160 L145 160 L140 105 C140 105 130 95 115 100 L115 180 C115 200 120 250 125 380 L105 380 L100 220 L95 380 L75 380 C80 250 85 200 85 180 L85 100 C70 95 60 105 60 105 L55 160 L35 160 L40 105 C40 95 45 85 55 80 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /> {/* Body Outline */}
                
                {/* Specific Muscle Groups (Can be colored via CSS classes or props) */}
                {/* Chest (Highlighted) */}
                <path d="M85 85 C95 85 100 90 100 95 C100 90 105 85 115 85 C120 90 118 105 100 110 C82 105 80 90 85 85 Z" fill="var(--color-primary)" opacity="0.8" />
                
                {/* Shoulders / Delts (Highlighted) */}
                <path d="M65 80 C75 75 80 80 85 85 L75 105 C65 100 60 90 65 80 Z" fill="var(--color-primary)" opacity="0.8" />
                <path d="M135 80 C125 75 120 80 115 85 L125 105 C135 100 140 90 135 80 Z" fill="var(--color-primary)" opacity="0.8" />
                
                {/* Triceps (Highlighted) */}
                <path d="M58 105 L55 135 L68 135 L73 105 Z" fill="var(--color-primary)" opacity="0.8" />
                <path d="M142 105 L145 135 L132 135 L127 105 Z" fill="var(--color-primary)" opacity="0.8" />
                
                {/* Abs (Outline) */}
                <path d="M92 115 L108 115 L108 130 L92 130 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <path d="M92 135 L108 135 L108 150 L92 150 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <path d="M92 155 L108 155 L108 170 L92 170 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                
                {/* Quads (Outline) */}
                <path d="M85 190 Q95 230 80 280 L95 280 Q100 230 100 190 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <path d="M115 190 Q105 230 120 280 L105 280 Q100 230 100 190 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              </svg>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {/* Missing Food Log Alert */}
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