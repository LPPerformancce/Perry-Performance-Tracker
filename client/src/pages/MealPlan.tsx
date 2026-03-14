import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronRight, Flame, Droplet, Wheat, Beef, Clock, ChefHat, Check, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LPLogoMark } from "@/components/ui/LPLogo";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Meal {
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  items: string[];
  prepTime: string;
}

const mealPlans: Record<string, Meal[]> = {
  Mon: [
    { name: "Breakfast", time: "7:30 AM", calories: 620, protein: 45, carbs: 55, fats: 22, items: ["4 egg whites + 2 whole eggs scrambled", "1 cup oats with banana", "Black coffee"], prepTime: "10 min" },
    { name: "Lunch", time: "12:30 PM", calories: 750, protein: 52, carbs: 65, fats: 28, items: ["200g grilled chicken breast", "Brown rice (1.5 cups cooked)", "Mixed greens with olive oil"], prepTime: "20 min" },
    { name: "Pre-Workout", time: "4:00 PM", calories: 350, protein: 30, carbs: 45, fats: 8, items: ["Protein shake with banana", "Rice cakes with almond butter"], prepTime: "5 min" },
    { name: "Dinner", time: "7:30 PM", calories: 680, protein: 48, carbs: 40, fats: 30, items: ["250g salmon fillet", "Sweet potato (medium)", "Steamed broccoli & asparagus"], prepTime: "25 min" },
  ],
  Tue: [
    { name: "Breakfast", time: "7:30 AM", calories: 580, protein: 42, carbs: 50, fats: 20, items: ["Greek yoghurt (200g) with granola", "Mixed berries", "Honey drizzle"], prepTime: "5 min" },
    { name: "Lunch", time: "12:30 PM", calories: 720, protein: 50, carbs: 60, fats: 25, items: ["Turkey mince bolognese", "Wholemeal pasta (1.5 cups)", "Side salad"], prepTime: "20 min" },
    { name: "Pre-Workout", time: "4:00 PM", calories: 320, protein: 28, carbs: 40, fats: 6, items: ["Protein bar", "Apple"], prepTime: "2 min" },
    { name: "Dinner", time: "7:30 PM", calories: 700, protein: 55, carbs: 35, fats: 32, items: ["300g rump steak", "Roasted sweet potato wedges", "Green beans & mushrooms"], prepTime: "30 min" },
  ],
  Wed: [
    { name: "Breakfast", time: "7:30 AM", calories: 600, protein: 40, carbs: 58, fats: 20, items: ["Overnight protein oats", "Chia seeds & flaxseed", "Blueberries"], prepTime: "5 min (prepped night before)" },
    { name: "Lunch", time: "12:30 PM", calories: 680, protein: 48, carbs: 55, fats: 24, items: ["Chicken & avocado wrap", "Mixed leaf salad", "Hummus (2 tbsp)"], prepTime: "10 min" },
    { name: "Pre-Workout", time: "4:00 PM", calories: 340, protein: 30, carbs: 42, fats: 7, items: ["Protein smoothie with oats", "Banana"], prepTime: "5 min" },
    { name: "Dinner", time: "7:30 PM", calories: 720, protein: 50, carbs: 45, fats: 30, items: ["Baked cod with lemon", "Quinoa (1 cup cooked)", "Roasted Mediterranean veg"], prepTime: "25 min" },
  ],
  Thu: [
    { name: "Breakfast", time: "7:30 AM", calories: 620, protein: 45, carbs: 55, fats: 22, items: ["4 egg whites + 2 whole eggs scrambled", "Wholemeal toast (2 slices)", "Avocado (half)"], prepTime: "10 min" },
    { name: "Lunch", time: "12:30 PM", calories: 730, protein: 52, carbs: 60, fats: 26, items: ["Lean beef stir-fry", "Jasmine rice (1.5 cups)", "Mixed peppers & pak choi"], prepTime: "15 min" },
    { name: "Pre-Workout", time: "4:00 PM", calories: 330, protein: 28, carbs: 38, fats: 8, items: ["Rice cakes with cottage cheese", "Handful of grapes"], prepTime: "3 min" },
    { name: "Dinner", time: "7:30 PM", calories: 660, protein: 48, carbs: 42, fats: 28, items: ["Chicken thigh tray bake", "New potatoes", "Roasted courgette & onion"], prepTime: "35 min" },
  ],
  Fri: [
    { name: "Breakfast", time: "7:30 AM", calories: 590, protein: 42, carbs: 52, fats: 20, items: ["Protein pancakes (3 stack)", "Maple syrup drizzle", "Strawberries"], prepTime: "15 min" },
    { name: "Lunch", time: "12:30 PM", calories: 700, protein: 50, carbs: 58, fats: 24, items: ["Tuna & sweetcorn jacket potato", "Side salad with balsamic", "Apple"], prepTime: "10 min" },
    { name: "Pre-Workout", time: "4:00 PM", calories: 350, protein: 30, carbs: 44, fats: 7, items: ["Protein shake", "2 rice cakes with jam"], prepTime: "3 min" },
    { name: "Dinner", time: "7:30 PM", calories: 700, protein: 52, carbs: 38, fats: 30, items: ["Prawn & chorizo paella", "Mixed salad", "Lemon wedge"], prepTime: "30 min" },
  ],
  Sat: [
    { name: "Breakfast", time: "9:00 AM", calories: 650, protein: 40, carbs: 65, fats: 24, items: ["Full English (lean): turkey bacon, eggs, beans, toast", "Orange juice"], prepTime: "15 min" },
    { name: "Lunch", time: "1:00 PM", calories: 700, protein: 48, carbs: 60, fats: 26, items: ["Homemade chicken burger", "Sweet potato fries (baked)", "Coleslaw"], prepTime: "20 min" },
    { name: "Snack", time: "4:00 PM", calories: 280, protein: 22, carbs: 30, fats: 8, items: ["Greek yoghurt with honey", "Mixed nuts (small handful)"], prepTime: "2 min" },
    { name: "Dinner", time: "7:00 PM", calories: 720, protein: 50, carbs: 48, fats: 32, items: ["Lamb kofta with tzatziki", "Flatbread", "Tabbouleh salad"], prepTime: "25 min" },
  ],
  Sun: [
    { name: "Breakfast", time: "9:30 AM", calories: 600, protein: 38, carbs: 60, fats: 22, items: ["Smoked salmon & cream cheese bagel", "Poached eggs (2)", "Spinach"], prepTime: "10 min" },
    { name: "Lunch", time: "1:30 PM", calories: 750, protein: 55, carbs: 55, fats: 30, items: ["Roast chicken breast", "Roast potatoes & parsnips", "Steamed greens & gravy"], prepTime: "60 min" },
    { name: "Snack", time: "4:30 PM", calories: 300, protein: 25, carbs: 35, fats: 8, items: ["Protein flapjack", "Banana"], prepTime: "2 min" },
    { name: "Dinner", time: "7:30 PM", calories: 650, protein: 45, carbs: 50, fats: 28, items: ["Beef chilli con carne", "Brown rice", "Sour cream & jalapeños"], prepTime: "30 min" },
  ],
};

