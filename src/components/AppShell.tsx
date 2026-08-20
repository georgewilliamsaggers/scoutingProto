"use client";

import { useEffect, useState } from "react";
import { AppHeaderProvider, useAppHeader } from "@/components/AppHeaderContext";
import { AppSectionPlaceholder } from "@/components/AppSectionPlaceholder";
import { AppSideMenu } from "@/components/AppSideMenu";
import { MobileShell } from "@/components/MobileShell";
import { ScoutingSection } from "@/components/ScoutingSection";
import { AppSection, getAppSectionLabel } from "@/lib/app-sections";

interface AppShellProps {
  initialSection?: AppSection;
}

export function AppShell({ initialSection = "scouting" }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<AppSection>(initialSection);

  return (
    <AppHeaderProvider defaultTitle={getAppSectionLabel(activeSection)}>
      <AppShellFrame
        activeSection={activeSection}
        menuOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        onSectionChange={(section) => {
          setActiveSection(section);
          setMenuOpen(false);
        }}
      />
    </AppHeaderProvider>
  );
}

function AppShellFrame({
  activeSection,
  menuOpen,
  onMenuOpen,
  onMenuClose,
  onSectionChange,
}: {
  activeSection: AppSection;
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onSectionChange: (section: AppSection) => void;
}) {
  const { config, setHeaderConfig } = useAppHeader();

  useEffect(() => {
    setHeaderConfig({
      title: getAppSectionLabel(activeSection),
      showBack: false,
    });
  }, [activeSection, setHeaderConfig]);

  return (
    <MobileShell>
      <div className="gradient-brand h-1.5 w-full shrink-0" />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 border-b border-border/60 bg-surface-elevated px-4 py-3">
          <div className="flex justify-start">
            {config.showBack && config.onBack ? (
              <button
                type="button"
                onClick={config.onBack}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-surface active:scale-95"
                aria-label="Go back"
              >
                <BackIcon />
              </button>
            ) : (
              <span className="h-10 w-10" aria-hidden="true" />
            )}
          </div>

          <h1 className="truncate text-center text-lg font-bold text-navy">
            {config.title}
          </h1>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-surface active:scale-95"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {activeSection === "scouting" ? (
            <ScoutingSection key={activeSection} />
          ) : (
            <AppSectionPlaceholder section={activeSection} />
          )}
        </div>

        <AppSideMenu
          open={menuOpen}
          activeSection={activeSection}
          onClose={onMenuClose}
          onSelect={onSectionChange}
        />
      </div>
    </MobileShell>
  );
}

function BackIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}
