"use client";

import { useMemo, useState } from "react";
import { fields, getFieldById } from "@/lib/fields";
import {
  countObservationTypes,
  FARM_OBSERVATION_TYPE_FILTERS,
  getFarmObservations,
  getObservationListTitle,
  sessionHasImportant,
} from "@/lib/field-observations";
import { ObservationIcon } from "@/components/ObservationTypeIcon";
import {
  getObservationLabel,
  getObservationTaxonomyTitle,
  OBSERVATION_MAP_COLORS,
  ObservationType,
  ScoutingObservation,
} from "@/lib/observations";
import {
  getScoutName,
  getScoutingSessionById,
  getScoutingSessions,
  getSessionDisplayTitle,
  SCOUTS,
  ScoutingSession,
} from "@/lib/scouting-tasks";
import { ScoutingSessionOverviewPage } from "@/components/desktop/ScoutingSessionOverviewPage";
import {
  FlagIcon,
  formatObservationTime,
  ObservationReviewSplit,
} from "@/components/desktop/ObservationReview";

const ALL_FIELD_IDS = fields.map((field) => field.id);

type ListTab = "sessions" | "observations";

export function ScoutingSessionsPage() {
  const [observations, setObservations] = useState(() => getFarmObservations());
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [tab, setTab] = useState<ListTab>("sessions");
  const [fromDate, setFromDate] = useState("2026-07-01");
  const [toDate, setToDate] = useState("2026-08-26");
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(ALL_FIELD_IDS);
  const [scoutId, setScoutId] = useState("all");
  const [importantOnly, setImportantOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ObservationType | "all">("all");

  const sessions = useMemo(() => getScoutingSessions(), []);

  const observationsBySession = useMemo(() => {
    const grouped = new Map<string, ScoutingObservation[]>();
    for (const observation of observations) {
      if (!observation.sessionId) continue;
      const current = grouped.get(observation.sessionId) ?? [];
      current.push(observation);
      grouped.set(observation.sessionId, current);
    }
    return grouped;
  }, [observations]);

  const from = useMemo(
    () => new Date(`${fromDate}T00:00:00.000Z`).getTime(),
    [fromDate]
  );
  const to = useMemo(() => new Date(`${toDate}T23:59:59.999Z`).getTime(), [toDate]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (!selectedFieldIds.includes(session.fieldId)) return false;
      if (scoutId !== "all" && session.carriedOutBy !== scoutId) return false;

      const started = new Date(session.startedAt).getTime();
      if (started < from || started > to) return false;

      const sessionObservations = observationsBySession.get(session.id) ?? [];
      if (importantOnly && !sessionHasImportant(sessionObservations)) return false;

      const needle = query.trim().toLowerCase();
      if (needle) {
        const haystack = [
          getSessionDisplayTitle(session),
          getFieldById(session.fieldId)?.name ?? "",
          getScoutName(session.carriedOutBy),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      return true;
    });
  }, [
    from,
    importantOnly,
    observationsBySession,
    query,
    scoutId,
    selectedFieldIds,
    sessions,
    to,
  ]);

  const filteredObservations = useMemo(() => {
    return observations.filter((observation) => {
      if (!observation.fieldId || !selectedFieldIds.includes(observation.fieldId)) {
        return false;
      }

      const created = new Date(observation.createdAt).getTime();
      if (created < from || created > to) return false;

      if (importantOnly && !observation.important) return false;
      if (typeFilter !== "all" && observation.type !== typeFilter) return false;

      const session = observation.sessionId
        ? getScoutingSessionById(observation.sessionId)
        : undefined;

      if (scoutId !== "all") {
        if (!session || session.carriedOutBy !== scoutId) return false;
      }

      const needle = query.trim().toLowerCase();
      if (needle) {
        const haystack = [
          getObservationTaxonomyTitle(observation),
          getObservationListTitle(observation),
          getObservationLabel(observation.type),
          observation.note,
          observation.changeComment ?? "",
          getFieldById(observation.fieldId)?.name ?? "",
          session ? getSessionDisplayTitle(session) : "",
          session ? getScoutName(session.carriedOutBy) : "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      return true;
    });
  }, [from, importantOnly, observations, query, scoutId, selectedFieldIds, to, typeFilter]);

  function updateObservation(id: string, patch: Partial<ScoutingObservation>) {
    setObservations((current) =>
      current.map((observation) =>
        observation.id === id ? { ...observation, ...patch } : observation
      )
    );
  }

  if (openSessionId) {
    const session = getScoutingSessionById(openSessionId);
    if (!session) {
      return (
        <div className="flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => setOpenSessionId(null)}
            className="self-start text-sm font-semibold text-[#1a4a4e] hover:underline"
          >
            ← Back to sessions
          </button>
          <p className="mt-4 text-sm text-stone-500">That session could not be found.</p>
        </div>
      );
    }

    return (
      <ScoutingSessionOverviewPage
        session={session}
        observations={observationsBySession.get(session.id) ?? []}
        onBack={() => setOpenSessionId(null)}
        onUpdateObservation={updateObservation}
      />
    );
  }

  const allFieldsSelected = selectedFieldIds.length === ALL_FIELD_IDS.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <header className="shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          Scouting
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Scouting sessions
          </h1>
          <div className="flex gap-1 rounded-lg bg-stone-200/80 p-1">
            <TabButton active={tab === "sessions"} onClick={() => setTab("sessions")}>
              Sessions
            </TabButton>
            <TabButton active={tab === "observations"} onClick={() => setTab("observations")}>
              Observations
            </TabButton>
          </div>
        </div>
        <p className="mt-1 text-sm text-stone-500">
          {tab === "sessions"
            ? `${filteredSessions.length} session${filteredSessions.length === 1 ? "" : "s"} · Open a row to review observations.`
            : `${filteredObservations.length} observation${filteredObservations.length === 1 ? "" : "s"} · Click one to review or edit it.`}
        </p>
      </header>

      <section className="shrink-0 rounded-xl border border-stone-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500 sm:col-span-2 lg:col-span-1">
            Search
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                tab === "sessions" ? "Session, field, scout" : "Note, type, field, scout"
              }
              className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-2 text-sm font-medium text-stone-800 outline-none placeholder:font-normal placeholder:text-stone-400 focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
            From
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-2 text-sm font-medium text-stone-800 outline-none focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
            To
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-stone-200 px-2 text-sm font-medium text-stone-800 outline-none focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
            Field
            <select
              value={
                selectedFieldIds.length === 1
                  ? selectedFieldIds[0]
                  : allFieldsSelected
                    ? "all"
                    : "mixed"
              }
              onChange={(event) => {
                const value = event.target.value;
                if (value === "all") setSelectedFieldIds(ALL_FIELD_IDS);
                else setSelectedFieldIds([value]);
              }}
              className="mt-1 h-9 w-full rounded-lg border border-stone-200 bg-white px-2 text-sm font-medium text-stone-800 outline-none focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
            >
              <option value="all">All fields</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
            Carried out by
            <select
              value={scoutId}
              onChange={(event) => setScoutId(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-stone-200 bg-white px-2 text-sm font-medium text-stone-800 outline-none focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15"
            >
              <option value="all">Anyone</option>
              {SCOUTS.map((scout) => (
                <option key={scout.id} value={scout.id}>
                  {scout.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {tab === "observations" && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <TypeChip
              label="All types"
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
        )}

        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={importantOnly}
            onChange={(event) => setImportantOnly(event.target.checked)}
            className="h-4 w-4 rounded border-stone-300 accent-[#2a8f7b]"
          />
          {tab === "sessions" ? "Important sessions only" : "Important observations only"}
        </label>
      </section>

      {tab === "sessions" ? (
        <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-stone-200 bg-white">
          {filteredSessions.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500">
              No sessions match these filters.
            </p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-stone-50 text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Session</th>
                  <th className="px-3 py-3 font-semibold">Field</th>
                  <th className="px-3 py-3 font-semibold">Scout</th>
                  <th className="px-3 py-3 text-center font-semibold">Flag</th>
                  {FARM_OBSERVATION_TYPE_FILTERS.map((entry) => (
                    <th key={entry.id} className="px-2 py-3 text-center font-semibold">
                      <span className="inline-flex flex-col items-center gap-1">
                        <ObservationIcon type={entry.id} className="h-3.5 w-3.5" />
                        {entry.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    observations={observationsBySession.get(session.id) ?? []}
                    onOpen={() => setOpenSessionId(session.id)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <ObservationReviewSplit
          observations={filteredObservations}
          onUpdateObservation={updateObservation}
          metaFor={(observation) => observationListMeta(observation)}
        />
      )}
    </div>
  );
}

function SessionRow({
  session,
  observations,
  onOpen,
}: {
  session: ScoutingSession;
  observations: ScoutingObservation[];
  onOpen: () => void;
}) {
  const field = getFieldById(session.fieldId);
  const counts = countObservationTypes(observations);
  const important = sessionHasImportant(observations);

  return (
    <tr
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      tabIndex={0}
      className="cursor-pointer hover:bg-[#2a8f7b]/5 focus:bg-[#2a8f7b]/5 focus:outline-none"
    >
      <td className="px-4 py-3">
        <p className="font-semibold text-stone-900">{getSessionDisplayTitle(session)}</p>
        <p className="mt-0.5 text-xs text-stone-500">{formatSessionWhen(session)}</p>
      </td>
      <td className="px-3 py-3 text-stone-700">{field?.name ?? session.fieldId}</td>
      <td className="whitespace-nowrap px-3 py-3 text-stone-700">
        {getScoutName(session.carriedOutBy)}
      </td>
      <td className="px-3 py-3 text-center">
        {important ? (
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-800"
            title="Has important observations"
          >
            <FlagIcon />
          </span>
        ) : (
          <span className="text-stone-300">—</span>
        )}
      </td>
      {FARM_OBSERVATION_TYPE_FILTERS.map((entry) => {
        const count = counts[entry.id];
        return (
          <td key={entry.id} className="px-2 py-3 text-center">
            <span
              className={[
                "inline-flex min-w-7 justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold",
                count > 0 ? "text-white" : "bg-stone-100 text-stone-400",
              ].join(" ")}
              style={count > 0 ? { backgroundColor: OBSERVATION_MAP_COLORS[entry.id] } : undefined}
            >
              {count}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

function TabButton({
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
        "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
        active ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900",
      ].join(" ")}
    >
      {children}
    </button>
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
        active
          ? "border-transparent text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
      ].join(" ")}
      style={active ? { backgroundColor: color ?? "#1a4a4e" } : undefined}
    >
      {type && (
        <ObservationIcon
          type={type}
          className="h-3.5 w-3.5"
          colorClass={active ? "text-white" : undefined}
        />
      )}
      {label}
    </button>
  );
}

function observationListMeta(observation: ScoutingObservation) {
  const fieldName = getFieldById(observation.fieldId ?? "")?.name;
  const session = observation.sessionId
    ? getScoutingSessionById(observation.sessionId)
    : undefined;
  const parts = [
    formatObservationTime(observation.createdAt),
    fieldName,
    session ? getScoutName(session.carriedOutBy) : null,
  ].filter(Boolean);

  return parts.join(" · ");
}

function formatSessionWhen(session: ScoutingSession) {
  const date = new Date(session.startedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const start = new Date(session.startedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = new Date(session.endedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} · ${start}–${end}`;
}
