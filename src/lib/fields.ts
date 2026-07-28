export interface Field {
  id: string;
  name: string;
  hectares: number;
  crop: string;
  variety: string;
  plantingDate: string;
  harvestDate: string;
  nextScoutingDate: string;
  nextInputDate: string;
  overview: string;
  activities: FieldActivity[];
}

export type ActivityType =
  | "planting"
  | "irrigation"
  | "scouting"
  | "fertiliser"
  | "general";

export const ACTIVITY_TYPES: { type: ActivityType; label: string }[] = [
  { type: "planting", label: "Planting" },
  { type: "irrigation", label: "Irrigation" },
  { type: "scouting", label: "Scouting" },
  { type: "fertiliser", label: "Fertiliser" },
  { type: "general", label: "General activity" },
];

export function getActivityTypeLabel(type: ActivityType): string {
  return ACTIVITY_TYPES.find((entry) => entry.type === type)?.label ?? "Activity";
}

export type ActivityStatus = "completed" | "upcoming" | "due";

export interface FieldActivity {
  id: string;
  type: ActivityType;
  label: string;
  date: string;
  status: ActivityStatus;
  note: string;
}

export type TaskType = "scouting" | "input";

export type TaskUrgency = "due" | "soon" | "scheduled";

export interface FieldTaskStatus {
  type: TaskType;
  urgency: TaskUrgency;
  daysUntil: number;
  label: string;
}

export const fields: Field[] = [
  {
    id: "north-meadow",
    name: "North Meadow",
    hectares: 42.5,
    crop: "Winter Wheat",
    variety: "Graham",
    plantingDate: "2025-10-15",
    harvestDate: "2026-08-10",
    nextScoutingDate: "2026-07-14",
    nextInputDate: "2026-07-22",
    overview:
      "Gently sloping south-facing block with well-drained loam. Previously in oilseed rape. Good establishment across most of the field, with a slightly thinner patch along the north hedge line.",
    activities: [
      { id: "nm-plant", type: "planting", label: "Planting", date: "2025-10-15", status: "completed", note: "Winter wheat drilled across the full block." },
      { id: "nm-scout-1", type: "scouting", label: "Scouting", date: "2026-02-20", status: "completed", note: "Even establishment with good tiller counts." },
      { id: "nm-fert-1", type: "fertiliser", label: "Fertiliser application", date: "2026-03-15", status: "completed", note: "First nitrogen applied at GS30." },
      { id: "nm-irr-1", type: "irrigation", label: "Irrigation", date: "2026-06-05", status: "completed", note: "Supplementary pass during dry spell." },
      { id: "nm-scout-2", type: "scouting", label: "Scouting", date: "2026-07-14", status: "due", note: "Check for disease pressure ahead of flag leaf." },
      { id: "nm-general-1", type: "general", label: "General activity", date: "2026-07-18", status: "upcoming", note: "Hedge trimming along north boundary." },
    ],
  },
  {
    id: "south-ridge",
    name: "South Ridge",
    hectares: 28.0,
    crop: "Spring Barley",
    variety: "Laureate",
    plantingDate: "2026-03-22",
    harvestDate: "2026-08-28",
    nextScoutingDate: "2026-07-20",
    nextInputDate: "2026-08-05",
    overview:
      "Higher elevation block with lighter soils. Even crop cover after a strong spring start. Watch the south-west corner for moisture stress during dry spells.",
    activities: [
      { id: "sr-plant", type: "planting", label: "Planting", date: "2026-03-22", status: "completed", note: "Spring barley sown into good seedbed." },
      { id: "sr-fert-1", type: "fertiliser", label: "Fertiliser application", date: "2026-04-18", status: "completed", note: "Base fertiliser applied at emergence." },
      { id: "sr-scout-1", type: "scouting", label: "Scouting", date: "2026-05-30", status: "completed", note: "Strong canopy development noted." },
      { id: "sr-irr-1", type: "irrigation", label: "Irrigation", date: "2026-06-28", status: "completed", note: "Irrigation run on south-west corner." },
      { id: "sr-scout-2", type: "scouting", label: "Scouting", date: "2026-07-20", status: "upcoming", note: "Pre-harvest assessment walk." },
      { id: "sr-general-1", type: "general", label: "General activity", date: "2026-08-01", status: "upcoming", note: "Gateway repair at field entrance." },
    ],
  },
];

