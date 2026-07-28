import { ScoutingTask } from "@/lib/scouting-tasks";

interface TaskCardProps {
  task: ScoutingTask;
  selected: boolean;
  onSelect: () => void;
}

export function TaskCard({ task, selected, onSelect }: TaskCardProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={[
          "flex w-full items-start gap-3 px-7 py-3 text-left transition-colors active:bg-surface",
          selected ? "bg-teal/5" : "hover:bg-surface",
        ].join(" ")}
      >
        <SelectionIndicator selected={selected} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-navy">{task.title}</p>
          <p className="mt-1 truncate text-xs text-muted">
            {task.project} · {task.category} · {task.location} · {task.commodity}
          </p>
        </div>
      </button>
    </li>
  );
}

function SelectionIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      className={[
        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
        selected ? "border-teal bg-teal" : "border-border bg-surface-elevated",
      ].join(" ")}
      aria-hidden="true"
    >
      {selected && (
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
}
