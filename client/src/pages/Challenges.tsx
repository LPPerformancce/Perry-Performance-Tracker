import { ArrowLeft, Trophy, CheckCircle2, Circle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Challenges() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center gap-3">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Challenges</h1>
          <p className="text-sm text-muted-foreground">Weekly goals to keep you motivated</p>
        </div>
      </header>

      <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-semibold text-primary-foreground/80 tracking-wider uppercase mb-1 block">Active This Week</span>
              <h2 className="text-xl font-display font-bold">The Core Consistency</h2>
            </div>
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          
          <p className="text-sm text-primary-foreground/90 mb-6 leading-relaxed">
            Complete 3 dedicated core sessions this week (min 10 mins each). Building a strong foundation prevents desk-job back pain.
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progress</span>
              <span>2 / 3 Sessions</span>
            </div>
            <Progress value={66} className="h-2 bg-primary-foreground/20 [&>div]:bg-white" />
          </div>
          
          <div className="mt-6 flex justify-between gap-3">
            <div className="bg-white/10 rounded-lg p-3 flex-1 flex flex-col items-center justify-center border border-white/20">
              <CheckCircle2 className="w-5 h-5 mb-1 text-white" />
              <span className="text-xs font-medium">Mon</span>
            </div>
            <div className="bg-white/10 rounded-lg p-3 flex-1 flex flex-col items-center justify-center border border-white/20">
              <CheckCircle2 className="w-5 h-5 mb-1 text-white" />
              <span className="text-xs font-medium">Wed</span>
            </div>
            <div className="bg-black/20 rounded-lg p-3 flex-1 flex flex-col items-center justify-center border border-black/10">
              <Circle className="w-5 h-5 mb-1 text-white/50" />
              <span className="text-xs font-medium text-white/70">Fri</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Past Challenges</h3>
        <div className="space-y-3">
          {[
            { title: "Hydration Hero", desc: "Drink 3L of water for 7 days", status: "completed", date: "Last Week" },
            { title: "Mobility Master", desc: "Daily 15m stretching", status: "completed", date: "2 Weeks Ago" },
            { title: "Sleep Optimiser", desc: "7+ hours sleep for 5 days", status: "missed", date: "3 Weeks Ago" },
          ].map((challenge, i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-foreground">{challenge.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{challenge.desc}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  {challenge.status === "completed" ? (
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md mb-1">
                      Missed
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{challenge.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}