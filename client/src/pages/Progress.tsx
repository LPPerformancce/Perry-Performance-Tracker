import { ArrowLeft, TrendingUp, Calendar as CalendarIcon, Activity, Flame, Ruler, Target } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const volumeData = [
  { name: 'Week 1', volume: 12000 },
  { name: 'Week 2', volume: 14500 },
  { name: 'Week 3', volume: 13800 },
  { name: 'Week 4', volume: 16200 },
  { name: 'Week 5', volume: 18000 },
  { name: 'Week 6', volume: 19500 },
];

const bodyPartVolume = [
  { subject: 'Chest', volume: 120, fullMark: 150 },
  { subject: 'Back', volume: 98, fullMark: 150 },
  { subject: 'Shoulders', volume: 86, fullMark: 150 },
  { subject: 'Quads', volume: 99, fullMark: 150 },
  { subject: 'Hamstrings', volume: 85, fullMark: 150 },
  { subject: 'Core', volume: 65, fullMark: 150 },
];

const weeklySets = [
  { name: 'Mon', sets: 18 },
  { name: 'Tue', sets: 0 },
  { name: 'Wed', sets: 22 },
  { name: 'Thu', sets: 0 },
  { name: 'Fri', sets: 16 },
  { name: 'Sat', sets: 0 },
  { name: 'Sun', sets: 0 },
];

const consistencyData = [
  { day: 'M', done: true },
  { day: 'T', done: false },
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: false },
  { day: 'S', done: true },
  { day: 'S', done: false },
];

export default function Progress() {
  useEffect(() => {
    // Handle hash scrolling if present in the URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // Wait for animation to complete
    }
  }, []);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Progress & Stats</h1>
          <p className="text-sm text-muted-foreground">Track your performance over time</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-1">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-1">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-2xl font-display font-bold text-foreground">4 Weeks</div>
            <div className="text-xs font-medium text-muted-foreground">Current Streak</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-1">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-display font-bold text-foreground">12</div>
            <div className="text-xs font-medium text-muted-foreground">All-Time PRs</div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4" id="stats">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Training Volume
          </h2>
          <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">Last 6 Weeks</span>
        </div>
        
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 pt-6">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" /> Weekly Consistency
        </h2>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">This Week</span>
              <span className="text-sm font-bold text-emerald-600">3/4 Sessions</span>
            </div>
            <div className="flex justify-between gap-2 mb-6">
              {consistencyData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${d.done ? 'bg-emerald-500 text-white shadow-sm' : 'bg-secondary text-muted-foreground'}`}>
                    {d.day}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySets}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                  />
                  <Bar dataKey="sets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Total working sets per day</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Muscle Group Distribution
          </h2>
        </div>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={bodyPartVolume}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Volume" dataKey="volume" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Relative volume distribution across muscle groups this week.</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" id="measurements">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" /> Body Metrics
          </h2>
          <Button variant="outline" size="sm" className="h-8 text-xs border-primary/20 text-primary" onClick={() => import("sonner").then(m => m.toast.info("Log Metrics", { description: "Opening measurement input form..." }))}>Log New</Button>
        </div>
        
        {/* Photo Progress */}
        <Card className="border-border shadow-sm mb-4" id="photos">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm">Recent Photos</h3>
              <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary">Compare All</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              <div className="w-24 h-32 rounded-lg bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 hover:text-primary transition-colors flex-shrink-0 relative overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      import("sonner").then(m => m.toast.success("Photo uploaded!", { description: "Progress photo added to your timeline." }));
                    }
                  }}
                  title="Upload progress photo"
                />
                <span className="text-xl mb-1">+</span>
                <span className="text-[10px] font-medium">Add Photo</span>
              </div>
              <div className="w-24 h-32 rounded-lg bg-secondary overflow-hidden flex-shrink-0 relative border border-border">
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale" alt="progress" />
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur text-[10px] p-1 text-center font-medium border-t border-border">
                  Oct 15
                </div>
              </div>
              <div className="w-24 h-32 rounded-lg bg-secondary overflow-hidden flex-shrink-0 relative border border-primary/50">
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="progress" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[10px] p-1 text-center font-medium">
                  Current
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {[
            { label: "Body Weight", current: "185.4 lbs", change: "-1.2 lbs", trend: "down" },
            { label: "Body Fat %", current: "18.5%", change: "-0.5%", trend: "down" },
            { label: "Waist", current: "34 in", change: "-0.5 in", trend: "down" }
          ].map((metric, i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-foreground">{metric.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Last updated 2 days ago</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base">{metric.current}</div>
                  <div className="text-xs font-medium text-emerald-600">{metric.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}