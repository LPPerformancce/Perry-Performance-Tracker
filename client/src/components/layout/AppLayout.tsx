import { BottomNav } from "./BottomNav";
import { LPLogo } from "@/components/ui/LPLogo";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-16 relative">
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0 overflow-hidden">
        <LPLogo size="watermark" variant="muted" className="w-[60vw] h-[60vw] max-w-[400px] max-h-[400px]" />
      </div>

      <main className="flex-1 w-full max-w-md mx-auto relative z-10 overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}