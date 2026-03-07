import { ArrowLeft, UserPlus, Search, Trophy, Play, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Friends() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center gap-3">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-semibold text-primary">Friends</h1>
          <p className="text-sm text-muted-foreground">Train together, stay accountable</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-primary/20 text-primary">
          <UserPlus className="w-4 h-4" /> Add
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search friends..." 
          className="pl-9 bg-card border-border shadow-sm"
        />
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recent Activity</h2>
        
        <div className="space-y-3">
          {[
            { name: "Michael Chen", initial: "MC", activity: "Completed Foundation: Upper", time: "2h ago", PRs: 1 },
            { name: "Sarah Jenkins", initial: "SJ", activity: "Started a new program", time: "5h ago", PRs: 0 },
            { name: "David Kim", initial: "DK", activity: "Completed Mobility Routine", time: "Yesterday", PRs: 0 },
          ].map((friend, i) => (
            <Card key={i} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="border border-border">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                      {friend.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-semibold text-sm text-foreground truncate">{friend.name}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{friend.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{friend.activity}</p>
                    
                    {friend.PRs > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-50 text-xs font-medium text-yellow-800 border border-yellow-100">
                        <Trophy className="w-3 h-3 text-yellow-600" />
                        Hit 1 new PR
                      </div>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <Button variant="secondary" size="sm" className="h-7 text-[10px] flex-1">High Five</Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1">View Session</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="space-y-4 pt-2 border-t border-border">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Shared Programs</h2>
        
        <Card className="bg-primary/5 border-primary/20 shadow-sm cursor-pointer hover:bg-primary/10 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <Play className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-semibold text-sm text-foreground">The 1000lb Club Prep</h4>
                 <p className="text-xs text-muted-foreground">Shared by Michael Chen</p>
               </div>
             </div>
             <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">Preview</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}