export type AppSection =
  | "incidents"
  | "patrols"
  | "water-management"
  | "scouting"
  | "settings";

export const APP_SECTIONS: {
  id: AppSection;
  label: string;
}[] = [
  { id: "incidents", label: "Incidents" },
  { id: "patrols", label: "Patrols" },
  { id: "water-management", label: "Water management" },
  { id: "scouting", label: "Scouting" },
  { id: "settings", label: "Settings" },
];

export function getAppSectionLabel(section: AppSection): string {
  return APP_SECTIONS.find((entry) => entry.id === section)?.label ?? "Scouting";
}
