"use client";

import { ReactNode } from "react";
import { usePrototypeWorkspace } from "@/components/PrototypeWorkspace";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = "" }: MobileShellProps) {
  const workspace = usePrototypeWorkspace();
  const isSplitView = workspace?.isSplitView ?? false;

  const phoneFrame = (
    <div
      className={[
        "relative flex w-full flex-col overflow-hidden bg-surface-elevated",
        isSplitView
          ? "h-[min(780px,calc(100dvh-3rem))] max-w-[430px] rounded-[2rem] shadow-[0_25px_60px_-12px_rgba(26,39,68,0.25)] ring-1 ring-black/5"
          : "h-dvh md:h-[780px] md:max-w-[430px] md:rounded-[2rem] md:shadow-[0_25px_60px_-12px_rgba(26,39,68,0.25)] md:ring-1 md:ring-black/5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );

  if (isSplitView) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-6">
        {phoneFrame}
      </div>
    );
  }

  return (
    <div
      className={[
        "flex min-h-dvh bg-surface-elevated",
        "md:items-center md:justify-center md:bg-gradient-to-b md:from-slate-100 md:to-slate-200 md:px-4 md:py-10",
      ].join(" ")}
    >
      {phoneFrame}
    </div>
  );
}
