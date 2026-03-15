import { useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Clock, Flame, Users, ChefHat, Plus, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getRecipeById } from "@/data/recipes";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = getRecipeById(Number(id));
  const [liked, setLiked] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [servingMultiplier, setServingMultiplier] = useState(1);

  if (!recipe) {
    return (
      <div className="p-4 text-center py-20">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Link href="/nutrition">
          <Button variant="outline" className="mt-4">Back to Nutrition</Button>
        </Link>
      </div>
    );
  }

  const toggleStep = (idx: number) => {
    const next = new Set(checkedSteps);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setCheckedSteps(next);
  };

  const scale = (val: number) => Math.round(val * servingMultiplier);

  return (
    <div className="animate-in fade-in duration-300 pb-24">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-56 object-cover"
          data-testid="img-recipe-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <Link href="/nutrition">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60" data-testid="button-back-recipe">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full ${liked ? "bg-red-500/30 text-red-400" : "bg-black/40 text-white"} hover:bg-black/60`}
            onClick={() => { setLiked(!liked); toast.success(liked ? "Removed from favourites" : "Added to favourites"); }}
            data-testid="button-like-recipe"
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          </Button>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
            recipe.difficulty === "Easy" ? "bg-emerald-500/80 text-white" :
            recipe.difficulty === "Medium" ? "bg-amber-500/80 text-white" :
            "bg-red-500/80 text-white"
          }`}>
            {recipe.difficulty}
          </span>
          <h1 className="text-2xl font-display font-bold text-white mt-2 drop-shadow-lg" data-testid="text-recipe-title">{recipe.title}</h1>
          <p className="text-sm text-white/80 mt-1">by {recipe.author}</p>
        </div>
      </div>

      <div className="p-4 space-y-5">
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Card className="border-border"><CardContent className="p-3 text-center"><Clock className="w-4 h-4 mx-auto text-primary mb-1" /><p className="text-lg font-bold text-foreground">{recipe.prepTime + recipe.cookTime}</p><p className="text-[10px] text-muted-foreground">mins total</p></CardContent></Card>
          <Card className="border-border"><CardContent className="p-3 text-center"><Flame className="w-4 h-4 mx-auto text-orange-400 mb-1" /><p className="text-lg font-bold text-foreground" data-testid="text-recipe-calories">{scale(recipe.calories)}</p><p className="text-[10px] text-muted-foreground">kcal</p></CardContent></Card>
          <Card className="border-border"><CardContent className="p-3 text-center"><div className="w-4 h-4 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-400 mb-1">P</div><p className="text-lg font-bold text-foreground">{scale(recipe.protein)}g</p><p className="text-[10px] text-muted-foreground">protein</p></CardContent></Card>
          <Card className="border-border"><CardContent className="p-3 text-center"><Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" /><p className="text-lg font-bold text-foreground">{recipe.servings * servingMultiplier}</p><p className="text-[10px] text-muted-foreground">servings</p></CardContent></Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3 text-foreground">Macro Breakdown (per serving)</h3>
            <div className="space-y-2">
              {[
                { label: "Protein", value: scale(recipe.protein), color: "bg-blue-500", pct: Math.round((recipe.protein * 4 / (recipe.calories || 1)) * 100) },
                { label: "Carbs", value: scale(recipe.carbs), color: "bg-amber-500", pct: Math.round((recipe.carbs * 4 / (recipe.calories || 1)) * 100) },
                { label: "Fats", value: scale(recipe.fats), color: "bg-red-400", pct: Math.round((recipe.fats * 9 / (recipe.calories || 1)) * 100) },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-14">{m.label}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.pct}%` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-10 text-right">{m.value}g</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-foreground">Servings</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))} data-testid="button-decrease-servings">-</Button>
            <span className="text-sm font-medium w-6 text-center">{recipe.servings * servingMultiplier}</span>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setServingMultiplier(servingMultiplier + 0.5)} data-testid="button-increase-servings">+</Button>
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">Ingredients</h2>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0" data-testid={`ingredient-${idx}`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{ing.item}</span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">Instructions</h2>
          <div className="space-y-3">
            {recipe.instructions.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  checkedSteps.has(idx) ? "bg-emerald-500/10 border-emerald-500/30" : "bg-card border-border"
                }`}
                onClick={() => toggleStep(idx)}
                data-testid={`step-${idx}`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  checkedSteps.has(idx) ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"
                }`}>
                  {checkedSteps.has(idx) ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <p className={`text-sm leading-relaxed ${checkedSteps.has(idx) ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {recipe.coachTip && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-start gap-3">
              <ChefHat className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-primary mb-1">Coach Lee's Tip</h3>
                <p className="text-sm text-muted-foreground italic leading-relaxed">{recipe.coachTip}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            className="bg-primary text-primary-foreground font-medium"
            onClick={() => toast.success("Added to Meal Plan", { description: `${recipe.title} added to today's meals` })}
            data-testid="button-add-to-meal-plan"
          >
            <Plus className="w-4 h-4 mr-2" /> Add to Meal Plan
          </Button>
          <Button
            variant="outline"
            className="border-border"
            onClick={() => {
              const text = `Check out this recipe: ${recipe.title} (${recipe.calories} kcal, ${recipe.protein}g protein)`;
              if (navigator.share) navigator.share({ title: recipe.title, text });
              else { navigator.clipboard.writeText(text); toast.success("Recipe link copied!"); }
            }}
            data-testid="button-share-recipe"
          >
            Share Recipe
          </Button>
        </div>
      </div>
    </div>
  );
}
