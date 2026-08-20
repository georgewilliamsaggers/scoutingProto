import { ScoutingObservation } from "@/lib/observations";

export type FieldObservationFilter =
  | "all"
  | "pest"
  | "disease"
  | "weed"
  | "other"
  | "moisture"
  | "population";

export const FIELD_OBSERVATION_FILTERS: {
  id: FieldObservationFilter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "pest", label: "Pest" },
  { id: "disease", label: "Disease" },
  { id: "weed", label: "Weed" },
  { id: "other", label: "General" },
  { id: "moisture", label: "Moisture" },
  { id: "population", label: "Population" },
];

const MOCK_FIELD_OBSERVATIONS: ScoutingObservation[] = [
  {
    id: "hist-nm-1",
    type: "disease",
    note: "Yellow rust spotting on upper leaves in the north hedge strip.",
    createdAt: "2026-08-05T09:15:00.000Z",
    fieldId: "north-meadow",
  },
  {
    id: "hist-nm-2",
    type: "pest",
    note: "Aphid colonies found on flag leaves in the central block.",
    createdAt: "2026-07-28T14:40:00.000Z",
    fieldId: "north-meadow",
  },
  {
    id: "hist-nm-3",
    type: "weed",
    note: "Black-grass patches along tramline on the east side.",
    createdAt: "2026-07-22T11:05:00.000Z",
    fieldId: "north-meadow",
  },
  {
    id: "hist-nm-4",
    type: "moisture",
    note: "Soil probe reading slightly dry at 10 cm depth.",
    createdAt: "2026-07-18T08:20:00.000Z",
    fieldId: "north-meadow",
  },
  {
    id: "hist-nm-5",
    type: "other",
    note: "Gateway ruts after recent rain — access limited from south.",
    createdAt: "2026-07-12T16:30:00.000Z",
    fieldId: "north-meadow",
  },
  {
    id: "hist-nm-6",
    type: "population",
    note: "Population · 8 plants in 0.5 m × 0.5 m square · 32 plants/m²",
    createdAt: "2026-08-08T10:20:00.000Z",
    fieldId: "north-meadow",
    populationDetails: {
      method: "square",
      plantCount: 8,
      squareWidthMeters: 0.5,
      squareHeightMeters: 0.5,
      rowLengthMeters: 10,
    },
  },
  {
    id: "hist-sr-1",
    type: "pest",
    note: "Leaf beetle damage on south-west corner plants.",
    createdAt: "2026-08-10T10:00:00.000Z",
    fieldId: "south-ridge",
  },
  {
    id: "hist-sr-2",
    type: "disease",
    note: "Rhynchosporium lesions on lower leaves in damp hollow.",
    createdAt: "2026-08-02T13:25:00.000Z",
    fieldId: "south-ridge",
  },
  {
    id: "hist-sr-3",
    type: "weed",
    note: "Chickweed establishing in headland margin.",
    createdAt: "2026-07-30T09:50:00.000Z",
    fieldId: "south-ridge",
  },
  {
    id: "hist-sr-4",
    type: "moisture",
    note: "Canopy and soil moisture adequate across the block.",
    createdAt: "2026-07-25T07:45:00.000Z",
    fieldId: "south-ridge",
  },
  {
    id: "hist-sr-5",
    type: "other",
    note: "Irrigation line leak noted near the south-west corner.",
    createdAt: "2026-07-15T15:10:00.000Z",
    fieldId: "south-ridge",
  },
  {
    id: "hist-sr-6",
    type: "population",
    note: "Population · 42 plants in 10 m row · 4.2 plants/m",
    createdAt: "2026-08-06T09:10:00.000Z",
    fieldId: "south-ridge",
    populationDetails: {
      method: "row",
      plantCount: 42,
      squareWidthMeters: 0.5,
      squareHeightMeters: 0.5,
      rowLengthMeters: 10,
    },
  },
];

export function getInitialFieldObservations(): Record<string, ScoutingObservation[]> {
  return MOCK_FIELD_OBSERVATIONS.reduce<Record<string, ScoutingObservation[]>>(
    (groups, observation) => {
      const fieldId = observation.fieldId;
      if (!fieldId) return groups;

      groups[fieldId] = [...(groups[fieldId] ?? []), observation];
      return groups;
    },
    {}
  );
}

export function getFieldObservationsInLastDays(
  observations: ScoutingObservation[],
  days = 30
): ScoutingObservation[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return observations
    .filter((observation) => new Date(observation.createdAt).getTime() >= cutoff)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function filterFieldObservations(
  observations: ScoutingObservation[],
  filter: FieldObservationFilter
): ScoutingObservation[] {
  if (filter === "all") return observations;
  return observations.filter((observation) => observation.type === filter);
}

export function appendFieldObservations(
  existing: Record<string, ScoutingObservation[]>,
  fieldId: string,
  observations: ScoutingObservation[]
): Record<string, ScoutingObservation[]> {
  if (observations.length === 0) return existing;

  const stamped = observations.map((observation) => ({
    ...observation,
    fieldId,
  }));

  return {
    ...existing,
    [fieldId]: [...(existing[fieldId] ?? []), ...stamped],
  };
}
