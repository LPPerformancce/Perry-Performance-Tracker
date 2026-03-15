import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Target, Dumbbell, AlertTriangle, Clock, Shield, Ruler, Calendar, Utensils, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { LPLogo } from "@/components/ui/LPLogo";
import { useCurrentUser } from "@/lib/userContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";

const TOTAL_STEPS = 8;

interface OnboardingData {
  fitnessGoal: string;
  experienceLevel: string;
  trainingFrequency: string;
  injuries: string;
  limitations: string;
  barriers: string;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  preferredWorkoutTime: string;
  equipmentAccess: string;
  dietaryPreference: string;
  displayName: string;
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { currentUser } = useCurrentUser();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fitnessGoal: "", experienceLevel: "", trainingFrequency: "",
    injuries: "", limitations: "", barriers: "",
    age: "", height: "", weight: "", targetWeight: "",
    preferredWorkoutTime: "", equipmentAccess: "", dietaryPreference: "",
    displayName: currentUser?.displayName || "",
  });

  const update = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/user-profiles", {
        userId: currentUser?.id,
        fitnessGoal: data.fitnessGoal,
        experienceLevel: data.experienceLevel,
        trainingFrequency: data.trainingFrequency,
        injuries: data.injuries || null,
        limitations: data.limitations || null,
        barriers: data.barriers || null,
        age: data.age ? parseInt(data.age) : null,
        height: data.height || null,
        weight: data.weight || null,
        targetWeight: data.targetWeight || null,
        preferredWorkoutTime: data.preferredWorkoutTime || null,
        equipmentAccess: data.equipmentAccess || null,
        dietaryPreference: data.dietaryPreference || null,
        onboardingCompleted: true,
      });
      if (data.displayName && data.displayName !== currentUser?.displayName) {
        await apiRequest("PATCH", `/api/users/${currentUser?.id}`, { displayName: data.displayName });
      }
    },
    onSuccess: () => {
      localStorage.setItem("lpp-onboarding-complete", "true");
      toast.success("Welcome to LP Performance!", { description: "Your profile has been set up." });
      setLocation("/");
    },
  });

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return !!data.fitnessGoal;
      case 2: return !!data.experienceLevel;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      case 6: return !!data.trainingFrequency;
      case 7: return true;
      default: return true;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else saveMutation.mutate();
  };

  const back = () => { if (step > 0) setStep(step - 1); };

  const OptionCard = ({ value, selected, onClick, icon: Icon, title, description }: {
    value: string; selected: boolean; onClick: () => void; icon?: any; title: string; description?: string;
  }) => (
    <Card
      className={`cursor-pointer transition-all border-2 ${selected ? 'border-primary bg-primary/10 shadow-md' : 'border-border hover:border-primary/30'}`}
      onClick={onClick}
      data-testid={`option-${value}`}
    >
      <CardContent className="p-4 flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selected ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {selected && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
      </CardContent>
    </Card>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center text-center space-y-6 py-8">
            <LPLogo size="xl" />
            <div>
              <h1 className="text-3xl font-display font-bold text-primary mb-2">Welcome to LP Performance</h1>
              <p className="text-muted-foreground max-w-sm">Let's set up your profile so Coach Lee can create the perfect programme for you.</p>
            </div>
            <div className="space-y-3 w-full max-w-sm">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your Name</label>
                <Input value={data.displayName} onChange={(e) => update("displayName", e.target.value)} placeholder="Enter your name" className="text-center text-lg" data-testid="input-display-name" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground/60">This takes about 3 minutes and helps us personalise your experience.</p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold">What's your primary goal?</h2>
              <p className="text-sm text-muted-foreground mt-1">This helps us match you with the right programme</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "build_muscle", title: "Build Muscle & Strength", description: "Gain lean mass and get stronger", icon: Dumbbell },
                { value: "lose_fat", title: "Lose Fat & Tone Up", description: "Reduce body fat while maintaining muscle", icon: Target },
                { value: "general_fitness", title: "General Fitness & Health", description: "Improve overall fitness and wellbeing", icon: Shield },
                { value: "sport_performance", title: "Sport Performance", description: "Train for a specific sport or event", icon: Sparkles },
                { value: "rehabilitation", title: "Rehabilitation & Recovery", description: "Recover from injury or return to training", icon: AlertTriangle },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={data.fitnessGoal === opt.value} onClick={() => update("fitnessGoal", opt.value)} />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Dumbbell className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold">What's your training experience?</h2>
              <p className="text-sm text-muted-foreground mt-1">Be honest — this ensures we don't push too hard or too soft</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "complete_beginner", title: "Complete Beginner", description: "Never really trained with weights before" },
                { value: "some_experience", title: "Some Experience", description: "Trained on and off, know the basics" },
                { value: "regular_trainer", title: "Regular Trainer", description: "Trained consistently for 1-3 years" },
                { value: "experienced", title: "Experienced", description: "3+ years of consistent strength training" },
                { value: "returning", title: "Returning After a Break", description: "Used to train but had a significant break" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={data.experienceLevel === opt.value} onClick={() => update("experienceLevel", opt.value)} />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold">Any injuries or limitations?</h2>
              <p className="text-sm text-muted-foreground mt-1">This is crucial for your safety. Skip if none.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current or past injuries</label>
                <Textarea value={data.injuries} onChange={(e) => update("injuries", e.target.value)} placeholder="e.g., Lower back pain, previous shoulder surgery, dodgy right knee..." className="resize-none" rows={3} data-testid="input-injuries" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Physical limitations or conditions</label>
                <Textarea value={data.limitations} onChange={(e) => update("limitations", e.target.value)} placeholder="e.g., Desk job causing tight hip flexors, limited shoulder mobility, asthma..." className="resize-none" rows={3} data-testid="input-limitations" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold">What are your barriers?</h2>
              <p className="text-sm text-muted-foreground mt-1">Understanding what holds you back helps us help you</p>
            </div>
            <Textarea value={data.barriers} onChange={(e) => update("barriers", e.target.value)}
              placeholder="e.g., Time constraints with work, gym anxiety, inconsistent motivation, travel a lot for work, not sure what to do in the gym..." className="resize-none" rows={5} data-testid="input-barriers" />
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-xs text-primary/80"><strong>Coach tip:</strong> Everyone has barriers. Being honest here lets us design around yours, not pretend they don't exist.</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Ruler className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold">Body metrics</h2>
              <p className="text-sm text-muted-foreground mt-1">Optional — helps with progress tracking</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Age</label>
                <Input value={data.age} onChange={(e) => update("age", e.target.value)} placeholder="e.g., 32" type="number" data-testid="input-age" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Height</label>
                <Input value={data.height} onChange={(e) => update("height", e.target.value)} placeholder="e.g., 5'10" data-testid="input-height" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Weight</label>
                <Input value={data.weight} onChange={(e) => update("weight", e.target.value)} placeholder="e.g., 180 lbs" data-testid="input-weight" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Target Weight</label>
                <Input value={data.targetWeight} onChange={(e) => update("targetWeight", e.target.value)} placeholder="e.g., 170 lbs" data-testid="input-target-weight" />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold">Training schedule</h2>
              <p className="text-sm text-muted-foreground mt-1">How often can you realistically train?</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "2x", title: "2 days per week", description: "Perfect for busy professionals" },
                { value: "3x", title: "3 days per week", description: "The sweet spot for most people" },
                { value: "4x", title: "4 days per week", description: "Great for dedicated trainees" },
                { value: "5x", title: "5+ days per week", description: "For those who live for the gym" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={data.trainingFrequency === opt.value} onClick={() => update("trainingFrequency", opt.value)} />
              ))}
            </div>
            <div className="space-y-3 mt-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Preferred workout time</label>
                <div className="flex gap-2">
                  {["Morning", "Lunchtime", "Evening", "Flexible"].map(t => (
                    <Button key={t} variant={data.preferredWorkoutTime === t ? "default" : "outline"}
                      size="sm" className={`flex-1 text-xs ${data.preferredWorkoutTime === t ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => update("preferredWorkoutTime", t)} data-testid={`button-time-${t.toLowerCase()}`}>{t}</Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Equipment access</label>
                <div className="flex gap-2">
                  {["Full Gym", "Home Gym", "Minimal", "None"].map(e => (
                    <Button key={e} variant={data.equipmentAccess === e ? "default" : "outline"}
                      size="sm" className={`flex-1 text-xs ${data.equipmentAccess === e ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => update("equipmentAccess", e)} data-testid={`button-equipment-${e.toLowerCase().replace(' ', '-')}`}>{e}</Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-display font-bold">You're all set!</h2>
              <p className="text-sm text-muted-foreground mt-1">Here's your profile summary</p>
            </div>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 space-y-3">
                {[
                  { label: "Name", value: data.displayName || "Not set" },
                  { label: "Goal", value: data.fitnessGoal?.replace(/_/g, " ") || "Not set" },
                  { label: "Experience", value: data.experienceLevel?.replace(/_/g, " ") || "Not set" },
                  { label: "Training", value: data.trainingFrequency ? `${data.trainingFrequency}/week` : "Not set" },
                  { label: "Injuries", value: data.injuries || "None reported" },
                  { label: "Barriers", value: data.barriers || "None reported" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground capitalize text-right max-w-[60%] truncate">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Dietary preference (optional)</label>
              <div className="flex flex-wrap gap-2">
                {["No Preference", "High Protein", "Vegetarian", "Vegan", "Keto", "Gluten Free"].map(d => (
                  <Button key={d} variant={data.dietaryPreference === d ? "default" : "outline"}
                    size="sm" className={`text-xs ${data.dietaryPreference === d ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => update("dietaryPreference", d)}>{d}</Button>
                ))}
              </div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 mt-4">
              <p className="text-xs text-primary/80"><strong>What happens next:</strong> Coach Lee will review your profile and match you with the ideal training programme. You can start exploring the app right away.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="h-1.5 bg-secondary [&>div]:bg-primary" />
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground font-medium">Step {step + 1} of {TOTAL_STEPS}</span>
          {step > 0 && <button className="text-[10px] text-primary font-medium" onClick={back}>← Back</button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {renderStep()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
        <Button
          className="w-full h-12 bg-primary text-primary-foreground font-semibold text-base"
          onClick={next}
          disabled={!canProceed() || saveMutation.isPending}
          data-testid="button-next-step"
        >
          {saveMutation.isPending ? "Saving..." : step === TOTAL_STEPS - 1 ? "Complete Setup" : "Continue"}
          {step < TOTAL_STEPS - 1 && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
