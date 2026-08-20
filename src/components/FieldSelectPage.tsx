"use client";

import { Field, fields, formatHectares } from "@/lib/fields";

interface FieldSelectPageProps {
  subtitle: string;
  actionLabel: string;
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
  onConfirm: () => void;
}

export function FieldSelectPage({
  subtitle,
  actionLabel,
  selectedFieldId,
  onSelectField,
  onConfirm,
}: FieldSelectPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border/60 px-7 py-4">
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {fields.map((field) => (
          <FieldSelectRow
            key={field.id}
            field={field}
            selected={selectedFieldId === field.id}
            onSelect={() => onSelectField(field.id)}
          />
        ))}
      </ul>

      <div className="shrink-0 border-t border-border/60 bg-surface-elevated px-7 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!selectedFieldId}
          className="btn-primary-block disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function FieldSelectRow({
  field,
  selected,
  onSelect,
}: {
  field: Field;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={[
          "flex w-full items-start gap-3 border-b border-border/40 px-7 py-4 text-left transition-colors active:bg-surface",
          selected ? "bg-teal/5" : "hover:bg-surface",
        ].join(" ")}
      >
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

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy">{field.name}</p>
          <p className="mt-1 text-xs text-muted">
            {field.crop} · {field.variety} · {formatHectares(field.hectares)}
          </p>
        </div>
      </button>
    </li>
  );
}
