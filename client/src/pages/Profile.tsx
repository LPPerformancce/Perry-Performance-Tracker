import { Settings, Award, Ruler, Share2, Activity, Link as LinkIcon, ChevronRight, Camera, Watch, LayoutDashboard, Calendar as CalendarIcon, Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-primary">Profile</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex items-center gap-5 relative z-10">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary relative shadow-sm">
          <span className="font-display font-semibold text-2xl text-primary">JD</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
            <Award className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl text-foreground">James Davis</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Foundation Program</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-xs font-medium text-secondary-foreground border border-border">
            <Link href="/coach" className="flex items-center gap-1.5 hover:text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Coach Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-medium shadow-sm hover:border-primary/50">
          Edit Profile
        </Button>
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-medium gap-2 shadow-sm hover:border-primary/50">
          <Share2 className="w-4 h-4" /> Share Stats
        </Button>
      </div>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Device Sync</h3>
        <Card className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer bg-gradient-to-r from-card to-secondary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <Watch className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Fitness Tracker</h4>
                  <p className="text-xs text-emerald-500 font-medium flex items-center mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" /> Synced Today, 9:42 AM
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Manage
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-0.5">Steps</div>
                <div className="font-semibold text-sm">8,432</div>
              </div>
              <div className="text-center border-x border-border/50">
                <div className="text-xs text-muted-foreground mb-0.5">Active Cal</div>
                <div className="font-semibold text-sm">450</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-0.5">Sleep</div>
                <div className="font-semibold text-sm">7h 12m</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Schedule & Sync</h3>
        <Card 
          className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer bg-card"
          onClick={() => window.location.href = '/calendar'}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Workout Calendar</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Manage schedule & sync to Google/Apple</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Privacy & Social</h3>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Share Activity</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Let friends see your sessions and PRs</p>
              </div>
            </div>
            <Switch defaultChecked />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Integrations</h3>
        <Card className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">MyFitnessPal</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Connect for nutrition data</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Connect
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground">Progress Tracking</h3>
        </div>
        
        <div className="grid gap-3">
          <Link href="/progress">
            <Card className="bg-card border-border shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary border border-border">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Progress Photos</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Upload and compare</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/progress">
            <Card className="bg-card border-border shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary border border-border">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Performance Stats</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Volume, consistency, PRs</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/progress">
            <Card className="bg-card border-border shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary border border-border">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Body Measurements</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Track weight and dimensions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}