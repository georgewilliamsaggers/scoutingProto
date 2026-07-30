export type ObservationType =
  | "disease"
  | "pest"
  | "weed"
  | "moisture"
  | "other"
  | "voice_note";

export const OBSERVATION_TYPES: {
  id: ObservationType;
  label: string;
  supportText?: string;
  tileClass: string;
  borderClass: string;
  iconClass: string;
  textClass: string;
  badgeClass: string;
}[] = [
  {
    id: "disease",
    label: "Disease",
    tileClass: "bg-red-50 active:bg-red-100",
    borderClass: "border-2 border-red-200",
    iconClass: "text-red-800",
    textClass: "text-red-900",
    badgeClass: "bg-red-300 text-white",
  },
  {
    id: "pest",
    label: "Pest",
    tileClass: "bg-amber-50 active:bg-amber-100",
    borderClass: "border-2 border-amber-200",
    iconClass: "text-amber-900",
    textClass: "text-amber-950",
    badgeClass: "bg-amber-300 text-amber-950",
  },
  {
    id: "weed",
    label: "Weed",
    tileClass: "bg-emerald-50 active:bg-emerald-100",
    borderClass: "border-2 border-emerald-200",
    iconClass: "text-emerald-700",
    textClass: "text-emerald-900",
    badgeClass: "bg-emerald-300 text-white",
  },
  {
    id: "moisture",
    label: "Moisture",
    tileClass: "bg-sky-50 active:bg-sky-100",
    borderClass: "border-2 border-sky-200",
    iconClass: "text-sky-800",
    textClass: "text-sky-900",
    badgeClass: "bg-sky-300 text-white",
  },
  {
    id: "other",
    label: "Other",
    supportText: "Capture a general observation",
    tileClass: "bg-slate-100 active:bg-slate-200",
    borderClass: "border-2 border-slate-300",
    iconClass: "text-slate-600",
    textClass: "text-slate-800",
    badgeClass: "bg-slate-300 text-white",
  },
  {
    id: "voice_note",
    label: "Voice note",
    supportText: "Record a voice note of our observations",
    tileClass: "bg-indigo-50 active:bg-indigo-100",
    borderClass: "border-2 border-indigo-200",
    iconClass: "text-indigo-700",
    textClass: "text-indigo-900",
    badgeClass: "bg-indigo-300 text-white",
  },
];

export function getObservationLabel(type: ObservationType): string {
  return OBSERVATION_TYPES.find((entry) => entry.id === type)?.label ?? "Observation";
}

export type ObservationFilter = ObservationType | "all";

export const OBSERVATION_FILTER_OPTIONS: {
  id: ObservationFilter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  ...OBSERVATION_TYPES.map((entry) => ({ id: entry.id, label: entry.label })),
];

export const OBSERVATION_MAP_COLORS: Record<ObservationType, string> = {
  disease: "#dc2626",
  pest: "#ea580c",
  weed: "#84bd00",
  moisture: "#0284c7",
  other: "#64748b",
  voice_note: "#4f46e5",
};

export interface ObservationLocation {
  latitude: number;
  longitude: number;
}

export interface FieldMapBounds {
  centerLat: number;
  centerLng: number;
  spanLat: number;
  spanLng: number;
}

export const FIELD_MAP_BOUNDS: Record<string, FieldMapBounds> = {
  "north-meadow": {
    centerLat: 52.1042,
    centerLng: -0.4981,
    spanLat: 0.0042,
    spanLng: 0.0064,
  },
  "south-ridge": {
    centerLat: 52.0815,
    centerLng: -0.5213,
    spanLat: 0.0036,
    spanLng: 0.0052,
  },
};

const DEFAULT_FIELD_MAP_BOUNDS = FIELD_MAP_BOUNDS["north-meadow"];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getFieldMapBounds(fieldId: string): FieldMapBounds {
  return FIELD_MAP_BOUNDS[fieldId] ?? DEFAULT_FIELD_MAP_BOUNDS;
}

export function generateObservationLocation(
  fieldId: string,
  observationId: string
): ObservationLocation {
  const bounds = getFieldMapBounds(fieldId);
  const latSeed = hashSeed(observationId);
  const lngSeed = hashSeed(`${observationId}-lng`);
  const latOffset = ((latSeed % 1000) / 1000 - 0.5) * bounds.spanLat;
  const lngOffset = ((lngSeed % 1000) / 1000 - 0.5) * bounds.spanLng;

  return {
    latitude: bounds.centerLat + latOffset,
    longitude: bounds.centerLng + lngOffset,
  };
}

export function observationLocationToMapPoint(
  location: ObservationLocation,
  fieldId: string
): { x: number; y: number } {
  const bounds = getFieldMapBounds(fieldId);
  const minLng = bounds.centerLng - bounds.spanLng / 2;
  const maxLat = bounds.centerLat + bounds.spanLat / 2;

  return {
    x: ((location.longitude - minLng) / bounds.spanLng) * 100,
    y: ((maxLat - location.latitude) / bounds.spanLat) * 100,
  };
}

