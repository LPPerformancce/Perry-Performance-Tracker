import { cn } from "@/lib/utils";

interface LPLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "watermark";
  className?: string;
  variant?: "gold" | "white" | "muted";
}

const sizeMap = {
  xs: "w-5 h-5",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
  watermark: "w-64 h-64",
};

const colorMap = {
  gold: "text-primary",
  white: "text-white",
  muted: "text-muted-foreground/20",
};

export function LPLogo({ size = "md", className, variant = "gold" }: LPLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], colorMap[variant], className)}
    >
      <rect x="2" y="2" width="96" height="96" rx="12" stroke="currentColor" strokeWidth="3" fill="none" />
      <path
        d="M24 22V78H44V68H34V22H24Z"
        fill="currentColor"
      />
      <path
        d="M50 22V78H60V58H70C78 58 84 52 84 44V36C84 28 78 22 70 22H50ZM60 32H68C72 32 74 34 74 38V42C74 46 72 48 68 48H60V32Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LPLogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6 text-primary", className)}
    >
      <path
        d="M10 10V90H30V76H20V10H10Z"
        fill="currentColor"
      />
      <path
        d="M38 10V90H48V54H62C72 54 80 46 80 36V28C80 18 72 10 62 10H38ZM48 22H60C65 22 68 25 68 30V34C68 39 65 42 60 42H48V22Z"
        fill="currentColor"
      />
    </svg>
  );
}
