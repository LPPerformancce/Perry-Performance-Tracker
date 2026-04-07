import { QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { UserProvider, useCurrentUser } from "./lib/userContext";
import { AppLayout } from "./components/layout/AppLayout";
import type { ClientAssignment, Program, ProgramDay, ProgramDayExercise, NutritionPlan, ClientNutritionAssignment, CheckIn, User, Conversation, Message, Exercise, WorkoutSession } from "@shared/schema";
import { useState } from "react";

function ProgramEditor({ coachId }: { coachId: number }) {
  const qc = useQueryClient();
  const { data: programs = [] } = useQuery<Program[]>({ queryKey: ["/api/programs/coach", String(coachId)] });
  const createProgram = useMutation({
    mutationFn: async () => (await apiRequest("POST", "/api/programs", { title: "New Program", description: "Bare-bones training plan", daysPerWeek: 3, durationWeeks: 8, coachId })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/programs/coach", String(coachId)] }),
  });

  return <section className="stack"><div className="section-head"><h2>Training programs</h2><button onClick={() => createProgram.mutate()}>New program</button></div>{programs.map((program) => <ProgramCard key={program.id} program={program} />)}</section>;
}

function ProgramCard({ program }: { program: Program }) {
  const qc = useQueryClient();
  const { data: days = [] } = useQuery<ProgramDay[]>({ queryKey: ["/api/programs", String(program.id), "days"] });
  const { data: exercises = [] } = useQuery<Exercise[]>({ queryKey: ["/api/exercises"] });
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const { data: dayExercises = [] } = useQuery<ProgramDayExercise[]>({ queryKey: ["/api/program-days", String(selectedDayId ?? 0), "exercises"], enabled: !!selectedDayId });

  const addDay = useMutation({
    mutationFn: async () => (await apiRequest("POST", "/api/program-days", { programId: program.id, dayName: `Day ${days.length + 1}`, sortOrder: days.length + 1 })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/programs", String(program.id), "days"] }),
  });
  const addExercise = useMutation({
    mutationFn: async () => {
      const first = exercises[0];
      if (!first || !selectedDayId) return null;
      return (await apiRequest("POST", "/api/program-day-exercises", { programDayId: selectedDayId, exerciseId: first.id, sets: 3, repsMin: 8, repsMax: 10, rpeTarget: 7, notes: "", sortOrder: dayExercises.length + 1 })).json();
    },
    onSuccess: () => selectedDayId && qc.invalidateQueries({ queryKey: ["/api/program-days", String(selectedDayId), "exercises"] }),
  });

  return <article className="card stack"><div className="section-head"><div><strong>{program.title}</strong><div className="muted">{program.daysPerWeek} days · {program.durationWeeks} weeks</div></div><button onClick={() => addDay.mutate()}>Add day</button></div><div className="chips">{days.map((day) => <button key={day.id} className={selectedDayId === day.id ? "chip active" : "chip"} onClick={() => setSelectedDayId(day.id)}>{day.dayName}</button>)}</div>{selectedDayId && <div className="stack"><div className="section-head"><strong>Exercises</strong><button onClick={() => addExercise.mutate()}>Add exercise</button></div>{dayExercises.map((row) => { const exercise = exercises.find((item) => item.id === row.exerciseId); return <div className="list-row" key={row.id}><div><strong>{exercise?.name ?? `Exercise ${row.exerciseId}`}</strong><div className="muted">{row.sets} sets · {row.repsMin}-{row.repsMax} reps · RPE {row.rpeTarget ?? 7}</div></div></div>; })}</div>}</article>;
}

function CoachClients() {
  const { currentUser } = useCurrentUser();
  const coachId = currentUser?.id ?? 1;
  const { data: allUsers = [] } = useQuery<User[]>({ queryKey: ["/api/users"] });
  const { data: assignments = [] } = useQuery<ClientAssignment[]>({ queryKey: ["/api/client-assignments/coach", String(coachId)] });
  const qc = useQueryClient();
  const assign = useMutation({
    mutationFn: async (clientId: number) => (await apiRequest("POST", "/api/client-assignments", { coachId, clientId, active: true })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/client-assignments/coach", String(coachId)] }),
  });
  const clients = allUsers.filter((user) => user.role === "client");
  return <section className="stack"><div className="section-head"><h2>Clients</h2><span className="muted">Assign and manage current coaching clients.</span></div><article className="card">{clients.map((client) => { const assigned = assignments.some((row) => row.clientId === client.id && row.active); return <div className="list-row" key={client.id}><div><strong>{client.displayName}</strong><div className="muted">{assigned ? "Assigned" : "Not assigned"}</div></div>{assigned ? <span className="muted">Active</span> : <button onClick={() => assign.mutate(client.id)}>Assign</button>}</div>; })}</article></section>;
}

function CoachNutrition() {
  const { currentUser } = useCurrentUser();
  const coachId = currentUser?.id ?? 1;
  const { data: plans = [] } = useQuery<NutritionPlan[]>({ queryKey: ["/api/nutrition-plans/coach", String(coachId)] });
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: async () => (await apiRequest("POST", "/api/nutrition-plans", { coachId, title: "New Nutrition Plan", description: "Simple baseline targets", caloriesTarget: 2400, proteinTarget: 180, carbsTarget: 220, fatsTarget: 70, guidance: "Keep meals simple and repeatable." })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/nutrition-plans/coach", String(coachId)] }),
  });
  return <section className="stack"><div className="section-head"><h2>Nutrition plans</h2><button onClick={() => create.mutate()}>New nutrition plan</button></div><article className="card">{plans.map((plan) => <div key={plan.id} className="list-row"><div><strong>{plan.title}</strong><div className="muted">{plan.caloriesTarget} kcal · {plan.proteinTarget}p · {plan.carbsTarget}c · {plan.fatsTarget}f</div></div></div>)}</article></section>;
}

function CoachCheckIns() {
  const { currentUser } = useCurrentUser();
  const coachId = currentUser?.id ?? 1;
  const { data: checkIns = [] } = useQuery<CheckIn[]>({ queryKey: ["/api/check-ins/coach", String(coachId)] });
  const qc = useQueryClient();
  const [reply, setReply] = useState<Record<number, string>>({});
  const sendReply = useMutation({
    mutationFn: async ({ id, coachReply }: { id: number; coachReply: string }) => (await apiRequest("PATCH", `/api/check-ins/${id}/reply`, { coachReply })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/check-ins/coach", String(coachId)] }),
  });
  return <section className="stack"><div className="section-head"><h2>Check-ins</h2><span className="muted">Weekly client reviews and coach replies.</span></div>{checkIns.map((checkIn) => <article className="card stack" key={checkIn.id}><div><strong>{checkIn.summary}</strong><div className="muted">Energy {checkIn.energy}/5 · Sleep {checkIn.sleep}/5 · Adherence {checkIn.adherence}/5</div></div><div>{checkIn.notes}</div><div className="muted">Bodyweight: {checkIn.bodyWeight ?? "Not provided"}</div><textarea rows={3} placeholder="Reply to this check-in" value={reply[checkIn.id] ?? checkIn.coachReply ?? ""} onChange={(e) => setReply((prev) => ({ ...prev, [checkIn.id]: e.target.value }))} /><button onClick={() => sendReply.mutate({ id: checkIn.id, coachReply: reply[checkIn.id] ?? "" })}>Save reply</button></article>)}</section>;
}

function CoachMessages() {
  const { currentUser, allUsers } = useCurrentUser();
  const coachId = currentUser?.id ?? 1;
  const clients = allUsers.filter((user) => user.role === "client");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(clients[0]?.id ?? null);
  const selectedClient = clients.find((user) => user.id === selectedClientId) ?? null;
  const { data } = useQuery<{ conversation: Conversation; messages: Message[] }>({ queryKey: ["/api/conversations", String(coachId), String(selectedClientId ?? 0)], enabled: !!selectedClientId });
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const send = useMutation({
    mutationFn: async () => {
      if (!data?.conversation || !body.trim()) return null;
      return (await apiRequest("POST", "/api/messages", { conversationId: data.conversation.id, senderId: coachId, body })).json();
    },
    onSuccess: () => {
      setBody("");
      selectedClientId && qc.invalidateQueries({ queryKey: ["/api/conversations", String(coachId), String(selectedClientId)] });
    },
  });
  return <section className="stack"><div className="section-head"><h2>Direct messages</h2><select value={selectedClientId ?? ""} onChange={(e) => setSelectedClientId(Number(e.target.value))}>{clients.map((client) => <option key={client.id} value={client.id}>{client.displayName}</option>)}</select></div><article className="card stack"><strong>{selectedClient?.displayName ?? "Select a client"}</strong><div className="stack">{data?.messages.map((message) => <div key={message.id} className={message.senderId === coachId ? "bubble mine" : "bubble"}>{message.body}</div>)}</div><textarea rows={3} placeholder="Write a message" value={body} onChange={(e) => setBody(e.target.value)} /><button onClick={() => send.mutate()}>Send</button></article></section>;
}

function ClientHome() {
  const { currentUser } = useCurrentUser();
  const clientId = currentUser?.id ?? 2;
  const { data: assignment } = useQuery<ClientAssignment>({ queryKey: ["/api/client-assignments/client", String(clientId)] });
  const { data: sessions = [] } = useQuery<WorkoutSession[]>({ queryKey: ["/api/workout-sessions/user", String(clientId)] });
  return <section className="stack"><div className="section-head"><h2>Overview</h2><span className="muted">Your current coaching essentials.</span></div><div className="stats-grid"><div><span>Assigned program</span><strong>{assignment?.programId ? `Program #${assignment.programId}` : "Not assigned"}</strong></div><div><span>Sessions logged</span><strong>{sessions.length}</strong></div></div><article className="card"><strong>What matters right now</strong><div className="muted">Train the assigned plan, hit the nutrition targets, complete your weekly check-in, and keep messages direct and clear.</div></article></section>;
}

function ClientTraining() {
  const { currentUser } = useCurrentUser();
  const clientId = currentUser?.id ?? 2;
  const { data: assignment } = useQuery<ClientAssignment>({ queryKey: ["/api/client-assignments/client", String(clientId)] });
  const { data: program } = useQuery<Program>({ queryKey: ["/api/programs", String(assignment?.programId ?? 0)], enabled: !!assignment?.programId });
  const { data: days = [] } = useQuery<ProgramDay[]>({ queryKey: ["/api/programs", String(program?.id ?? 0), "days"], enabled: !!program?.id });
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const { data: exercises = [] } = useQuery<ProgramDayExercise[]>({ queryKey: ["/api/program-days", String(selectedDayId ?? 0), "exercises"], enabled: !!selectedDayId });
  const qc = useQueryClient();
  const logSession = useMutation({
    mutationFn: async () => {
      if (!program || !selectedDayId) return null;
      const session = await (await apiRequest("POST", "/api/workout-sessions", { userId: clientId, programId: program.id, title: `${program.title} - ${days.find((day) => day.id === selectedDayId)?.dayName ?? "Day"}`, durationSeconds: 2700, totalVolume: 0, notes: "Logged from MVP training view" })).json();
      for (const [index, exercise] of exercises.entries()) {
        await apiRequest("POST", "/api/workout-sets", { sessionId: session.id, exerciseId: exercise.exerciseId, setNumber: 1, weight: 0, reps: exercise.repsMin, rpe: exercise.rpeTarget ?? 7, completed: true, exerciseOrder: index + 1 });
      }
      return session;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/workout-sessions/user", String(clientId)] }),
  });
  return <section className="stack"><div className="section-head"><h2>Training</h2><span className="muted">Assigned sessions only.</span></div>{program ? <article className="card stack"><div><strong>{program.title}</strong><div className="muted">{program.description}</div></div><div className="chips">{days.map((day) => <button key={day.id} className={selectedDayId === day.id ? "chip active" : "chip"} onClick={() => setSelectedDayId(day.id)}>{day.dayName}</button>)}</div>{selectedDayId && <div className="stack">{exercises.map((exercise) => <div className="list-row" key={exercise.id}><div><strong>Exercise #{exercise.exerciseId}</strong><div className="muted">{exercise.sets} sets · {exercise.repsMin}-{exercise.repsMax} reps · RPE {exercise.rpeTarget ?? 7}</div></div></div>)}<button onClick={() => logSession.mutate()}>Log completed session</button></div>}</article> : <article className="card">No assigned program yet.</article>}</section>;
}

function ClientNutrition() {
  const { currentUser } = useCurrentUser();
  const clientId = currentUser?.id ?? 2;
  const { data: assignment } = useQuery<ClientNutritionAssignment>({ queryKey: ["/api/nutrition-assignments/client", String(clientId)] });
  const { data: plans = [] } = useQuery<NutritionPlan[]>({ queryKey: ["/api/nutrition-plans/coach", String(assignment?.coachId ?? 0)], enabled: !!assignment?.coachId });
  const plan = plans.find((item) => item.id === assignment?.nutritionPlanId);
  return <section className="stack"><div className="section-head"><h2>Nutrition</h2><span className="muted">Assigned targets and simple guidance.</span></div>{plan ? <article className="card stack"><strong>{plan.title}</strong><div className="stats-grid"><div><span>Calories</span><strong>{plan.caloriesTarget}</strong></div><div><span>Protein</span><strong>{plan.proteinTarget} g</strong></div><div><span>Carbs</span><strong>{plan.carbsTarget} g</strong></div><div><span>Fats</span><strong>{plan.fatsTarget} g</strong></div></div><div>{plan.guidance}</div></article> : <article className="card">No assigned nutrition plan yet.</article>}</section>;
}

function ClientCheckIns() {
  const { currentUser } = useCurrentUser();
  const clientId = currentUser?.id ?? 2;
  const { data: checkIns = [] } = useQuery<CheckIn[]>({ queryKey: ["/api/check-ins/client", String(clientId)] });
  const qc = useQueryClient();
  const [form, setForm] = useState({ summary: "Weekly check-in", energy: 3, sleep: 3, adherence: 3, bodyWeight: "", notes: "" });
  const submit = useMutation({
    mutationFn: async () => (await apiRequest("POST", "/api/check-ins", { clientId, coachId: 1, ...form })).json(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/check-ins/client", String(clientId)] }); setForm({ summary: "Weekly check-in", energy: 3, sleep: 3, adherence: 3, bodyWeight: "", notes: "" }); },
  });
  return <section className="stack"><div className="section-head"><h2>Check-in</h2><span className="muted">Weekly feedback for your coach.</span></div><article className="card stack"><input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Summary" /><div className="stats-grid"><label>Energy<input type="number" min={1} max={5} value={form.energy} onChange={(e) => setForm({ ...form, energy: Number(e.target.value) })} /></label><label>Sleep<input type="number" min={1} max={5} value={form.sleep} onChange={(e) => setForm({ ...form, sleep: Number(e.target.value) })} /></label><label>Adherence<input type="number" min={1} max={5} value={form.adherence} onChange={(e) => setForm({ ...form, adherence: Number(e.target.value) })} /></label><label>Bodyweight<input value={form.bodyWeight} onChange={(e) => setForm({ ...form, bodyWeight: e.target.value })} placeholder="e.g. 81.1 kg" /></label></div><textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="How did the week go?" /><button onClick={() => submit.mutate()}>Submit check-in</button></article>{checkIns.map((checkIn) => <article className="card stack" key={checkIn.id}><strong>{checkIn.summary}</strong><div className="muted">Energy {checkIn.energy}/5 · Sleep {checkIn.sleep}/5 · Adherence {checkIn.adherence}/5</div><div>{checkIn.notes}</div>{checkIn.coachReply && <div><strong>Coach reply</strong><div>{checkIn.coachReply}</div></div>}</article>)}</section>;
}

function SharedMessages() {
  const { currentUser } = useCurrentUser();
  const isCoach = currentUser?.role === "coach";
  const coachId = isCoach ? currentUser?.id ?? 1 : 1;
  const clientId = isCoach ? 2 : currentUser?.id ?? 2;
  const { data } = useQuery<{ conversation: Conversation; messages: Message[] }>({ queryKey: ["/api/conversations", String(coachId), String(clientId)] });
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const send = useMutation({
    mutationFn: async () => {
      if (!data?.conversation || !currentUser || !body.trim()) return null;
      return (await apiRequest("POST", "/api/messages", { conversationId: data.conversation.id, senderId: currentUser.id, body })).json();
    },
    onSuccess: () => { setBody(""); qc.invalidateQueries({ queryKey: ["/api/conversations", String(coachId), String(clientId)] }); },
  });
  return <section className="stack"><div className="section-head"><h2>Messages</h2><span className="muted">Direct coach/client thread only.</span></div><article className="card stack"><div className="stack">{data?.messages.map((message) => <div className={message.senderId === currentUser?.id ? "bubble mine" : "bubble"} key={message.id}>{message.body}</div>)}</div><textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message" /><button onClick={() => send.mutate()}>Send</button></article></section>;
}

function CoachHome() { return <section className="stack"><CoachClients /></section>; }
function CoachPrograms() { const { currentUser } = useCurrentUser(); return <ProgramEditor coachId={currentUser?.id ?? 1} />; }
function ClientDashboard() { return <ClientHome />; }

function Router() {
  const { currentUser } = useCurrentUser();
  const isCoach = currentUser?.role === "coach";
  return <AppLayout><Switch>{isCoach ? <><Route path="/" component={CoachHome} /><Route path="/programs" component={CoachPrograms} /><Route path="/nutrition" component={CoachNutrition} /><Route path="/check-ins" component={CoachCheckIns} /><Route path="/messages" component={CoachMessages} /></> : <><Route path="/" component={ClientDashboard} /><Route path="/training" component={ClientTraining} /><Route path="/nutrition" component={ClientNutrition} /><Route path="/check-ins" component={ClientCheckIns} /><Route path="/messages" component={SharedMessages} /></>}<Route>Not found.</Route></Switch></AppLayout>;
}

export default function App() {
  return <QueryClientProvider client={queryClient}><UserProvider><Router /></UserProvider></QueryClientProvider>;
}
