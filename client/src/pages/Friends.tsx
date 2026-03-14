import { ArrowLeft, UserPlus, Search, Trophy, Play, CheckCircle2, TrendingUp, Dumbbell, Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
        <Button variant="outline" size="sm" className="h-8 gap-1 border-primary/20 text-primary" onClick={() => {
          import("sonner").then(m => m.toast.info("Add Friend", { description: "Opening contacts to invite friends." }));
        }}>
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

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary mb-4">
          <TabsTrigger value="feed">Activity Feed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-4">
          <div className="space-y-3">
            {[
              { name: "Michael Chen", initial: "MC", activity: "Completed Foundation: Upper", time: "2h ago", PRs: 1, shared: true, stats: "5 exercises • 45m • 8,500 lbs total" },
              { name: "Sarah Jenkins", initial: "SJ", activity: "Started a new program", time: "5h ago", PRs: 0, shared: true, stats: "" },
              { name: "David Kim", initial: "DK", activity: "Completed Mobility Routine", time: "Yesterday", PRs: 0, shared: false, stats: "Session details hidden by user" },
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
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-xs font-medium text-primary border border-primary/20">
                          <Trophy className="w-3 h-3 text-yellow-600" />
                          Hit 1 new PR (Bench Press: 205 lbs)
                        </div>
                      )}
                      
                      <div className="mt-3 flex gap-2">
                        <Button variant="secondary" size="sm" className="h-7 text-[10px] flex-1" onClick={() => {
                          import("sonner").then(m => m.toast.success("High Five Sent!", { description: `You hyped up ${friend.name}.` }));
                        }}>High Five</Button>
                        
                        {friend.shared ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1">View Session</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md w-[95vw] rounded-xl">
                              <DialogHeader>
                                <DialogTitle className="text-lg flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-[10px]">{friend.initial}</AvatarFallback>
                                  </Avatar>
                                  {friend.name}'s Session
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Workout</span>
                                  <span className="font-medium">Foundation: Upper</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Volume</span>
                                  <span className="font-medium text-primary">8,500 lbs</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Duration</span>
                                  <span className="font-medium">45 mins</span>
                                </div>
                                
                                <div className="border-t border-border pt-4 mt-2">
                                  <h4 className="font-semibold text-sm mb-2">Key Lifts</h4>
                                  <div className="space-y-2">
                                    <div className="bg-secondary/50 p-2 rounded flex justify-between text-xs">
                                      <span>Barbell Bench Press</span>
                                      <span className="font-bold text-primary">205 lbs x 5</span>
                                    </div>
                                    <div className="bg-secondary/50 p-2 rounded flex justify-between text-xs">
                                      <span>Incline DB Press</span>
                                      <span className="font-bold">75 lbs x 8</span>
                                    </div>
                                    <div className="bg-secondary/50 p-2 rounded flex justify-between text-xs">
                                      <span>Seated Cable Row</span>
                                      <span className="font-bold">140 lbs x 10</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1 opacity-50" disabled>
                            <Lock className="w-3 h-3 mr-1" /> Private
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm mb-4">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> Weekly Volume Challenge
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Total weight moved this week</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-0.5">Your Rank</div>
                <div className="font-bold text-xl text-foreground">#3</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            {[
              { rank: 1, name: "Michael Chen", vol: "32,400 lbs", me: false },
              { rank: 2, name: "Alex Johnson", vol: "28,150 lbs", me: false },
              { rank: 3, name: "James Davis", vol: "24,500 lbs", me: true },
              { rank: 4, name: "Sarah Jenkins", vol: "19,200 lbs", me: false },
              { rank: 5, name: "David Kim", vol: "Private", me: false, hidden: true },
            ].map((user) => (
              <div key={user.rank} className={`flex items-center gap-3 p-3 rounded-lg border ${user.me ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-card border-border'}`}>
                <div className={`w-6 text-center font-bold ${user.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {user.rank}
                </div>
                <Avatar className="w-8 h-8 border border-border">
                  <AvatarFallback className={`text-[10px] ${user.me ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {user.name} {user.me && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">You</span>}
                  </div>
                </div>
                <div className={`text-sm font-semibold ${user.hidden ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                  {user.hidden ? <Lock className="w-3.5 h-3.5 inline mr-1" /> : ''}
                  {user.vol}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <section className="space-y-4 pt-4 border-t border-border">
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
             <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => {
               import("sonner").then(m => m.toast.info("Program Preview", { description: "Loading program details..." }));
             }}>Preview</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}