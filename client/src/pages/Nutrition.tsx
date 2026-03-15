import { useState } from "react";
import { Search, Flame, ChefHat, Plus, ChevronRight, Camera, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { RECIPES, searchRecipes, getRecipesByCategory, type Recipe } from "@/data/recipes";
import { searchFoods, type FoodItem } from "@/data/foodDatabase";

export default function Nutrition() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);

  const categories = [
    { key: "all", label: "All" },
    { key: "breakfast", label: "Breakfast" },
    { key: "lunch", label: "Lunch" },
    { key: "dinner", label: "Dinner" },
    { key: "snack", label: "Snacks" },
  ];

  let filteredRecipes: Recipe[];
  if (searchTerm.trim()) {
    filteredRecipes = searchRecipes(searchTerm);
    if (activeCategory !== "all") filteredRecipes = filteredRecipes.filter(r => r.category === activeCategory);
  } else if (activeCategory === "all") {
    filteredRecipes = RECIPES.slice(0, 12);
  } else {
    filteredRecipes = getRecipesByCategory(activeCategory as Recipe["category"]).slice(0, 8);
  }

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setFoodResults(searchFoods(val));
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Nutrition</h1>
          <p className="text-sm text-muted-foreground mt-1">Fuel your performance</p>
        </div>
        <Button className="bg-primary text-primary-foreground gap-1.5 shadow-md" onClick={() => setLocation('/meal-scanner')} data-testid="button-meal-scanner">
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
              <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Protein</span><span>140g</span></div>
              <Progress value={85} className="h-1.5 bg-secondary [&>div]:bg-primary" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Carbs</span><span>210g</span></div>
              <Progress value={60} className="h-1.5 bg-secondary [&>div]:bg-blue-400" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium"><span className="text-muted-foreground">Fats</span><span>55g</span></div>
              <Progress value={75} className="h-1.5 bg-secondary [&>div]:bg-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search recipes or food database..."
          className="pl-9 bg-card border-border shadow-sm h-11"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          data-testid="input-search-nutrition"
        />
        {foodResults.length > 0 && searchTerm.trim() && (
          <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div className="p-2 border-b border-border"><span className="text-[10px] font-semibold text-muted-foreground uppercase">Food Database</span></div>
            {foodResults.map((food, i) => (
              <div key={i} className="px-3 py-2 text-sm border-b border-border last:border-0 flex justify-between items-center hover:bg-secondary/50">
                <div>
                  <p className="text-foreground text-xs font-medium">{food.name}</p>
                  <p className="text-[10px] text-muted-foreground">{food.servingSize}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{food.calories} kcal</p>
                  <p className="text-[10px] text-muted-foreground">P:{food.protein}g C:{food.carbs}g F:{food.fats}g</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Your Meal Plan</h2>
          <Link href="/meal-plan"><Button variant="ghost" size="sm" className="text-primary text-xs">View Plan</Button></Link>
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

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Recipe Ideas <span className="text-xs font-normal text-muted-foreground">({RECIPES.length} recipes)</span></h2>
          <Link href="/create-recipe">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" data-testid="button-add-recipe">
              <Plus className="w-3.5 h-3.5" /> Add Recipe
            </Button>
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 scrollbar-none">
          {categories.map(cat => (
            <Button
              key={cat.key}
              variant={activeCategory === cat.key ? "default" : "outline"}
              onClick={() => setActiveCategory(cat.key)}
              className={`rounded-full px-4 h-8 text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card border-border text-foreground hover:bg-secondary/80"
              }`}
              data-testid={`filter-recipe-${cat.key}`}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredRecipes.map(recipe => (
            <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
              <Card className="bg-card border-border shadow-sm overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group" data-testid={`card-recipe-${recipe.id}`}>
                <div className="h-28 bg-secondary relative overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/50 text-white backdrop-blur-sm uppercase">{recipe.difficulty}</span>
                  <span className="absolute bottom-1 right-2 text-[9px] font-medium text-white/80 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">{recipe.author}</span>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-semibold text-sm truncate leading-tight mb-1">{recipe.title}</h4>
                  <div className="flex gap-2 text-[10px] text-muted-foreground font-medium">
                    <span>{recipe.calories} kcal</span>
                    <span>•</span>
                    <span className="text-primary">{recipe.protein}g Pro</span>
                    <span>•</span>
                    <span>{recipe.prepTime + recipe.cookTime}m</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {searchTerm.trim() && filteredRecipes.length === 0 && (
          <div className="text-center py-8">
            <ChefHat className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No recipes found for "{searchTerm}"</p>
          </div>
        )}

        {!searchTerm.trim() && (
          <Button
            variant="ghost"
            className="w-full text-xs text-primary"
            onClick={() => setActiveCategory(activeCategory === "all" ? "all" : activeCategory)}
            data-testid="button-see-all-recipes"
          >
            Browse all {RECIPES.length} recipes
          </Button>
        )}
      </section>
    </div>
  );
}
