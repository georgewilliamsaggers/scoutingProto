export type ObservationType =
  | "disease"
  | "pest"
  | "weed"
  | "nutrition"
  | "moisture"
  | "chemical_injury"
  | "post_treatment_check"
  | "trap"
  | "other"
  | "voice_note";

export const OBSERVATION_TYPES: {
  id: ObservationType;
  label: string;
  tileClass: string;
  iconClass: string;
}[] = [
  {
    id: "disease",
    label: "Disease",
    tileClass: "bg-red-100 ring-red-100 active:bg-red-200",
    iconClass: "bg-red-200 text-red-700",
  },
  {
    id: "pest",
    label: "Pest",
    tileClass: "bg-orange-100 ring-orange-100 active:bg-orange-200",
    iconClass: "bg-orange-200 text-orange-700",
  },
  {
    id: "weed",
    label: "Weed",
    tileClass: "bg-lime/20 ring-lime/20 active:bg-lime/30",
    iconClass: "bg-lime/30 text-lime",
  },
  {
    id: "nutrition",
    label: "Nutrition",
    tileClass: "bg-teal/15 ring-teal/20 active:bg-teal/25",
    iconClass: "bg-teal/25 text-teal-deep",
  },
  {
    id: "moisture",
    label: "Moisture",
    tileClass: "bg-sky-100 ring-sky-100 active:bg-sky-200",
    iconClass: "bg-sky-200 text-sky-700",
  },
  {
    id: "chemical_injury",
    label: "Chemical injury",
    tileClass: "bg-amber-100 ring-amber-100 active:bg-amber-200",
    iconClass: "bg-amber-200 text-amber-800",
  },
  {
    id: "post_treatment_check",
    label: "Post treatment check",
    tileClass: "bg-violet-100 ring-violet-100 active:bg-violet-200",
    iconClass: "bg-violet-200 text-violet-700",
  },
  {
    id: "trap",
    label: "Trap",
    tileClass: "bg-navy/10 ring-navy/10 active:bg-navy/15",
    iconClass: "bg-navy/15 text-navy",
  },
  {
    id: "other",
    label: "Other",
    tileClass: "bg-border/40 ring-border active:bg-border/60",
    iconClass: "bg-border/80 text-muted",
  },
  {
    id: "voice_note",
    label: "Voice note",
    tileClass: "bg-indigo-100 ring-indigo-100 active:bg-indigo-200",
    iconClass: "bg-indigo-200 text-indigo-700",
  },
];

export function getObservationLabel(type: ObservationType): string {
  return OBSERVATION_TYPES.find((entry) => entry.id === type)?.label ?? "Observation";
}

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
  diseaseOther: string;
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
  diseaseOther: "",
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
  if (!details.disease) return false;
  if (details.disease === "Other" && !details.diseaseOther.trim()) return false;
  if (isDiseasePhotoRequired(details) && !hasRequiredDiseasePhoto(details)) return false;
  return true;
}

export function formatDiseaseSummary(details: DiseaseObservationDetails): string {
  const diseaseLabel = getDiseaseDisplayName(details);
  const parts = [
    diseaseLabel && `Disease: ${diseaseLabel}`,
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

export const WEED_TYPES = [
  "Black-grass",
  "Wild oats",
  "Common poppy",
  "Chickweed",
  "Mayweed",
  "Cleavers",
  "Thistle",
  "Unknown",
  "Other",
] as const;

export const WEED_GROUPS = [
  "Grass weeds",
  "Broadleaved weeds",
  "Sedges",
  "Other",
] as const;

export const WEED_GROWTH_STAGES = [
  "Seedling",
  "Early vegetative",
  "Tillering",
  "Stem extension",
  "Flowering",
  "Seed set",
  "Mature",
] as const;

export const WEED_DENSITY_CLASSES = [
  "Light",
  "Moderate",
  "Heavy",
  "Very heavy",
] as const;

export const WEED_DISTRIBUTION_PATTERNS = [
  "Patchy",
  "Uniform",
  "Scattered",
  "Field margin",
  "Headlands",
  "Along tramlines",
] as const;

export interface WeedObservationDetails {
  weed: string;
  weedOther: string;
  weedGroup: string;
  weedGrowthStage: string;
  densityClass: string;
  distributionPattern: string;
  heightMinCm: string;
  heightMaxCm: string;
  media: ObservationMediaItem[];
}

export const EMPTY_WEED_DETAILS: WeedObservationDetails = {
  weed: "",
  weedOther: "",
  weedGroup: "",
  weedGrowthStage: "",
  densityClass: "",
  distributionPattern: "",
  heightMinCm: "",
  heightMaxCm: "",
  media: [],
};

export function getWeedDisplayName(details: WeedObservationDetails): string {
  if (details.weed === "Other" && details.weedOther.trim()) {
    return details.weedOther.trim();
  }

  return details.weed;
}

export function canSaveWeedObservation(details: WeedObservationDetails): boolean {
  if (!details.weed) return false;
  if (details.weed === "Other" && !details.weedOther.trim()) return false;
  return true;
}

export function formatWeedSummary(details: WeedObservationDetails): string {
  const weedLabel = getWeedDisplayName(details);
  const parts = [
    weedLabel && `Weed: ${weedLabel}`,
    details.weedGroup && `Group: ${details.weedGroup}`,
    details.weedGrowthStage && `Growth stage: ${details.weedGrowthStage}`,
    details.densityClass && `Density: ${details.densityClass}`,
    details.distributionPattern && `Distribution: ${details.distributionPattern}`,
    details.heightMinCm &&
      details.heightMaxCm &&
      `Height: ${details.heightMinCm}–${details.heightMaxCm} cm`,
    details.heightMinCm &&
      !details.heightMaxCm &&
      `Height min: ${details.heightMinCm} cm`,
    !details.heightMinCm &&
      details.heightMaxCm &&
      `Height max: ${details.heightMaxCm} cm`,
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
  diseaseDetails?: DiseaseObservationDetails;
  otherDetails?: OtherObservationDetails;
  weedDetails?: WeedObservationDetails;
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
  voiceNoteDetails?: VoiceNoteDetails
): ScoutingObservation {
  return {
    id: `obs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    note,
    createdAt: new Date().toISOString(),
    diseaseDetails,
    otherDetails,
    weedDetails,
    voiceNoteDetails,
  };
}
