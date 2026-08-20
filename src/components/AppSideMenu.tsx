"use client";

import { AppSection, APP_SECTIONS } from "@/lib/app-sections";

interface AppSideMenuProps {
  open: boolean;
  activeSection: AppSection;
  onClose: () => void;
  onSelect: (section: AppSection) => void;
}

export function AppSideMenu({
  open,
  activeSection,
  onClose,
  onSelect,
}: AppSideMenuProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-navy/40"
      />

      <nav
        aria-label="Main navigation"
        className="relative side-menu-panel flex h-full w-[min(18rem,82%)] flex-col bg-surface-elevated shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            Menu
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-navy"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto px-3 py-3">
          {APP_SECTIONS.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-colors",
                    isActive
                      ? "bg-teal/10 text-navy"
                      : "text-navy hover:bg-surface active:bg-surface",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      isActive ? "bg-teal/15 text-teal" : "bg-surface text-muted",
                    ].join(" ")}
                  >
                    <SectionIcon section={item.id} />
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-teal" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function SectionIcon({ section }: { section: AppSection }) {
  switch (section) {
    case "incidents":
      return <AlertIcon />;
    case "patrols":
      return <PatrolIcon />;
    case "water-management":
      return <WaterIcon />;
    case "scouting":
      return <ScoutIcon />;
    case "settings":
      return <SettingsIcon />;
  }
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function PatrolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.69c2.5 3 5 6.5 5 9.5a5 5 0 0 1-10 0c0-3 2.5-6.5 5-9.5Z" />
    </svg>
  );
}

function ScoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
