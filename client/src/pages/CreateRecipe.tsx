import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Plus, X, Search, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { searchFoods, type FoodItem } from "@/data/foodDatabase";

interface RecipeIngredient {
  name: string;
  amount: string;
  grams: number;
  matchedFood?: FoodItem;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function CreateRecipe() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("breakfast");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("1");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [coachTip, setCoachTip] = useState("");
  const [manualMacros, setManualMacros] = useState(false);
  const [manualCals, setManualCals] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFats, setManualFats] = useState("");

  const [ingSearch, setIngSearch] = useState("");
  const [ingAmount, setIngAmount] = useState("");
  const [ingGrams, setIngGrams] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const handleSearchFood = (query: string) => {
    setIngSearch(query);
    setSearchResults(searchFoods(query));
    setSelectedFood(null);
  };

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setIngSearch(food.name);
    setSearchResults([]);
  };

  const addIngredient = () => {
    if (!ingSearch.trim() || !ingAmount.trim()) return;
    const grams = Number(ingGrams) || 100;
    let cal = 0, pro = 0, car = 0, fat = 0;
    if (selectedFood) {
      const servGrams = parseFloat(selectedFood.servingSize) || 100;
      const ratio = grams / servGrams;
      cal = Math.round(selectedFood.calories * ratio);
      pro = Math.round(selectedFood.protein * ratio * 10) / 10;
      car = Math.round(selectedFood.carbs * ratio * 10) / 10;
      fat = Math.round(selectedFood.fats * ratio * 10) / 10;
    }
    setIngredients([...ingredients, {
      name: ingSearch,
      amount: ingAmount,
      grams,
      matchedFood: selectedFood || undefined,
      calories: cal,
      protein: pro,
      carbs: car,
      fats: fat,
    }]);
    setIngSearch("");
    setIngAmount("");
    setIngGrams("");
    setSelectedFood(null);
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const addInstruction = () => setInstructions([...instructions, ""]);
  const updateInstruction = (idx: number, val: string) => {
    const next = [...instructions];
    next[idx] = val;
    setInstructions(next);
  };
  const removeInstruction = (idx: number) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const totalCalories = manualMacros ? Number(manualCals) : ingredients.reduce((s, i) => s + i.calories, 0);
  const totalProtein = manualMacros ? Number(manualProtein) : Math.round(ingredients.reduce((s, i) => s + i.protein, 0));
  const totalCarbs = manualMacros ? Number(manualCarbs) : Math.round(ingredients.reduce((s, i) => s + i.carbs, 0));
  const totalFats = manualMacros ? Number(manualFats) : Math.round(ingredients.reduce((s, i) => s + i.fats, 0));
  const perServing = Number(servings) || 1;

  const handleSubmit = () => {
    if (!title.trim()) { toast.error("Give your recipe a name"); return; }
    if (ingredients.length === 0) { toast.error("Add at least one ingredient"); return; }
    if (instructions.filter(s => s.trim()).length === 0) { toast.error("Add at least one instruction step"); return; }
    toast.success("Recipe submitted!", { description: `"${title}" has been saved to your recipes.` });
    navigate("/nutrition");
  };

  return (
    <div className="p-4 space-y-5 animate-in fade-in duration-300 pb-24">
      <header className="py-2 flex items-center gap-3">
        <Link href="/nutrition">
          <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground" data-testid="button-back-create-recipe">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Create Recipe</h1>
          <p className="text-sm text-muted-foreground">Share your favourite meals</p>
        </div>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Recipe Name</Label>
          <Input placeholder="e.g. High Protein Chicken Stir-Fry" value={title} onChange={e => setTitle(e.target.value)} data-testid="input-recipe-title" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Category</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={category} onChange={e => setCategory(e.target.value)} data-testid="select-recipe-category">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={difficulty} onChange={e => setDifficulty(e.target.value)} data-testid="select-recipe-difficulty">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Prep (mins)</Label>
            <Input type="number" placeholder="5" value={prepTime} onChange={e => setPrepTime(e.target.value)} data-testid="input-prep-time" />
          </div>
          <div className="space-y-2">
            <Label>Cook (mins)</Label>
            <Input type="number" placeholder="15" value={cookTime} onChange={e => setCookTime(e.target.value)} data-testid="input-cook-time" />
          </div>
          <div className="space-y-2">
            <Label>Servings</Label>
            <Input type="number" placeholder="1" value={servings} onChange={e => setServings(e.target.value)} data-testid="input-servings" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-foreground">Ingredients</h2>
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setManualMacros(!manualMacros)} data-testid="button-toggle-manual-macros">
            <Calculator className="w-3 h-3 mr-1" /> {manualMacros ? "Auto-Calculate" : "Manual Macros"}
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search food database..."
                className="pl-9"
                value={ingSearch}
                onChange={e => handleSearchFood(e.target.value)}
                data-testid="input-search-food"
              />
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((food, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 border-b border-border last:border-0 flex justify-between items-center"
                      onClick={() => selectFood(food)}
                      data-testid={`food-result-${i}`}
                    >
                      <span className="text-foreground">{food.name}</span>
                      <span className="text-[10px] text-muted-foreground">{food.calories}kcal/{food.servingSize}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Amount (e.g. 150g)" value={ingAmount} onChange={e => setIngAmount(e.target.value)} data-testid="input-ing-amount" />
              <Input placeholder="Weight (g)" type="number" value={ingGrams} onChange={e => setIngGrams(e.target.value)} data-testid="input-ing-grams" />
              <Button size="sm" className="bg-primary text-primary-foreground" onClick={addIngredient} data-testid="button-add-ingredient">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {ingredients.length > 0 && (
          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 px-3 bg-card border border-border rounded-lg" data-testid={`added-ingredient-${idx}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ing.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ing.amount} {ing.matchedFood ? `• ${ing.calories}kcal / ${ing.protein}g P / ${ing.carbs}g C / ${ing.fats}g F` : ""}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeIngredient(idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {manualMacros && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-2">Enter macros manually (per serving):</p>
              <div className="grid grid-cols-4 gap-2">
                <div><Label className="text-[10px]">Calories</Label><Input type="number" value={manualCals} onChange={e => setManualCals(e.target.value)} placeholder="420" data-testid="input-manual-cal" /></div>
                <div><Label className="text-[10px]">Protein</Label><Input type="number" value={manualProtein} onChange={e => setManualProtein(e.target.value)} placeholder="35" data-testid="input-manual-protein" /></div>
                <div><Label className="text-[10px]">Carbs</Label><Input type="number" value={manualCarbs} onChange={e => setManualCarbs(e.target.value)} placeholder="48" data-testid="input-manual-carbs" /></div>
                <div><Label className="text-[10px]">Fats</Label><Input type="number" value={manualFats} onChange={e => setManualFats(e.target.value)} placeholder="12" data-testid="input-manual-fats" /></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border bg-secondary/30">
        <CardContent className="p-3">
          <p className="text-xs font-semibold text-foreground mb-1">Nutrition Summary {!manualMacros ? "(auto-calculated)" : "(manual)"}</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><p className="text-lg font-bold text-foreground">{Math.round(totalCalories / perServing)}</p><p className="text-[10px] text-muted-foreground">kcal</p></div>
            <div><p className="text-lg font-bold text-blue-400">{Math.round(totalProtein / perServing)}g</p><p className="text-[10px] text-muted-foreground">protein</p></div>
            <div><p className="text-lg font-bold text-amber-400">{Math.round(totalCarbs / perServing)}g</p><p className="text-[10px] text-muted-foreground">carbs</p></div>
            <div><p className="text-lg font-bold text-red-400">{Math.round(totalFats / perServing)}g</p><p className="text-[10px] text-muted-foreground">fats</p></div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-display font-semibold text-lg text-foreground">Instructions</h2>
        {instructions.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-2">{idx + 1}</span>
            <Textarea
              placeholder={`Step ${idx + 1}...`}
              className="resize-none flex-1"
              rows={2}
              value={step}
              onChange={e => updateInstruction(idx, e.target.value)}
              data-testid={`input-instruction-${idx}`}
            />
            {instructions.length > 1 && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive mt-1" onClick={() => removeInstruction(idx)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addInstruction} className="w-full border-dashed" data-testid="button-add-step">
          <Plus className="w-4 h-4 mr-1" /> Add Step
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Coach Tip (optional)</Label>
        <Textarea placeholder="Any tips, substitutions, or advice..." value={coachTip} onChange={e => setCoachTip(e.target.value)} className="resize-none" rows={2} data-testid="input-coach-tip" />
      </div>

      <Button className="w-full bg-primary text-primary-foreground font-semibold h-12" onClick={handleSubmit} data-testid="button-submit-recipe">
        Submit Recipe
      </Button>
    </div>
  );
}
