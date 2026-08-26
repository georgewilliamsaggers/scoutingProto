"use client";

import { ReactNode, useState } from "react";

export interface FarmXNavChild {
  id: string;
  label: string;
}

export interface FarmXNavItem {
  id: string;
  label: string;
  children?: FarmXNavChild[];
}

export const FARMX_BASE_NAV: FarmXNavItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "planning", label: "Planning" },
  { id: "task-management", label: "Task management" },
  { id: "human-resource", label: "Human resource" },
  { id: "stores", label: "Stores" },
  { id: "sales", label: "Sales" },
  { id: "farming", label: "Farming" },
  { id: "water-management", label: "Water management" },
  { id: "orchards", label: "Orchards" },
  { id: "asset-management", label: "Asset management" },
  { id: "finance", label: "Finance" },
  { id: "security-management", label: "Security management" },
  { id: "weigh-bridge", label: "Weigh bridge" },
  { id: "admin", label: "Admin" },
  {
    id: "setup",
    label: "Setup",
    children: [{ id: "catalogue", label: "Catalogue configuration" }],
  },
  { id: "internal", label: "Internal" },
  { id: "tenant-management", label: "Tenant management" },
];

interface FarmXShellProps {
  navItems: FarmXNavItem[];
  defaultPage: string;
  defaultExpandedIds?: string[];
  fillMain?: boolean;
  placeholderHint?: string;
  renderPage: (page: string) => ReactNode;
}

export function FarmXShell({
  navItems,
  defaultPage,
  defaultExpandedIds = [],
  fillMain = false,
  placeholderHint = "This FarmX module is a shell only.",
  renderPage,
}: FarmXShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);
  const [page, setPage] = useState(defaultPage);
  const [placeholderLabel, setPlaceholderLabel] = useState("Dashboard");

  function toggleExpanded(id: string) {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function openPlaceholder(label: string, id: string) {
    setPlaceholderLabel(label);
    setPage(id);
  }

  const pageContent = renderPage(page);

  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-[#f3f4f6] text-stone-800">
      <aside
        className={[
          "flex h-full shrink-0 flex-col bg-[#1a4a4e] text-white transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-[248px]",
        ].join(" ")}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
          <FarmXMark />
          {!collapsed && (
            <span className="text-[15px] font-semibold tracking-wide">FarmX</span>
          )}
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const expanded = expandedIds.includes(item.id);
            const childActive =
              item.children?.some((child) => child.id === page) ?? false;

            return (
              <div key={item.id}>
                <button
                  type="button"
                  title={item.label}
                  onClick={() => {
                    if (item.children) {
                      toggleExpanded(item.id);
                      return;
                    }
                    openPlaceholder(item.label, item.id);
                  }}
                  className={[
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors",
                    childActive
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <NavGlyph name={item.id} />
                  {!collapsed && (
                    <>
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <ChevronIcon open={expanded} />
                    </>
                  )}
                </button>

                {!collapsed && item.children && expanded && (
                  <div className="pb-1">
                    {item.children.map((child) => {
                      const active = page === child.id;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => setPage(child.id)}
                          className={[
                            "flex w-full items-center px-4 py-2 pl-12 text-left text-[13px] transition-colors",
                            active
                              ? "bg-white/15 font-medium text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white",
                          ].join(" ")}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="flex h-12 items-center gap-3 border-t border-white/10 px-4 text-[13px] text-white/80 hover:bg-white/10 hover:text-white"
        >
          <CollapseIcon flipped={collapsed} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setCollapsed((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100"
          >
            <MenuIcon />
          </button>

          <div className="flex items-center gap-1">
            <HeaderIcon label="Search">
              <SearchIcon />
            </HeaderIcon>
            <HeaderIcon label="Notifications" badge="99+" badgeClass="bg-[#7c3aed]">
              <BellIcon />
            </HeaderIcon>
            <HeaderIcon label="User switcher" badge="2" badgeClass="bg-[#2a8f7b]">
              <UsersIcon />
            </HeaderIcon>
            <HeaderIcon label="Help">
              <HelpIcon />
            </HeaderIcon>
            <div className="ml-2 flex items-center gap-2 border-l border-stone-200 pl-3">
              <div className="text-right">
                <p className="text-sm font-medium leading-none text-stone-800">
                  George Saggers
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                  ADM
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
                GS
              </div>
            </div>
          </div>
        </header>

        <main
          className={[
            "min-h-0 flex-1 p-6 pb-24",
            fillMain ? "flex flex-col overflow-hidden" : "overflow-y-auto",
          ].join(" ")}
        >
          {pageContent ?? (
            <PlaceholderPage label={placeholderLabel} hint={placeholderHint} />
          )}
        </main>
      </div>
    </div>
  );
}

export function PlaceholderPage({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-[960px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
        {label}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
        Not in this prototype
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        {hint ?? "This FarmX module is a shell only."}
      </p>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white px-5 py-10 text-center text-sm text-stone-500">
        Use the sidebar to open a working section, or switch view with the toggle in the
        bottom-right.
      </div>
    </div>
  );
}

function HeaderIcon({
  label,
  badge,
  badgeClass,
  children,
}: {
  label: string;
  badge?: string;
  badgeClass?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100"
    >
      {children}
      {badge && (
        <span
          className={[
            "absolute -right-0.5 -top-0.5 rounded-full px-1 text-[9px] font-bold leading-4 text-white",
            badgeClass,
          ].join(" ")}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function FarmXMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#32cd32]/90 text-[11px] font-bold text-[#1a4a4e]">
      fX
    </span>
  );
}

function NavGlyph({ name }: { name: string }) {
  const path =
    {
      dashboard: "M4 13h6V4H4zm10 7h6v-9h-6zM4 20h6v-5H4zm10-9h6V4h-6z",
      planning: "M8 7V3m8 4V3M5 11h14M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
      "task-management": "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
      "human-resource": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M8 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
      stores: "M3 9l1-5h16l1 5M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18",
      sales: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
      farming: "M12 22V8M5 12c4-8 10-8 14 0M8 22c.5-3 2-5 4-5s3.5 2 4 5",
      scouting: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
      "water-management": "M12 2.7c3.5 4.5 7 8.2 7 11.3a7 7 0 1 1-14 0c0-3.1 3.5-6.8 7-11.3z",
      orchards: "M12 22V10M7 8a5 5 0 1 1 10 0c0 4-5 6-5 6s-5-2-5-6z",
      "asset-management": "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
      finance: "M3 3v18h18M7 14l4-4 4 4 6-6",
      "security-management": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
      "weigh-bridge": "M4 20h16M6 16l2-8h8l2 8M10 8V4h4v4",
      admin: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a7.9 7.9 0 0 0 .1-1 7.9 7.9 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L13 3h-2l-.3 2.5a8 8 0 0 0-1.7 1L6.6 5.9l-2 3.5 2 1.5a8 8 0 0 0-.1 2 8 8 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1L11 21h2l.3-2.5a8 8 0 0 0 1.7-1l2.4 1 2-3.5z",
      setup: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
      internal: "M3 7h18M3 12h18M3 17h18",
      "tenant-management": "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6",
    }[name] ?? "M4 6h16M4 12h16M4 18h16";

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 opacity-90"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={["shrink-0 opacity-70 transition-transform", open ? "rotate-180" : ""].join(" ")}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CollapseIcon({ flipped }: { flipped: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={flipped ? "rotate-180" : ""}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 1 1 4.4 2.7c-.8.4-1.5 1.1-1.5 2" />
      <path d="M12 17h.01" />
    </svg>
  );
}
