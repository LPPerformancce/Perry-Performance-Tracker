import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, Upload, Send, Bot, User, Sparkles, Apple, Beef, Wheat, Droplet, Check, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LPLogoMark } from "@/components/ui/LPLogo";
import { useCurrentUser } from "@/lib/userContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  image?: string;
  macros?: { calories: number; protein: number; carbs: number; fats: number; items: string[] };
}

const MEAL_ANALYSES: Record<string, { calories: number; protein: number; carbs: number; fats: number; items: string[]; advice: string }> = {
  default: {
    calories: 520, protein: 35, carbs: 55, fats: 18,
    items: ["Grilled chicken breast (~150g)", "Brown rice (~1 cup)", "Mixed vegetables", "Light dressing"],
    advice: "Great balanced meal! Good protein content. Consider adding a handful of nuts for healthy fats to reach your macro targets."
  },
  breakfast: {
    calories: 420, protein: 28, carbs: 48, fats: 14,
    items: ["Scrambled eggs (2 large)", "Wholemeal toast (2 slices)", "Avocado (quarter)", "Orange juice"],
    advice: "Solid breakfast. The eggs provide quality protein. You could boost protein further by adding Greek yoghurt on the side."
  },
  healthy: {
    calories: 380, protein: 32, carbs: 35, fats: 12,
    items: ["Grilled salmon fillet (~120g)", "Quinoa (~3/4 cup)", "Steamed broccoli", "Lemon wedge"],
    advice: "Excellent choice! Rich in omega-3 from the salmon. This meal aligns perfectly with your high-protein lean bulk plan."
  },
  snack: {
    calories: 280, protein: 20, carbs: 30, fats: 10,
    items: ["Protein bar", "Banana", "Small handful of almonds"],
    advice: "Good pre-workout snack. The banana provides quick energy and the protein bar helps with muscle recovery."
  },
};

const CHAT_RESPONSES: Record<string, string> = {
  protein: "Based on your lean bulk goal, aim for 1.6-2.2g of protein per kg bodyweight daily. That's roughly 130-180g for your build. Good sources: chicken, fish, eggs, Greek yoghurt, and whey protein.",
  carbs: "Carbs fuel your workouts! On training days, aim for 3-4g per kg bodyweight. On rest days, reduce to 2-3g. Focus on complex sources: oats, rice, sweet potato, and whole grains.",
  meal_prep: "Meal prep is a game-changer for consistency. Try cooking 3-4 proteins on Sunday (chicken, mince, salmon), batch cook rice and roast veg. Store in portions for the week.",
  water: "Aim for 2-3 litres of water daily, more on training days. A good rule: drink 500ml when you wake up, 500ml before training, and sip throughout the day.",
  default: "That's a great question! Based on your training goals, I'd recommend focusing on protein-rich meals with complex carbs around your workouts. Would you like specific meal suggestions or recipes?",
};

export default function MealScanner() {
  const [, setLocation] = useLocation();
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", content: "Hi! I'm your LP nutrition assistant. Upload a photo of your meal and I'll estimate the macros, or ask me any nutrition question." }
  ]);
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const logMealMutation = useMutation({
    mutationFn: async (macros: { calories: number; protein: number; carbs: number; fats: number; description: string }) => {
      await apiRequest("POST", "/api/meal-logs", {
        userId: currentUser?.id,
        mealType: "scanned",
        description: macros.description,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fats: macros.fats,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meal-logs"] });
      toast.success("Meal logged!", { description: "Added to your daily nutrition." });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const imageData = ev.target?.result as string;
      const userMsg: ChatMessage = {
        id: Date.now(),
        role: "user",
        content: "Can you analyze this meal?",
        image: imageData,
      };
      setMessages(prev => [...prev, userMsg]);
      setIsAnalyzing(true);
      scrollToBottom();

      setTimeout(() => {
        const analyses = Object.values(MEAL_ANALYSES);
        const analysis = analyses[Math.floor(Math.random() * analyses.length)];

        const assistantMsg: ChatMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: analysis.advice,
          macros: {
            calories: analysis.calories + Math.floor(Math.random() * 60 - 30),
            protein: analysis.protein + Math.floor(Math.random() * 8 - 4),
            carbs: analysis.carbs + Math.floor(Math.random() * 10 - 5),
            fats: analysis.fats + Math.floor(Math.random() * 6 - 3),
            items: analysis.items,
          },
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsAnalyzing(false);
        scrollToBottom();
      }, 2000);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: inputText };
    setMessages(prev => [...prev, userMsg]);
    const text = inputText.toLowerCase();
    setInputText("");
    scrollToBottom();

    setTimeout(() => {
      let response = CHAT_RESPONSES.default;
      if (text.includes("protein")) response = CHAT_RESPONSES.protein;
      else if (text.includes("carb")) response = CHAT_RESPONSES.carbs;
      else if (text.includes("prep") || text.includes("plan")) response = CHAT_RESPONSES.meal_prep;
      else if (text.includes("water") || text.includes("hydrat")) response = CHAT_RESPONSES.water;

      const assistantMsg: ChatMessage = { id: Date.now() + 1, role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMsg]);
      scrollToBottom();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/nutrition")} className="h-8 w-8 text-muted-foreground" data-testid="button-back-nutrition">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-sm">LP Nutrition AI</h1>
            <p className="text-[10px] text-muted-foreground">Meal scanner & nutrition coach</p>
          </div>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">Demo</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <LPLogoMark className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
              {msg.image && (
                <div className="rounded-xl overflow-hidden mb-2 border border-border">
                  <img src={msg.image} alt="Uploaded meal" className="w-full h-40 object-cover" />
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-md"
                  : "bg-card border border-border rounded-tl-md"
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.macros && (
                <Card className="mt-2 border-primary/30 bg-primary/5">
                  <CardContent className="p-3 space-y-3">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Estimated Breakdown</h4>
                    <div className="space-y-1">
                      {msg.macros.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50">
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">{msg.macros.calories}</div>
                        <div className="text-[9px] text-muted-foreground">kcal</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-primary">{msg.macros.protein}g</div>
                        <div className="text-[9px] text-muted-foreground">protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-400">{msg.macros.carbs}g</div>
                        <div className="text-[9px] text-muted-foreground">carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{msg.macros.fats}g</div>
                        <div className="text-[9px] text-muted-foreground">fats</div>
                      </div>
                    </div>
                    <Button
                      size="sm" className="w-full text-xs bg-primary text-primary-foreground h-8"
                      onClick={() => logMealMutation.mutate({
                        calories: msg.macros!.calories,
                        protein: msg.macros!.protein,
                        carbs: msg.macros!.carbs,
                        fats: msg.macros!.fats,
                        description: msg.macros!.items.join(", "),
                      })}
                      data-testid="button-log-meal"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Log This Meal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1 border border-border">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <LPLogoMark className="w-4 h-4 text-primary" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                Analyzing your meal...
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border px-4 py-3">
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0 border-primary/30 text-primary" onClick={() => fileInputRef.current?.click()} data-testid="button-upload-photo">
            <Camera className="w-5 h-5" />
          </Button>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about nutrition..."
            className="flex-1 h-10"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            data-testid="input-chat-message"
          />
          <Button size="icon" className="h-10 w-10 bg-primary text-primary-foreground flex-shrink-0" onClick={handleSendMessage} disabled={!inputText.trim()} data-testid="button-send-message">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center text-[9px] text-muted-foreground/50 mt-2">
          Demo mode — macro estimates are simulated. Real AI analysis coming soon.
        </p>
      </div>
    </div>
  );
}
