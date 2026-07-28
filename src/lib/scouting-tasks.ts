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
];

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
