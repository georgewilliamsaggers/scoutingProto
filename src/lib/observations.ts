export type ObservationType =
  | "disease"
  | "pest"
  | "weed"
  | "moisture"
  | "other"
  | "population"
  | "voice_note";

export const OBSERVATION_TYPES: {
  id: ObservationType;
  label: string;
  supportText?: string;
  emoji?: string;
  tileClass: string;
  borderClass: string;
  iconContainerClass: string;
  accentClass: string;
  iconClass: string;
  textClass: string;
  badgeClass: string;
}[] = [
  {
    id: "pest",
    label: "Pest / insect",
    supportText: "What insect or pest can you see?",
    emoji: "🐛",
    tileClass: "bg-surface-elevated active:bg-stone-50",
    borderClass: "border border-border/50",
    iconContainerClass: "bg-rose-50",
    accentClass: "bg-rose-100/70",
    iconClass: "text-rose-700",
    textClass: "text-navy",
    badgeClass: "bg-rose-400 text-white",
  },
  {
    id: "disease",
    label: "Disease",
    supportText: "Where is the crop looking unhealthy?",
    emoji: "🎯",
    tileClass: "bg-surface-elevated active:bg-stone-50",
    borderClass: "border border-border/50",
    iconContainerClass: "bg-orange-50",
    accentClass: "bg-orange-100/70",
    iconClass: "text-orange-700",
    textClass: "text-navy",
    badgeClass: "bg-orange-400 text-white",
  },
  {
    id: "weed",
    label: "Weed",
    supportText: "What kind of unwanted plant is present?",
    emoji: "🌿",
    tileClass: "bg-surface-elevated active:bg-stone-50",
    borderClass: "border border-border/50",
    iconContainerClass: "bg-emerald-50",
    accentClass: "bg-emerald-100/70",
    iconClass: "text-emerald-700",
    textClass: "text-navy",
    badgeClass: "bg-emerald-400 text-white",
  },
  {
    id: "moisture",
    label: "Moisture",
    supportText: "Observe plants, soil—or both.",
    emoji: "💧",
    tileClass: "bg-surface-elevated active:bg-stone-50",
    borderClass: "border border-border/50",
    iconContainerClass: "bg-sky-50",
    accentClass: "bg-sky-100/70",
    iconClass: "text-sky-700",
    textClass: "text-navy",
    badgeClass: "bg-sky-400 text-white",
  },
  {
    id: "other",
    label: "Other",
    supportText: "Capture a general observation",
    emoji: "⋯",
    tileClass: "bg-surface-elevated active:bg-stone-50",
    borderClass: "border border-border/50",
    iconContainerClass: "bg-stone-100",
    accentClass: "bg-stone-200/70",
    iconClass: "text-stone-600",
    textClass: "text-navy",
    badgeClass: "bg-stone-400 text-white",
  },
  {
    id: "population",
    label: "Population",
    supportText: "Count plants in this crop",
    emoji: "🌱",
    tileClass: "bg-surface-elevated active:bg-stone-50",
    borderClass: "border border-border/50",
    iconContainerClass: "bg-amber-50",
    accentClass: "bg-amber-100/70",
    iconClass: "text-amber-700",
    textClass: "text-navy",
    badgeClass: "bg-amber-400 text-white",
  },
  {
    id: "voice_note",
    label: "Voice note",
    supportText: "Record a voice note of our observations",
    emoji: "🎙️",
    tileClass: "bg-surface-elevated active:bg-stone-50",
    borderClass: "border border-border/50",
    iconContainerClass: "bg-indigo-50",
    accentClass: "bg-indigo-100/70",
    iconClass: "text-indigo-700",
    textClass: "text-navy",
    badgeClass: "bg-indigo-400 text-white",
  },
];

export const LOG_OBSERVATION_TILE_TYPES = OBSERVATION_TYPES.filter(
  (entry) => entry.id !== "voice_note"
);

export function getObservationLabel(type: ObservationType): string {
  return OBSERVATION_TYPES.find((entry) => entry.id === type)?.label ?? "Observation";
}

export function getObservationTaxonomyTitle(observation: ScoutingObservation): string {
  if (observation.type === "pest" && observation.pestDetails) {
    return getPestDisplayName(observation.pestDetails);
  }

  if (observation.type === "disease" && observation.diseaseDetails) {
    const details = observation.diseaseDetails;
    const group = details.diseaseCategoryLabel.trim();
    const specific = details.diseaseSpecificTypeId
      ? getDiseaseSpecificType(details.diseaseSpecificTypeId)?.label
      : undefined;

    if (group && specific && specific.toLowerCase() !== group.toLowerCase()) {
      return `${group} · ${specific}`;
    }
    if (group) return group;
    if (specific) return specific;
    return getDiseaseDisplayName(details);
  }

  if (observation.type === "weed" && observation.weedDetails) {
    return getWeedDisplayName(observation.weedDetails);
  }

  return getObservationLabel(observation.type);
}

