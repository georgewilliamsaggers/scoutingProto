"use client";

import { CatalogueConfigPage } from "@/components/desktop/CatalogueConfigPage";
import { FARMX_BASE_NAV, FarmXShell } from "@/components/desktop/FarmXShell";

export function DesktopApp() {
  return (
    <FarmXShell
      navItems={FARMX_BASE_NAV}
      defaultPage="catalogue"
      defaultExpandedIds={["setup"]}
      placeholderHint="Switch back to Catalogue configuration from Setup in the sidebar."
      renderPage={(page) => (page === "catalogue" ? <CatalogueConfigPage /> : null)}
    />
  );
}
