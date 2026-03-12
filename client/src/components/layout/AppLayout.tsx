import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-16 relative">
      {/* Subtle watermark LP logo in the background */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0 overflow-hidden">
        <span className="font-display font-bold tracking-tighter" style={{ fontSize: '40vw', lineHeight: 1 }}>
          LP
        </span>
      </div>

      <main className="flex-1 w-full max-w-md mx-auto relative z-10 overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}