export default function MealPlan() {
  const [, setLocation] = useLocation();
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({});

  const meals = mealPlans[selectedDay] || mealPlans["Mon"];
  const dayTotals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fats: acc.fats + m.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const toggleMeal = (key: string) => {
    setCheckedMeals(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = meals.filter((_, i) => checkedMeals[`${selectedDay}-${i}`]).length;

  return (
    <div className="min-h-screen bg-background pb-24 animate-in fade-in duration-300">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/nutrition")} className="h-8 w-8 text-muted-foreground" data-testid="button-back-nutrition">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display font-semibold text-primary text-lg" data-testid="text-meal-plan-title">LP High-Protein Lean Bulk</h1>
          <p className="text-xs text-muted-foreground">Designed by Coach Lee Perry</p>
        </div>
        <LPLogoMark className="w-6 h-6 text-primary/30" />
      </header>

      <div className="px-4 pt-4 space-y-4">
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Targets</h3>
              <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                {checkedCount}/{meals.length} meals logged
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <div className="text-lg font-display font-bold text-foreground">{dayTotals.calories.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">kcal</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-1">
                  <Beef className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-lg font-display font-bold text-foreground">{dayTotals.protein}g</div>
                <div className="text-[10px] text-muted-foreground">Protein</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-1">
                  <Wheat className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-display font-bold text-foreground">{dayTotals.carbs}g</div>
                <div className="text-[10px] text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-1">
                  <Droplet className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-lg font-display font-bold text-foreground">{dayTotals.fats}g</div>
                <div className="text-[10px] text-muted-foreground">Fats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {days.map(day => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              size="sm"
              className={`min-w-[48px] h-9 text-xs font-semibold rounded-lg flex-shrink-0 ${
                selectedDay === day ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
              }`}
              onClick={() => setSelectedDay(day)}
              data-testid={`button-day-${day.toLowerCase()}`}
            >
              {day}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {meals.map((meal, i) => {
            const mealKey = `${selectedDay}-${i}`;
            const isChecked = checkedMeals[mealKey];
            return (
              <Card
                key={mealKey}
                className={`border-border shadow-sm overflow-hidden transition-all ${isChecked ? 'opacity-60 border-primary/30' : ''}`}
                data-testid={`card-meal-${i}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{meal.name}</h3>
                        {isChecked && (
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Logged</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meal.time}</span>
                        <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" /> {meal.prepTime}</span>
                      </div>
                    </div>
                    <Button
                      variant={isChecked ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 rounded-full transition-colors flex-shrink-0 ${isChecked ? 'bg-primary text-primary-foreground' : 'border-border'}`}
                      onClick={() => toggleMeal(mealKey)}
                      data-testid={`button-check-meal-${i}`}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {meal.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className={isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border/50">
                    <div className="text-center">
                      <div className="text-xs font-semibold text-foreground">{meal.calories}</div>
                      <div className="text-[9px] text-muted-foreground">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-primary">{meal.protein}g</div>
                      <div className="text-[9px] text-muted-foreground">protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-blue-400">{meal.carbs}g</div>
                      <div className="text-[9px] text-muted-foreground">carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-orange-400">{meal.fats}g</div>
                      <div className="text-[9px] text-muted-foreground">fats</div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="border-dashed border-2 border-border bg-secondary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-foreground">Weekly Shopping List</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Auto-generated from your meal plan</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => {
              import("sonner").then(m => m.toast.info("Shopping list", { description: "This feature is coming soon." }));
            }} data-testid="button-shopping-list">
              View
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground/50 pb-4">
          Meal plan designed by Coach Lee Perry for lean muscle gain. Adjust portions to your needs.
        </p>
      </div>
    </div>
  );
}
