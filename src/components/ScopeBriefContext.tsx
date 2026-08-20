"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

interface ScopeBriefContextValue {
  activeSectionId: string;
  setActiveSectionId: (sectionId: string) => void;
}

const ScopeBriefContext = createContext<ScopeBriefContextValue | null>(null);

export function ScopeBriefProvider({ children }: { children: ReactNode }) {
  const [activeSectionId, setActiveSectionId] = useState("log-observation");

  return (
    <ScopeBriefContext.Provider value={{ activeSectionId, setActiveSectionId }}>
      {children}
    </ScopeBriefContext.Provider>
  );
}

export function useScopeBrief() {
  const context = useContext(ScopeBriefContext);
  if (!context) {
    throw new Error("useScopeBrief must be used within ScopeBriefProvider");
  }
  return context;
}

export function useScopeBriefOptional() {
  return useContext(ScopeBriefContext);
}
