import {
  DISEASE_CATEGORIES,
  PEST_CATEGORIES,
  PEST_SPECIFIC_TYPES,
  WEED_CATEGORIES,
  WEED_SPECIFIC_TYPES,
} from "@/lib/observations";

export const CATALOGUE_CROPS = [
  { id: "wheat", label: "Wheat" },
  { id: "barley", label: "Barley" },
  { id: "oats", label: "Oats" },
  { id: "corn", label: "Corn" },
  { id: "soy", label: "Soy" },
  { id: "rapeseed", label: "Rapeseed" },
] as const;

export type CatalogueCropId = (typeof CATALOGUE_CROPS)[number]["id"];

export type CatalogueSection = "plant-parts" | "diseases" | "pests" | "weeds";

export interface CatalogueEntry {
  id: string;
  label: string;
  description: string;
  scientificName: string;
  symptomsDamage: string;
  active: boolean;
  imageSrc: string;
  cropIds: string[];
}

export interface DiseaseGroupEntry extends CatalogueEntry {
  cropImages: Record<string, string>;
}

export interface NestedGroupEntry extends CatalogueEntry {
  items: CatalogueEntry[];
}

export interface PlantPartEntry {
  id: string;
  label: string;
  cropIds: string[];
  archived: boolean;
}

export interface CatalogueState {
  plantParts: PlantPartEntry[];
  diseases: DiseaseGroupEntry[];
  pests: NestedGroupEntry[];
  weeds: NestedGroupEntry[];
}

const CEREALS: CatalogueCropId[] = ["wheat", "barley", "oats"];
const WHEAT_BARLEY: CatalogueCropId[] = ["wheat", "barley"];

const DISEASE_META: Record<
  string,
  { scientificName: string; symptomsDamage: string; cropIds: CatalogueCropId[] }
> = {
  rust: {
    scientificName: "Puccinia spp.",
    symptomsDamage:
      "Orange, yellow or brown pustules on leaves and stems. Reduces photosynthetic area and grain fill.",
    cropIds: CEREALS,
  },
  leaf_blotch: {
    scientificName: "Zymoseptoria / Pyrenophora",
    symptomsDamage:
      "Tan or brown lesions on leaves, often with dark fruiting bodies. Can defoliate the canopy in wet seasons.",
    cropIds: WHEAT_BARLEY,
  },
  head_disease: {
    scientificName: "Fusarium spp.",
    symptomsDamage:
      "Bleached spikelets, pink fungal growth and shrivelled grain. Yield and quality losses, mycotoxin risk.",
    cropIds: ["wheat"],
  },
  mildew: {
    scientificName: "Blumeria graminis",
    symptomsDamage:
      "White or grey powdery coating on upper leaves. Slows growth and can lodge dense canopies.",
    cropIds: CEREALS,
  },
  sclerotinia: {
    scientificName: "Sclerotinia sclerotiorum",
    symptomsDamage:
      "White mould and bleached stems in dense canopies. Premature ripening and lodging in oilseed crops.",
    cropIds: ["rapeseed"],
  },
  rhynchosporium: {
    scientificName: "Rhynchosporium commune",
    symptomsDamage:
      "Dark leaf spots with a pale centre and yellow halo. Rapid leaf death in cool, wet barley.",
    cropIds: WHEAT_BARLEY,
  },
  downy_mildew: {
    scientificName: "Peronospora / Hyaloperonospora",
    symptomsDamage:
      "Pale yellow patches with fuzzy growth on the leaf underside. Distorts young tissue in wet conditions.",
    cropIds: ["soy", "rapeseed"],
  },
};

const PEST_GROUP_META: Record<
  string,
  { scientificName: string; symptomsDamage: string; cropIds: CatalogueCropId[] }
