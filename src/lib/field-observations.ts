import {
  EMPTY_DISEASE_DETAILS,
  EMPTY_PEST_DETAILS,
  EMPTY_WEED_DETAILS,
  generateObservationLocation,
  getDiseaseCategory,
  getDiseaseSpecificType,
  getObservationLabel,
  getPestCategory,
  getPestSpecificType,
  getWeedCategory,
  getWeedSpecificType,
  ObservationType,
  ScoutingObservation,
} from "@/lib/observations";

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

function mockPest(categoryId: string, specificTypeId?: string) {
  const category = getPestCategory(categoryId);
  const specific = specificTypeId ? getPestSpecificType(specificTypeId) : undefined;

  return {
    ...EMPTY_PEST_DETAILS,
    pestCategoryId: categoryId,
    pestCategoryLabel: category?.label ?? "",
    pestSpecificTypeId: specificTypeId ?? "",
    pestLabel: specific?.label ?? category?.label ?? "",
    pest: specific?.label ?? category?.label ?? "",
  };
}

function mockDisease(categoryId: string, specificTypeId?: string) {
  const category = getDiseaseCategory(categoryId);
  const specific = specificTypeId ? getDiseaseSpecificType(specificTypeId) : undefined;

  return {
    ...EMPTY_DISEASE_DETAILS,
    diseaseCategoryId: categoryId,
    diseaseCategoryLabel: category?.label ?? "",
    diseaseSpecificTypeId: specificTypeId ?? "",
    diseaseLabel: specific?.label ?? category?.label ?? "",
    disease: specific?.label ?? category?.label ?? "",
  };
}

function mockWeed(categoryId: string, specificTypeId?: string) {
  const category = getWeedCategory(categoryId);
  const specific = specificTypeId ? getWeedSpecificType(specificTypeId) : undefined;

  return {
    ...EMPTY_WEED_DETAILS,
    weedCategoryId: categoryId,
    weedCategoryLabel: category?.label ?? "",
    weedSpecificTypeId: specificTypeId ?? "",
    weedLabel: specific?.label ?? category?.label ?? "",
    weed: specific?.label ?? category?.label ?? "",
  };
}

