import { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MobileShell } from "@/components/MobileShell";

interface ScoutingPageLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function ScoutingPageLayout({
  children,
  footer,
  headerTitle,
  headerSubtitle,
}: ScoutingPageLayoutProps) {
  return (
    <MobileShell>
      <div className="gradient-brand h-1.5 w-full shrink-0" />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 px-7 pt-4">
          <AppHeader title={headerTitle} subtitle={headerSubtitle} />
        </div>

        <main className="flex-1 overflow-y-auto pb-4">{children}</main>

        {footer}
      </div>
    </MobileShell>
  );
}