> = {
  aphids: {
    scientificName: "Aphididae",
    symptomsDamage:
      "Colonies on leaves and ears, sticky honeydew and sooty mould. Virus transmission risk.",
    cropIds: CEREALS,
  },
  beetles: {
    scientificName: "Coleoptera",
    symptomsDamage:
      "Shot-holing, chewing and stem boring. Stand loss at establishment and feeding on flowers.",
    cropIds: [...CEREALS, "rapeseed"],
  },
  caterpillars: {
    scientificName: "Lepidoptera larvae",
    symptomsDamage:
      "Leaf stripping, windowing and defoliation as larvae move through the canopy.",
    cropIds: [...CEREALS, "corn"],
  },
  mites: {
    scientificName: "Acari",
    symptomsDamage:
      "Fine stippling, bronzing and webbing on drought-stressed leaves. Premature senescence.",
    cropIds: [...CEREALS, "soy"],
  },
  slugs: {
    scientificName: "Gastropoda",
    symptomsDamage:
      "Irregular holes, shredded seedlings and slime trails. Severe establishment loss in wet seedbeds.",
    cropIds: [...CEREALS, "rapeseed"],
  },
  wireworm: {
    scientificName: "Agriotes spp.",
    symptomsDamage:
      "Soil-dwelling larvae bore into stems and roots. Patchy emergence and wilting plants.",
    cropIds: [...CEREALS, "corn"],
  },
};

const PEST_ITEM_META: Record<string, string> = {
  grain_aphid: "Sitobion avenae",
  bird_cherry_oat_aphid: "Rhopalosiphum padi",
  rose_grain_aphid: "Metopolophium dirhodum",
  flea_beetle: "Phyllotreta spp.",
  wheat_bulb_fly: "Delia coarctata",
  blossom_beetle: "Meligethes aeneus",
  armyworm: "Mythimna / Spodoptera",
  cereal_leaf_beetle: "Oulema melanopus",
  brown_wheat_mite: "Petrobia latens",
  two_spotted_spider_mite: "Tetranychus urticae",
};

const WEED_GROUP_META: Record<
  string,
  { scientificName: string; symptomsDamage: string; cropIds: CatalogueCropId[] }
> = {
  broadleaf: {
    scientificName: "Dicotyledoneae",
    symptomsDamage:
      "Competes for light, nutrients and moisture. Can smother the crop and contaminate harvest.",
    cropIds: CATALOGUE_CROPS.map((crop) => crop.id),
  },
  grass: {
    scientificName: "Poaceae",
    symptomsDamage:
      "Mimics the crop, reduces tillering and yield. Seed return builds a persistent seedbank.",
    cropIds: [...CEREALS, "corn"],
  },
  sedge: {
    scientificName: "Cyperaceae",
    symptomsDamage:
      "Triangular-stemmed weeds in wet or compacted ground. Competes strongly in row crops.",
    cropIds: ["corn", "soy"],
  },
};

const WEED_ITEM_META: Record<string, string> = {
  common_poppy: "Papaver rhoeas",
  chickweed: "Stellaria media",
  mayweed: "Tripleurospermum inodorum",
  cleavers: "Galium aparine",
  thistle: "Cirsium arvense",
  black_grass: "Alopecurus myosuroides",
  wild_oats: "Avena fatua",
  brome: "Bromus spp.",
  yellow_nutsedge: "Cyperus esculentus",
  purple_nutsedge: "Cyperus rotundus",
};

function cropImageMap(imageSrc: string, cropIds: string[]): Record<string, string> {
  return Object.fromEntries(cropIds.map((cropId) => [cropId, imageSrc]));
}

