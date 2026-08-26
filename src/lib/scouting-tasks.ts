export interface ScoutingTask {
  id: string;
  title: string;
  project: string;
  category: string;
  location: string;
  commodity: string;
  fieldId: string;
}

export const scoutingTasks: ScoutingTask[] = [
  {
    id: "task-scout-cp1",
    title: "Conducting scouting on CP1",
    project: "Wheat 26",
    category: "Scouting",
    location: "CP1",
    commodity: "Wheat",
    fieldId: "north-meadow",
  },
  {
    id: "task-scout-cp2",
    title: "Conducting scouting on CP2",
    project: "Wheat 26",
    category: "Scouting",
    location: "CP2",
    commodity: "Wheat",
    fieldId: "north-meadow",
  },
  {
    id: "task-loading-trucks",
    title: "Loading trucks",
    project: "Soya 26",
    category: "Loading and offloading",
    location: "Chicken shed",
    commodity: "Soya",
    fieldId: "south-ridge",
  },
  {
    id: "task-offload-cp1",
    title: "Offloading at CP1",
    project: "Soya 26",
    category: "Loading and offloading",
    location: "CP1",
    commodity: "Soya",
    fieldId: "south-ridge",
  },
  {
    id: "task-scout-shed",
    title: "Conducting scouting on Chicken shed",
    project: "Soya 26",
    category: "Scouting",
    location: "Chicken shed",
    commodity: "Soya",
    fieldId: "south-ridge",
  },
  {
    id: "task-loading-cp2",
    title: "Loading trucks at CP2",
    project: "Wheat 26",
    category: "Loading and offloading",
    location: "CP2",
    commodity: "Wheat",
    fieldId: "north-meadow",
  },
  {
    id: "task-scout-north",
    title: "North boundary walk",
    project: "Wheat 26",
    category: "Scouting",
    location: "CP1",
    commodity: "Wheat",
    fieldId: "north-meadow",
  },
  {
    id: "task-offload-cp2",
    title: "Offloading at CP2",
    project: "Soya 26",
    category: "Loading and offloading",
    location: "CP2",
    commodity: "Soya",
    fieldId: "south-ridge",
  },
  {
    id: "task-quality-cp1",
    title: "Quality check on CP1",
    project: "Wheat 26",
    category: "Scouting",
    location: "CP1",
    commodity: "Wheat",
    fieldId: "north-meadow",
  },
  {
    id: "task-intake-shed",
    title: "Intake inspection at Chicken shed",
    project: "Soya 26",
    category: "Scouting",
    location: "Chicken shed",
    commodity: "Soya",
    fieldId: "south-ridge",
  },
  {
    id: "task-scout-willow",
    title: "Conducting scouting on Willow Bottom",
    project: "Rapeseed 26",
    category: "Scouting",
    location: "Willow Bottom",
    commodity: "Oilseed Rape",
    fieldId: "willow-bottom",
  },
];

export interface ScoutingSession {
  id: string;
  taskId: string;
  fieldId: string;
  carriedOutBy: string;
  startedAt: string;
  endedAt: string;
  status: "completed";
}

export const SCOUTS: { id: string; name: string }[] = [
  { id: "george-saggers", name: "George Saggers" },
  { id: "priya-nair", name: "Priya Nair" },
  { id: "tom-hale", name: "Tom Hale" },
  { id: "amina-okonkwo", name: "Amina Okonkwo" },
];

export function getScoutName(id: string): string {
  return SCOUTS.find((scout) => scout.id === id)?.name ?? "Unknown";
}

