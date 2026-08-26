"use client";

import { useEffect, useMemo, useState } from "react";
import { getFieldById } from "@/lib/fields";
import {
  FARM_OBSERVATION_TYPE_FILTERS,
  getObservationListTitle,
} from "@/lib/field-observations";
import { ObservationIcon } from "@/components/ObservationTypeIcon";
import {
  getObservationLabel,
  getObservationTaxonomyTitle,
  getReviewStatusChip,
  OBSERVATION_MAP_COLORS,
  ObservationReviewStatus,
  ObservationType,
  ScoutingObservation,
} from "@/lib/observations";
import {
  getScoutName,
  getScoutingSessionById,
  getSessionDisplayTitle,
} from "@/lib/scouting-tasks";

export function ObservationReviewSplit({
  observations,
  onUpdateObservation,
  listFilters = false,
  metaFor,
}: {
  observations: ScoutingObservation[];
  onUpdateObservation: (id: string, patch: Partial<ScoutingObservation>) => void;
  listFilters?: boolean;
  metaFor?: (observation: ScoutingObservation) => string;
}) {
  const sorted = useMemo(
    () =>
      [...observations].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [observations]
  );

  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id ?? null);
  const [typeFilter, setTypeFilter] = useState<ObservationType | "all">("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    if (!listFilters) return sorted;
    const needle = query.trim().toLowerCase();

    return sorted.filter((observation) => {
      if (typeFilter !== "all" && observation.type !== typeFilter) return false;
      if (!needle) return true;

      const haystack = [
        getObservationTaxonomyTitle(observation),
        getObservationListTitle(observation),
        getObservationLabel(observation.type),
        observation.note,
        observation.changeComment ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [listFilters, query, sorted, typeFilter]);

  useEffect(() => {
    if (visible.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!visible.some((observation) => observation.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [selectedId, visible]);

  const selected = sorted.find((observation) => observation.id === selectedId) ?? null;

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
        {listFilters && (
          <div className="shrink-0 border-b border-stone-100 p-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400">
                <SearchGlyph />
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search observations"
                className="h-9 w-full rounded-lg border border-stone-200 bg-white pl-8 pr-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <TypeChip
                label="All"
                active={typeFilter === "all"}
                onClick={() => setTypeFilter("all")}
              />
              {FARM_OBSERVATION_TYPE_FILTERS.map((entry) => (
                <TypeChip
                  key={entry.id}
                  type={entry.id}
                  label={entry.label}
                  color={OBSERVATION_MAP_COLORS[entry.id]}
                  active={typeFilter === entry.id}
                  onClick={() => setTypeFilter(entry.id)}
                />
              ))}
            </div>
          </div>
        )}

        <ul className="min-h-0 flex-1 overflow-y-auto p-2">
          {visible.length === 0 ? (
            <li className="px-2 py-8 text-center text-sm text-stone-500">
              No observations match this filter.
            </li>
          ) : (
            visible.map((observation) => {
              const active = observation.id === selectedId;
              const title = getObservationTaxonomyTitle(observation);
              const comment = observation.note.trim();
              const showComment = comment.length > 0 && comment !== title;
              const status = getReviewStatusChip(observation.reviewStatus);

              return (
                <li key={observation.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(observation.id)}
                    className={[
                      "mb-1 flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                      active ? "bg-[#1a4a4e] text-white" : "hover:bg-stone-50",
                    ].join(" ")}
                  >
                    <ObservationIcon
                      type={observation.type}
                      className="mt-0.5 h-4 w-4 shrink-0"
                      colorClass={active ? "text-white" : undefined}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          "line-clamp-2 block text-sm font-semibold",
                          active ? "text-white" : "text-stone-900",
                        ].join(" ")}
                      >
                        {title}
                      </span>
                      {showComment && (
                        <span
                          className={[
                            "mt-0.5 line-clamp-2 block text-xs leading-snug",
                            active ? "text-white/75" : "text-stone-500",
                          ].join(" ")}
                        >
                          {comment}
                        </span>
                      )}
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <ReviewStatusChip tone={status.tone} label={status.label} active={active} />
                        <span
                          className={[
                            "text-[11px]",
                            active ? "text-white/55" : "text-stone-400",
                          ].join(" ")}
                        >
                          {metaFor
                            ? metaFor(observation)
                            : formatObservationTime(observation.createdAt)}
                        </span>
                      </span>
                    </span>
                    {observation.important && (
                      <span
                        className={[
                          "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                          active ? "bg-amber-300 text-amber-950" : "bg-amber-100 text-amber-800",
                        ].join(" ")}
                        title="Important"
                      >
                        <FlagIcon />
                      </span>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
        {selected ? (
          <ObservationReviewPanel
            observation={selected}
            onUpdate={(patch) => onUpdateObservation(selected.id, patch)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-stone-500">
            Select an observation to review it.
          </div>
        )}
      </section>
    </div>
  );
}

export function ObservationReviewPanel({
  observation,
  onUpdate,
}: {
  observation: ScoutingObservation;
  onUpdate: (patch: Partial<ScoutingObservation>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftNote, setDraftNote] = useState(observation.note);
  const [draftComment, setDraftComment] = useState(observation.changeComment ?? "");

  useEffect(() => {
    setEditing(false);
    setDraftNote(observation.note);
    setDraftComment(observation.changeComment ?? "");
  }, [observation.id, observation.note, observation.changeComment]);

  const status = observation.reviewStatus ?? "pending";
  const session = observation.sessionId
    ? getScoutingSessionById(observation.sessionId)
    : undefined;
  const fieldName = getFieldById(observation.fieldId ?? "")?.name ?? "Unknown field";
  const scoutName = session ? getScoutName(session.carriedOutBy) : null;

  function saveChange() {
    const note = draftNote.trim();
    if (!note) return;
    onUpdate({
      note,
      changeComment: draftComment.trim() || undefined,
      reviewStatus: "changed",
    });
    setEditing(false);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: OBSERVATION_MAP_COLORS[observation.type] }}
          >
            <ObservationIcon
              type={observation.type}
              className="h-3.5 w-3.5"
              colorClass="text-white"
            />
            {getObservationLabel(observation.type)}
          </span>
          {observation.important && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
              <FlagIcon />
              Important
            </span>
          )}
          {status !== "pending" && (
            <span
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                status === "agreed"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-sky-50 text-sky-800",
              ].join(" ")}
            >
              {status === "agreed" ? "Agreed" : "Changed"}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-xl font-bold text-stone-900">
          {getObservationTaxonomyTitle(observation)}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          {formatDateTime(observation.createdAt)} · {fieldName}
          {scoutName ? ` · Logged by ${scoutName}` : ""}
        </p>
        {session && (
          <p className="mt-0.5 text-xs text-stone-400">{getSessionDisplayTitle(session)}</p>
        )}

        {observation.location && (
          <p className="mt-1 text-xs text-stone-400">
            {observation.location.latitude.toFixed(5)}, {observation.location.longitude.toFixed(5)}
          </p>
        )}

        {editing ? (
          <div className="mt-5 space-y-3">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
              Observation
              <textarea
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
              />
            </label>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
              What did you change?
              <textarea
                value={draftComment}
                onChange={(event) => setDraftComment(event.target.value)}
                rows={2}
                placeholder="Optional note for the scout or agronomist"
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveChange}
                disabled={!draftNote.trim()}
                className="rounded-lg bg-[#1a4a4e] px-3 py-2 text-sm font-semibold text-white hover:bg-[#163c40] disabled:opacity-50"
              >
                Save change
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setDraftNote(observation.note);
                  setDraftComment(observation.changeComment ?? "");
                }}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <p className="text-sm leading-relaxed text-stone-700">{observation.note}</p>
            {observation.changeComment && (
              <div className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700">
                  Change made
                </p>
                <p className="mt-1">{observation.changeComment}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-stone-100 bg-stone-50 px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
          Review
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              onUpdate({ reviewStatus: "agreed" });
            }}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              status === "agreed"
                ? "bg-[#2a8f7b] text-white"
                : "border border-stone-200 bg-white text-stone-700 hover:border-[#2a8f7b] hover:text-[#1a4a4e]",
            ].join(" ")}
          >
            Agree
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              status === "changed" && !editing
                ? "bg-[#1a4a4e] text-white"
                : "border border-stone-200 bg-white text-stone-700 hover:border-[#1a4a4e] hover:text-[#1a4a4e]",
            ].join(" ")}
          >
            Make a change
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ important: !observation.important })}
            className={[
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              observation.important
                ? "bg-amber-500 text-white"
                : "border border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:text-amber-800",
            ].join(" ")}
          >
            <FlagIcon />
            {observation.important ? "Important" : "Flag as important"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FlagIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22V15" />
    </svg>
  );
}

function ReviewStatusChip({
  tone,
  label,
  active,
}: {
  tone: ObservationReviewStatus;
  label: string;
  active: boolean;
}) {
  const palette = {
    pending: active
      ? "bg-white/20 text-white"
      : "bg-stone-100 text-stone-600",
    agreed: active
      ? "bg-emerald-300 text-emerald-950"
      : "bg-emerald-50 text-emerald-800",
    changed: active
      ? "bg-sky-300 text-sky-950"
      : "bg-sky-50 text-sky-800",
  }[tone];

  return (
    <span className={`rounded-full px-1.5 py-px text-[10px] font-semibold ${palette}`}>
      {label}
    </span>
  );
}

function TypeChip({
  label,
  active,
  onClick,
  color,
  type,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
  type?: ObservationType;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors",
        active
          ? "border-transparent text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
      ].join(" ")}
      style={active ? { backgroundColor: color ?? "#1a4a4e" } : undefined}
    >
      {type && (
        <ObservationIcon
          type={type}
          className="h-3 w-3"
          colorClass={active ? "text-white" : undefined}
        />
      )}
      {label}
    </button>
  );
}

export function formatObservationTime(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SearchGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}
