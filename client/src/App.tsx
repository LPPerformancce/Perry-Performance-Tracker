import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Dashboard from "@/pages/Dashboard";
import Workout from "@/pages/Workout";
import ActiveWorkout from "@/pages/ActiveWorkout";
import Messages from "@/pages/Messages";
import Community from "@/pages/Community";
import Challenges from "@/pages/Challenges";
import Bootcamps from "@/pages/Bootcamps";
import Friends from "@/pages/Friends";
import CoachDashboard from "@/pages/CoachDashboard";
import Profile from "@/pages/Profile";
import Exercises from "@/pages/Exercises";
import Progress from "@/pages/Progress";
import Nutrition from "@/pages/Nutrition";
import Calendar from "@/pages/Calendar";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard}/>
        <Route path="/workout" component={Workout}/>
        <Route path="/workout/active/:id" component={ActiveWorkout}/>
        <Route path="/exercises" component={Exercises}/>
        <Route path="/nutrition" component={Nutrition}/>
        <Route path="/community" component={Community}/>
        <Route path="/messages" component={Messages}/>
        <Route path="/challenges" component={Challenges}/>
        <Route path="/bootcamps" component={Bootcamps}/>
        <Route path="/friends" component={Friends}/>
        <Route path="/progress" component={Progress}/>
        <Route path="/coach" component={CoachDashboard}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/calendar" component={Calendar}/>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;