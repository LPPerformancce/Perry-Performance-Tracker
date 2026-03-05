import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-16">
      <main className="flex-1 w-full max-w-md mx-auto relative overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}