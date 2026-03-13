import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, RefreshCw, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocation } from "wouter";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { toast } from "sonner";

export default function Calendar() {
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Mock data for workouts
  const scheduledWorkouts = [
    { id: 1, date: new Date(), title: "Foundation: Full Body", time: "17:00", duration: "45m", synced: true },
    { id: 2, date: addDays(new Date(), 2), title: "Upper Body Focus", time: "07:00", duration: "50m", synced: true },
    { id: 3, date: addDays(new Date(), 4), title: "Lower Body Power", time: "18:00", duration: "60m", synced: false },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Calendar Synced Successfully", {
        description: "Your workouts have been updated with Google Calendar."
      });
    }, 1500);
  };

  const getDaysInWeek = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  const currentWeekDays = getDaysInWeek(currentDate);
  const selectedDateWorkouts = scheduledWorkouts.filter(w => isSameDay(w.date, selectedDate));

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and sync your workouts</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-2 bg-card border-border"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-primary" : ""}`} /> 
          {isSyncing ? "Syncing..." : "Sync"}
        </Button>
      </header>

      {/* Calendar View */}
      <Card className="border-border shadow-sm overflow-hidden bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-semibold text-sm">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {currentWeekDays.map((day, i) => {
              const isSelected = isSameDay(day, selectedDate);
              const hasWorkout = scheduledWorkouts.some(w => isSameDay(w.date, day));
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    h-12 rounded-lg flex flex-col items-center justify-center relative transition-all
                    ${isSelected ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'hover:bg-secondary/50 text-foreground'}
                    ${isToday && !isSelected ? 'border border-primary/30 text-primary' : ''}
                  `}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                  {hasWorkout && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-background' : 'bg-primary'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Workouts for Selected Date */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {isSameDay(selectedDate, new Date()) ? "Today's Plan" : format(selectedDate, "EEEE, MMM d")}
          </h3>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {selectedDateWorkouts.length > 0 ? (
          <div className="space-y-3">
            {selectedDateWorkouts.map((workout) => (
              <Card key={workout.id} className="border-border shadow-sm border-l-4 border-l-primary cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => setLocation('/workout/active/foundation-1')}>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-base">{workout.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {workout.time} ({workout.duration})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    {workout.synced ? (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> Synced to Personal Calendar
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Smartphone className="w-3 h-3" /> App Only
                      </span>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-xs border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-card border border-border border-dashed rounded-xl">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-foreground mb-1">Rest Day</h4>
            <p className="text-sm text-muted-foreground">No workouts scheduled for this day.</p>
            <Button variant="outline" className="mt-4 text-xs font-medium h-8 bg-background">
              Schedule Workout
            </Button>
          </div>
        )}
      </div>

      {/* Sync Settings */}
      <section className="space-y-3 pt-4 border-t border-border/50">
        <h3 className="font-semibold text-lg text-foreground">Calendar Connections</h3>
        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <Monitor className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Google Calendar</h4>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">Connected (user@example.com)</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Manage
              </Button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Apple Calendar</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}