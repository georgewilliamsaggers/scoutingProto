"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  DiseaseCategory,
  DiseaseSpecificType,
  DISEASE_CATEGORY_PAGE_COUNT,
  getDiseaseCategoryGridPages,
  searchDiseaseGroups,
} from "@/lib/observations";

interface DiseaseSymptomMatchPageProps {
  onClose: () => void;
  onSelect: (categoryId: string, specificTypeId?: string) => void;
  onNotSure: () => void;
}

export function DiseaseSymptomMatchPage({
  onClose,
  onSelect,
  onNotSure,
}: DiseaseSymptomMatchPageProps) {
  const pages = getDiseaseCategoryGridPages();
  const [activePage, setActivePage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageScrollRef = useRef<HTMLDivElement>(null);

  const searchGroups = useMemo(
    () => searchDiseaseGroups(searchQuery),
    [searchQuery]
  );
  const isSearching = searchQuery.trim().length > 0;

  function handlePageScroll() {
    const container = pageScrollRef.current;
    if (!container) return;

    const page = Math.round(container.scrollLeft / container.clientWidth);
    setActivePage(page);
  }

  function goToPage(page: number) {
    const container = pageScrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: page * container.clientWidth,
      behavior: "smooth",
    });
    setActivePage(page);
  }

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
          Match the symptom
        </p>
        <h1 className="text-[1.625rem] font-bold leading-tight text-navy">
          What does it look like?
        </h1>

        <label className="relative my-4 block">
          <SearchIcon />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diseases or symptoms…"
            className="h-11 w-full rounded-xl border border-border bg-surface py-0 pl-10 pr-4 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20"
          />
        </label>
      </div>

      {isSearching ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-3">
          {searchGroups.length > 0 ? (
            <div className="space-y-3">
              {searchGroups.map((group) => (
                <div key={group.category.id} className="space-y-1.5">
                  <SearchCategoryRow
                    category={group.category}
                    onSelect={() => onSelect(group.category.id)}
                  />
                  {group.species.map((species) => (
                    <SearchSpeciesRow
                      key={species.id}
                      species={species}
                      onSelect={() => onSelect(group.category.id, species.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center">
              <p className="text-sm font-semibold text-navy">No matches found</p>
              <p className="mt-1 text-sm text-muted">
                Try a symptom, disease name, or browse the categories below.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          ref={pageScrollRef}
          onScroll={handlePageScroll}
          className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pages.map((slots, pageIndex) => (
            <div
              key={`category-page-${pageIndex}`}
              className="grid h-full w-full shrink-0 snap-start grid-cols-2 grid-rows-3 gap-2.5 px-6"
            >
              {slots.map((category, index) =>
                category ? (
                  <CategoryGridCard
                    key={category.id}
                    category={category}
                    onSelect={() => onSelect(category.id)}
                  />
                ) : (
                  <div
                    key={`empty-${pageIndex}-${index}`}
                    aria-hidden="true"
                    className="min-h-0 rounded-2xl border border-transparent"
                  />
                )
              )}
            </div>
          ))}
        </div>
      )}

      <div className="shrink-0 px-6 pt-2">
        {!isSearching && (
          <div className="mb-3 flex items-center justify-center gap-2">
            {Array.from({ length: DISEASE_CATEGORY_PAGE_COUNT }, (_, page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-label={`Category page ${page + 1}`}
                className={[
                  "h-2 w-2 rounded-full transition-colors",
                  activePage === page ? "bg-teal" : "bg-border",
                ].join(" ")}
              />
            ))}
          </div>
        )}

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
  category: DiseaseCategory;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface-elevated text-left shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="relative min-h-0 flex-1 bg-surface">
        <Image
          src={category.imageSrc}
          alt={category.label}
          fill
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

function SearchCategoryRow({
  category,
  onSelect,
}: {
  category: DiseaseCategory;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex min-h-20 w-full overflow-hidden rounded-xl border border-border/80 bg-surface-elevated text-left transition-all active:scale-[0.98]"
    >
      <div className="absolute inset-y-0 left-0 w-28">
        <Image
          src={category.imageSrc}
          alt={category.label}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="flex min-w-0 flex-1 items-center py-3.5 pl-[7.5rem] pr-4">
        <p className="text-sm font-bold text-navy">{category.label}</p>
      </div>
    </button>
  );
}

function SearchSpeciesRow({
  species,
  onSelect,
}: {
  species: DiseaseSpecificType;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative ml-3 flex min-h-20 w-[calc(100%-0.75rem)] overflow-hidden rounded-xl border border-border/60 bg-surface text-left transition-all active:scale-[0.98] active:bg-surface-elevated"
    >
      <div className="absolute inset-y-0 left-0 w-28">
        <Image
          src={species.imageSrc}
          alt={species.label}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-3.5 pl-[7.5rem] pr-4">
        <p className="text-sm font-semibold text-navy">{species.label}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{species.description}</p>
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