export function getReviewStatusChip(status?: ObservationReviewStatus): {
  label: string;
  tone: ObservationReviewStatus;
} {
  if (status === "agreed") return { label: "Checked", tone: "agreed" };
  if (status === "changed") return { label: "Checked modified", tone: "changed" };
  return { label: "Unchecked", tone: "pending" };
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
  population: "#d97706",
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
  "willow-bottom": {
    centerLat: 52.0930,
    centerLng: -0.5050,
    spanLat: 0.0038,
    spanLng: 0.0056,
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
  return locationToBoundsPoint(location, getFieldMapBounds(fieldId));
}

export function getFarmMapBounds(fieldIds: string[]): FieldMapBounds {
  const selected = (fieldIds.length > 0 ? fieldIds : Object.keys(FIELD_MAP_BOUNDS)).map(
    getFieldMapBounds
  );
  const minLat = Math.min(...selected.map((b) => b.centerLat - b.spanLat / 2));
  const maxLat = Math.max(...selected.map((b) => b.centerLat + b.spanLat / 2));
  const minLng = Math.min(...selected.map((b) => b.centerLng - b.spanLng / 2));
  const maxLng = Math.max(...selected.map((b) => b.centerLng + b.spanLng / 2));
  const spanLat = Math.max(0.006, (maxLat - minLat) * 1.35);
  const spanLng = Math.max(0.008, (maxLng - minLng) * 1.35);

  return {
    centerLat: (minLat + maxLat) / 2,
    centerLng: (minLng + maxLng) / 2,
    spanLat,
    spanLng,
  };
}

export function locationToFarmMapPoint(
  location: ObservationLocation,
  fieldIds: string[]
): { x: number; y: number } {
  return locationToBoundsPoint(location, getFarmMapBounds(fieldIds));
}

function locationToBoundsPoint(
  location: ObservationLocation,
  bounds: FieldMapBounds
): { x: number; y: number } {
  const minLng = bounds.centerLng - bounds.spanLng / 2;
  const maxLat = bounds.centerLat + bounds.spanLat / 2;

  return {
    x: ((location.longitude - minLng) / bounds.spanLng) * 100,
    y: ((maxLat - location.latitude) / bounds.spanLat) * 100,
  };
}

export const DISEASE_CATEGORIES = [
  {
    id: "gray_leaf_spot",
    label: "Gray leaf spot",
    description:
      "Long rectangular grey-brown lesions on maize leaves. Control with residue management, rotation and a registered foliar fungicide.",
    imageSrc: "/diseases/maize-gray-leaf-spot.webp",
    showInGrid: true,
    searchTerms: ["grey leaf spot", "cercospora", "maize"],
  },
  {
    id: "northern_leaf_blight",
    label: "Northern leaf blight",
    description:
      "Large cigar-shaped leaf lesions. Control with resistant hybrids, rotation and timely fungicide.",
    imageSrc: "/diseases/maize-northern-leaf-blight.webp",
    showInGrid: true,
    searchTerms: ["turcicum", "nlb", "maize"],
  },
  {
    id: "maize_streak",
    label: "Maize streak disease",
    description:
      "Narrow yellow streaks running with the veins. Control leafhoppers and plant resistant hybrids.",
    imageSrc: "/diseases/maize-streak-virus.webp",
    showInGrid: true,
    searchTerms: ["msd", "streak virus", "maize"],
  },
  {
    id: "common_rust",
    label: "Common rust",
    description:
      "Raised cinnamon-brown pustules on maize leaves. Control with resistant hybrids; fungicide if infection is early and severe.",
    imageSrc: "/diseases/maize-common-rust.webp",
    showInGrid: true,
    searchTerms: ["maize rust", "puccinia sorghi"],
  },
  {
    id: "fusarium_ear_rot",
    label: "Fusarium ear rot",
    description:
      "White or pink mould between kernels. Control with hybrid choice, ear-insect management and dry grain storage.",
    imageSrc: "/diseases/maize-ear-rot.webp",
    showInGrid: true,
    searchTerms: ["ear rot", "cob rot", "fusarium"],
  },
  {
    id: "lethal_necrosis",
    label: "Maize lethal necrosis",
    description:
      "Mottling, leaf-edge death and poor cobs. Control by using clean seed, managing vectors and destroying infected plants.",
    imageSrc: "/diseases/maize-lethal-necrosis.webp",
    showInGrid: true,
    searchTerms: ["mln", "mlnd", "mcmv"],
  },
  {
    id: "stem_rust",
    label: "Stem rust",
    description:
      "Long reddish-brown pustules, often on stems. Control with resistant cultivars and foliar fungicide at early infection.",
    imageSrc: "/diseases/wheat-stem-rust.webp",
    showInGrid: false,
    searchTerms: ["black rust", "ug99", "puccinia graminis"],
  },
  {
    id: "stripe_rust",
    label: "Stripe rust",
    description:
      "Yellow-orange pustules arranged in stripes. Control with resistant cultivars and early fungicide in cool weather.",
    imageSrc: "/diseases/wheat-stripe-rust.webp",
    showInGrid: false,
    searchTerms: ["yellow rust", "puccinia striiformis"],
  },
  {
    id: "leaf_rust",
    label: "Leaf rust",
    description:
      "Scattered round orange-brown pustules on leaves. Control with resistant cultivars and a registered foliar fungicide.",
    imageSrc: "/diseases/wheat-leaf-rust.webp",
    showInGrid: false,
    searchTerms: ["brown rust", "barley rust", "puccinia"],
  },
  {
    id: "septoria",
    label: "Septoria leaf blotch",
    description:
      "Brown blotches with small black dots. Control with rotation, residue burial and a flag-leaf fungicide.",
    imageSrc: "/diseases/wheat-septoria.webp",
    showInGrid: false,
    searchTerms: ["zymoseptoria", "leaf blotch"],
  },
  {
    id: "fusarium_head_blight",
    label: "Fusarium head blight",
    description:
      "Premature bleaching and pink growth on heads. Control with rotation away from maize, resistant cultivars and flowering fungicide.",
    imageSrc: "/diseases/wheat-fusarium-head-blight.webp",
    showInGrid: false,
    searchTerms: ["fhb", "head scab", "fusarium"],
  },
  {
    id: "wheat_blast",
    label: "Wheat blast",
    description:
      "Bleached heads above a dark neck lesion. Control with certified seed, residue hygiene and a heading-stage fungicide.",
    imageSrc: "/diseases/wheat-blast.webp",
    showInGrid: false,
    searchTerms: ["mot", "magnaporthe", "blast"],
  },
  {
    id: "take_all",
    label: "Take-all",
    description:
      "Blackened roots and whiteheads in patches. Control with rotation away from wheat and barley, and balanced nutrition.",
    imageSrc: "/diseases/wheat-take-all.png",
    showInGrid: false,
    searchTerms: ["take-all", "take all", "gaeumannomyces", "whiteheads"],
  },
  {
    id: "net_blotch",
    label: "Net blotch",
    description:
      "Dark net-like brown markings on barley leaves. Control with rotation, clean seed and a registered foliar fungicide.",
    imageSrc: "/diseases/barley-net-blotch.png",
    showInGrid: false,
    searchTerms: ["pyrenophora", "netting"],
  },
  {
    id: "spot_blotch",
    label: "Spot blotch",
    description:
      "Oval dark-brown spots with yellow margins. Control with resistant cultivars, rotation and foliar fungicide.",
    imageSrc: "/diseases/barley-spot-blotch.png",
    showInGrid: false,
    searchTerms: ["bipolaris", "spot blotch"],
  },
  {
    id: "powdery_mildew",
    label: "Powdery mildew",
    description:
      "White powdery patches on green tissue. Control with resistant cultivars, avoiding dense canopies and early fungicide.",
    imageSrc: "/diseases/barley-powdery-mildew.png",
    showInGrid: false,
    searchTerms: ["blumeria", "white coating"],
  },
  {
    id: "loose_smut",
    label: "Loose smut",
    description:
      "Heads replaced by loose black spores. Control with certified seed and a systemic seed treatment.",
    imageSrc: "/diseases/barley-loose-smut.png",
    showInGrid: false,
    searchTerms: ["ustilago", "smut"],
  },
  {
    id: "black_shank",
    label: "Black shank",
    description:
      "Blackened stem base with rapid wilting. Control with resistant cultivars, rotation, drainage and a registered soil fungicide.",
    imageSrc: "/diseases/tobacco-black-shank.png",
    showInGrid: false,
    searchTerms: ["phytophthora nicotianae", "tobacco"],
  },
  {
    id: "granville_wilt",
    label: "Granville wilt",
    description:
      "Sudden wilt of still-green tobacco with brown vascular staining. Control with rotation off solanaceous crops, resistant cultivars and sanitation.",
    imageSrc: "/diseases/tobacco-granville-wilt.png",
    showInGrid: false,
    searchTerms: ["granville", "ralstonia", "tobacco wilt", "bacterial wilt"],
  },
  {
    id: "angular_leaf_spot",
    label: "Angular leaf spot",
    description:
      "Angular dead areas limited by veins. Control with copper sprays, avoiding working wet crops and resistant cultivars.",
    imageSrc: "/diseases/tobacco-angular-leaf-spot.png",
    showInGrid: false,
    searchTerms: ["wildfire", "tobacco"],
  },
  {
    id: "frogeye_leaf_spot",
    label: "Frogeye leaf spot",
    description:
      "Round tan or grey-centred spots with darker borders. Control with rotation, residue management and a registered foliar fungicide.",
    imageSrc: "/diseases/soybean-frogeye-leaf-spot.webp",
    showInGrid: false,
    searchTerms: ["cercospora", "frogeye", "soybean", "tobacco"],
  },
  {
    id: "bacterial_wilt",
    label: "Bacterial wilt",
    description:
      "Sudden wilt with brown vascular tissue or bacterial ooze. Control with rotation, sanitation and avoiding waterlogged fields.",
    imageSrc: "/diseases/potato-bacterial-wilt.png",
    showInGrid: false,
    searchTerms: ["ralstonia", "wilt", "groundnut", "potato"],
  },
  {
    id: "mosaic_virus",
    label: "Tobacco mosaic",
    description:
      "Patchy light and dark green mosaic. Control by using clean seed, sanitation and not handling plants after tobacco use.",
    imageSrc: "/diseases/tobacco-mosaic-virus.png",
    showInGrid: false,
    searchTerms: ["tmv", "mosaic"],
  },
  {
    id: "fusarium_wilt",
    label: "Fusarium wilt",
    description:
      "Yellowing and wilt with vascular browning. Control with rotation, resistant cultivars and avoiding infested soil movement.",
    imageSrc: "/diseases/tobacco-fusarium-wilt.png",
    showInGrid: false,
    searchTerms: ["fusarium oxysporum", "tobacco wilt"],
  },
  {
    id: "soybean_rust",
    label: "Soybean rust",
    description:
      "Tiny tan lesions and pustules under leaves. Control with early scouting and a registered foliar fungicide at first pustules.",
    imageSrc: "/diseases/soybean-rust.webp",
    showInGrid: false,
    searchTerms: ["phakopsora", "asian soybean rust"],
  },
  {
    id: "bacterial_pustule",
    label: "Bacterial pustule",
    description:
      "Small raised spots with yellow halos. Control with clean seed, rotation and avoiding work in wet canopies.",
    imageSrc: "/diseases/soybean-bacterial-pustule.webp",
    showInGrid: false,
    searchTerms: ["xanthomonas", "soybean"],
  },
  {
    id: "bacterial_blight",
    label: "Bacterial blight",
    description:
      "Angular water-soaked then brown spots. Control with clean seed, rotation and avoiding work in wet canopies.",
    imageSrc: "/diseases/soybean-bacterial-blight.webp",
    showInGrid: false,
    searchTerms: ["pseudomonas", "soybean blight"],
  },
  {
    id: "red_leaf_blotch",
    label: "Red leaf blotch",
    description:
      "Red-brown blotches on lower leaves. Control with rotation, residue burial and a registered foliar fungicide.",
    imageSrc: "/diseases/soybean-red-leaf-blotch.webp",
    showInGrid: false,
    searchTerms: ["coniothyrium", "phoma", "soybean"],
  },
  {
    id: "root_stem_rot",
    label: "Root and stem rot",
    description:
      "Dark stem lesion rising from the soil. Control with resistant cultivars, good drainage and seed treatment.",
    imageSrc: "/diseases/soybean-root-stem-rot.webp",
    showInGrid: false,
    searchTerms: ["phytophthora sojae", "stem rot"],
  },
  {
    id: "rosette",
    label: "Groundnut rosette",
    description:
      "Bunched small leaves and severe stunting. Control aphids early and plant resistant cultivars at recommended density.",
    imageSrc: "/diseases/groundnut-rosette.png",
    showInGrid: false,
    searchTerms: ["rosette", "groundnut virus"],
  },
  {
    id: "early_leaf_spot",
    label: "Early leaf spot",
    description:
      "Brown leaf spots with yellow halos. Control with rotation, burying residue and a calendar foliar fungicide.",
    imageSrc: "/diseases/groundnut-early-leaf-spot.png",
    showInGrid: false,
    searchTerms: ["passalora", "cercospora", "groundnut"],
  },
  {
    id: "late_leaf_spot",
    label: "Late leaf spot",
    description:
      "Dark spots, often without a strong halo. Control with rotation, residue burial and a registered foliar fungicide.",
    imageSrc: "/diseases/groundnut-late-leaf-spot.png",
    showInGrid: false,
    searchTerms: ["nothopassalora", "groundnut"],
  },
  {
    id: "groundnut_rust",
    label: "Groundnut rust",
    description:
      "Orange-brown pustules beneath leaves. Control with resistant cultivars and a registered foliar fungicide.",
    imageSrc: "/diseases/groundnut-rust.png",
    showInGrid: false,
    searchTerms: ["puccinia arachidis", "groundnut rust"],
  },
  {
    id: "crown_rot",
    label: "Aspergillus crown rot",
    description:
      "Dark crown rot and seedling collapse. Control with quality seed, seed treatment and avoiding hot dry planting stress.",
    imageSrc: "/diseases/groundnut-aspergillus-crown-rot.png",
    showInGrid: false,
    searchTerms: ["aspergillus", "crown rot", "groundnut"],
  },
  {
    id: "late_blight",
    label: "Late blight",
    description:
      "Fast-growing water-soaked lesions, white edge growth and tuber rot. Control with certified seed, destruction of volunteers and protectant fungicide.",
    imageSrc: "/diseases/potato-late-blight.png",
    showInGrid: false,
    searchTerms: ["phytophthora infestans", "potato blight"],
  },
  {
    id: "early_blight",
    label: "Early blight",
    description:
      "Dry brown target spots with concentric rings. Control with rotation, adequate nutrition and a registered foliar fungicide.",
    imageSrc: "/diseases/potato-early-blight.png",
    showInGrid: false,
    searchTerms: ["alternaria", "target spot"],
  },
  {
    id: "blackleg_soft_rot",
    label: "Blackleg and soft rot",
    description:
      "Inky black stem base or wet soft tuber decay. Control with certified seed, careful harvest and cool dry storage.",
    imageSrc: "/diseases/potato-blackleg-soft-rot.png",
    showInGrid: false,
    searchTerms: ["pectobacterium", "dickeya", "soft rot"],
  },
  {
    id: "potato_virus_y",
    label: "Potato virus Y",
    description:
      "Mosaic colour, leaf crinkling and uneven or reduced growth. Control with certified seed and aphid management.",
    imageSrc: "/diseases/potato-virus-y.png",
    showInGrid: false,
    searchTerms: ["pvy", "potato virus"],
  },
  {
    id: "common_scab",
    label: "Common scab",
    description:
      "Dry rough, corky, raised or pitted lesions on tubers. Control with irrigation at tuber initiation and resistant cultivars.",
    imageSrc: "/diseases/potato-common-scab.png",
    showInGrid: false,
    searchTerms: ["streptomyces", "potato scab"],
  },
  {
    id: "purple_blotch",
    label: "Purple blotch",
    description:
      "Purple-brown leaf lesions that elongate and collapse the neck. Control with rotation, good airflow and a registered foliar fungicide.",
    imageSrc: "/diseases/onion-purple-blotch.png",
    showInGrid: false,
    searchTerms: ["alternaria porri", "onion"],
  },
  {
    id: "downy_mildew",
    label: "Downy mildew",
    description:
      "Pale leaf streaks with fuzzy growth in cool, humid weather. Control with drainage, wider spacing and a protectant fungicide.",
    imageSrc: "/diseases/onion-downy-mildew.png",
    showInGrid: false,
    searchTerms: ["peronospora", "onion downy"],
  },
  {
    id: "iris_yellow_spot",
    label: "Iris yellow spot",
    description:
      "Diamond-shaped yellow or straw lesions on leaves and seed stalks. Control thrips and avoid planting next to infected onions.",
    imageSrc: "/diseases/onion-iris-yellow-spot.png",
    showInGrid: false,
    searchTerms: ["iysv", "tospovirus", "onion"],
  },
  {
    id: "fusarium_basal_rot",
    label: "Fusarium basal rot",
    description:
      "Brown basal plate rot and bulbs that collapse from the base. Control with rotation, well-drained beds and healthy planting material.",
    imageSrc: "/diseases/onion-fusarium-basal-rot.png",
    showInGrid: false,
    searchTerms: ["basal rot", "onion fusarium"],
  },
  {
    id: "bacterial_soft_rot",
    label: "Bacterial soft rot",
    description:
      "Water-soaked neck and wet, foul bulb decay. Control by curing well, avoiding neck injury and storing cool and dry.",
    imageSrc: "/diseases/onion-bacterial-soft-rot.png",
    showInGrid: false,
    searchTerms: ["pectobacterium", "onion soft rot"],
  },
  {
    id: "onion_rust",
    label: "Onion rust",
    description:
      "Orange-brown pustules on onion leaves and flower stalks. Control with rotation and a registered foliar fungicide.",
    imageSrc: "/diseases/onion-rust.png",
    showInGrid: false,
    searchTerms: ["puccinia allii", "onion rust"],
  },
  {
    id: "citrus_greening",
    label: "Citrus greening",
    description:
      "Asymmetric blotchy leaf mottling and small lopsided fruit. Control psyllids and remove infected trees.",
    imageSrc: "/diseases/citrus-greening.png",
    showInGrid: false,
    searchTerms: ["hlb", "huanglongbing", "liberibacter"],
  },
  {
    id: "citrus_canker",
    label: "Citrus canker",
    description:
      "Raised corky lesions with distinct yellow halos. Control with copper sprays, windbreaks and removal of badly infected trees.",
    imageSrc: "/diseases/citrus-canker.png",
    showInGrid: false,
    searchTerms: ["xanthomonas citri", "canker"],
  },
  {
    id: "citrus_black_spot",
    label: "Citrus black spot",
    description:
      "Hard black circular spots or freckled lesions on fruit. Control with copper and strobilurin sprays from fruit set, plus leaf-litter hygiene.",
    imageSrc: "/diseases/citrus-black-spot.png",
    showInGrid: false,
    searchTerms: ["phyllosticta", "black spot"],
  },
  {
    id: "gummosis",
    label: "Phytophthora gummosis",
    description:
      "Cracked dark bark with amber gum near the trunk base. Control with high budding, good drainage and a registered phosphonate or metalaxyl drench.",
    imageSrc: "/diseases/citrus-gummosis.png",
    showInGrid: false,
    searchTerms: ["phytophthora", "gum", "collar rot"],
  },
  {
    id: "tristeza",
    label: "Citrus tristeza",
    description:
      "Tree decline, stem pitting and small fruit. Control with tolerant rootstocks, certified budwood and aphid management.",
    imageSrc: "/diseases/citrus-tristeza.png",
    showInGrid: false,
    searchTerms: ["ctv", "tristeza"],
  },
  {
    id: "greasy_spot",
    label: "Greasy spot",
    description:
      "Dark oily-looking leaf spots followed by early leaf drop. Control with copper sprays after the rainy flush and leaf-litter hygiene.",
    imageSrc: "/diseases/citrus-greasy-spot.png",
    showInGrid: false,
    searchTerms: ["zasmidium", "greasy spot"],
  },
] as const;

export type DiseaseCategory = (typeof DISEASE_CATEGORIES)[number];

export interface DiseaseSearchGroup {
  category: DiseaseCategory;
  species: DiseaseSpecificType[];
}

export const DISEASE_SPECIFIC_TYPES = [
  {
    id: "leaf_rust_wheat",
    categoryId: "leaf_rust",
    label: "Wheat leaf rust",
    description:
      "Scattered round orange-brown pustules on wheat leaves. Control with resistant cultivars and foliar fungicide.",
    diseaseValue: "Brown rust",
    imageSrc: "/diseases/wheat-leaf-rust.webp",
  },
  {
    id: "leaf_rust_barley",
    categoryId: "leaf_rust",
    label: "Barley leaf rust",
    description:
      "Small orange-brown leaf pustules on barley. Control with resistant cultivars and foliar fungicide.",
    diseaseValue: "Brown rust",
    imageSrc: "/diseases/barley-leaf-rust.png",
  },
  {
    id: "frogeye_tobacco",
    categoryId: "frogeye_leaf_spot",
    label: "Tobacco frogeye",
    description:
      "Round tan spots with darker borders on tobacco leaves. Control with rotation and a registered foliar fungicide.",
    diseaseValue: "Frogeye leaf spot",
    imageSrc: "/diseases/tobacco-frogeye-leaf-spot.png",
  },
  {
    id: "frogeye_soybean",
    categoryId: "frogeye_leaf_spot",
    label: "Soybean frogeye",
    description:
      "Round grey-centred spots with dark rims. Control with resistant cultivars and a registered foliar fungicide.",
    diseaseValue: "Frogeye leaf spot",
    imageSrc: "/diseases/soybean-frogeye-leaf-spot.webp",
  },
  {
    id: "blackleg",
    categoryId: "blackleg_soft_rot",
    label: "Blackleg",
    description:
      "Inky black stem base on potato plants. Control with certified seed and careful handling.",
    diseaseValue: "Other",
    imageSrc: "/diseases/potato-blackleg-soft-rot.png",
  },
  {
    id: "tuber_soft_rot",
    categoryId: "blackleg_soft_rot",
    label: "Tuber soft rot",
    description:
      "Wet soft decay of potato tubers. Control with careful harvest and cool dry storage.",
    diseaseValue: "Other",
    imageSrc: "/diseases/potato-blackleg-soft-rot.png",
  },
  {
    id: "african_citrus_greening",
    categoryId: "citrus_greening",
    label: "African citrus greening",
    description:
      "Blotchy mottle and lopsided fruit in African citrus. Control the African citrus psyllid and remove infected trees.",
    diseaseValue: "Other",
    imageSrc: "/diseases/citrus-greening.png",
  },
  {
    id: "asian_citrus_greening",
    categoryId: "citrus_greening",
    label: "Asian citrus greening",
    description:
      "Huanglongbing with blotchy leaves and bitter fruit. Control Asian citrus psyllid and remove infected trees.",
    diseaseValue: "Other",
    imageSrc: "/diseases/citrus-greening.png",
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

  if (!normalizedQuery) {
    return categories
      .map((category) => ({
        category,
        species: getSpeciesForCategory(category.id),
      }))
      .sort((a, b) => a.category.label.localeCompare(b.category.label));
  }

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
    imageSrc: "/pests/aphids.webp",
    showInGrid: true,
    searchTerms: ["aphid", "colony", "sticky", "honeydew"],
  },
  {
    id: "caterpillars",
    label: "Caterpillars",
    description: "Larvae chewing leaves, stems, pods or fruit",
    imageSrc: "/pests/fall-armyworm.webp",
    showInGrid: true,
    searchTerms: ["caterpillar", "armyworm", "bollworm", "borer", "worm"],
  },
  {
    id: "cutworms",
    label: "Cutworms",
    description: "Young plants cut near soil level",
    imageSrc: "/pests/cutworm.webp",
    showInGrid: true,
    searchTerms: ["cutworm", "agrotis", "seedling"],
  },
  {
    id: "termites",
    label: "Termites",
    description: "Soil galleries and hollowed roots or stems",
    imageSrc: "/pests/termites.webp",
    showInGrid: true,
    searchTerms: ["termite", "microtermes", "macrotermes"],
  },
  {
    id: "thrips",
    label: "Thrips",
    description: "Tiny slender insects causing silvering and distortion",
    imageSrc: "/pests/thrips.webp",
    showInGrid: true,
    searchTerms: ["thrips", "silvering", "onion thrips"],
  },
  {
    id: "whiteflies",
    label: "Whiteflies",
    description: "Small white insects and honeydew beneath leaves",
    imageSrc: "/pests/whitefly.webp",
    showInGrid: true,
    searchTerms: ["whitefly", "bemisia"],
  },
  {
    id: "mites",
    label: "Mites",
    description: "Tiny pests causing stippling, bronzing or bulb damage",
    imageSrc: "/pests/red-spider-mite.webp",
    showInGrid: false,
    searchTerms: ["mite", "spider mite", "bulb mite"],
  },
  {
    id: "beetles",
    label: "Beetles and bugs",
    description: "Chewing beetles, grubs, stink bugs and scale",
    imageSrc: "/pests/cereal-leaf-beetle.png",
    showInGrid: false,
    searchTerms: ["beetle", "stink bug", "white grub", "scale", "hessian"],
  },
  {
    id: "leaf_miners",
    label: "Leaf miners",
    description: "Mines, folded leaflets or silvery serpentine trails",
    imageSrc: "/pests/groundnut-leaf-miner.png",
    showInGrid: false,
    searchTerms: ["leaf miner", "leafminer", "mines"],
  },
  {
    id: "nematodes",
    label: "Nematodes",
    description: "Root galls, cysts and patchy stunting",
    imageSrc: "/pests/potato-root-knot-nematodes.png",
    showInGrid: false,
    searchTerms: ["nematode", "cyst", "root-knot", "galls"],
  },
  {
    id: "fruit_flies",
    label: "Fruit flies",
    description: "Fruit punctures followed by internal larval damage",
    imageSrc: "/pests/citrus-fruit-fly.png",
    showInGrid: false,
    searchTerms: ["fruit fly", "ceratitis", "medfly"],
  },
  {
    id: "psyllids",
    label: "Psyllids",
    description: "Mottled adults and waxy nymphs on tender new flush",
    imageSrc: "/pests/citrus-psyllid.png",
    showInGrid: false,
    searchTerms: ["psyllid", "diaphorina", "greening vector"],
  },
] as const;

export type PestCategory = (typeof PEST_CATEGORIES)[number];

export const PEST_SPECIFIC_TYPES = [
  {
    id: "cereal_aphids",
    categoryId: "aphids",
    label: "Cereal aphids",
    description: "Colonies on leaves or heads; curled leaves",
    imageSrc: "/pests/aphids.webp",
  },
  {
    id: "tobacco_aphid",
    categoryId: "aphids",
    label: "Tobacco aphid",
    description: "Soft insect colonies and sticky tobacco leaves",
    imageSrc: "/pests/aphids.webp",
  },
  {
    id: "green_peach_aphid",
    categoryId: "aphids",
    label: "Green peach aphid",
    description: "Soft colonies, curled growth and sticky leaves",
    imageSrc: "/pests/potato-aphids.png",
  },
  {
    id: "groundnut_aphid",
    categoryId: "aphids",
    label: "Groundnut aphid",
    description: "Dark colonies on young shoots of groundnuts and soybeans",
    imageSrc: "/pests/aphids.webp",
  },
  {
    id: "potato_aphid",
    categoryId: "aphids",
    label: "Potato aphid",
    description: "Colonies on potato leaves and growing points",
    imageSrc: "/pests/potato-aphids.png",
  },
  {
    id: "fall_armyworm",
    categoryId: "caterpillars",
    label: "Fall armyworm",
    description: "Windowing, ragged holes and frass in the maize whorl",
    imageSrc: "/pests/fall-armyworm.webp",
  },
  {
    id: "african_armyworm",
    categoryId: "caterpillars",
    label: "African armyworm",
    description: "Chewed leaves and fast-moving caterpillars",
    imageSrc: "/pests/fall-armyworm.webp",
  },
  {
    id: "african_bollworm",
    categoryId: "caterpillars",
    label: "African bollworm",
    description: "Caterpillars chewing buds, flowers or pods",
    imageSrc: "/pests/african-bollworm.png",
  },
  {
    id: "beet_armyworm",
    categoryId: "caterpillars",
    label: "Beet armyworm",
    description: "Caterpillars feeding on onion leaves and growing points",
    imageSrc: "/pests/fall-armyworm.webp",
  },
  {
    id: "stem_borers",
    categoryId: "caterpillars",
    label: "Stem borers",
    description: "Shot holes, dead hearts or tunnelling",
    imageSrc: "/pests/stem-borer.webp",
  },
  {
    id: "legume_pod_borer",
    categoryId: "caterpillars",
    label: "Legume pod borer",
    description: "Webbed flowers and bored pods",
    imageSrc: "/pests/african-bollworm.png",
  },
  {
    id: "potato_tuber_moth",
    categoryId: "caterpillars",
    label: "Potato tuber moth",
    description: "Leaf mines, stem entry or tunnels beneath the tuber skin",
    imageSrc: "/pests/potato-tuber-moth.png",
  },
  {
    id: "false_codling_moth",
    categoryId: "caterpillars",
    label: "False codling moth",
    description: "Fruit entry holes, frass and pinkish larvae inside",
    imageSrc: "/pests/citrus-false-codling-moth.png",
  },
  {
    id: "cutworm",
    categoryId: "cutworms",
    label: "Cutworms",
    description: "Young plants cut near soil level",
    imageSrc: "/pests/cutworm.webp",
  },
  {
    id: "termite",
    categoryId: "termites",
    label: "Termites",
    description: "Hollowed roots or stems and soil galleries",
    imageSrc: "/pests/termites.webp",
  },
  {
    id: "tobacco_thrips",
    categoryId: "thrips",
    label: "Tobacco thrips",
    description: "Silvered streaks and tiny slender insects",
    imageSrc: "/pests/thrips.webp",
  },
  {
    id: "onion_thrips",
    categoryId: "thrips",
    label: "Onion thrips",
    description: "Silvered onion leaves and distorted new growth",
    imageSrc: "/pests/thrips.webp",
  },
  {
    id: "citrus_thrips",
    categoryId: "thrips",
    label: "Citrus thrips",
    description: "Tiny orange insects with silvered new leaves or a fruit scar ring",
    imageSrc: "/pests/citrus-thrips.png",
  },
  {
    id: "whitefly",
    categoryId: "whiteflies",
    label: "Whiteflies",
    description: "Small white insects beneath leaves",
    imageSrc: "/pests/whitefly.webp",
  },
  {
    id: "red_spider_mite",
    categoryId: "mites",
    label: "Red spider mites",
    description: "Fine stippling, bronzing and webbing",
    imageSrc: "/pests/red-spider-mite.webp",
  },
  {
    id: "bulb_mites",
    categoryId: "mites",
    label: "Bulb mites",
    description: "Feeding on onion bulbs and roots in the soil",
    imageSrc: "/pests/red-spider-mite.webp",
  },
  {
    id: "cereal_leaf_beetle",
    categoryId: "beetles",
    label: "Cereal leaf beetle",
    description: "Long scraped strips between leaf veins",
    imageSrc: "/pests/cereal-leaf-beetle.png",
  },
  {
    id: "hessian_fly",
    categoryId: "beetles",
    label: "Hessian fly",
    description: "Weak tillers and larvae beneath the sheath",
    imageSrc: "/pests/hessian-fly.png",
  },
  {
    id: "false_wireworm",
    categoryId: "beetles",
    label: "False wireworms",
    description: "Chewed roots and stem bases",
    imageSrc: "/pests/false-wireworm.png",
  },
  {
    id: "white_grubs",
    categoryId: "beetles",
    label: "White grubs",
    description: "C-shaped larvae near damaged groundnut roots and pods",
    imageSrc: "/pests/white-grub.png",
  },
  {
    id: "stink_bugs",
    categoryId: "beetles",
    label: "Stink bugs",
    description: "Shield-shaped bugs and shrivelled soybean seed",
    imageSrc: "/pests/stink-bug.webp",
  },
  {
    id: "red_scale",
    categoryId: "beetles",
    label: "California red scale",
    description: "Round red-brown armored scales on leaves, twigs or fruit",
    imageSrc: "/pests/citrus-red-scale.png",
  },
  {
    id: "soybean_leaf_miner",
    categoryId: "leaf_miners",
    label: "Groundnut leaf miner",
    description: "Mined, folded or dried leaflets on groundnuts and soybeans",
    imageSrc: "/pests/groundnut-leaf-miner.png",
  },
  {
    id: "potato_leafminer",
    categoryId: "leaf_miners",
    label: "Potato leafminer",
    description: "Pale winding mines that widen across leaflets",
    imageSrc: "/pests/potato-leafminer.png",
  },
  {
    id: "onion_leafminer",
    categoryId: "leaf_miners",
    label: "Onion leafminer",
    description: "Pale mines in onion leaves",
    imageSrc: "/pests/potato-leafminer.png",
  },
  {
    id: "citrus_leafminer",
    categoryId: "leaf_miners",
    label: "Citrus leafminer",
    description: "Silvery serpentine mines and curling on young leaves",
    imageSrc: "/pests/citrus-leafminer.png",
  },
  {
    id: "potato_cyst_nematodes",
    categoryId: "nematodes",
    label: "Potato cyst nematodes",
    description: "Patchy stunting with tiny cream or golden cysts on roots",
    imageSrc: "/pests/potato-cyst-nematodes.png",
  },
  {
    id: "root_knot_nematodes",
    categoryId: "nematodes",
    label: "Root-knot nematodes",
    description: "Root galls, uneven growth and distorted tubers or bulbs",
    imageSrc: "/pests/potato-root-knot-nematodes.png",
  },
  {
    id: "mediterranean_fruit_fly",
    categoryId: "fruit_flies",
    label: "Mediterranean fruit fly",
    description: "Fruit punctures followed by soft internal larval damage",
    imageSrc: "/pests/citrus-fruit-fly.png",
  },
  {
    id: "citrus_psyllid",
    categoryId: "psyllids",
    label: "Asian citrus psyllid",
    description: "Mottled adults and waxy nymphs on tender new flush",
    imageSrc: "/pests/citrus-psyllid.png",
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
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return PEST_CATEGORIES.map((category) => ({
      category,
      species: [],
    })).sort((a, b) => a.category.label.localeCompare(b.category.label));
  }

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
  voiceNote?: VoiceNoteDetails;
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
  const countLabel = PEST_AMOUNT_LABELS[details.pestCountScale - 1] ?? "";
  const severityLabel = PEST_DAMAGE_LABELS[details.damageSeverityScale - 1] ?? "";

  const parts = [
    pestLabel && `Pest: ${pestLabel}`,
    details.infectedParts.length > 0 &&
      `Infected: ${details.infectedParts.join(", ")}`,
    prevalenceLabel && `Spread: ${prevalenceLabel}`,
    countLabel && `Count: ${countLabel}`,
    severityLabel && `Damage: ${severityLabel}`,
    details.flaggedForFollowUp ? "Flagged for follow up" : null,
    details.otherNotes.trim() || null,
    details.voiceNote && formatVoiceNoteSummary(details.voiceNote),
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

export const PEST_AMOUNT_LABELS = [
  "One",
  "Few",
  "Some",
  "Many",
  "Very many",
] as const;

export const PEST_DAMAGE_LABELS = [
  "No damage",
  "Light",
  "Moderate",
  "Heavy",
  "Severe",
] as const;

export const PLANTS_AFFECTED_LABELS = [
  "1 in 10",
  "2–3 in 10",
  "4–5 in 10",
  "6–8 in 10",
  "9–10 in 10",
] as const;

export const DISEASE_SEVERITY_LABELS = [
  "Trace",
  "Low",
  "Moderate",
  "High",
  "Severe",
] as const;

export const DISEASE_SPREAD_LABELS = [
  "One plant",
  "A few plants",
  "Small patches",
  "Several patches",
  "Across field",
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
  voiceNote?: VoiceNoteDetails;
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
  fieldPrevalence: 1,
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
  const spreadLabel = DISEASE_SPREAD_LABELS[details.fieldPrevalence - 1] ?? "";
  const severityLabel =
    DISEASE_SEVERITY_LABELS[details.severityScale - 1] ?? "";

  const parts = [
    diseaseLabel && `Disease: ${diseaseLabel}`,
    details.plantLocations.length > 0 &&
      `Location: ${details.plantLocations.join(", ")}`,
    severityLabel && `Severity: ${severityLabel}`,
    spreadLabel && `Spread: ${spreadLabel}`,
    details.flaggedForFollowUp ? "Flagged for follow up" : null,
    details.symptomLocation && `Location: ${details.symptomLocation}`,
    details.lesionType && `Lesion: ${details.lesionType}`,
    details.plantsAffectedPercent && `${details.plantsAffectedPercent}% plants affected`,
    details.severity && `Severity: ${details.severity}`,
    details.areaAffectedPercent && `${details.areaAffectedPercent}% area affected`,
    details.sampleTaken ? "Sample taken" : null,
    details.needsAction ? "Needs action" : null,
    details.otherNotes && details.otherNotes,
    details.voiceNote && formatVoiceNoteSummary(details.voiceNote),
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
    description: "Wide or rounded leaves, often with visible veins or lobes",
    imageSrc: "/weeds/broadleaf.png",
    searchTerms: [
      "broadleaf",
      "blackjack",
      "pigweed",
      "mexican poppy",
      "wild sunflower",
      "wandering jew",
      "commelina",
      "khaki",
      "tagetes",
      "starbur",
      "mexican clover",
      "poinsettia",
      "datura",
      "morning glory",
      "purslane",
      "nicandra",
      "sicklepod",
      "goatweed",
      "ageratum",
    ],
  },
  {
    id: "grass",
    label: "Grass weed",
    description: "Narrow leaves and jointed stems, often in tufts",
    imageSrc: "/weeds/grass.png",
    searchTerms: [
      "grass",
      "couch",
      "goosegrass",
      "wild oats",
      "johnson grass",
      "itchgrass",
      "rottboellia",
      "jungle rice",
      "crabgrass",
      "crowfoot",
    ],
  },
  {
    id: "sedge",
    label: "Sedge",
    description: "Stiff leaves and often a three-sided stem",
    imageSrc: "/weeds/sedge.png",
    searchTerms: ["sedge", "yellow nutsedge", "purple nutsedge"],
  },
  {
    id: "parasitic",
    label: "Parasitic weed",
    description: "Attaches to crop roots and stunts the host; has little or no green leaf of its own",
    imageSrc: "/weeds/witchweed.png",
    searchTerms: ["striga", "witchweed", "broomrape", "broom rape", "orobanche", "parasitic"],
  },
] as const;

export type WeedCategory = (typeof WEED_CATEGORIES)[number];

export const WEED_SPECIFIC_TYPES = [
  {
    id: "blackjack",
    categoryId: "broadleaf",
    label: "Blackjack",
    description: "Opposite toothed leaves and barbed black seeds",
    weedValue: "Blackjack",
    imageSrc: "/weeds/blackjack.png",
  },
  {
    id: "pigweed",
    categoryId: "broadleaf",
    label: "Pigweed",
    description: "Red or green amaranth with dense flower spikes",
    weedValue: "Pigweed",
    imageSrc: "/weeds/pigweed.png",
  },
  {
    id: "mexican_poppy",
    categoryId: "broadleaf",
    label: "Mexican poppy",
    description: "Spiny leaves and pale yellow poppy flowers",
    weedValue: "Mexican poppy",
    imageSrc: "/weeds/mexican-poppy.png",
  },
  {
    id: "wild_sunflower",
    categoryId: "broadleaf",
    label: "Wild sunflower",
    description: "Large coarse leaves and yellow daisy-like flowers",
    weedValue: "Wild sunflower",
    imageSrc: "/weeds/wild-sunflower.png",
  },
  {
    id: "wandering_jew",
    categoryId: "broadleaf",
    label: "Wandering Jew",
    description: "Succulent trailing stems and small blue flowers; hard to kill",
    weedValue: "Wandering Jew",
    imageSrc: "/weeds/wandering-jew.png",
  },
  {
    id: "khaki_weed",
    categoryId: "broadleaf",
    label: "Khaki weed",
    description: "Finely divided leaves and a strong scent when crushed",
    weedValue: "Khaki weed",
    imageSrc: "/weeds/khaki-weed.png",
  },
  {
    id: "bristly_starbur",
    categoryId: "broadleaf",
    label: "Bristly starbur",
    description: "Hairy stems and spiny bur-like seed heads",
    weedValue: "Bristly starbur",
    imageSrc: "/weeds/bristly-starbur.png",
  },
  {
    id: "mexican_clover",
    categoryId: "broadleaf",
    label: "Mexican clover",
    description: "Opposite leaves and small six-petalled white flowers",
    weedValue: "Mexican clover",
    imageSrc: "/weeds/mexican-clover.png",
  },
  {
    id: "wild_poinsettia",
    categoryId: "broadleaf",
    label: "Wild poinsettia",
    description: "Milky sap and upper leaves often marked with a pale or red patch",
    weedValue: "Wild poinsettia",
    imageSrc: "/weeds/wild-poinsettia.png",
  },
  {
    id: "apple_of_peru",
    categoryId: "broadleaf",
    label: "Apple of Peru",
    description: "Pale blue flowers and lantern-like green berries",
    weedValue: "Apple of Peru",
    imageSrc: "/weeds/apple-of-peru.png",
  },
  {
    id: "thorn_apple",
    categoryId: "broadleaf",
    label: "Thorn apple",
    description: "Spiny seed capsules and large trumpet flowers; poisonous",
    weedValue: "Thorn apple",
    imageSrc: "/weeds/thorn-apple.png",
  },
  {
    id: "morning_glory",
    categoryId: "broadleaf",
    label: "Morning glory",
    description: "Twining vine with heart-shaped leaves and trumpet flowers",
    weedValue: "Morning glory",
    imageSrc: "/weeds/morning-glory.png",
  },
  {
    id: "purslane",
    categoryId: "broadleaf",
    label: "Purslane",
    description: "Prostrate succulent stems, fleshy leaves and yellow flowers",
    weedValue: "Purslane",
    imageSrc: "/weeds/purslane.png",
  },
  {
    id: "sicklepod",
    categoryId: "broadleaf",
    label: "Sicklepod",
    description: "Pinnate leaves and curved sickle-shaped seed pods",
    weedValue: "Sicklepod",
    imageSrc: "/weeds/sicklepod.png",
  },
  {
    id: "goatweed",
    categoryId: "broadleaf",
    label: "Goatweed",
    description: "Hairy leaves and dense clusters of pale lilac flower heads",
    weedValue: "Goatweed",
    imageSrc: "/weeds/goatweed.png",
  },
  {
    id: "couch_grass",
    categoryId: "grass",
    label: "Couch grass",
    description: "Creeping stolons forming a dense grass mat",
    weedValue: "Couch grass",
    imageSrc: "/weeds/couch-grass.png",
  },
  {
    id: "goosegrass",
    categoryId: "grass",
    label: "Goosegrass",
    description: "Flattened stems radiating from a central crown",
    weedValue: "Goosegrass",
    imageSrc: "/weeds/goosegrass.png",
  },
  {
    id: "wild_oats",
    categoryId: "grass",
    label: "Wild oats",
    description: "Large drooping seed heads and twisted leaf tips",
    weedValue: "Wild oats",
    imageSrc: "/weeds/wild-oats.png",
  },
  {
    id: "johnson_grass",
    categoryId: "grass",
    label: "Johnson grass",
    description: "Tall sorghum-like grass with a spreading rhizome",
    weedValue: "Johnson grass",
    imageSrc: "/weeds/johnson-grass.png",
  },
  {
    id: "itchgrass",
    categoryId: "grass",
    label: "Itchgrass",
    description: "Tall bristly grass that irritates skin; serious in maize",
    weedValue: "Itchgrass",
    imageSrc: "/weeds/itchgrass.png",
  },
  {
    id: "jungle_rice",
    categoryId: "grass",
    label: "Jungle rice",
    description: "Tufted grass of wet ground, often with purple banding on stems",
    weedValue: "Jungle rice",
    imageSrc: "/weeds/jungle-rice.png",
  },
  {
    id: "crabgrass",
    categoryId: "grass",
    label: "Crabgrass",
    description: "Spreading grass with finger-like seed heads close to the ground",
    weedValue: "Crabgrass",
    imageSrc: "/weeds/crabgrass.png",
  },
  {
    id: "crowfoot_grass",
    categoryId: "grass",
    label: "Crowfoot grass",
    description: "Spreading annual with radiating finger-like seed heads",
    weedValue: "Crowfoot grass",
    imageSrc: "/weeds/crowfoot-grass.png",
  },
  {
    id: "yellow_nutsedge",
    categoryId: "sedge",
    label: "Yellow nutsedge",
    description: "Triangular stems, yellow-green leaves, tubers",
    weedValue: "Yellow nutsedge",
    imageSrc: "/weeds/yellow-nutsedge.png",
  },
  {
    id: "purple_nutsedge",
    categoryId: "sedge",
    label: "Purple nutsedge",
    description: "Dark green leaves, purple-brown seed heads",
    weedValue: "Purple nutsedge",
    imageSrc: "/weeds/purple-nutsedge.png",
  },
  {
    id: "witchweed",
    categoryId: "parasitic",
    label: "Witchweed",
    description: "Small plants with red or pink flowers; stunts maize on poor soils",
    weedValue: "Witchweed",
    imageSrc: "/weeds/witchweed.png",
  },
  {
    id: "broomrape",
    categoryId: "parasitic",
    label: "Broom rape",
    description: "Leafless yellowish spikes at the crop base; pull before seed set",
    weedValue: "Broom rape",
    imageSrc: "/weeds/broomrape.png",
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

  if (!normalizedQuery) {
    return WEED_CATEGORIES.map((category) => ({ category })).sort((a, b) =>
      a.category.label.localeCompare(b.category.label)
    );
  }

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

export const WEED_GROWTH_STAGE_LABELS = [
  "Germinating",
  "2-leaf",
  "4-leaf",
  "6-leaf",
  "8-leaf",
  "Large",
  "Very large",
  "Flowering",
] as const;

export const WEED_AMOUNT_LABELS = [
  "Single",
  "Few",
  "Some",
  "Plenty",
  "Dense",
] as const;

/** @deprecated Use WEED_GROWTH_STAGE_LABELS */
export const WEED_SIZE_OPTIONS = WEED_GROWTH_STAGE_LABELS.map((label) => ({
  label,
  subtitle: "",
}));

/** @deprecated Use WEED_AMOUNT_LABELS */
export const WEED_DENSITY_OPTIONS = WEED_AMOUNT_LABELS.map((label) => ({
  label,
  subtitle: "",
}));

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
  voiceNote?: VoiceNoteDetails;
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
  sizeScale: 1,
  densityScale: 2,
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
      return `${details.weedCategoryLabel} · ${specificType.label}`;
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
  const growthStageLabel =
    WEED_GROWTH_STAGE_LABELS[details.sizeScale - 1] ?? "";
  const amountLabel = WEED_AMOUNT_LABELS[details.densityScale - 1] ?? "";

  const parts = [
    weedLabel && `Weed: ${weedLabel}`,
    details.weedCategoryLabel &&
      !details.weedSpecificTypeId &&
      details.weedCategoryId !== "other" &&
      `Type: ${details.weedCategoryLabel}`,
    growthStageLabel && `Growth stage: ${growthStageLabel}`,
    amountLabel && `Amount: ${amountLabel}`,
    details.flaggedForFollowUp ? "Flagged for follow up" : null,
    details.otherNotes.trim() || null,
    details.voiceNote && formatVoiceNoteSummary(details.voiceNote),
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
  { id: "0_10", label: "0–10 cm", step: 1 },
  { id: "10_20", label: "10–20 cm", step: 2 },
  { id: "20_40", label: "20–40 cm", step: 3 },
  { id: "40_60", label: "40–60 cm", step: 4 },
  { id: "60_80", label: "60–80 cm", step: 5 },
] as const;

export type MoistureDepth = (typeof MOISTURE_DEPTHS)[number];

export const PLANT_CONDITION_LABELS = [
  "Leaves burning / dying",
  "Severely wilted",
  "Wilted",
  "Slight stress",
  "Lush / growing",
] as const;

export const PLANT_AREA_AFFECTED_LABELS = [
  "Single plants",
  "Small spots",
  "Several patches",
  "Large areas",
  "Most of field",
] as const;

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
  includePlantCondition: boolean;
  includeSoilMoisture: boolean;
  plantConditionScale: number;
  areaAffectedScale: number;
  readings: MoistureDepthReading[];
}

export const EMPTY_MOISTURE_DETAILS: MoistureObservationDetails = {
  includePlantCondition: false,
  includeSoilMoisture: false,
  plantConditionScale: 3,
  areaAffectedScale: 2,
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
  const parts: (string | null | false)[] = [];

  if (details.includePlantCondition) {
    const conditionLabel =
      PLANT_CONDITION_LABELS[details.plantConditionScale - 1] ?? "";
    const areaLabel = PLANT_AREA_AFFECTED_LABELS[details.areaAffectedScale - 1] ?? "";
    if (conditionLabel) parts.push(`Plants: ${conditionLabel}`);
    if (areaLabel) parts.push(`Area: ${areaLabel}`);
  }

  if (details.includeSoilMoisture || details.readings.length > 0) {
    const soilParts = details.readings.map((reading) => {
      const depth = getMoistureDepth(reading.depthId);
      const level = getMoistureLevelForValue(reading.level);
      const depthLabel = depth?.label ?? reading.depthId;
      return `${depthLabel}: ${level.label}`;
    });
    if (soilParts.length > 0) {
      parts.push(`Soil · ${soilParts.join(" · ")}`);
    }
  }

  const filtered = parts.filter(Boolean);
  return filtered.length > 0
    ? `Moisture · ${filtered.join(" · ")}`
    : "Moisture check logged.";
}

export type PopulationCountMethod = "square" | "row";

/** Project-level quadrat size supplied by the backend. */
export const PROJECT_POPULATION_SQUARE = {
  widthMeters: 0.5,
  heightMeters: 0.5,
} as const;

/** Project-level row length supplied by the backend. */
export const PROJECT_POPULATION_ROW_LENGTH_M = 10;

export interface PopulationObservationDetails {
  method: PopulationCountMethod;
  plantCount: number;
  squareWidthMeters: number;
  squareHeightMeters: number;
  rowLengthMeters: number;
}

export const EMPTY_POPULATION_DETAILS: PopulationObservationDetails = {
  method: "square",
  plantCount: 0,
  squareWidthMeters: PROJECT_POPULATION_SQUARE.widthMeters,
  squareHeightMeters: PROJECT_POPULATION_SQUARE.heightMeters,
  rowLengthMeters: PROJECT_POPULATION_ROW_LENGTH_M,
};

export function createPopulationDetails(
  method: PopulationCountMethod
): PopulationObservationDetails {
  return {
    ...EMPTY_POPULATION_DETAILS,
    method,
  };
}

export function getPopulationSquareAreaM2(
  details: PopulationObservationDetails
): number {
  return details.squareWidthMeters * details.squareHeightMeters;
}

export function formatPopulationSquareLabel(
  details: PopulationObservationDetails
): string {
  return `${details.squareWidthMeters} m × ${details.squareHeightMeters} m`;
}

export function formatPopulationDensity(
  details: PopulationObservationDetails
): string | null {
  if (details.method === "square") {
    const area = getPopulationSquareAreaM2(details);
    if (area <= 0) return null;
    const perM2 = details.plantCount / area;
    const rounded = Number.isInteger(perM2) ? String(perM2) : perM2.toFixed(0);
    return `${rounded} plants/m²`;
  }

  if (details.rowLengthMeters <= 0) return null;
  const perM = details.plantCount / details.rowLengthMeters;
  const rounded = Number.isInteger(perM) ? String(perM) : perM.toFixed(1);
  return `${rounded} plants/m`;
}

export function formatPopulationSummary(
  details: PopulationObservationDetails
): string {
  const density = formatPopulationDensity(details);
  const countLabel = `${details.plantCount} plant${details.plantCount === 1 ? "" : "s"}`;

  if (details.method === "square") {
    const parts = [
      `Population · ${countLabel} in ${formatPopulationSquareLabel(details)} square`,
      density,
    ].filter(Boolean);
    return parts.join(" · ");
  }

  const parts = [
    `Population · ${countLabel} in ${details.rowLengthMeters} m row`,
    density,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function getPopulationCollapsedSummary(
  details: PopulationObservationDetails
): string {
  const countLabel = `${details.plantCount} plant${details.plantCount === 1 ? "" : "s"}`;

  if (details.method === "square") {
    return `${countLabel} in ${formatPopulationSquareLabel(details)} square`;
  }

  return `${countLabel} in ${details.rowLengthMeters} m row`;
}

export function getMoistureCollapsedSummary(
  details: MoistureObservationDetails
): string {
  const parts: string[] = [];

  if (details.includePlantCondition) {
    const conditionLabel =
      PLANT_CONDITION_LABELS[details.plantConditionScale - 1];
    const areaLabel = PLANT_AREA_AFFECTED_LABELS[details.areaAffectedScale - 1];
    if (conditionLabel) parts.push(conditionLabel.toLowerCase());
    if (areaLabel) parts.push(areaLabel.toLowerCase());
  }

  if (details.includeSoilMoisture || details.readings.length > 0) {
    details.readings.forEach((reading) => {
      const depth = getMoistureDepth(reading.depthId);
      const level = getMoistureLevelForValue(reading.level);
      parts.push(`${depth?.label ?? reading.depthId} ${level.label.toLowerCase()}`);
    });
  }

  return parts.length > 0 ? parts.join(" · ") : "Moisture check logged";
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

export type ObservationReviewStatus = "pending" | "agreed" | "changed";

export interface ScoutingObservation {
  id: string;
  type: ObservationType;
  note: string;
  createdAt: string;
  fieldId?: string;
  sessionId?: string;
  reviewStatus?: ObservationReviewStatus;
  important?: boolean;
  changeComment?: string;
  location?: ObservationLocation;
  diseaseDetails?: DiseaseObservationDetails;
  pestDetails?: PestObservationDetails;
  otherDetails?: OtherObservationDetails;
  weedDetails?: WeedObservationDetails;
  moistureDetails?: MoistureObservationDetails;
  populationDetails?: PopulationObservationDetails;
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
  populationDetails?: PopulationObservationDetails,
  fieldId?: string
): ScoutingObservation {
  const id = `obs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    type,
    note,
    createdAt: new Date().toISOString(),
    fieldId,
    location: fieldId ? generateObservationLocation(fieldId, id) : undefined,
    diseaseDetails,
    pestDetails,
    otherDetails,
    weedDetails,
    moistureDetails,
    populationDetails,
    voiceNoteDetails,
  };
}
