"use client";

import { ChangeEvent, DragEvent, ReactNode, useEffect, useRef } from "react";
import { CATALOGUE_CROPS, CatalogueEntry, fileToObjectUrl } from "@/lib/catalogue";

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-[#2a8f7b]" : "bg-stone-300",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

export function ImagePicker({
  src,
  onChange,
  compact = false,
}: {
  src: string;
  onChange: (src: string) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange(fileToObjectUrl(file));
    event.target.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={[
          "flex items-center justify-center overflow-hidden border border-dashed border-stone-300 bg-stone-50 text-[10px] font-medium text-stone-500 transition-colors hover:border-[#2a8f7b] hover:bg-[#2a8f7b]/5",
          compact ? "h-12 w-12 rounded-md" : "h-16 w-16 rounded-lg",
        ].join(" ")}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span>{compact ? "+" : "Add"}</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export function DragHandle() {
  return (
    <span
      className="flex cursor-grab flex-col items-center justify-center gap-0.5 text-stone-400 active:cursor-grabbing"
      aria-hidden="true"
    >
      <span className="flex gap-0.5">
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
      </span>
      <span className="flex gap-0.5">
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
      </span>
      <span className="flex gap-0.5">
        <span className="h-1 w-1 rounded-full bg-current" />
        <span className="h-1 w-1 rounded-full bg-current" />
      </span>
    </span>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className="w-full resize-y rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm leading-relaxed text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
    />
  );
}

export function EntryFields({
  entry,
  onChange,
  showImage = false,
}: {
  entry: CatalogueEntry;
  onChange: (patch: Partial<CatalogueEntry>) => void;
  showImage?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {showImage && (
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <FieldLabel>Generic image</FieldLabel>
          <ImagePicker src={entry.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
        </div>
      )}

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <FieldLabel>Name</FieldLabel>
        <TextInput
          value={entry.label}
          onChange={(label) => onChange({ label })}
          placeholder="Display name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Scientific name</FieldLabel>
        <TextInput
          value={entry.scientificName}
          onChange={(scientificName) => onChange({ scientificName })}
          placeholder="e.g. Puccinia graminis"
        />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
        <div>
          <p className="text-sm font-medium text-stone-800">Active</p>
          <p className="text-xs text-stone-500">Visible in scouting regardless of crop</p>
        </div>
        <ToggleSwitch
          checked={entry.active}
          onChange={(active) => onChange({ active })}
          label="Active"
        />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <FieldLabel>Description</FieldLabel>
        <TextArea
          value={entry.description}
          onChange={(description) => onChange({ description })}
          placeholder="Short summary shown in the catalogue"
        />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <FieldLabel>Symptoms / damage</FieldLabel>
        <TextArea
          value={entry.symptomsDamage}
          onChange={(symptomsDamage) => onChange({ symptomsDamage })}
          placeholder="What scouts should look for in the field"
        />
      </div>
    </div>
  );
}

export function useRowDrag(onReorder: (fromIndex: number, toIndex: number) => void) {
  const dragIndex = useRef<number | null>(null);

  function onDragStart(index: number) {
    return (event: DragEvent) => {
      dragIndex.current = index;
      event.dataTransfer.effectAllowed = "move";
    };
  }

  function onDragOver(index: number) {
    return (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (dragIndex.current === null || dragIndex.current === index) return;
      onReorder(dragIndex.current, index);
      dragIndex.current = index;
    };
  }

  function onDragEnd() {
    dragIndex.current = null;
  }

  return { onDragStart, onDragOver, onDragEnd };
}

export function CropHeaderCells() {
  return (
    <>
      {CATALOGUE_CROPS.map((crop) => (
        <th
          key={crop.id}
          className="min-w-[110px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500"
        >
          {crop.label}
        </th>
      ))}
    </>
  );
}

export function AllCropsHeaderCell() {
  return (
    <th className="min-w-[64px] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
      All
    </th>
  );
}

export function AllCropsCheckbox({
  cropIds,
  onToggleAll,
  label,
  disabled = false,
}: {
  cropIds: string[];
  onToggleAll: (enabled: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  const allOn = CATALOGUE_CROPS.length > 0 && cropIds.length === CATALOGUE_CROPS.length;
  const someOn = cropIds.length > 0 && !allOn;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = someOn;
    }
  }, [someOn]);

  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={allOn}
      disabled={disabled}
      onChange={(event) => onToggleAll(event.target.checked)}
      aria-label={label}
      className="h-4 w-4 rounded border-stone-300 accent-[#2a8f7b] disabled:cursor-not-allowed"
    />
  );
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-stone-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1a4a4e] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#163c40]"
    >
      <PlusIcon />
      {children}
    </button>
  );
}

export function matchesCatalogueQuery(query: string, ...fields: (string | undefined)[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return fields.some((field) => (field ?? "").toLowerCase().includes(normalized));
}

export function CatalogueSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400">
        <SearchGlyph />
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-48 rounded-lg border border-stone-200 bg-white pl-8 pr-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15 sm:w-56"
      />
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

export function LineItemCopy({
  label,
  description,
  active,
  meta,
}: {
  label: string;
  description: string;
  active: boolean;
  meta?: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-semibold text-stone-900">{label}</p>
        {!active && (
          <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-600">
            Hidden
          </span>
        )}
      </div>
      <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-stone-500">
        {description || "No description"}
      </p>
      {meta && <p className="mt-0.5 truncate text-[11px] text-stone-400">{meta}</p>}
    </div>
  );
}

export function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-[#1a4a4e]"
    >
      {children}
    </button>
  );
}

export function PenButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton onClick={onClick} label="Edit">
      <PenIcon />
    </IconButton>
  );
}

export function PlusButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <IconButton onClick={onClick} label={label}>
      <PlusGlyph />
    </IconButton>
  );
}

function PenIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function PlusGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function EditDialog({
  open,
  title,
  subtitle,
  active,
  onActiveChange,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <button
        type="button"
        aria-label="Close editor"
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogue-edit-title"
        className="relative z-10 my-auto w-full max-w-2xl overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
              Edit
            </p>
            <h2
              id="catalogue-edit-title"
              className="mt-0.5 truncate text-lg font-semibold text-stone-900"
            >
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {onActiveChange && (
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <span>Active</span>
                <ToggleSwitch
                  checked={Boolean(active)}
                  onChange={onActiveChange}
                  label="Active"
                />
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="max-h-[min(70vh,640px)] overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex justify-end border-t border-stone-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-lg bg-[#1a4a4e] px-4 text-sm font-semibold text-white hover:bg-[#163c40]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
