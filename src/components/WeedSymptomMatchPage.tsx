"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  searchWeedCategories,
  WEED_CATEGORIES,
  WeedCategory,
} from "@/lib/observations";

interface WeedSymptomMatchPageProps {
  onClose: () => void;
  onSelect: (categoryId: string) => void;
  onNotSure: () => void;
}

export function WeedSymptomMatchPage({
  onClose,
  onSelect,
  onNotSure,
}: WeedSymptomMatchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(
    () => searchWeedCategories(searchQuery),
    [searchQuery]
  );
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-surface-elevated">
      <div className="flex shrink-0 items-center justify-end px-5 pb-1 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-navy"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="shrink-0 px-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
          Identify the weed
        </p>
        <h1 className="text-[1.625rem] font-bold leading-tight text-navy">
          What type of weed is it?
        </h1>

        <label className="relative my-4 block">
          <SearchIcon />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search weeds…"
            className="h-11 w-full rounded-xl border border-border bg-surface py-0 pl-10 pr-4 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20"
          />
        </label>
      </div>

      {isSearching ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3">
          {searchResults.length > 0 ? (
            <div className="space-y-2.5">
              {searchResults.map((result) => (
                <SearchResultCard
                  key={result.category.id}
                  category={result.category}
                  matchedLabel={result.matchedLabel}
                  onSelect={() => onSelect(result.category.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center">
              <p className="text-sm font-semibold text-navy">No matches found</p>
              <p className="mt-1 text-sm text-muted">
                Try a weed name or browse the categories below.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3">
          <div className="grid grid-cols-2 gap-3">
            {WEED_CATEGORIES.map((category) => (
              <CategoryGridCard
                key={category.id}
                category={category}
                onSelect={() => onSelect(category.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="shrink-0 px-6 pt-2">
        <button
          type="button"
          onClick={onNotSure}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface px-4 py-3.5 text-left transition-all active:scale-[0.98] active:bg-surface-elevated"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <QuestionIcon />
          </span>
          <span>
            <span className="block text-sm font-bold text-navy">Not sure / other</span>
            <span className="mt-0.5 block text-xs text-muted">
              Take a photo, then add what you found
            </span>
          </span>
        </button>
      </div>

      <div className="shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]" />
    </div>
  );
}

function CategoryGridCard({
  category,
  onSelect,
}: {
  category: WeedCategory;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex min-h-[8.5rem] flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated text-left shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="relative min-h-0 flex-1 bg-surface">
        <Image
          src={category.imageSrc}
          alt={category.label}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 430px) 50vw, 200px"
        />
      </div>
      <div className="shrink-0 px-2.5 py-2">
        <p className="text-xs font-bold leading-tight text-navy">{category.label}</p>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted">
          {category.description}
        </p>
      </div>
    </button>
  );
}

function SearchResultCard({
  category,
  matchedLabel,
  onSelect,
}: {
  category: WeedCategory;
  matchedLabel?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated p-3 text-left shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
        <Image
          src={category.imageSrc}
          alt={category.label}
          fill
          unoptimized
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-navy">{category.label}</p>
        {matchedLabel && (
          <p className="mt-0.5 text-xs font-semibold text-teal">Matches {matchedLabel}</p>
        )}
        <p className="mt-1 line-clamp-2 text-xs text-muted">{category.description}</p>
      </div>
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
