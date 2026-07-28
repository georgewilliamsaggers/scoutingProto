"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ScoutingPageLayout } from "@/components/ScoutingPageLayout";
import { filterScoutingTasks, scoutingTasks } from "@/lib/scouting-tasks";
import { TaskCard } from "@/components/TaskCard";

export function ScoutingInstancesView() {
  const router = useRouter();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(
    () => filterScoutingTasks(scoutingTasks, searchQuery),
    [searchQuery]
  );

  const selectedTask = scoutingTasks.find((task) => task.id === selectedTaskId);

  function handleStartScouting() {
    if (!selectedTask) return;
    router.push(`/scouting/${selectedTask.id}`);
  }

  return (
    <ScoutingPageLayout
      headerTitle="Scouting"
      headerSubtitle="Select a task and then start scouting"
      footer={
        <div className="shrink-0 border-t border-border/60 bg-surface-elevated px-7 pb-4 pt-4 shadow-[0_-4px_24px_rgba(26,39,68,0.06)] max-md:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleStartScouting}
            disabled={!selectedTask}
            className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold text-white shadow-lg shadow-lime/25 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            Start scouting
          </button>
        </div>
      }
    >
      <div className="mb-3 px-7">
        <div className="relative">
          <SearchIcon />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks…"
            className="h-10 w-full rounded-xl border border-border bg-surface-elevated py-2 pl-9 pr-4 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20"
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="px-7 text-sm text-muted">No tasks match your search.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border bg-surface-elevated">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              selected={selectedTaskId === task.id}
              onSelect={() => setSelectedTaskId(task.id)}
            />
          ))}
        </ul>
      )}
    </ScoutingPageLayout>
  );
}

function SearchIcon() {
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
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