export const DISEASE_CATEGORIES = [
  {
    id: "rust",
    label: "Rust",
    description: "Orange or yellow pustules on leaves and stems",
    imageSrc: "/diseases/stem-rust.svg",
    showInGrid: true,
    searchTerms: ["pustules", "orange", "yellow", "stripe", "stem rust", "leaf rust"],
  },
  {
    id: "leaf_blotch",
    label: "Leaf blotch",
    description: "Tan or brown lesions on leaves, often with dark specks",
    imageSrc: "/diseases/septoria-leaf-blotch.svg",
    showInGrid: true,
    searchTerms: ["septoria", "net blotch", "ramularia", "lesions", "blotch"],
  },
  {
    id: "head_disease",
    label: "Head disease",
    description: "Bleaching or damage on the wheat head",
    imageSrc: "/diseases/fusarium-head-blight.svg",
    showInGrid: true,
    searchTerms: ["fusarium", "wheat blast", "head blight", "spikelet", "ear"],
  },
  {
    id: "mildew",
    label: "Mildew",
    description: "White or grey powdery coating on leaves",
    imageSrc: "/diseases/powdery-mildew.svg",
    showInGrid: true,
    searchTerms: ["powdery", "white coating", "grey coating"],
  },
  {
    id: "sclerotinia",
    label: "Sclerotinia",
    description: "White mould and stem bleaching in dense canopies",
    imageSrc: "/diseases/fusarium-head-blight.svg",
    showInGrid: false,
    searchTerms: ["white mould", "stem rot", "sclerotinia stem", "bleaching"],
  },
  {
    id: "rhynchosporium",
    label: "Rhynchosporium",
    description: "Dark leaf spots with a yellow halo on barley and wheat leaves",
    imageSrc: "/diseases/net-blotch.svg",
    showInGrid: false,
    searchTerms: ["leaf scald", "dark spots", "halo", "rhynchosporium"],
  },
  {
    id: "downy_mildew",
    label: "Downy mildew",
    description: "Pale yellow patches with fuzzy growth on the leaf underside",
    imageSrc: "/diseases/powdery-mildew.svg",
    showInGrid: false,
    searchTerms: ["downy", "fuzzy", "underside", "pale patches"],
  },
] as const;

export type DiseaseCategory = (typeof DISEASE_CATEGORIES)[number];

export interface DiseaseSearchGroup {
  category: DiseaseCategory;
  species: DiseaseSpecificType[];
}

export const DISEASE_SPECIFIC_TYPES = [
  {
    id: "stem_rust",
    categoryId: "rust",
    label: "Stem rust",
    description: "Raised orange-brown pustules on stems and leaves",
    diseaseValue: "Brown rust",
    imageSrc: "/diseases/stem-rust.svg",
  },
  {
    id: "stripe_rust",
    categoryId: "rust",
    label: "Stripe rust",
    description: "Bright yellow-orange stripes running along leaves",
    diseaseValue: "Yellow rust",
    imageSrc: "/diseases/stripe-rust.svg",
  },
  {
    id: "leaf_rust",
    categoryId: "rust",
    label: "Leaf rust",
    description: "Small scattered orange-brown pustules on leaves",
    diseaseValue: "Brown rust",
    imageSrc: "/diseases/leaf-rust.svg",
  },
  {
    id: "septoria_leaf_blotch",
    categoryId: "leaf_blotch",
    label: "Septoria leaf blotch",
    description: "Elongated tan lesions with dark specks inside",
    diseaseValue: "Septoria leaf blotch",
    imageSrc: "/diseases/septoria-leaf-blotch.svg",
  },
  {
    id: "net_blotch",
    categoryId: "leaf_blotch",
    label: "Net blotch",
    description: "Dark brown netting pattern across the leaf surface",
    diseaseValue: "Net blotch",
    imageSrc: "/diseases/net-blotch.svg",
  },
  {
    id: "ramularia",
    categoryId: "leaf_blotch",
    label: "Ramularia",
    description: "Rectangular brown lesions between leaf veins",
    diseaseValue: "Ramularia",
    imageSrc: "/diseases/ramularia.svg",
  },
  {
    id: "fusarium_head_blight",
    categoryId: "head_disease",
    label: "Fusarium head blight",
    description: "Bleached spikelets with pinkish fungal growth",
    diseaseValue: "Fusarium head blight",
    imageSrc: "/diseases/fusarium-head-blight.svg",
  },
  {
    id: "wheat_blast",
    categoryId: "head_disease",
    label: "Wheat blast",
    description: "Bleached spikelets spreading from the top of the head",
    diseaseValue: "Other",
    imageSrc: "/diseases/wheat-blast.svg",
  },
  {
    id: "powdery_mildew",
    categoryId: "mildew",
    label: "Powdery mildew",
    description: "White powdery patches on upper leaf surfaces",
    diseaseValue: "Powdery mildew",
    imageSrc: "/diseases/powdery-mildew.svg",
  },
] as const;

export type DiseaseSpecificType = (typeof DISEASE_SPECIFIC_TYPES)[number];

export const DISEASE_CATEGORY_SLOTS_PER_PAGE = 6;
export const DISEASE_CATEGORY_PAGE_COUNT = 2;

export function getDiseaseCategory(id: string): DiseaseCategory | undefined {
  return DISEASE_CATEGORIES.find((category) => category.id === id);
}

export function getDiseaseSpecificType(id: string): DiseaseSpecificType | undefined {
  return DISEASE_SPECIFIC_TYPES.find((type) => type.id === id);
}

export function getDiseaseSpecificTypesForCategory(
  categoryId: string
): DiseaseSpecificType[] {
  return DISEASE_SPECIFIC_TYPES.filter((type) => type.categoryId === categoryId);
}

