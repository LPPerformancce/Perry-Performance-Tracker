import { Search, Flame, Droplet, Coffee, ChefHat, Plus, ChevronRight, Camera, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";

export default function Nutrition() {
  const [, setLocation] = useLocation();
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Nutrition</h1>
          <p className="text-sm text-muted-foreground mt-1">Fuel your performance</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground gap-1.5 shadow-md"
          onClick={() => setLocation('/meal-scanner')}
          data-testid="button-meal-scanner"
        >
          <Camera className="w-4 h-4" /> Scan Meal
        </Button>
      </header>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 cursor-pointer hover:bg-primary/15 transition-colors" onClick={() => setLocation('/meal-scanner')} data-testid="card-ai-scanner">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground">AI Meal Scanner</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Snap a photo of your meal and get instant macro estimates + nutrition coaching</p>
          </div>
          <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
        </CardContent>
      </Card>

      {/* Daily Macros Overview */}
      <Card className="border-primary/20 shadow-md overflow-hidden bg-gradient-to-br from-card to-background">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-1 uppercase tracking-wider">Today's Macros</h3>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-display font-bold text-primary">2,150</span>
                <span className="text-xs text-muted-foreground mb-1">/ 2,800 kcal</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Protein</span>
                <span>140g</span>
              </div>
              <Progress value={85} className="h-1.5 bg-secondary [&>div]:bg-primary" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Carbs</span>
                <span>210g</span>
              </div>
              <Progress value={60} className="h-1.5 bg-secondary [&>div]:bg-blue-400" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Fats</span>
                <span>55g</span>
              </div>
              <Progress value={75} className="h-1.5 bg-secondary [&>div]:bg-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search food database..." 
          className="pl-9 bg-card border-border shadow-sm h-11"
        />
      </div>

      {/* Preset Meal Plans */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Your Meal Plan</h2>
          <Button variant="ghost" size="sm" className="text-primary text-xs" onClick={() => {
            import("sonner").then(m => m.toast.info("All Meal Plans", { description: "Opening library..." }));
          }}>View All</Button>
        </div>
        <Link href="/meal-plan">
          <Card className="border-border shadow-sm border-l-4 border-l-primary cursor-pointer hover:bg-secondary/50 transition-colors" data-testid="card-meal-plan">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">LP High-Protein Lean Bulk</h3>
                <p className="text-xs text-muted-foreground mt-1">4 meals/day • ~2,800 kcal • ~180g Protein</p>
                <div className="mt-3 flex gap-2">
                  <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-1 rounded">Preset by Coach</span>
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded font-medium">7-Day Plan</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Recipe Ideas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Recipe Ideas</h2>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => {
            import("sonner").then(m => m.toast.info("Submit Recipe", { description: "Opening recipe builder..." }));
          }}>
            <Plus className="w-3.5 h-3.5" /> Submit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Steak & Sweet Potato", kcal: 650, p: 45, author: "Coach Lee" },
            { title: "Overnight Pro-Oats", kcal: 420, p: 35, author: "Community" },
            { title: "Chicken Pesto Bowl", kcal: 550, p: 50, author: "Coach Lee" },
            { title: "Salmon & Asparagus", kcal: 600, p: 42, author: "Sarah J." },
          ].map((recipe, i) => (
            <Card key={i} className="bg-card border-border shadow-sm overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group">
              <div className="h-24 bg-secondary flex items-center justify-center relative">
                <ChefHat className="w-8 h-8 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute bottom-1 right-2 text-[9px] font-medium text-white/80 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {recipe.author}
                </span>
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold text-sm truncate leading-tight mb-1">{recipe.title}</h4>
                <div className="flex gap-2 text-[10px] text-muted-foreground font-medium">
                  <span>{recipe.kcal} kcal</span>
                  <span>•</span>
                  <span className="text-primary">{recipe.p}g Pro</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}