export const scoutingSessions: ScoutingSession[] = [
  {
    id: "session-nm-0718",
    taskId: "task-scout-cp1",
    fieldId: "north-meadow",
    carriedOutBy: "george-saggers",
    startedAt: "2026-07-18T07:50:00.000Z",
    endedAt: "2026-07-18T11:40:00.000Z",
    status: "completed",
  },
  {
    id: "session-nm-0722",
    taskId: "task-scout-cp2",
    fieldId: "north-meadow",
    carriedOutBy: "priya-nair",
    startedAt: "2026-07-22T09:30:00.000Z",
    endedAt: "2026-07-22T13:10:00.000Z",
    status: "completed",
  },
  {
    id: "session-nm-0728",
    taskId: "task-scout-north",
    fieldId: "north-meadow",
    carriedOutBy: "george-saggers",
    startedAt: "2026-07-28T13:15:00.000Z",
    endedAt: "2026-07-28T16:20:00.000Z",
    status: "completed",
  },
  {
    id: "session-nm-0805",
    taskId: "task-scout-cp1",
    fieldId: "north-meadow",
    carriedOutBy: "priya-nair",
    startedAt: "2026-08-05T08:30:00.000Z",
    endedAt: "2026-08-05T12:05:00.000Z",
    status: "completed",
  },
  {
    id: "session-nm-0808",
    taskId: "task-quality-cp1",
    fieldId: "north-meadow",
    carriedOutBy: "george-saggers",
    startedAt: "2026-08-08T09:00:00.000Z",
    endedAt: "2026-08-08T12:30:00.000Z",
    status: "completed",
  },
  {
    id: "session-nm-0818",
    taskId: "task-scout-cp2",
    fieldId: "north-meadow",
    carriedOutBy: "priya-nair",
    startedAt: "2026-08-18T10:00:00.000Z",
    endedAt: "2026-08-18T13:20:00.000Z",
    status: "completed",
  },
  {
    id: "session-sr-0725",
    taskId: "task-scout-shed",
    fieldId: "south-ridge",
    carriedOutBy: "tom-hale",
    startedAt: "2026-07-25T07:00:00.000Z",
    endedAt: "2026-07-25T10:40:00.000Z",
    status: "completed",
  },
  {
    id: "session-sr-0730",
    taskId: "task-intake-shed",
    fieldId: "south-ridge",
    carriedOutBy: "tom-hale",
    startedAt: "2026-07-30T09:00:00.000Z",
    endedAt: "2026-07-30T12:15:00.000Z",
    status: "completed",
  },
  {
    id: "session-sr-0802",
    taskId: "task-scout-shed",
    fieldId: "south-ridge",
    carriedOutBy: "tom-hale",
    startedAt: "2026-08-02T12:10:00.000Z",
    endedAt: "2026-08-02T16:00:00.000Z",
    status: "completed",
  },
  {
    id: "session-sr-0806",
    taskId: "task-scout-shed",
    fieldId: "south-ridge",
    carriedOutBy: "tom-hale",
    startedAt: "2026-08-06T08:20:00.000Z",
    endedAt: "2026-08-06T11:10:00.000Z",
    status: "completed",
  },
  {
    id: "session-sr-0810",
    taskId: "task-intake-shed",
    fieldId: "south-ridge",
    carriedOutBy: "tom-hale",
    startedAt: "2026-08-10T09:15:00.000Z",
    endedAt: "2026-08-10T12:40:00.000Z",
    status: "completed",
  },
  {
    id: "session-sr-0819",
    taskId: "task-scout-shed",
    fieldId: "south-ridge",
    carriedOutBy: "tom-hale",
    startedAt: "2026-08-19T08:30:00.000Z",
    endedAt: "2026-08-19T11:20:00.000Z",
    status: "completed",
  },
  {
    id: "session-wb-0729",
    taskId: "task-scout-willow",
    fieldId: "willow-bottom",
    carriedOutBy: "amina-okonkwo",
    startedAt: "2026-07-29T08:10:00.000Z",
    endedAt: "2026-07-29T11:45:00.000Z",
    status: "completed",
  },
  {
    id: "session-wb-0808",
    taskId: "task-scout-willow",
    fieldId: "willow-bottom",
    carriedOutBy: "amina-okonkwo",
    startedAt: "2026-08-08T11:00:00.000Z",
    endedAt: "2026-08-08T15:10:00.000Z",
    status: "completed",
  },
  {
    id: "session-wb-0812",
    taskId: "task-scout-willow",
    fieldId: "willow-bottom",
    carriedOutBy: "amina-okonkwo",
    startedAt: "2026-08-12T14:00:00.000Z",
    endedAt: "2026-08-12T17:05:00.000Z",
    status: "completed",
  },
  {
    id: "session-wb-0814",
    taskId: "task-scout-willow",
    fieldId: "willow-bottom",
    carriedOutBy: "george-saggers",
    startedAt: "2026-08-14T06:50:00.000Z",
    endedAt: "2026-08-14T09:30:00.000Z",
    status: "completed",
  },
  {
    id: "session-wb-0820",
    taskId: "task-scout-willow",
    fieldId: "willow-bottom",
    carriedOutBy: "amina-okonkwo",
    startedAt: "2026-08-20T09:20:00.000Z",
    endedAt: "2026-08-20T13:00:00.000Z",
    status: "completed",
  },
];

export function getScoutingSessions(): ScoutingSession[] {
  return [...scoutingSessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export function getScoutingSessionById(id: string): ScoutingSession | undefined {
  return scoutingSessions.find((session) => session.id === id);
}

export function getSessionDisplayTitle(session: ScoutingSession): string {
  return getScoutingTaskById(session.taskId)?.title ?? "Scouting session";
}

export function toDateInputValue(value: string): string {
  return value.slice(0, 10);
}

export const DEFAULT_SCOUTING_TASK_ID = "task-scout-cp1";

export function getDefaultScoutingRoute(): string {
  return "/scouting";
}

export function getScoutingTaskById(id: string): ScoutingTask | undefined {
  return scoutingTasks.find((task) => task.id === id);
}

export function filterScoutingTasks(
  tasks: ScoutingTask[],
  query: string
): ScoutingTask[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return tasks;

  return tasks.filter((task) =>
    [task.title, task.project, task.category, task.location, task.commodity].some(
      (value) => value.toLowerCase().includes(normalized)
    )
  );
}
