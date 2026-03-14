import { ArrowLeft, Target, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Bootcamps() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center gap-3">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Bootcamps</h1>
          <p className="text-sm text-muted-foreground">Focused seasonal programs</p>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Currently Active
        </h2>

        <Card className="border-border shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
          <CardContent className="p-0">
            <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-transparent">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display font-bold text-xl text-foreground">Summer Prep '24</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Week 3 of 8</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-[90%]">
                8-week intensive focusing on leaning out while maintaining the strength we built over winter.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-medium text-foreground">
                  <span>Your Progress</span>
                  <span>35%</span>
                </div>
                <Progress value={35} className="h-2 bg-emerald-500/20 [&>div]:bg-emerald-500" />
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> 42 Members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Ends Aug 15
                </span>
              </div>
            </div>
            <div className="p-4 bg-card border-t border-border flex items-center justify-between">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground z-10">
                     User
                   </div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-[10px] font-medium text-foreground z-0">
                   +38
                 </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs font-medium border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4 pt-4 border-t border-border">
        <h2 className="font-semibold text-lg text-foreground">Upcoming Bootcamps</h2>
        
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Autumn Strength Phase</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Transition back to heavy lifting. Focus on the big three lifts and building dense muscle.
                </p>
                <p className="text-xs font-medium text-primary mt-2">Starts September 1st</p>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              Join Waitlist
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}