export function getDiseaseCategoryGridPages(): (DiseaseCategory | null)[][] {
  const gridCategories = DISEASE_CATEGORIES.filter(
    (category) => category.showInGrid !== false
  );
  const totalSlots = DISEASE_CATEGORY_SLOTS_PER_PAGE * DISEASE_CATEGORY_PAGE_COUNT;

  const allSlots = Array.from({ length: totalSlots }, (_, index) => {
    return gridCategories[index] ?? null;
  });

  return Array.from({ length: DISEASE_CATEGORY_PAGE_COUNT }, (_, pageIndex) => {
    const start = pageIndex * DISEASE_CATEGORY_SLOTS_PER_PAGE;
    return allSlots.slice(start, start + DISEASE_CATEGORY_SLOTS_PER_PAGE);
  });
}

interface SearchableCategory {
  id: string;
  label: string;
  description: string;
  searchTerms?: readonly string[];
}

interface SearchableSpecies {
  id: string;
  categoryId: string;
  label: string;
  description: string;
}

function buildObservationSearchGroups<
  TCategory extends SearchableCategory,
  TSpecies extends SearchableSpecies,
>(
  query: string,
  categories: readonly TCategory[],
  getSpeciesForCategory: (categoryId: string) => TSpecies[]
): { category: TCategory; species: TSpecies[] }[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const groups: { category: TCategory; species: TSpecies[] }[] = [];

  for (const category of categories) {
    const categoryText = [
      category.label,
      category.description,
      ...(category.searchTerms ?? []),
    ]
      .join(" ")
      .toLowerCase();
    const categoryMatches = categoryText.includes(normalizedQuery);
    const allSpecies = getSpeciesForCategory(category.id);
    const matchingSpecies = allSpecies.filter((species) =>
      [species.label, species.description].join(" ").toLowerCase().includes(normalizedQuery)
    );

    if (!categoryMatches && matchingSpecies.length === 0) continue;

    const species =
      categoryMatches && matchingSpecies.length === 0 ? allSpecies : matchingSpecies;

    groups.push({ category, species });
  }

  return groups.sort((a, b) => a.category.label.localeCompare(b.category.label));
}

export function searchDiseaseGroups(query: string): DiseaseSearchGroup[] {
  return buildObservationSearchGroups(
    query,
    DISEASE_CATEGORIES,
    getDiseaseSpecificTypesForCategory
  );
}

export const PEST_CATEGORIES = [
  {
    id: "aphids",
    label: "Aphids",
    description: "Small soft-bodied insects clustering on leaves and stems",
    imageSrc: "/pests/aphids.svg",
    showInGrid: true,
    searchTerms: ["aphid", "colony", "sticky", "honeydew", "grain aphid"],
  },
  {
    id: "beetles",
    label: "Beetles",
    description: "Hard-shelled insects chewing leaves or stems",
    imageSrc: "/pests/beetles.svg",
    showInGrid: true,
    searchTerms: ["beetle", "flea beetle", "bulb fly", "chewing"],
  },
  {
    id: "caterpillars",
    label: "Caterpillars",
    description: "Larvae feeding on leaves and flag leaves",
    imageSrc: "/pests/caterpillars.svg",
    showInGrid: true,
    searchTerms: ["caterpillar", "larvae", "armyworm", "worm", "defoliation"],
  },
  {
    id: "mites",
    label: "Mites",
    description: "Tiny pests causing stippling or bronzing on leaves",
    imageSrc: "/pests/mites.svg",
    showInGrid: true,
    searchTerms: ["mite", "stippling", "bronzing", "spider mite"],
  },
  {
    id: "slugs",
    label: "Slugs",
    description: "Slime trails and irregular holes in leaves and seedlings",
    imageSrc: "/pests/slugs.svg",
    showInGrid: false,
    searchTerms: ["slug", "snail", "slime", "holes"],
  },
  {
    id: "wireworm",
    label: "Wireworm",
    description: "Soil-dwelling larvae damaging roots and stems below ground",
    imageSrc: "/pests/wireworm.svg",
    showInGrid: false,
    searchTerms: ["wireworm", "larvae", "roots", "soil pest"],
  },
] as const;

export type PestCategory = (typeof PEST_CATEGORIES)[number];

export const PEST_SPECIFIC_TYPES = [
  {
    id: "grain_aphid",
    categoryId: "aphids",
    label: "Grain aphid",
    description: "Green or black colonies on leaves and ears",
    imageSrc: "/pests/aphids.svg",
  },
  {
    id: "bird_cherry_oat_aphid",
    categoryId: "aphids",
    label: "Bird cherry-oat aphid",
    description: "Olive-green aphids on leaves, often with yellowing",
    imageSrc: "/pests/aphids.svg",
  },
  {
    id: "rose_grain_aphid",
    categoryId: "aphids",
    label: "Rose-grain aphid",
    description: "Pink-green aphids on upper leaves and stems",
    imageSrc: "/pests/aphids.svg",
  },
  {
    id: "flea_beetle",
    categoryId: "beetles",
    label: "Flea beetle",
    description: "Small jumping beetles leaving shot-hole damage in leaves",
    imageSrc: "/pests/beetles.svg",
  },
  {
    id: "wheat_bulb_fly",
    categoryId: "beetles",
    label: "Wheat bulb fly",
    description: "Larvae feeding inside stems near the base of plants",
    imageSrc: "/pests/beetles.svg",
  },
  {
    id: "blossom_beetle",
    categoryId: "beetles",
    label: "Blossom beetle",
    description: "Beetles feeding on flowers and developing grain",
    imageSrc: "/pests/beetles.svg",
  },
  {
    id: "armyworm",
    categoryId: "caterpillars",
    label: "Armyworm",
    description: "Striped larvae marching across leaves and stems",
    imageSrc: "/pests/caterpillars.svg",
  },
  {
    id: "cereal_leaf_beetle",
    categoryId: "caterpillars",
    label: "Cereal leaf beetle",
    description: "Skeletal leaf damage from larval feeding strips",
    imageSrc: "/pests/caterpillars.svg",
  },
  {
    id: "brown_wheat_mite",
    categoryId: "mites",
    label: "Brown wheat mite",
    description: "Fine stippling and bronzing on drought-stressed leaves",
    imageSrc: "/pests/mites.svg",
  },
  {
    id: "two_spotted_spider_mite",
    categoryId: "mites",
    label: "Two-spotted spider mite",
    description: "Webbing and pale stippling on upper leaf surfaces",
    imageSrc: "/pests/mites.svg",
  },
] as const;

