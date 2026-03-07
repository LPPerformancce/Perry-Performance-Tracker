import { Settings, Award, Ruler, Share2, Activity, Link as LinkIcon, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-primary">Profile</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border border-border relative shadow-sm">
          <span className="font-display font-semibold text-2xl text-primary">JD</span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-background">
            <Award className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl text-foreground">James Davis</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Foundation Program</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-xs font-medium text-secondary-foreground border border-border">
            <Link href="/coach" className="flex items-center gap-1.5 hover:text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              Coach Access Mode
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-medium shadow-sm">
          Edit Profile
        </Button>
        <Button variant="outline" className="h-10 bg-card border-border text-xs font-medium gap-2 shadow-sm">
          <Share2 className="w-4 h-4" /> Share Stats
        </Button>
      </div>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Integrations</h3>
        <Card className="border-border shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">MyFitnessPal</h4>
                <p className="text-xs text-emerald-600 font-medium flex items-center mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" /> Connected
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-8">
              Sync Data <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 space-y-3">
        <h3 className="font-semibold text-lg text-foreground">Tracking & Records</h3>
        
        <div className="grid gap-3">
          <Card className="bg-card border-border shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Personal Records</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">View your lifting progression</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
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
        </div>
      </section>
    </div>
  );
}