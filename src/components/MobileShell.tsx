import { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = "" }: MobileShellProps) {
  return (
    <div
      className={[
        "flex min-h-dvh",
        // Phone / narrow viewport: full-screen app feel
        "bg-surface-elevated",
        // Wider viewport: centered phone mockup
        "md:items-center md:justify-center md:bg-gradient-to-b md:from-slate-100 md:to-slate-200 md:px-4 md:py-10",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex h-dvh w-full flex-col overflow-hidden bg-surface-elevated",
          "md:h-[780px] md:max-w-[430px] md:rounded-[2rem] md:shadow-[0_25px_60px_-12px_rgba(26,39,68,0.25)] md:ring-1 md:ring-black/5",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
