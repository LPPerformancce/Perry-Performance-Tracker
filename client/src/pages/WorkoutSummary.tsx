import { ArrowLeft, Share2, Award, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const muscleData = [
  { subject: 'Chest', volume: 120, fullMark: 150 },
  { subject: 'Back', volume: 98, fullMark: 150 },
  { subject: 'Shoulders', volume: 86, fullMark: 150 },
  { subject: 'Quads', volume: 99, fullMark: 150 },
  { subject: 'Hamstrings', volume: 85, fullMark: 150 },
  { subject: 'Core', volume: 65, fullMark: 150 },
];

const intensityData = [
  { name: 'Ex 1', rpe: 7 },
  { name: 'Ex 2', rpe: 8 },
  { name: 'Ex 3', rpe: 7.5 },
  { name: 'Ex 4', rpe: 9 },
  { name: 'Ex 5', rpe: 8.5 },
];

export default function WorkoutSummary() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
          <Share2 className="w-5 h-5" />
        </Button>
      </header>

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-display font-bold text-primary">Great Work!</h1>
        <p className="text-muted-foreground">Foundation: Full Body completed.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-1">
            <div className="text-xl font-display font-bold text-foreground">45m</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Time</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-1">
            <div className="text-xl font-display font-bold text-foreground">8.2k</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Vol (lbs)</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/20 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-1">
            <div className="text-xl font-display font-bold text-primary">2</div>
            <div className="text-[10px] font-medium text-primary/80 uppercase tracking-wider">New PRs</div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4 pt-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Muscle Group Focus
        </h2>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={muscleData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Volume" dataKey="volume" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Chest and Quads took the most load today.</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Intensity (RPE)
        </h2>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 pt-6">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intensityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                  />
                  <Bar dataKey="rpe" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="pt-6">
        <Button 
          className="w-full h-12 text-md font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setLocation('/progress')}
        >
          View Full Analytics
        </Button>
      </section>
    </div>
  );
}