export type PestSpecificType = (typeof PEST_SPECIFIC_TYPES)[number];

export interface PestSearchGroup {
  category: PestCategory;
  species: PestSpecificType[];
}

export const PEST_CATEGORY_SLOTS_PER_PAGE = 6;
export const PEST_CATEGORY_PAGE_COUNT = 2;

export function getPestCategory(id: string): PestCategory | undefined {
  return PEST_CATEGORIES.find((category) => category.id === id);
}

export function getPestSpecificType(id: string): PestSpecificType | undefined {
  return PEST_SPECIFIC_TYPES.find((type) => type.id === id);
}

export function getPestSpecificTypesForCategory(categoryId: string): PestSpecificType[] {
  return PEST_SPECIFIC_TYPES.filter((type) => type.categoryId === categoryId);
}

export function getPestCategoryGridPages(): (PestCategory | null)[][] {
  const gridCategories = PEST_CATEGORIES.filter((category) => category.showInGrid !== false);
  const totalSlots = PEST_CATEGORY_SLOTS_PER_PAGE * PEST_CATEGORY_PAGE_COUNT;

  const allSlots = Array.from({ length: totalSlots }, (_, index) => {
    return gridCategories[index] ?? null;
  });

  return Array.from({ length: PEST_CATEGORY_PAGE_COUNT }, (_, pageIndex) => {
    const start = pageIndex * PEST_CATEGORY_SLOTS_PER_PAGE;
    return allSlots.slice(start, start + PEST_CATEGORY_SLOTS_PER_PAGE);
  });
}

export function searchPestGroups(query: string): PestSearchGroup[] {
  return buildObservationSearchGroups(
    query,
    PEST_CATEGORIES,
    getPestSpecificTypesForCategory
  );
}

export const PEST_INFECTED_PARTS = [
  "Leaf",
  "Stem",
  "Roots",
  "Whole plant",
  "Flower",
  "Growing point",
] as const;

export type PestInfectedPart = (typeof PEST_INFECTED_PARTS)[number];

export interface PestObservationDetails {
  pest: string;
  pestLabel: string;
  pestImageSrc: string;
  pestCategoryId: string;
  pestCategoryLabel: string;
  pestCategoryImageSrc: string;
  pestSpecificTypeId: string;
  pestOther: string;
  infectedParts: string[];
  fieldPrevalence: number;
  pestCountScale: number;
  damageSeverityScale: number;
  flaggedForFollowUp: boolean;
  otherNotes: string;
  media: ObservationMediaItem[];
}

export const EMPTY_PEST_DETAILS: PestObservationDetails = {
  pest: "",
  pestLabel: "",
  pestImageSrc: "",
  pestCategoryId: "",
  pestCategoryLabel: "",
  pestCategoryImageSrc: "",
  pestSpecificTypeId: "",
  pestOther: "",
  infectedParts: [],
  fieldPrevalence: 2,
  pestCountScale: 2,
  damageSeverityScale: 2,
  flaggedForFollowUp: false,
  otherNotes: "",
  media: [],
};

export function getPestDisplayName(details: PestObservationDetails): string {
  if (details.pestCategoryId === "other") {
    return details.pestOther.trim() || "Pest";
  }

  if (details.pestSpecificTypeId) {
    const specificType = getPestSpecificType(details.pestSpecificTypeId);
    if (specificType) {
      return `${details.pestCategoryLabel} · ${specificType.label}`;
    }
  }

  if (details.pestCategoryLabel.trim()) {
    return details.pestCategoryLabel.trim();
  }

  return details.pestLabel || details.pest || "Pest";
}

