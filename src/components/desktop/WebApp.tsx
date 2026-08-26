"use client";

import { FARMX_BASE_NAV, FarmXNavItem, FarmXShell } from "@/components/desktop/FarmXShell";
import { ScoutingSessionsPage } from "@/components/desktop/ScoutingSessionsPage";
import { ViewObservationsPage } from "@/components/desktop/ViewObservationsPage";

const WEB_NAV: FarmXNavItem[] = FARMX_BASE_NAV.flatMap((item) =>
  item.id === "farming"
    ? [
        item,
        {
          id: "scouting",
          label: "Scouting",
          children: [
            { id: "sessions", label: "Scouting sessions" },
            { id: "observations", label: "View observations" },
          ],
        },
      ]
    : [item]
);

export function WebApp() {
  return (
    <FarmXShell
      navItems={WEB_NAV}
      defaultPage="observations"
      defaultExpandedIds={["scouting"]}
      fillMain
      placeholderHint="Open Scouting in the sidebar to view sessions or observations."
      renderPage={(page) => {
        if (page === "observations") return <ViewObservationsPage />;
        if (page === "sessions") return <ScoutingSessionsPage />;
        return null;
      }}
    />
  );
}
