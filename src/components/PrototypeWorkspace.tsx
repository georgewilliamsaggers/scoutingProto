"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ScopeBriefProvider } from "@/components/ScopeBriefContext";
import { ScopeBriefPanel } from "@/components/ScopeBriefPanel";

interface PrototypeWorkspaceContextValue {
  isSplitView: boolean;
  briefOpen: boolean;
  setBriefOpen: (open: boolean) => void;
}

const PrototypeWorkspaceContext =
  createContext<PrototypeWorkspaceContextValue | null>(null);

export function usePrototypeWorkspace() {
  return useContext(PrototypeWorkspaceContext);
}

interface PrototypeWorkspaceProps {
  children: ReactNode;
}

export function PrototypeWorkspace({ children }: PrototypeWorkspaceProps) {
  const [isSplitView, setIsSplitView] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");

    function update() {
      setIsSplitView(media.matches);
      if (media.matches) {
        setBriefOpen(false);
      }
    }

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <ScopeBriefProvider>
      <PrototypeWorkspaceContext.Provider
        value={{ isSplitView, briefOpen, setBriefOpen }}
      >
        <div className="flex min-h-dvh w-full">
        <div
          className={[
            "relative min-h-dvh min-w-0",
            isSplitView ? "xl:w-1/2 xl:shrink-0" : "flex-1",
          ].join(" ")}
        >
          {children}

          {!isSplitView && (
            <button
              type="button"
              onClick={() => setBriefOpen(true)}
              className="fixed bottom-5 right-5 z-40 flex h-11 items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 text-sm font-semibold text-navy shadow-lg shadow-navy/10 transition-colors hover:border-teal/40 xl:hidden"
            >
              <BriefIcon />
              Scope brief
            </button>
          )}
        </div>

        {isSplitView ? (
          <aside className="hidden h-dvh w-1/2 shrink-0 flex-col border-l border-border bg-surface xl:flex">
            <ScopeBriefPanel onClose={() => setBriefOpen(false)} />
          </aside>
        ) : briefOpen ? (
          <div className="fixed inset-0 z-50 flex xl:hidden">
            <button
              type="button"
              aria-label="Close scope brief"
              onClick={() => setBriefOpen(false)}
              className="absolute inset-0 bg-navy/40"
            />
            <aside className="relative ml-auto flex h-full w-full max-w-lg flex-col bg-surface shadow-2xl">
              <ScopeBriefPanel onClose={() => setBriefOpen(false)} />
            </aside>
          </div>
        ) : null}
        </div>
      </PrototypeWorkspaceContext.Provider>
    </ScopeBriefProvider>
  );
}

function BriefIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </svg>
  );
}