export function formatPestSummary(details: PestObservationDetails): string {
  const pestLabel = getPestDisplayName(details);
  const prevalenceLabel = FIELD_PREVALENCE_LABELS[details.fieldPrevalence - 1] ?? "";
  const countLabel = PLANTS_AFFECTED_LABELS[details.pestCountScale - 1] ?? "";
  const severityLabel = SEVERITY_SCALE_LABELS[details.damageSeverityScale - 1] ?? "";

  const parts = [
    pestLabel && `Pest: ${pestLabel}`,
    details.infectedParts.length > 0 &&
      `Infected: ${details.infectedParts.join(", ")}`,
    prevalenceLabel && `Spread: ${prevalenceLabel}`,
    countLabel && `Count: ${countLabel}`,
    severityLabel && `Damage: ${severityLabel}`,
    details.flaggedForFollowUp ? "Flagged for follow up" : null,
    details.otherNotes.trim() || null,
  ].filter(Boolean);

  const imageCount = details.media.filter((item) => item.type === "image").length;
  const videoCount = details.media.filter((item) => item.type === "video").length;

  if (imageCount > 0) {
    parts.push(`${imageCount} image${imageCount === 1 ? "" : "s"}`);
  }

  if (videoCount > 0) {
    parts.push(`${videoCount} video${videoCount === 1 ? "" : "s"} (pending analysis)`);
  }

  return parts.join(" · ") || "Pest observation logged.";
}

export const PLANT_LOCATIONS = [
  "Top of plant",
  "Middle",
  "Lower plant",
  "Roots / base",
  "Head",
  "Whole plant",
] as const;

export type PlantLocation = (typeof PLANT_LOCATIONS)[number];

export const FIELD_PREVALENCE_LABELS = [
  "One spot",
  "Few patches",
  "Several patches",
  "Widespread",
  "Whole field",
] as const;

export const PLANTS_AFFECTED_LABELS = [
  "1 in 10",
  "2–3 in 10",
  "4–5 in 10",
  "6–8 in 10",
  "9–10 in 10",
] as const;

