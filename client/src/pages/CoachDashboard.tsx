import { Users, FileText, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CoachDashboard() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Coach Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage clients and programs</p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary text-primary-foreground border-none shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-1">
            <Users className="w-6 h-6 mb-1 opacity-80" />
            <div className="text-2xl font-display font-bold">24</div>
            <div className="text-xs font-medium text-primary-foreground/80">Active Clients</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center text-center gap-1">
            <FileText className="w-6 h-6 mb-1 text-muted-foreground" />
            <div className="text-2xl font-display font-bold">12</div>
            <div className="text-xs font-medium text-muted-foreground">Active Programs</div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Client Management</h2>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> Invite
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-9 bg-card border-border shadow-sm h-10"
          />
        </div>

        <div className="space-y-2">
          {[
            { name: "Sarah Jenkins", plan: "Foundation v2", lastActive: "Today", status: "good" },
            { name: "Michael Chen", plan: "Summer Prep '24", lastActive: "Yesterday", status: "good" },
            { name: "Emma Watson", plan: "Hypertrophy PPL", lastActive: "3 days ago", status: "warning" },
          ].map((client, i) => (
            <Card key={i} className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{client.name}</h4>
                    <p className="text-xs text-muted-foreground">{client.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Active {client.lastActive}</div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] bg-secondary text-secondary-foreground">
                    Assign Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Program Builder</h2>
          <Button size="sm" className="h-8 text-xs gap-1 bg-primary text-primary-foreground">
            <Plus className="w-3.5 h-3.5" /> Create New
          </Button>
        </div>

        <div className="grid gap-3">
          <Card className="border-border border-l-4 border-l-primary shadow-sm cursor-pointer hover:bg-secondary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Foundation for Professionals</h3>
                <p className="text-xs text-muted-foreground mt-1">3 days/week • 8 weeks</p>
              </div>
              <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                14 Assigned
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border border-l-4 border-l-primary shadow-sm cursor-pointer hover:bg-secondary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Desk-Worker Posture Fix</h3>
                <p className="text-xs text-muted-foreground mt-1">2 days/week • Mobility focus</p>
              </div>
              <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                8 Assigned
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}