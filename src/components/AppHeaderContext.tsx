"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface AppHeaderConfig {
  title: string;
  showBack: boolean;
  onBack?: () => void;
}

interface AppHeaderContextValue {
  config: AppHeaderConfig;
  setHeaderConfig: (config: AppHeaderConfig) => void;
}

const AppHeaderContext = createContext<AppHeaderContextValue | null>(null);

export function AppHeaderProvider({
  children,
  defaultTitle,
}: {
  children: ReactNode;
  defaultTitle: string;
}) {
  const [config, setConfig] = useState<AppHeaderConfig>({
    title: defaultTitle,
    showBack: false,
  });

  const setHeaderConfig = useCallback((next: AppHeaderConfig) => {
    setConfig(next);
  }, []);

  const value = useMemo(
    () => ({ config, setHeaderConfig }),
    [config, setHeaderConfig]
  );

  return (
    <AppHeaderContext.Provider value={value}>
      {children}
    </AppHeaderContext.Provider>
  );
}

export function useAppHeader() {
  const context = useContext(AppHeaderContext);
  if (!context) {
    throw new Error("useAppHeader must be used within AppHeaderProvider");
  }
  return context;
}
