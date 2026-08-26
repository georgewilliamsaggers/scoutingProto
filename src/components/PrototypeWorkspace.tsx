"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CatalogueProvider } from "@/components/desktop/CatalogueContext";
import { DesktopApp } from "@/components/desktop/DesktopApp";
import { WebApp } from "@/components/desktop/WebApp";

export type PrototypeViewMode = "mobile" | "config" | "web";

interface PrototypeWorkspaceContextValue {
  viewMode: PrototypeViewMode;
  setViewMode: (mode: PrototypeViewMode) => void;
}

const PrototypeWorkspaceContext =
  createContext<PrototypeWorkspaceContextValue | null>(null);

export function usePrototypeWorkspace() {
  return useContext(PrototypeWorkspaceContext);
}

const VIEW_MODE_KEY = "farmx-prototype-view-mode";

interface PrototypeWorkspaceProps {
  children: ReactNode;
}

function readStoredViewMode(): PrototypeViewMode {
  const stored = window.localStorage.getItem(VIEW_MODE_KEY);
  if (stored === "desktop") return "config";
  if (stored === "mobile" || stored === "config" || stored === "web") return stored;
  return "mobile";
}

export function PrototypeWorkspace({ children }: PrototypeWorkspaceProps) {
  const [viewMode, setViewModeState] = useState<PrototypeViewMode>("mobile");

  useEffect(() => {
    setViewModeState(readStoredViewMode());
  }, []);

  function setViewMode(mode: PrototypeViewMode) {
    setViewModeState(mode);
    window.localStorage.setItem(VIEW_MODE_KEY, mode);
  }

  return (
    <CatalogueProvider>
      <PrototypeWorkspaceContext.Provider value={{ viewMode, setViewMode }}>
        <div className="relative min-h-dvh w-full">
          {viewMode === "config" ? (
            <DesktopApp />
          ) : viewMode === "web" ? (
            <WebApp />
          ) : (
            children
          )}
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </PrototypeWorkspaceContext.Provider>
    </CatalogueProvider>
  );
}

function ViewModeToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: PrototypeViewMode;
  setViewMode: (mode: PrototypeViewMode) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-[80] flex rounded-full border border-stone-200 bg-white p-1 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.45)]">
      <ToggleButton
        active={viewMode === "mobile"}
        onClick={() => setViewMode("mobile")}
        icon={<PhoneIcon />}
        label="Mobile"
      />
      <ToggleButton
        active={viewMode === "config"}
        onClick={() => setViewMode("config")}
        icon={<ConfigIcon />}
        label="Config"
      />
      <ToggleButton
        active={viewMode === "web"}
        onClick={() => setViewMode("web")}
        icon={<WebIcon />}
        label="Web view"
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
        active ? "bg-[#1a4a4e] text-white" : "text-stone-500 hover:text-stone-800",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function ConfigIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}
