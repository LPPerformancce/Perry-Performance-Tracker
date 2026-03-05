import { Settings, Award, Ruler, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="py-2 flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-foreground">Profile</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center border-2 border-primary/50 relative">
          <span className="font-display font-bold text-2xl text-primary">LP</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
            <Award className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl">Lee Perry</h2>
          <p className="text-sm text-muted-foreground">Pro Member</p>
          <div className="flex gap-4 mt-2">
            <div className="text-xs">
              <span className="font-bold text-foreground">142</span> <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="text-xs">
              <span className="font-bold text-foreground">89</span> <span className="text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-semibold uppercase tracking-wide">
          Edit Profile
        </Button>
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-semibold uppercase tracking-wide gap-2">
          <Share2 className="w-4 h-4" /> Share Profile
        </Button>
      </div>

      <section className="mt-8 space-y-4">
        <h3 className="font-display font-bold text-xl uppercase tracking-wider text-muted-foreground">Stats & Records</h3>
        
        <div className="grid gap-3">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Personal Records</h4>
                  <p className="text-xs text-muted-foreground">12 PRs logged</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Body Measurements</h4>
                  <p className="text-xs text-muted-foreground">Updated 1w ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}