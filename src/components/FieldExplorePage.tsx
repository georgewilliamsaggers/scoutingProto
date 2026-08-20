"use client";

import { Field, fields, formatHectares } from "@/lib/fields";

interface FieldExplorePageProps {
  onSelectField: (fieldId: string) => void;
}

export function FieldExplorePage({ onSelectField }: FieldExplorePageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border/60 px-7 py-4">
        <p className="text-sm text-muted">
          Select a field to view recent observations
        </p>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {fields.map((field) => (
          <FieldExploreRow
            key={field.id}
            field={field}
            onSelect={() => onSelectField(field.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function FieldExploreRow({
  field,
  onSelect,
}: {
  field: Field;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-3 border-b border-border/40 px-7 py-4 text-left transition-colors hover:bg-surface active:bg-surface"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy">{field.name}</p>
          <p className="mt-1 text-xs text-muted">
            {field.crop} · {field.variety} · {formatHectares(field.hectares)}
          </p>
        </div>
        <ChevronRightIcon />
      </button>
    </li>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-muted">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