export const SEVERITY_SCALE_LABELS = [
  "Trace",
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

export const DISEASE_TYPES = [
  "Septoria leaf blotch",
  "Yellow rust",
  "Brown rust",
  "Powdery mildew",
  "Fusarium head blight",
  "Ramularia",
  "Net blotch",
  "Rhynchosporium",
  "Sclerotinia",
  "Downy mildew",
  "Unknown",
  "Other",
] as const;

export type DiseaseType = (typeof DISEASE_TYPES)[number];

export interface DiseaseObservationDetails {
  disease: string;
  diseaseLabel: string;
  diseaseImageSrc: string;
  diseaseCategoryId: string;
  diseaseCategoryLabel: string;
  diseaseCategoryImageSrc: string;
  diseaseSpecificTypeId: string;
  diseaseOther: string;
  plantLocations: string[];
  fieldPrevalence: number;
  plantsAffectedScale: number;
  severityScale: number;
  flaggedForFollowUp: boolean;
  symptomLocation: string;
  lesionType: string;
  plantsAffectedPercent: string;
  severity: string;
  areaAffectedPercent: string;
  sampleTaken: boolean;
  needsAction: boolean;
  otherNotes: string;
  media: ObservationMediaItem[];
}

export const EMPTY_DISEASE_DETAILS: DiseaseObservationDetails = {
  disease: "",
  diseaseLabel: "",
  diseaseImageSrc: "",
  diseaseCategoryId: "",
  diseaseCategoryLabel: "",
  diseaseCategoryImageSrc: "",
  diseaseSpecificTypeId: "",
  diseaseOther: "",
  plantLocations: [],
  fieldPrevalence: 2,
  plantsAffectedScale: 2,
  severityScale: 2,
  flaggedForFollowUp: false,
  symptomLocation: "",
  lesionType: "",
  plantsAffectedPercent: "",
  severity: "",
  areaAffectedPercent: "",
  sampleTaken: false,
  needsAction: false,
  otherNotes: "",
  media: [],
};

export function getDiseaseDisplayName(details: DiseaseObservationDetails): string {
  if (details.diseaseCategoryId === "other") {
    return details.diseaseOther.trim() || "Disease";
  }

  if (details.diseaseSpecificTypeId) {
    const specificType = getDiseaseSpecificType(details.diseaseSpecificTypeId);
    if (specificType) {
      return `${details.diseaseCategoryLabel} · ${specificType.label}`;
    }
  }

  if (details.diseaseCategoryLabel.trim()) {
    return details.diseaseCategoryLabel.trim();
  }

  if (details.diseaseLabel.trim()) {
    return details.diseaseLabel.trim();
  }

  if (details.disease === "Other" && details.diseaseOther.trim()) {
    return details.diseaseOther.trim();
  }

  return details.disease;
}

export function isDiseasePhotoRequired(details: DiseaseObservationDetails): boolean {
  return details.disease === "Unknown";
}

export function hasRequiredDiseasePhoto(details: DiseaseObservationDetails): boolean {
  return details.media.some((item) => item.type === "image");
}

export function canSaveDiseaseObservation(details: DiseaseObservationDetails): boolean {
  if (!details.diseaseCategoryId && !details.disease) return false;
  if (
    details.disease === "Other" &&
    details.diseaseCategoryId !== "other" &&
    !details.diseaseOther.trim()
  ) {
    return false;
  }
  if (isDiseasePhotoRequired(details) && !hasRequiredDiseasePhoto(details)) return false;
  return true;
}

export function formatDiseaseSummary(details: DiseaseObservationDetails): string {
  const diseaseLabel = getDiseaseDisplayName(details);
  const prevalenceLabel =
    FIELD_PREVALENCE_LABELS[details.fieldPrevalence - 1] ?? "";
  const plantsAffectedLabel =
    PLANTS_AFFECTED_LABELS[details.plantsAffectedScale - 1] ?? "";
  const severityLabel =
    SEVERITY_SCALE_LABELS[details.severityScale - 1] ?? "";

  const parts = [
    diseaseLabel && `Disease: ${diseaseLabel}`,
    details.plantLocations.length > 0 &&
      `Location: ${details.plantLocations.join(", ")}`,
    prevalenceLabel && `Spread: ${prevalenceLabel}`,
    plantsAffectedLabel && `Plants affected: ${plantsAffectedLabel}`,
    severityLabel && `Severity: ${severityLabel}`,
    details.flaggedForFollowUp ? "Flagged for follow up" : null,
    details.symptomLocation && `Location: ${details.symptomLocation}`,
    details.lesionType && `Lesion: ${details.lesionType}`,
    details.plantsAffectedPercent && `${details.plantsAffectedPercent}% plants affected`,
    details.severity && `Severity: ${details.severity}`,
    details.areaAffectedPercent && `${details.areaAffectedPercent}% area affected`,
    details.sampleTaken ? "Sample taken" : null,
    details.needsAction ? "Needs action" : null,
    details.otherNotes && details.otherNotes,
  ].filter(Boolean);

  const imageCount = details.media.filter((item) => item.type === "image").length;
  const videoCount = details.media.filter((item) => item.type === "video").length;

  if (imageCount > 0) {
    parts.push(`${imageCount} image${imageCount === 1 ? "" : "s"}`);
  }

  if (videoCount > 0) {
    parts.push(`${videoCount} video${videoCount === 1 ? "" : "s"} (pending analysis)`);
  }

  return parts.join(" · ") || "Disease observation logged.";
}

export const WEED_CATEGORIES = [
  {
    id: "broadleaf",
    label: "Broadleaf weed",
    description: "Wide leaves, often with visible veins or lobes",
    imageSrc: "/weeds/broadleaf.svg",
    searchTerms: ["broadleaf", "broadleaved", "poppy", "chickweed", "mayweed", "cleavers", "thistle"],
  },
  {
    id: "grass",
    label: "Grass weed",
    description: "Narrow leaves, often in tufts or clumps",
    imageSrc: "/weeds/grass.svg",
    searchTerms: ["grass", "black-grass", "wild oats", "brome", "ryegrass"],
  },
  {
    id: "sedge",
    label: "Sedge",
    description: "Triangular stems, often in wet or compacted areas",
    imageSrc: "/weeds/sedge.svg",
    searchTerms: ["sedge", "yellow nutsedge", "purple nutsedge"],
  },
] as const;

export type WeedCategory = (typeof WEED_CATEGORIES)[number];

export const WEED_SPECIFIC_TYPES = [
  {
    id: "common_poppy",
    categoryId: "broadleaf",
    label: "Common poppy",
    description: "Red flowers, lobed leaves, often in cereal crops",
    weedValue: "Common poppy",
    imageSrc: "/weeds/common-poppy.svg",
  },
  {
    id: "chickweed",
    categoryId: "broadleaf",
    label: "Chickweed",
    description: "Small oval leaves, white star-shaped flowers",
    weedValue: "Chickweed",
    imageSrc: "/weeds/chickweed.svg",
  },
  {
    id: "mayweed",
    categoryId: "broadleaf",
    label: "Mayweed",
    description: "Feathery leaves, daisy-like white flowers",
    weedValue: "Mayweed",
    imageSrc: "/weeds/mayweed.svg",
  },
  {
    id: "cleavers",
    categoryId: "broadleaf",
    label: "Cleavers",
    description: "Sticky stems, whorls of narrow leaves",
    weedValue: "Cleavers",
    imageSrc: "/weeds/cleavers.svg",
  },
  {
    id: "thistle",
    categoryId: "broadleaf",
    label: "Thistle",
    description: "Spiny lobed leaves, purple or pink flowers",
    weedValue: "Thistle",
    imageSrc: "/weeds/thistle.svg",
  },
  {
    id: "black_grass",
    categoryId: "grass",
    label: "Black-grass",
    description: "Dark purple-black seed heads, slender leaves",
    weedValue: "Black-grass",
    imageSrc: "/weeds/black-grass.svg",
  },
  {
    id: "wild_oats",
    categoryId: "grass",
    label: "Wild oats",
    description: "Large drooping seed heads, twisted leaf tips",
    weedValue: "Wild oats",
    imageSrc: "/weeds/wild-oats.svg",
  },
  {
    id: "brome",
    categoryId: "grass",
    label: "Brome",
    description: "Hairy leaves and stems, large drooping panicles",
    weedValue: "Brome",
    imageSrc: "/weeds/brome.svg",
  },
  {
    id: "yellow_nutsedge",
    categoryId: "sedge",
    label: "Yellow nutsedge",
    description: "Triangular stems, yellow-green leaves, tubers",
    weedValue: "Yellow nutsedge",
    imageSrc: "/weeds/yellow-nutsedge.svg",
  },
  {
    id: "purple_nutsedge",
    categoryId: "sedge",
    label: "Purple nutsedge",
    description: "Dark green leaves, purple-brown seed heads",
    weedValue: "Purple nutsedge",
    imageSrc: "/weeds/purple-nutsedge.svg",
  },
] as const;

export type WeedSpecificType = (typeof WEED_SPECIFIC_TYPES)[number];

export interface WeedCategorySearchResult {
  category: WeedCategory;
  matchedLabel?: string;
}

export function getWeedCategory(id: string): WeedCategory | undefined {
  return WEED_CATEGORIES.find((category) => category.id === id);
}

export function getWeedSpecificType(id: string): WeedSpecificType | undefined {
  return WEED_SPECIFIC_TYPES.find((type) => type.id === id);
}

export function getWeedSpecificTypesForCategory(categoryId: string): WeedSpecificType[] {
  return WEED_SPECIFIC_TYPES.filter((type) => type.categoryId === categoryId);
}

export function searchWeedCategories(query: string): WeedCategorySearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const results = new Map<string, WeedCategorySearchResult>();

  for (const category of WEED_CATEGORIES) {
    const categoryText = [
      category.label,
      category.description,
      ...(category.searchTerms ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (categoryText.includes(normalizedQuery)) {
      results.set(category.id, { category });
    }
  }

  for (const type of WEED_SPECIFIC_TYPES) {
    const typeText = [type.label, type.description].join(" ").toLowerCase();
    if (!typeText.includes(normalizedQuery)) continue;

    const category = getWeedCategory(type.categoryId);
    if (!category) continue;

    const existing = results.get(category.id);
    if (!existing) {
      results.set(category.id, { category, matchedLabel: type.label });
      continue;
    }

    if (!existing.matchedLabel) {
      results.set(category.id, { category, matchedLabel: type.label });
    }
  }

  return Array.from(results.values()).sort((a, b) =>
    a.category.label.localeCompare(b.category.label)
  );
}

export const WEED_SIZE_OPTIONS = [
  { label: "Germinating", subtitle: "First leaves" },
  { label: "Small", subtitle: "2–3 leaves" },
  { label: "Established", subtitle: "4–6 leaves" },
  { label: "Large", subtitle: "7+ leaves" },
  { label: "Flowering", subtitle: "In flower" },
] as const;

export const WEED_DENSITY_OPTIONS = [
  { label: "Single", subtitle: "Just one" },
  { label: "Few", subtitle: "Hard to spot" },
  { label: "Some", subtitle: "Easy to see" },
  { label: "Plenty", subtitle: "Throughout area" },
  { label: "Dense", subtitle: "Everywhere" },
] as const;

export interface WeedObservationDetails {
  weed: string;
  weedLabel: string;
  weedImageSrc: string;
  weedCategoryId: string;
  weedCategoryLabel: string;
  weedCategoryImageSrc: string;
  weedSpecificTypeId: string;
  weedOther: string;
  sizeScale: number;
  densityScale: number;
  flaggedForFollowUp: boolean;
  otherNotes: string;
  media: ObservationMediaItem[];
}

export const EMPTY_WEED_DETAILS: WeedObservationDetails = {
  weed: "",
  weedLabel: "",
  weedImageSrc: "",
  weedCategoryId: "",
  weedCategoryLabel: "",
  weedCategoryImageSrc: "",
  weedSpecificTypeId: "",
  weedOther: "",
  sizeScale: 3,
  densityScale: 3,
  flaggedForFollowUp: false,
  otherNotes: "",
  media: [],
};

export function getWeedDisplayName(details: WeedObservationDetails): string {
  if (details.weedCategoryId === "other") {
    return details.weedOther.trim() || "Weed";
  }

  if (details.weedSpecificTypeId) {
    const specificType = getWeedSpecificType(details.weedSpecificTypeId);
    if (specificType) {
      return specificType.label;
    }
  }

  if (details.weedCategoryLabel.trim()) {
    return details.weedCategoryLabel.trim();
  }

  return details.weedLabel || details.weed || "Weed";
}

export function canSaveWeedObservation(details: WeedObservationDetails): boolean {
  return Boolean(details.weedCategoryId);
}

export function formatWeedSummary(details: WeedObservationDetails): string {
  const weedLabel = getWeedDisplayName(details);
  const sizeLabel = WEED_SIZE_OPTIONS[details.sizeScale - 1]?.label ?? "";
  const densityLabel = WEED_DENSITY_OPTIONS[details.densityScale - 1]?.label ?? "";

  const parts = [
    weedLabel && `Weed: ${weedLabel}`,
    details.weedCategoryLabel &&
      !details.weedSpecificTypeId &&
      details.weedCategoryId !== "other" &&
      `Type: ${details.weedCategoryLabel}`,
    sizeLabel && `Size: ${sizeLabel}`,
    densityLabel && `Density: ${densityLabel}`,
    details.flaggedForFollowUp ? "Flagged for follow up" : null,
    details.otherNotes.trim() || null,
  ].filter(Boolean);

  const imageCount = details.media.filter((item) => item.type === "image").length;
  const videoCount = details.media.filter((item) => item.type === "video").length;

  if (imageCount > 0) {
    parts.push(`${imageCount} image${imageCount === 1 ? "" : "s"}`);
  }

  if (videoCount > 0) {
    parts.push(`${videoCount} video${videoCount === 1 ? "" : "s"} (pending analysis)`);
  }

  return parts.join(" · ") || "Weed observation logged.";
}

export const MOISTURE_DEPTHS = [
  { id: "0_20", label: "0–20 cm", step: 1 },
  { id: "20_40", label: "20–40 cm", step: 2 },
  { id: "40_60", label: "40–60 cm", step: 3 },
  { id: "60_80", label: "60–80 cm", step: 4 },
] as const;

export type MoistureDepth = (typeof MOISTURE_DEPTHS)[number];

export const MOISTURE_LEVELS = [
  {
    value: 1,
    label: "Dust",
    subtitle: "Powder dry, falls apart",
    swatch: "#e8c896",
    accent: "#d4a574",
  },
  {
    value: 2,
    label: "Dry",
    subtitle: "Crumbly, no moisture",
    swatch: "#dcc4a0",
    accent: "#c4a060",
  },
  {
    value: 3,
    label: "Ideal",
    subtitle: "Cool, holds lightly",
    swatch: "#84bd00",
    accent: "#6fa300",
  },
  {
    value: 4,
    label: "Wet",
    subtitle: "Damp, sticks together",
    swatch: "#7ec8d4",
    accent: "#5eb8c4",
  },
  {
    value: 5,
    label: "Mud",
    subtitle: "Saturated, muddy",
    swatch: "#3d8090",
    accent: "#2d6a7a",
  },
] as const;

export type MoistureLevel = (typeof MOISTURE_LEVELS)[number];

export interface MoistureDepthReading {
  depthId: string;
  level: number;
}

export interface MoistureObservationDetails {
  readings: MoistureDepthReading[];
}

export const EMPTY_MOISTURE_DETAILS: MoistureObservationDetails = {
  readings: [],
};

export function getMoistureDepth(id: string): MoistureDepth | undefined {
  return MOISTURE_DEPTHS.find((depth) => depth.id === id);
}

export function getMoistureLevelForValue(level: number): MoistureLevel {
  const rounded = Math.min(5, Math.max(1, Math.round(level)));
  return MOISTURE_LEVELS[rounded - 1];
}

export function formatMoistureLevelValue(level: number): string {
  return Number.isInteger(level) ? String(level) : level.toFixed(1);
}

export function formatMoistureSummary(details: MoistureObservationDetails): string {
  if (details.readings.length === 0) {
    return "Moisture check logged.";
  }

  const parts = details.readings.map((reading) => {
    const depth = getMoistureDepth(reading.depthId);
    const level = getMoistureLevelForValue(reading.level);
    const depthLabel = depth?.label ?? reading.depthId;
    return `${depthLabel}: ${level.label}`;
  });

  return `Moisture · ${parts.join(" · ")}`;
}

export function getMoistureCollapsedSummary(
  details: MoistureObservationDetails
): string {
  if (details.readings.length === 0) return "Moisture check logged";

  const labels = details.readings.map((reading) => {
    const depth = getMoistureDepth(reading.depthId);
    const level = getMoistureLevelForValue(reading.level);
    return `${depth?.label ?? reading.depthId} ${level.label.toLowerCase()}`;
  });

  return labels.join(" · ");
}

export interface VoiceNoteDetails {
  audioUrl: string;
  durationSeconds: number;
  media?: ObservationMediaItem[];
}

export function formatVoiceNoteSummary(details: VoiceNoteDetails): string {
  const mins = Math.floor(details.durationSeconds / 60);
  const secs = details.durationSeconds % 60;
  const duration =
    mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  const imageCount = details.media?.filter((item) => item.type === "image").length ?? 0;
  const imageSuffix =
    imageCount > 0
      ? ` · ${imageCount} photo${imageCount === 1 ? "" : "s"}`
      : "";

  return `Voice note · ${duration}${imageSuffix}`;
}

export interface ScoutingObservation {
  id: string;
  type: ObservationType;
  note: string;
  createdAt: string;
  location?: ObservationLocation;
  diseaseDetails?: DiseaseObservationDetails;
  pestDetails?: PestObservationDetails;
  otherDetails?: OtherObservationDetails;
  weedDetails?: WeedObservationDetails;
  moistureDetails?: MoistureObservationDetails;
  voiceNoteDetails?: VoiceNoteDetails;
}

export type ObservationMediaType = "image" | "video";

export interface ObservationMediaItem {
  id: string;
  type: ObservationMediaType;
  url: string;
  name: string;
  pendingAnalysis?: boolean;
}

export function formatMediaUploadTime(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export interface OtherObservationDetails {
  media: ObservationMediaItem[];
}

export const EMPTY_OTHER_DETAILS: OtherObservationDetails = {
  media: [],
};

export function formatOtherSummary(
  note: string,
  details: OtherObservationDetails
): string {
  const parts = [note.trim()].filter(Boolean);

  const imageCount = details.media.filter((item) => item.type === "image").length;
  const videoCount = details.media.filter((item) => item.type === "video").length;

  if (imageCount > 0) {
    parts.push(`${imageCount} image${imageCount === 1 ? "" : "s"}`);
  }

  if (videoCount > 0) {
    parts.push(`${videoCount} video${videoCount === 1 ? "" : "s"} (pending analysis)`);
  }

  return parts.join(" · ") || "Other observation logged.";
}

export function createObservation(
  type: ObservationType,
  note: string,
  diseaseDetails?: DiseaseObservationDetails,
  otherDetails?: OtherObservationDetails,
  weedDetails?: WeedObservationDetails,
  voiceNoteDetails?: VoiceNoteDetails,
  pestDetails?: PestObservationDetails,
  moistureDetails?: MoistureObservationDetails,
  fieldId?: string
): ScoutingObservation {
  const id = `obs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    type,
    note,
    createdAt: new Date().toISOString(),
    location: fieldId ? generateObservationLocation(fieldId, id) : undefined,
    diseaseDetails,
    pestDetails,
    otherDetails,
    weedDetails,
    moistureDetails,
    voiceNoteDetails,
  };
}
