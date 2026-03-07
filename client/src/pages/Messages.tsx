import { Search, ChevronRight, MessageSquare, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Messages() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2">
        <h1 className="text-2xl font-display font-semibold text-primary">Coach Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Direct support and guidance</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search messages..." 
          className="pl-9 bg-card border-border shadow-sm h-11 rounded-lg"
        />
      </div>

      <div className="space-y-3">
        <Card className="border-primary/20 shadow-sm bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src="https://i.pravatar.cc/150?u=coach" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">LP</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-base truncate">Lee Perry (Coach)</h3>
                <span className="text-xs text-primary font-medium whitespace-nowrap ml-2">10:42 AM</span>
              </div>
              <p className="text-sm text-muted-foreground truncate font-medium">
                Great job on the squats yesterday. Let's try...
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          </CardContent>
        </Card>

        <h3 className="text-sm font-semibold text-muted-foreground mt-6 mb-2 uppercase tracking-wider">Group Channels</h3>

        <Card className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-base truncate">Summer Bootcamp Q3</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">Yesterday</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium text-foreground">Sarah:</span> Has anyone tried the new protein...
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-base truncate">General Q&A</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">Tue</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium text-foreground">Coach Lee:</span> Check out this week's mobility routine.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Mocking a chat view when clicked */}
      <div className="mt-8 border border-border rounded-xl shadow-sm bg-card overflow-hidden">
        <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">LP</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm">Lee Perry</h4>
            <p className="text-xs text-muted-foreground">Typically replies in a few hours</p>
          </div>
        </div>
        <div className="p-4 space-y-4 bg-background/50 h-[300px] flex flex-col justify-end">
          <div className="flex gap-3">
             <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">LP</AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%]">
              <p className="text-sm">Hi there! I reviewed your last session. Form looks much better on those deadlifts.</p>
              <p className="text-[10px] text-muted-foreground mt-1 text-right">Yesterday 4:30 PM</p>
            </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 shadow-sm max-w-[85%]">
              <p className="text-sm">Thanks Lee! I focused on keeping my chest up like you said. Should we bump the weight next time?</p>
              <p className="text-[10px] text-primary-foreground/70 mt-1 text-right">Yesterday 5:15 PM</p>
            </div>
          </div>
           <div className="flex gap-3">
             <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">LP</AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%]">
              <p className="text-sm">Great job on the squats yesterday. Let's try adding 5lbs to your working sets next week, but keep the RPE around 8.</p>
              <p className="text-[10px] text-muted-foreground mt-1 text-right">10:42 AM</p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-card border-t border-border flex gap-2">
          <Input placeholder="Type a message..." className="bg-background" />
          <Button className="bg-primary">Send</Button>
        </div>
      </div>
    </div>
  );
}