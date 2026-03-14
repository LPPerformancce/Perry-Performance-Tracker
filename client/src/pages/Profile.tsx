import { Settings, Award, Ruler, Share2, Activity, Link as LinkIcon, ChevronRight, Camera, Watch, LayoutDashboard, Calendar as CalendarIcon, Shield, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/userContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LPLogo } from "@/components/ui/LPLogo";

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const { currentUser, switchUser } = useCurrentUser();

  const updateUserMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      if (!currentUser) return;
      const res = await apiRequest("PATCH", `/api/users/${currentUser.id}`, data);
      return res.json();
    },
  });

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LPLogo size="xs" />
          <h1 className="text-2xl font-display font-bold tracking-tight text-primary">Profile</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex items-center gap-5 relative z-10">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary relative shadow-sm">
          <span className="font-display font-semibold text-2xl text-primary" data-testid="text-user-initials">{currentUser?.avatarInitials || "?"}</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
            <Award className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl text-foreground" data-testid="text-user-name">{currentUser?.displayName || "Loading..."}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{currentUser?.program || "No Program"}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-xs font-medium text-secondary-foreground border border-border">
            <Link href="/coach" className="flex items-center gap-1.5 hover:text-primary" data-testid="link-coach-portal">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Coach Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-medium shadow-sm hover:border-primary/50" data-testid="button-edit-profile">
          Edit Profile
        </Button>
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-medium gap-2 shadow-sm hover:border-primary/50">
          <Share2 className="w-4 h-4" /> Share Stats
        </Button>
      </div>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Switch User (Demo)</h3>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 2, name: "James (User)", initials: "JD" },
            { id: 1, name: "Coach Lee", initials: "LP" },
          ].map(u => (
            <Button
              key={u.id}
              variant={currentUser?.id === u.id ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => switchUser(u.id)}
              data-testid={`button-switch-user-${u.id}`}
            >
              {u.initials} - {u.name}
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Schedule</h3>
        <Card className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer bg-card">
          <Link href="/calendar">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Workout Calendar</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">View and manage your training schedule</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Link>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Preferences</h3>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div>
                <h4 className="font-semibold text-sm">Theme</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle light and dark mode</p>
              </div>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
              data-testid="switch-theme"
            />
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
            <Switch 
              checked={currentUser?.shareActivity ?? true} 
              onCheckedChange={(checked) => {
                updateUserMutation.mutate({ shareActivity: checked });
                toast.success(checked ? "Activity sharing enabled" : "Activity sharing disabled", {
                  description: checked ? "Friends can now see your sessions." : "Your sessions are now private."
                });
              }} 
              data-testid="switch-share-activity"
            />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground">Integrations</h3>
          <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">Demo Mode</span>
        </div>
        <Card className="border-border shadow-sm">
          <CardContent className="p-0 divide-y divide-border">
            {[
              { name: "Apple Health / Google Fit", icon: Watch, desc: "Wearable & fitness tracker sync", status: "not_available" as const },
              { name: "MyFitnessPal", icon: LayoutDashboard, desc: "Nutrition tracking integration", status: "not_available" as const },
            ].map((integration, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
                    <integration.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{integration.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{integration.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                  Not available
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-[10px] text-muted-foreground/60 text-center">
          External integrations require native app APIs. These will be available in the mobile release.
        </p>
      </section>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground">Progress Tracking</h3>
        </div>
        
        <div className="grid gap-3">
          <Link href="/progress#photos">
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

          <Link href="/progress#stats">
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
          
          <Link href="/progress#measurements">
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