const MOCK_FIELD_OBSERVATIONS: ScoutingObservation[] = [
  {
    id: "hist-nm-1",
    type: "disease",
    note: "Yellow rust spotting on upper leaves in the north hedge strip.",
    createdAt: "2026-08-05T09:15:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0805",
    diseaseDetails: mockDisease("rust", "stripe_rust"),
  },
  {
    id: "hist-nm-2",
    type: "pest",
    note: "Aphid colonies found on flag leaves in the central block.",
    createdAt: "2026-07-28T14:40:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0728",
    pestDetails: mockPest("aphids", "grain_aphid"),
  },
  {
    id: "hist-nm-3",
    type: "weed",
    note: "Black-grass patches along tramline on the east side.",
    createdAt: "2026-07-22T11:05:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0722",
    weedDetails: mockWeed("grass", "black_grass"),
  },
  {
    id: "hist-nm-4",
    type: "moisture",
    note: "Soil probe reading slightly dry at 10 cm depth.",
    createdAt: "2026-07-18T08:20:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0718",
    reviewStatus: "agreed",
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
    sessionId: "session-nm-0808",
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
    sessionId: "session-sr-0810",
    pestDetails: mockPest("beetles", "flea_beetle"),
  },
  {
    id: "hist-sr-2",
    type: "disease",
    note: "Rhynchosporium lesions on lower leaves in damp hollow.",
    createdAt: "2026-08-02T13:25:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0802",
    diseaseDetails: mockDisease("rhynchosporium"),
  },
  {
    id: "hist-sr-3",
    type: "weed",
    note: "Chickweed establishing in headland margin.",
    createdAt: "2026-07-30T09:50:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0730",
    weedDetails: mockWeed("broadleaf", "chickweed"),
  },
  {
    id: "hist-sr-4",
    type: "moisture",
    note: "Canopy and soil moisture adequate across the block.",
    createdAt: "2026-07-25T07:45:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0725",
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
    sessionId: "session-sr-0806",
    populationDetails: {
      method: "row",
      plantCount: 42,
      squareWidthMeters: 0.5,
      squareHeightMeters: 0.5,
      rowLengthMeters: 10,
    },
  },
  {
    id: "hist-nm-7",
    type: "pest",
    note: "Grain aphids clustering on ears along the shared hedge with Willow Bottom.",
    createdAt: "2026-08-18T11:10:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0818",
    important: true,
    pestDetails: mockPest("aphids", "grain_aphid"),
  },
  {
    id: "hist-sr-7",
    type: "pest",
    note: "Aphid colonies on the north headland, same pressure seen in neighbouring wheat.",
    createdAt: "2026-08-19T09:40:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0819",
    pestDetails: mockPest("aphids", "grain_aphid"),
  },
  {
    id: "hist-wb-1",
    type: "pest",
    note: "Aphids moving into the east canopy from cereal neighbours.",
    createdAt: "2026-08-20T10:15:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0820",
    important: true,
    pestDetails: mockPest("aphids", "grain_aphid"),
  },
  {
    id: "hist-wb-2",
    type: "pest",
    note: "Pollen beetle still present on late flowers in the wet hollow.",
    createdAt: "2026-08-12T15:05:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0812",
    pestDetails: mockPest("beetles", "blossom_beetle"),
  },
  {
    id: "hist-wb-3",
    type: "disease",
    note: "Sclerotinia stem lesions in the dense centre of the block.",
    createdAt: "2026-08-08T12:30:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0808",
    diseaseDetails: mockDisease("sclerotinia"),
  },
  {
    id: "hist-wb-4",
    type: "weed",
    note: "Cleavers in the willow-belt margin.",
    createdAt: "2026-07-29T08:55:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0729",
    weedDetails: mockWeed("broadleaf", "cleavers"),
  },
  {
    id: "hist-wb-5",
    type: "moisture",
    note: "Hollow remains wet after last rain — standing water in tyre tracks.",
    createdAt: "2026-08-14T07:20:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0814",
  },
  {
    id: "hist-nm-8",
    type: "disease",
    note: "Yellow rust returning on the east tramline after last week's spotting.",
    createdAt: "2026-08-18T10:25:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0818",
    reviewStatus: "changed",
    changeComment: "Pressure is higher on the tramline than first logged.",
    diseaseDetails: mockDisease("rust", "stripe_rust"),
  },
  {
    id: "hist-nm-9",
    type: "weed",
    note: "Black-grass seed heads in a thin strip beside the shared hedge.",
    createdAt: "2026-08-18T11:45:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0818",
    weedDetails: mockWeed("grass", "black_grass"),
  },
  {
    id: "hist-nm-10",
    type: "moisture",
    note: "Surface dry on the crest; still adequate in the lower third.",
    createdAt: "2026-08-18T12:20:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0818",
  },
  {
    id: "hist-nm-11",
    type: "other",
    note: "Small lodging patch after wind near the north gateway.",
    createdAt: "2026-08-18T12:55:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0818",
  },
  {
    id: "hist-nm-12",
    type: "pest",
    note: "Rose-grain aphids on flag leaves in the west third.",
    createdAt: "2026-08-05T08:50:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0805",
    pestDetails: mockPest("aphids", "rose_grain_aphid"),
  },
  {
    id: "hist-nm-13",
    type: "weed",
    note: "Cleavers climbing in the headland near the hedge gap.",
    createdAt: "2026-08-05T10:40:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0805",
    weedDetails: mockWeed("broadleaf", "cleavers"),
  },
  {
    id: "hist-nm-14",
    type: "moisture",
    note: "Probe at 10 cm still moist after weekend rain.",
    createdAt: "2026-08-05T11:20:00.000Z",
    fieldId: "north-meadow",
    sessionId: "session-nm-0805",
  },
  {
    id: "hist-sr-8",
    type: "disease",
    note: "Rhynchosporium spreading from the damp hollow toward the centre.",
    createdAt: "2026-08-19T08:55:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0819",
    important: true,
    diseaseDetails: mockDisease("rhynchosporium"),
  },
  {
    id: "hist-sr-9",
    type: "moisture",
    note: "South-west corner starting to stress — lighter soil drying first.",
    createdAt: "2026-08-19T10:15:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0819",
  },
  {
    id: "hist-sr-10",
    type: "weed",
    note: "Volunteer oilseed in the north headland.",
    createdAt: "2026-08-19T10:50:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0819",
    weedDetails: mockWeed("broadleaf"),
  },
  {
    id: "hist-sr-11",
    type: "disease",
    note: "Net blotch on lower leaves, more on the shaded edge.",
    createdAt: "2026-08-10T09:35:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0810",
    diseaseDetails: mockDisease("leaf_blotch", "net_blotch"),
  },
  {
    id: "hist-sr-12",
    type: "other",
    note: "Rabbit grazing along the west fence line.",
    createdAt: "2026-08-10T11:20:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0810",
  },
  {
    id: "hist-sr-13",
    type: "weed",
    note: "Fat hen in a thin band after the last cultivation miss.",
    createdAt: "2026-08-10T12:05:00.000Z",
    fieldId: "south-ridge",
    sessionId: "session-sr-0810",
    weedDetails: mockWeed("broadleaf"),
  },
  {
    id: "hist-wb-6",
    type: "disease",
    note: "Sclerotinia still active in the dense centre — stems lodging.",
    createdAt: "2026-08-20T09:40:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0820",
    diseaseDetails: mockDisease("sclerotinia"),
  },
  {
    id: "hist-wb-7",
    type: "weed",
    note: "Cleavers thick along the willow-belt margin.",
    createdAt: "2026-08-20T11:05:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0820",
    weedDetails: mockWeed("broadleaf", "cleavers"),
  },
  {
    id: "hist-wb-8",
    type: "moisture",
    note: "Hollow still wet; standing water in the lowest tyre tracks.",
    createdAt: "2026-08-20T11:50:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0820",
  },
  {
    id: "hist-wb-9",
    type: "other",
    note: "Broken field drain outlet on the east boundary.",
    createdAt: "2026-08-20T12:30:00.000Z",
    fieldId: "willow-bottom",
    sessionId: "session-wb-0820",
  },
];

