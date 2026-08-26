"use client";

import { useMemo, useState } from "react";
import { fields, getFieldById } from "@/lib/fields";
import {
  FARM_OBSERVATION_TYPE_FILTERS,
  getFarmObservations,
} from "@/lib/field-observations";
import { ObservationIcon } from "@/components/ObservationTypeIcon";
import {
  ObservationType,
  OBSERVATION_MAP_COLORS,
} from "@/lib/observations";
import {
  getScoutingSessions,
  getSessionDisplayTitle,
  ScoutingSession,
  toDateInputValue,
} from "@/lib/scouting-tasks";
import { FarmObservationMap } from "@/components/desktop/FarmObservationMap";

const ALL_FIELD_IDS = fields.map((field) => field.id);
const ALL_TYPES = FARM_OBSERVATION_TYPE_FILTERS.map((entry) => entry.id);
const ALL_SESSIONS = getScoutingSessions();

type TimeFilterMode = "date" | "sessions";

export function ViewObservationsPage() {
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(ALL_FIELD_IDS);
  const [fromDate, setFromDate] = useState("2026-07-01");
  const [toDate, setToDate] = useState("2026-08-26");
  const [timeFilter, setTimeFilter] = useState<TimeFilterMode>("date");
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ObservationType[]>(ALL_TYPES);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fieldSessions = useMemo(
    () => ALL_SESSIONS.filter((session) => selectedFieldIds.includes(session.fieldId)),
    [selectedFieldIds]
  );

  const selectedSessions = useMemo(
    () => ALL_SESSIONS.filter((session) => selectedSessionIds.includes(session.id)),
    [selectedSessionIds]
  );

  const farmObservations = useMemo(() => getFarmObservations(), []);

  const sessionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const observation of farmObservations) {
      if (!observation.sessionId) continue;
      counts.set(observation.sessionId, (counts.get(observation.sessionId) ?? 0) + 1);
    }
    return counts;
  }, [farmObservations]);

  const filtered = useMemo(() => {
    const from = new Date(`${fromDate}T00:00:00.000Z`).getTime();
    const to = new Date(`${toDate}T23:59:59.999Z`).getTime();

    return farmObservations.filter((observation) => {
      if (!observation.fieldId || !selectedFieldIds.includes(observation.fieldId)) {
        return false;
      }
      if (!selectedTypes.includes(observation.type)) return false;

      if (timeFilter === "sessions") {
        return Boolean(
          observation.sessionId && selectedSessionIds.includes(observation.sessionId)
        );
      }

      const created = new Date(observation.createdAt).getTime();
      return created >= from && created <= to;
    });
  }, [
    farmObservations,
    fromDate,
    selectedFieldIds,
    selectedSessionIds,
    selectedTypes,
    timeFilter,
    toDate,
  ]);

  const timelineRange = useMemo(() => {
    if (timeFilter === "sessions" && selectedSessions.length > 0) {
      const starts = selectedSessions.map((session) => new Date(session.startedAt).getTime());
      const ends = selectedSessions.map((session) => new Date(session.endedAt).getTime());
      return {
        fromDate: toDateInputValue(new Date(Math.min(...starts)).toISOString()),
        toDate: toDateInputValue(new Date(Math.max(...ends)).toISOString()),
      };
    }

    return { fromDate, toDate };
  }, [fromDate, selectedSessions, timeFilter, toDate]);

  function toggleField(fieldId: string) {
    setSelectedFieldIds((current) =>
      current.includes(fieldId)
        ? current.filter((id) => id !== fieldId)
        : [...current, fieldId]
    );
    setSelectedId(null);
  }

  function toggleType(type: ObservationType) {
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((id) => id !== type) : [...current, type]
    );
    setSelectedId(null);
  }

  function toggleSession(sessionId: string) {
    setSelectedSessionIds((current) =>
      current.includes(sessionId)
        ? current.filter((id) => id !== sessionId)
        : [...current, sessionId]
    );
    setSelectedId(null);
  }

  function setTimeFilterMode(mode: TimeFilterMode) {
    setTimeFilter(mode);
    setSelectedId(null);
  }

  const allFieldsSelected = selectedFieldIds.length === ALL_FIELD_IDS.length;
  const visibleSessionIds = fieldSessions.map((session) => session.id);
  const allVisibleSessionsSelected =
    visibleSessionIds.length > 0 &&
    visibleSessionIds.every((id) => selectedSessionIds.includes(id));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <header className="shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          Scouting
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
          View observations
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {filtered.length} observation{filtered.length === 1 ? "" : "s"} ·{" "}
          {selectedFieldIds.length === 0
            ? "no fields selected"
            : selectedFieldIds.length === 1
              ? fields.find((field) => field.id === selectedFieldIds[0])?.name
              : `${selectedFieldIds.length} fields`}
          {timeFilter === "sessions"
            ? ` · ${selectedSessionIds.length} session${
                selectedSessionIds.length === 1 ? "" : "s"
              }`
            : ""}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-[280px] shrink-0 flex-col gap-4 overflow-y-auto">
          <section className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-stone-900">Fields</h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedFieldIds(allFieldsSelected ? [] : ALL_FIELD_IDS);
                  setSelectedId(null);
                }}
                className="text-[11px] font-semibold text-[#1a4a4e] hover:underline"
              >
                {allFieldsSelected ? "Clear" : "Select all"}
              </button>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              One field for a close look, or several to see farm-wide patterns.
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {fields.map((field) => {
                const checked = selectedFieldIds.includes(field.id);
                return (
                  <li key={field.id}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-lg px-1.5 py-1.5 hover:bg-stone-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleField(field.id)}
                        className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-[#2a8f7b]"
                      />
                      <span>
                        <span className="block text-sm font-medium text-stone-800">
                          {field.name}
                        </span>
                        <span className="block text-[11px] text-stone-500">
                          {field.crop} · {field.hectares} ha
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-stone-900">Time filter</h2>
            <div className="mt-3 grid grid-cols-2 rounded-lg bg-stone-100 p-0.5">
              <ModeButton
                active={timeFilter === "date"}
                onClick={() => setTimeFilterMode("date")}
              >
                Date range
              </ModeButton>
              <ModeButton
                active={timeFilter === "sessions"}
                onClick={() => setTimeFilterMode("sessions")}
              >
                Sessions
              </ModeButton>
            </div>

            {timeFilter === "date" ? (
              <div className="mt-3 flex flex-col gap-2">
                <p className="text-xs text-stone-500">
                  All observations in this period, whether or not they came from a
                  scouting session.
                </p>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                  From
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => {
                      setFromDate(event.target.value);
                      setSelectedId(null);
                    }}
                    className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-2 text-sm text-stone-800 outline-none focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
                  />
                </label>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                  To
                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) => {
                      setToDate(event.target.value);
                      setSelectedId(null);
                    }}
                    className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-2 text-sm text-stone-800 outline-none focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-xs text-stone-500">
                  Only points logged in the selected sessions.
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-stone-500">
                    {selectedSessionIds.length} selected
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSessionIds(
                        allVisibleSessionsSelected ? [] : visibleSessionIds
                      );
                      setSelectedId(null);
                    }}
                    className="shrink-0 text-[11px] font-semibold text-[#1a4a4e] hover:underline disabled:text-stone-300"
                    disabled={visibleSessionIds.length === 0}
                  >
                    {allVisibleSessionsSelected ? "Clear" : "Select all"}
                  </button>
                </div>
                {fieldSessions.length === 0 ? (
                  <p className="mt-3 text-xs text-stone-500">
                    No sessions for the selected fields.
                  </p>
                ) : (
                  <ul className="mt-2 flex flex-col gap-0.5">
                    {fieldSessions.map((session) => {
                      const checked = selectedSessionIds.includes(session.id);
                      return (
                        <li key={session.id}>
                          <label className="flex cursor-pointer items-start gap-2 rounded-lg px-1.5 py-1.5 hover:bg-stone-50">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSession(session.id)}
                              className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-[#2a8f7b]"
                            />
                            <span>
                              <span className="block text-sm font-medium leading-snug text-stone-800">
                                {getSessionDisplayTitle(session)}
                              </span>
                              <span className="block text-[11px] text-stone-500">
                                {formatSessionMeta(session, sessionCounts.get(session.id) ?? 0)}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-stone-900">Observation type</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FARM_OBSERVATION_TYPE_FILTERS.map((entry) => {
                const active = selectedTypes.includes(entry.id);
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => toggleType(entry.id)}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                      active
                        ? "border-transparent text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
                    ].join(" ")}
                    style={
                      active
                        ? { backgroundColor: OBSERVATION_MAP_COLORS[entry.id] }
                        : undefined
                    }
                  >
                    <ObservationIcon
                      type={entry.id}
                      className="h-3.5 w-3.5"
                      colorClass={active ? "text-white" : undefined}
                    />
                    {entry.label}
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <FarmObservationMap
            observations={filtered}
            fieldIds={selectedFieldIds}
            selectedId={selectedId}
            onSelect={setSelectedId}
            fromDate={timelineRange.fromDate}
            toDate={timelineRange.toDate}
            emptyMessage={
              timeFilter === "sessions" && selectedSessionIds.length === 0
                ? "Select one or more scouting sessions to plot their points."
                : "No observations match these filters."
            }
          />
          {filtered.length > 0 && (
            <p className="mt-2 shrink-0 text-xs text-stone-500">
              Click a pin to see the field, date and note.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-white text-stone-900 shadow-sm"
          : "text-stone-500 hover:text-stone-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function formatSessionMeta(session: ScoutingSession, count: number) {
  const fieldName = getFieldById(session.fieldId)?.name ?? "Unknown field";
  const date = new Date(session.startedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  return `${date} · ${fieldName} · ${count} point${count === 1 ? "" : "s"}`;
}