export function getFieldById(id: string): Field | undefined {
  return fields.find((field) => field.id === id);
}

export function formatHectares(hectares: number): string {
  return `${hectares} ha`;
}

function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function daysBetween(from: string | Date, to: string | Date = new Date()): number {
  const start = startOfDay(typeof from === "string" ? new Date(from) : from);
  const end = startOfDay(typeof to === "string" ? new Date(to) : to);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
}

export function daysSincePlanting(plantingDate: string): number {
  return daysBetween(plantingDate);
}

export function daysUntil(date: string): number {
  return daysBetween(new Date(), date);
}

export function getCropTimelineProgress(field: Field) {
  const daysPlanted = daysSincePlanting(field.plantingDate);
  const daysToHarvest = daysUntil(field.harvestDate);
  const totalDays = daysBetween(field.plantingDate, field.harvestDate);
  const progressPercent =
    totalDays > 0
      ? Math.min(100, Math.max(0, Math.round((daysPlanted / totalDays) * 100)))
      : 0;

  return { daysPlanted, daysToHarvest, progressPercent, totalDays };
}

export function sortActivities(activities: FieldActivity[]): FieldActivity[] {
  return [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getSortedActivities(field: Field): FieldActivity[] {
  return sortActivities(field.activities);
}

export function getActivitySeasonContext(field: Field, activityDate: string) {
  const daysSincePlanting = daysBetween(field.plantingDate, activityDate);
  const daysToHarvest = daysBetween(activityDate, field.harvestDate);

  return { daysSincePlanting, daysToHarvest };
}

export function getActivityProgress(field: Field, date: string): number {
  const totalDays = daysBetween(field.plantingDate, field.harvestDate);
  if (totalDays <= 0) return 0;
  const elapsed = daysBetween(field.plantingDate, date);
  return Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));
}

export function getTodayProgress(field: Field): number {
  return getActivityProgress(field, new Date().toISOString().slice(0, 10));
}

export function formatPlantingDate(plantingDate: string): string {
  return new Date(plantingDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function createFieldActivity(
  type: ActivityType,
  note = ""
): FieldActivity {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    label: getActivityTypeLabel(type),
    date: today,
    status: "completed",
    note: note || `Recorded on ${formatShortDate(today)}.`,
  };
}

function getTaskUrgency(daysUntilDue: number): TaskUrgency {
  if (daysUntilDue <= 0) return "due";
  if (daysUntilDue <= 7) return "soon";
  return "scheduled";
}

function getTaskLabel(
  type: TaskType,
  urgency: TaskUrgency,
  daysUntilDue: number,
  dueDate: string
): string {
  const taskName = type === "scouting" ? "Scouting" : "Input";

  if (urgency === "due") {
    return daysUntilDue === 0 ? `${taskName} due today` : `${taskName} overdue`;
  }

  if (urgency === "soon") {
    return daysUntilDue === 1
      ? `${taskName} due tomorrow`
      : `${taskName} in ${daysUntilDue} days`;
  }

  return `${taskName} ${formatShortDate(dueDate)}`;
}

export function getFieldTaskStatuses(field: Field): FieldTaskStatus[] {
  return (["scouting", "input"] as const).map((type) => {
    const dueDate = type === "scouting" ? field.nextScoutingDate : field.nextInputDate;
    const daysUntilDue = daysUntil(dueDate);
    const urgency = getTaskUrgency(daysUntilDue);

    return {
      type,
      urgency,
      daysUntil: daysUntilDue,
      label: getTaskLabel(type, urgency, daysUntilDue, dueDate),
    };
  });
}