export function createInitialCatalogue(): CatalogueState {
  const diseases: DiseaseGroupEntry[] = DISEASE_CATEGORIES.map((category) => {
    const meta = DISEASE_META[category.id];
    const cropIds = meta?.cropIds ?? [...CEREALS];

    return {
      id: category.id,
      label: category.label,
      description: category.description,
      scientificName: meta?.scientificName ?? "",
      symptomsDamage: meta?.symptomsDamage ?? category.description,
      active: category.showInGrid !== false,
      imageSrc: category.imageSrc,
      cropIds: [...cropIds],
      cropImages: cropImageMap(category.imageSrc, cropIds),
    };
  });

  const pests: NestedGroupEntry[] = PEST_CATEGORIES.map((category) => {
    const meta = PEST_GROUP_META[category.id];
    const cropIds = meta?.cropIds ?? [...CEREALS];

    return {
      id: category.id,
      label: category.label,
      description: category.description,
      scientificName: meta?.scientificName ?? "",
      symptomsDamage: meta?.symptomsDamage ?? category.description,
      active: category.showInGrid !== false,
      imageSrc: category.imageSrc,
      cropIds: [...cropIds],
      items: PEST_SPECIFIC_TYPES.filter((item) => item.categoryId === category.id).map(
        (item) => ({
          id: item.id,
          label: item.label,
          description: item.description,
          scientificName: PEST_ITEM_META[item.id] ?? "",
          symptomsDamage: item.description,
          active: true,
          imageSrc: item.imageSrc,
          cropIds: [...cropIds],
        })
      ),
    };
  });

  const weeds: NestedGroupEntry[] = WEED_CATEGORIES.map((category) => {
    const meta = WEED_GROUP_META[category.id];
    const cropIds = meta?.cropIds ?? CATALOGUE_CROPS.map((crop) => crop.id);

    return {
      id: category.id,
      label: category.label,
      description: category.description,
      scientificName: meta?.scientificName ?? "",
      symptomsDamage: meta?.symptomsDamage ?? category.description,
      active: true,
      imageSrc: category.imageSrc,
      cropIds: [...cropIds],
      items: WEED_SPECIFIC_TYPES.filter((item) => item.categoryId === category.id).map(
        (item) => ({
          id: item.id,
          label: item.label,
          description: item.description,
          scientificName: WEED_ITEM_META[item.id] ?? "",
          symptomsDamage: item.description,
          active: true,
          imageSrc: item.imageSrc,
          cropIds: [...cropIds],
        })
      ),
    };
  });

  return { diseases, pests, weeds, plantParts: createInitialPlantParts() };
}

export function reorderItems<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function allCropIds(): string[] {
  return CATALOGUE_CROPS.map((crop) => crop.id);
}

export function createDiseaseGroup(index: number): DiseaseGroupEntry {
  return {
    id: `disease-${Date.now()}-${index}`,
    label: "New disease group",
    description: "",
    scientificName: "",
    symptomsDamage: "",
    active: true,
    imageSrc: "",
    cropIds: [],
    cropImages: {},
  };
}

export function createNestedGroup(
  kind: "pest" | "weed",
  index: number
): NestedGroupEntry {
  return {
    id: `${kind}-group-${Date.now()}-${index}`,
    label: kind === "pest" ? "New pest group" : "New weed group",
    description: "",
    scientificName: "",
    symptomsDamage: "",
    active: true,
    imageSrc: "",
    cropIds: [],
    items: [],
  };
}

export function createNestedItem(kind: "pest" | "weed", index: number): CatalogueEntry {
  return {
    id: `${kind}-${Date.now()}-${index}`,
    label: kind === "pest" ? "New pest" : "New weed",
    description: "",
    scientificName: "",
    symptomsDamage: "",
    active: true,
    imageSrc: "",
    cropIds: [],
  };
}

export function createPlantPart(index: number): PlantPartEntry {
  return {
    id: `plant-part-${Date.now()}-${index}`,
    label: "New plant part",
    cropIds: [],
    archived: false,
  };
}

export function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

function createInitialPlantParts(): PlantPartEntry[] {
  const all = allCropIds();
  const oilseed: CatalogueCropId[] = ["soy", "rapeseed"];

  return [
    { id: "leaf", label: "Leaf", cropIds: [...all], archived: false },
    { id: "pod", label: "Pod", cropIds: [...oilseed], archived: false },
    { id: "stem", label: "Stem", cropIds: [...all], archived: false },
    { id: "roots", label: "Roots", cropIds: [...all], archived: false },
    { id: "flower", label: "Flower", cropIds: [...oilseed], archived: false },
    { id: "head", label: "Head", cropIds: [...CEREALS], archived: false },
    { id: "growing-point", label: "Growing point", cropIds: [...all], archived: false },
    { id: "whole-plant", label: "Whole plant", cropIds: [...all], archived: false },
  ];
}