export function getFarmObservations(): ScoutingObservation[] {
  return MOCK_FIELD_OBSERVATIONS.map((observation) => {
    const fieldId = observation.fieldId;
    if (!fieldId) return observation;

    return {
      ...observation,
      location:
        observation.location ?? generateObservationLocation(fieldId, observation.id),
    };
  });
}

export const FARM_OBSERVATION_TYPE_FILTERS: {
  id: ObservationType;
  label: string;
}[] = [
  { id: "pest", label: "Pest" },
  { id: "disease", label: "Disease" },
  { id: "weed", label: "Weed" },
  { id: "moisture", label: "Moisture" },
  { id: "population", label: "Population" },
  { id: "other", label: "Other" },
];

export function getObservationListTitle(observation: ScoutingObservation): string {
  const note = observation.note.trim();
  return note || getObservationLabel(observation.type);
}

export function countObservationTypes(observations: ScoutingObservation[]) {
  const counts: Record<ObservationType, number> = {
    pest: 0,
    disease: 0,
    weed: 0,
    moisture: 0,
    population: 0,
    other: 0,
    voice_note: 0,
  };

  for (const observation of observations) {
    counts[observation.type] += 1;
  }

  return counts;
}

export function sessionHasImportant(observations: ScoutingObservation[]): boolean {
  return observations.some((observation) => observation.important);
}

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
