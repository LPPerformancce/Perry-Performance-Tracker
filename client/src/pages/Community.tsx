import { Link } from "wouter";
import { MessageSquare, Heart, Share2, Flame, Target, Users as UsersIcon, Camera, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Community() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Community Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect, share, and grow together</p>
        </div>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        <Link href="/challenges">
          <Card className="min-w-[120px] bg-gradient-to-br from-card to-secondary/50 border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Weekly<br/>Challenges</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/bootcamps">
          <Card className="min-w-[120px] bg-gradient-to-br from-card to-secondary/50 border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Seasonal<br/>Bootcamps</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/friends">
          <Card className="min-w-[120px] bg-gradient-to-br from-card to-secondary/50 border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <UsersIcon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Connect<br/>Friends</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/messages">
          <Card className="min-w-[120px] bg-gradient-to-br from-card to-secondary/50 border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Group<br/>Chat</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12 bg-card border-border shadow-sm text-foreground flex items-center gap-2 justify-start px-4">
          <Camera className="w-4 h-4 text-primary" />
          <span className="font-medium text-xs">Share Photo</span>
        </Button>
        <Button variant="outline" className="h-12 bg-card border-border shadow-sm text-foreground flex items-center gap-2 justify-start px-4">
          <ChefHat className="w-4 h-4 text-primary" />
          <span className="font-medium text-xs">Share Recipe</span>
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Community Feed</h2>

        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">James Davis</h4>
              <p className="text-xs text-muted-foreground">2 hours ago • Foundation Program</p>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm leading-relaxed mb-3">
              Finally hit a new PR on my deadlift today! 225lbs for 5 reps. It's been a long road back to training after my desk job wrecked my lower back, but the steady progression is working.
            </p>
            <div className="bg-secondary/50 rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Deadlift (Barbell)</span>
                <span className="font-bold text-primary">225 lbs × 5</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Personal Record 🏆</div>
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t border-border flex gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2">
              <Heart className="w-4 h-4 mr-1.5" /> 12
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2">
              <MessageSquare className="w-4 h-4 mr-1.5" /> 4
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2 ml-auto">
              <Share2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary">LP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">Coach Lee</h4>
                <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-medium">Admin</span>
              </div>
              <p className="text-xs text-muted-foreground">Yesterday • Announcement</p>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm leading-relaxed">
              Great work everyone on the mobility challenge this week! A reminder that recovery is just as important as the stimulus. Make sure you're getting your protein in.
            </p>
          </CardContent>
          <CardFooter className="p-3 border-t border-border flex gap-4">
            <Button variant="ghost" size="sm" className="text-primary font-medium h-8 px-2">
              <Heart className="w-4 h-4 mr-1.5 fill-current" /> 24
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2">
              <MessageSquare className="w-4 h-4 mr-1.5" /> 8
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}