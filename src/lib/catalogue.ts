import {
  DISEASE_CATEGORIES,
  PEST_CATEGORIES,
  PEST_SPECIFIC_TYPES,
  WEED_CATEGORIES,
  WEED_SPECIFIC_TYPES,
} from "@/lib/observations";

export const CATALOGUE_CROPS = [
  { id: "wheat", label: "Wheat" },
  { id: "maize", label: "Maize" },
  { id: "barley", label: "Barley" },
  { id: "tobacco", label: "Tobacco" },
  { id: "soybeans", label: "Soybeans" },
  { id: "groundnuts", label: "Groundnuts" },
  { id: "potatoes", label: "Potatoes" },
  { id: "onions", label: "Onions" },
  { id: "citrus", label: "Citrus" },
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

const ALL: CatalogueCropId[] = [
  "wheat",
  "maize",
  "barley",
  "tobacco",
  "soybeans",
  "groundnuts",
  "potatoes",
  "onions",
  "citrus",
];
const CEREALS: CatalogueCropId[] = ["wheat", "maize", "barley"];
const LEGUMES: CatalogueCropId[] = ["soybeans", "groundnuts"];

type DiseaseMeta = {
  scientificName: string;
  symptomsDamage: string;
  cropIds: CatalogueCropId[];
  cropImages?: Partial<Record<CatalogueCropId, string>>;
};

const DISEASE_META: Record<string, DiseaseMeta> = {
  gray_leaf_spot: {
    scientificName: "Cercospora zeina",
    symptomsDamage:
      "Long rectangular grey-brown lesions parallel to maize veins; lower leaves first. Yield loss when lesions reach the ear leaf. Management: rotate away from maize, bury or remove residue, choose less susceptible hybrids, and apply a registered foliar fungicide from tasselling if weather is wet.",
    cropIds: ["maize"],
    cropImages: { maize: "/diseases/maize-gray-leaf-spot.webp" },
  },
  northern_leaf_blight: {
    scientificName: "Exserohilum turcicum",
    symptomsDamage:
      "Large cigar-shaped grey-green then tan lesions on maize leaves. Can kill foliage before grain fill. Management: plant resistant hybrids, rotate crops, manage residue, and use a registered foliar fungicide when lesions appear before tasselling in humid weather.",
    cropIds: ["maize"],
    cropImages: { maize: "/diseases/maize-northern-leaf-blight.webp" },
  },
  maize_streak: {
    scientificName: "Maize streak virus",
    symptomsDamage:
      "Narrow yellow streaks along the veins; plants are stunted and cobs poorly filled. Spread by leafhoppers. Management: plant resistant hybrids, control leafhoppers on seedlings, avoid staggered plantings next to infected maize, and rogue badly infected plants.",
    cropIds: ["maize"],
    cropImages: { maize: "/diseases/maize-streak-virus.webp" },
  },
  common_rust: {
    scientificName: "Puccinia sorghi",
    symptomsDamage:
      "Raised cinnamon-brown pustules on both leaf surfaces; severe cases cause early leaf death. Management: resistant hybrids usually suffice; apply a registered foliar fungicide if pustules appear early on a susceptible hybrid in cool, humid weather.",
    cropIds: ["maize"],
    cropImages: { maize: "/diseases/maize-common-rust.webp" },
  },
  fusarium_ear_rot: {
    scientificName: "Fusarium verticillioides complex",
    symptomsDamage:
      "White or pink mould between kernels, often from the ear tip or insect wounds; mycotoxin risk. Management: choose hybrids with tight husks, control ear insects, harvest promptly, dry grain below 14% moisture, and do not store mouldy cobs.",
    cropIds: ["maize"],
    cropImages: { maize: "/diseases/maize-ear-rot.webp" },
  },
  lethal_necrosis: {
    scientificName: "MCMV + potyvirus complex",
    symptomsDamage:
      "Mottling, leaf-edge necrosis, dead heart and poorly filled cobs. Plants may die. Management: use certified virus-tested seed, control thrips and beetles, destroy infected plants, avoid maize after maize, and do not move infected material between fields.",
    cropIds: ["maize"],
    cropImages: { maize: "/diseases/maize-lethal-necrosis.webp" },
  },
  stem_rust: {
    scientificName: "Puccinia graminis f. sp. tritici",
    symptomsDamage:
      "Long reddish-brown pustules on stems, leaves and heads; stems may lodge. Management: grow resistant cultivars, destroy volunteer wheat, and apply a registered foliar fungicide at first pustules, repeating if infection pressure stays high.",
    cropIds: ["wheat"],
    cropImages: { wheat: "/diseases/wheat-stem-rust.webp" },
  },
  stripe_rust: {
    scientificName: "Puccinia striiformis f. sp. tritici",
    symptomsDamage:
      "Yellow-orange pustules in stripes on leaves; can defoliate crops in cool weather. Management: plant resistant cultivars, monitor from tillering, and apply a registered foliar fungicide at first stripes before they reach the flag leaf.",
    cropIds: ["wheat"],
    cropImages: { wheat: "/diseases/wheat-stripe-rust.webp" },
  },
  leaf_rust: {
    scientificName: "Puccinia triticina; Puccinia hordei",
    symptomsDamage:
      "Scattered round orange-brown pustules on leaves; severe infection shortens grain fill. Management: use resistant cultivars, remove volunteers, and apply a registered foliar fungicide if pustules appear on upper leaves before grain fill.",
    cropIds: ["wheat", "barley"],
    cropImages: {
      wheat: "/diseases/wheat-leaf-rust.webp",
      barley: "/diseases/barley-leaf-rust.png",
    },
  },
  septoria: {
    scientificName: "Zymoseptoria tritici",
    symptomsDamage:
      "Brown leaf blotches with small black pycnidia; flag-leaf infection cuts yield. Management: rotate with non-cereals, bury residue, avoid very dense canopies, and protect the flag leaf with a registered fungicide in wet seasons.",
    cropIds: ["wheat"],
    cropImages: { wheat: "/diseases/wheat-septoria.webp" },
  },
  fusarium_head_blight: {
    scientificName: "Fusarium graminearum complex",
    symptomsDamage:
      "Premature bleaching of spikelets, pink growth and shrivelled grain; mycotoxin risk. Management: rotate away from maize and wheat, choose less susceptible cultivars, plough in residue, and apply a registered fungicide at early flowering in wet weather.",
    cropIds: ["wheat", "barley"],
    cropImages: {
      wheat: "/diseases/wheat-fusarium-head-blight.webp",
      barley: "/diseases/barley-fusarium-head-blight.png",
    },
  },
  wheat_blast: {
    scientificName: "Magnaporthe oryzae pathotype Triticum",
    symptomsDamage:
      "Bleached heads above a dark brown neck lesion; grain is shrivelled or absent. Warm rain at heading favours spread. Management: plant certified seed, destroy volunteers and crop residue, avoid moving infected straw, and apply a registered fungicide at early heading if risk is high.",
    cropIds: ["wheat"],
    cropImages: { wheat: "/diseases/wheat-blast.webp" },
  },
  take_all: {
    scientificName: "Gaeumannomyces tritici; Gaeumannomyces graminis",
    symptomsDamage:
      "Patchy stunting, blackened roots and stem bases, and whiteheads that pull easily from the soil. Worse in second or third wheat crops. Management: rotate at least one year out of wheat and barley, avoid early sowing on infested land, keep phosphate adequate and nitrogen balanced, and control grassy weeds that host the fungus.",
    cropIds: ["wheat", "barley"],
    cropImages: {
      wheat: "/diseases/wheat-take-all.png",
      barley: "/diseases/wheat-take-all.png",
    },
  },
  net_blotch: {
    scientificName: "Pyrenophora teres",
    symptomsDamage:
      "Dark net-like brown markings or oval spots on barley leaves; can kill lower canopy. Management: rotate away from barley, use clean seed, bury residue, and apply a registered foliar fungicide if netting reaches mid-canopy before heading.",
    cropIds: ["barley"],
    cropImages: { barley: "/diseases/barley-net-blotch.png" },
  },
  spot_blotch: {
    scientificName: "Bipolaris sorokiniana",
    symptomsDamage:
      "Oval dark-brown spots with yellow margins; heads and grain can also be infected. Management: rotate with non-cereals, use clean seed, plant less susceptible cultivars, and apply a registered foliar fungicide in warm, humid weather.",
    cropIds: ["barley"],
    cropImages: { barley: "/diseases/barley-spot-blotch.png" },
  },
  powdery_mildew: {
    scientificName: "Blumeria graminis f. sp. hordei",
    symptomsDamage:
      "White powdery patches on leaves and stems; severe infection yellows and kills tissue. Management: plant resistant cultivars, avoid excessive nitrogen and dense stands, and apply a registered fungicide at first colonies on upper leaves.",
    cropIds: ["barley"],
    cropImages: { barley: "/diseases/barley-powdery-mildew.png" },
  },
  loose_smut: {
    scientificName: "Ustilago nuda",
    symptomsDamage:
      "Emerging heads replaced by a loose mass of black spores; neighbouring florets are infected. Management: plant certified seed and use a systemic seed treatment; do not save seed from infected fields.",
    cropIds: ["barley"],
    cropImages: { barley: "/diseases/barley-loose-smut.png" },
  },
  black_shank: {
    scientificName: "Phytophthora nicotianae",
    symptomsDamage:
      "Blackened stem base, root rot and rapid wilt, often in wet patches. Plants may snap at soil level. Management: plant resistant cultivars, rotate off tobacco, improve drainage, avoid moving infested soil, and use a registered soil-applied fungicide where the variety is only partly resistant.",
    cropIds: ["tobacco"],
    cropImages: { tobacco: "/diseases/tobacco-black-shank.png" },
  },
  granville_wilt: {
    scientificName: "Ralstonia solanacearum",
    symptomsDamage:
      "Sudden wilt of still-green tobacco leaves, often one-sided at first; cut stems show brown vascular staining and may ooze. Worse in warm, wet soils. Management: rotate several years away from tobacco, potato, tomato and other solanaceous crops, plant resistant cultivars, avoid waterlogging, and sanitise tools and irrigation water. Do not plant into known infested patches.",
    cropIds: ["tobacco"],
    cropImages: { tobacco: "/diseases/tobacco-granville-wilt.png" },
  },
  angular_leaf_spot: {
    scientificName: "Pseudomonas syringae pv. tabaci",
    symptomsDamage:
      "Angular dead areas limited by veins; wet weather can cause wildfire-like yellow halos. Management: plant resistant cultivars, avoid working wet crops, destroy infected debris, and apply a registered copper spray at first lesions.",
    cropIds: ["tobacco"],
    cropImages: { tobacco: "/diseases/tobacco-angular-leaf-spot.png" },
  },
  frogeye_leaf_spot: {
    scientificName: "Cercospora nicotianae; Cercospora sojina",
    symptomsDamage:
      "Round tan or grey-centred spots with darker borders on leaves; severe cases cause defoliation. Management: rotate crops, bury residue, use less susceptible cultivars, and apply a registered foliar fungicide if spots move into the upper canopy.",
    cropIds: ["tobacco", "soybeans"],
    cropImages: {
      tobacco: "/diseases/tobacco-frogeye-leaf-spot.png",
      soybeans: "/diseases/soybean-frogeye-leaf-spot.webp",
    },
  },
  bacterial_wilt: {
    scientificName: "Ralstonia solanacearum complex",
    symptomsDamage:
      "Sudden wilt with brown vascular tissue or bacterial ooze from cut stems or tubers. Management: rotate away from solanaceous and other host crops, plant in well-drained fields, sanitise tools and irrigation, and do not save seed or tubers from infected plants. On tobacco this disease is listed separately as Granville wilt.",
    cropIds: ["groundnuts", "potatoes"],
    cropImages: {
      groundnuts: "/diseases/groundnut-bacterial-wilt.png",
      potatoes: "/diseases/potato-bacterial-wilt.png",
    },
  },
  mosaic_virus: {
    scientificName: "Tobacco mosaic virus",
    symptomsDamage:
      "Patchy light and dark green mosaic, leaf distortion and reduced leaf quality. Spreads on hands, tools and infected debris. Management: use clean seed, wash hands and tools, do not handle plants after using tobacco products, rogue infected plants, and control weeds that host the virus.",
    cropIds: ["tobacco"],
    cropImages: { tobacco: "/diseases/tobacco-mosaic-virus.png" },
  },
  fusarium_wilt: {
    scientificName: "Fusarium oxysporum f. sp. nicotianae",
    symptomsDamage:
      "Yellowing and one-sided wilt with brown vascular staining; plants often die in patches. Management: rotate off tobacco, plant resistant cultivars, avoid moving infested soil, and do not plant into poorly drained or previously wilted land.",
    cropIds: ["tobacco"],
    cropImages: { tobacco: "/diseases/tobacco-fusarium-wilt.png" },
  },
  soybean_rust: {
    scientificName: "Phakopsora pachyrhizi",
    symptomsDamage:
      "Tiny tan lesions and raised pustules on the underside of leaves; rapid defoliation in wet weather. Management: scout lower canopy from flowering, and apply a registered foliar fungicide at first pustules, repeating if rain continues. Resistant cultivars reduce but do not replace sprays in high-pressure seasons.",
    cropIds: ["soybeans"],
    cropImages: { soybeans: "/diseases/soybean-rust.webp" },
  },
  bacterial_pustule: {
    scientificName: "Xanthomonas citri pv. glycines",
    symptomsDamage:
      "Small raised spots with yellow halos; pustules form on the undersides of leaves. Management: plant clean seed, rotate with non-hosts, avoid working wet canopies, and destroy infected residue. Copper sprays have limited value once the crop is dense.",
    cropIds: ["soybeans"],
    cropImages: { soybeans: "/diseases/soybean-bacterial-pustule.webp" },
  },
  bacterial_blight: {
    scientificName: "Pseudomonas syringae pv. glycinea",
    symptomsDamage:
      "Angular water-soaked then brown spots, often with a yellow halo; lesions may tear out. Management: use clean seed, rotate crops, avoid cultivation while leaves are wet, and bury infected residue. Foliar bactericides rarely pay once infection is established.",
    cropIds: ["soybeans"],
    cropImages: { soybeans: "/diseases/soybean-bacterial-blight.webp" },
  },
  red_leaf_blotch: {
    scientificName: "Coniothyrium glycines",
    symptomsDamage:
      "Red-brown blotches on lower leaves that enlarge and defoliate plants. Management: rotate away from soybean, bury residue, and apply a registered foliar fungicide if blotches move up the canopy in wet weather.",
    cropIds: ["soybeans"],
    cropImages: { soybeans: "/diseases/soybean-red-leaf-blotch.webp" },
  },
  root_stem_rot: {
    scientificName: "Phytophthora sojae",
    symptomsDamage:
      "Dark stem lesion rising from the soil, wilt and plant death in wet patches. Management: plant resistant cultivars, improve drainage, use a seed treatment with activity against Phytophthora, and avoid compacting wet soils.",
    cropIds: ["soybeans"],
    cropImages: { soybeans: "/diseases/soybean-root-stem-rot.webp" },
  },
  rosette: {
    scientificName: "Groundnut rosette virus complex",
    symptomsDamage:
      "Bunched small leaves, yellow or green rosette and severe stunting; yield can be lost. Spread by aphids. Management: plant resistant cultivars at recommended density, control aphids from emergence, rogue infected plants, and avoid late plantings next to infected groundnuts.",
    cropIds: ["groundnuts"],
    cropImages: { groundnuts: "/diseases/groundnut-rosette.png" },
  },
  early_leaf_spot: {
    scientificName: "Passalora arachidicola",
    symptomsDamage:
      "Brown leaf spots with yellow halos, mainly on upper leaf surfaces; leads to defoliation. Management: rotate away from groundnuts, bury residue, and follow a registered foliar fungicide programme from about 40 days after planting in wet seasons.",
    cropIds: ["groundnuts"],
    cropImages: { groundnuts: "/diseases/groundnut-early-leaf-spot.png" },
  },
  late_leaf_spot: {
    scientificName: "Nothopassalora personata",
    symptomsDamage:
      "Dark spots, often without a strong halo, more obvious on the underside of leaves; rapid defoliation. Management: rotate, bury residue, and maintain a registered foliar fungicide programme through pod fill in humid weather.",
    cropIds: ["groundnuts"],
    cropImages: { groundnuts: "/diseases/groundnut-late-leaf-spot.png" },
  },
  groundnut_rust: {
    scientificName: "Puccinia arachidis",
    symptomsDamage:
      "Orange-brown pustules beneath leaves; severe rust defoliates plants before harvest. Management: plant less susceptible cultivars and include a registered rust-active fungicide in the leaf-spot spray programme.",
    cropIds: ["groundnuts"],
    cropImages: { groundnuts: "/diseases/groundnut-rust.png" },
  },
  crown_rot: {
    scientificName: "Aspergillus niger",
    symptomsDamage:
      "Dark crown rot, yellowing and seedling collapse, especially in hot dry seedbeds. Management: plant high-quality treated seed into moist soil, avoid deep planting in hot sand, and do not save seed from infected plants.",
    cropIds: ["groundnuts"],
    cropImages: { groundnuts: "/diseases/groundnut-aspergillus-crown-rot.png" },
  },
  late_blight: {
    scientificName: "Phytophthora infestans",
    symptomsDamage:
      "Fast-growing water-soaked leaf lesions with white growth on the edges in humid weather; stems blacken and tubers rot. Management: plant certified seed, destroy volunteers and dumps, and apply a protectant then systemic registered fungicide from canopy closure in wet weather. Kill haulm before harvest if blight is active.",
    cropIds: ["potatoes"],
    cropImages: { potatoes: "/diseases/potato-late-blight.png" },
  },
  early_blight: {
    scientificName: "Alternaria solani",
    symptomsDamage:
      "Dry brown target spots with concentric rings, usually on older leaves; can defoliate stressed crops. Management: rotate, keep nutrition adequate, avoid prolonged leaf wetness, and apply a registered foliar fungicide when spots appear on lower leaves.",
    cropIds: ["potatoes"],
    cropImages: { potatoes: "/diseases/potato-early-blight.png" },
  },
  blackleg_soft_rot: {
    scientificName: "Pectobacterium spp.; Dickeya spp.",
    symptomsDamage:
      "Inky black stem base in the field or wet, foul tuber decay in store. Management: plant certified seed, avoid planting damaged or wet seed, handle tubers carefully at harvest, and store cool, dry and well ventilated.",
    cropIds: ["potatoes"],
    cropImages: { potatoes: "/diseases/potato-blackleg-soft-rot.png" },
  },
  potato_virus_y: {
    scientificName: "Potato virus Y",
    symptomsDamage:
      "Mosaic colour, leaf crinkling, necrotic streaks and uneven or reduced growth; quality and yield drop. Spread by aphids. Management: plant certified seed, control aphids, rogue infected plants early, and keep seed crops isolated from ware crops.",
    cropIds: ["potatoes"],
    cropImages: { potatoes: "/diseases/potato-virus-y.png" },
  },
  common_scab: {
    scientificName: "Streptomyces scabies complex",
    symptomsDamage:
      "Dry rough, corky, raised or pitted lesions on tubers; quality is reduced more than yield. Management: keep soil moist at tuber initiation, use less susceptible cultivars, avoid high pH lime just before planting, and do not plant scabby seed.",
    cropIds: ["potatoes"],
    cropImages: { potatoes: "/diseases/potato-common-scab.png" },
  },
  purple_blotch: {
    scientificName: "Alternaria porri",
    symptomsDamage:
      "Purple-brown leaf lesions that elongate, girdle the leaf and collapse the neck; bulbs may rot in store. Management: rotate, space plants for airflow, avoid overhead irrigation late in the day, and apply a registered foliar fungicide from mid-season in wet weather.",
    cropIds: ["onions"],
    cropImages: { onions: "/diseases/onion-purple-blotch.png" },
  },
  downy_mildew: {
    scientificName: "Peronospora destructor",
    symptomsDamage:
      "Pale leaf streaks with purple-grey fuzzy growth in cool, humid weather; leaves collapse. Management: plant on well-drained beds, avoid dense stands, irrigate in the morning, and apply a registered protectant fungicide before prolonged leaf wetness.",
    cropIds: ["onions"],
    cropImages: { onions: "/diseases/onion-downy-mildew.png" },
  },
  iris_yellow_spot: {
    scientificName: "Iris yellow spot virus",
    symptomsDamage:
      "Diamond-shaped yellow or straw lesions on leaves and seed stalks; seed yield can collapse. Spread by onion thrips. Management: control thrips from early season, avoid planting next to infected onions or volunteers, and rogue symptomatic plants in seed crops.",
    cropIds: ["onions"],
    cropImages: { onions: "/diseases/onion-iris-yellow-spot.png" },
  },
  fusarium_basal_rot: {
    scientificName: "Fusarium oxysporum f. sp. cepae",
    symptomsDamage:
      "Brown basal plate rot, yellowing from the tip and bulbs that collapse from the base in field or store. Management: rotate several years away from Allium crops, plant on well-drained beds, use healthy transplants or sets, and cure bulbs thoroughly before storage.",
    cropIds: ["onions"],
    cropImages: { onions: "/diseases/onion-fusarium-basal-rot.png" },
  },
  bacterial_soft_rot: {
    scientificName: "Pectobacterium carotovorum complex",
    symptomsDamage:
      "Water-soaked neck and wet, foul bulb decay in the field or store. Management: avoid neck injury, stop irrigation before harvest, cure thoroughly, and store cool and dry. Discard rotting bulbs so they do not spread in the store.",
    cropIds: ["onions"],
    cropImages: { onions: "/diseases/onion-bacterial-soft-rot.png" },
  },
  onion_rust: {
    scientificName: "Puccinia allii",
    symptomsDamage:
      "Orange-brown pustules on leaves and flower stalks; severe rust weakens bulbs. Management: rotate away from Allium crops, destroy volunteers, and apply a registered foliar fungicide if pustules appear early.",
    cropIds: ["onions"],
    cropImages: { onions: "/diseases/onion-rust.png" },
  },
  citrus_greening: {
    scientificName: "Candidatus Liberibacter spp.",
    symptomsDamage:
      "Asymmetric blotchy leaf mottling, yellow shoots, and small lopsided bitter fruit. Trees decline. Spread by citrus psyllids. Management: plant certified trees, control psyllids year-round, remove infected trees promptly, and do not move infected material.",
    cropIds: ["citrus"],
    cropImages: { citrus: "/diseases/citrus-greening.png" },
  },
  citrus_canker: {
    scientificName: "Xanthomonas citri subsp. citri",
    symptomsDamage:
      "Raised corky lesions with distinct yellow halos on leaves, twigs and fruit; fruit drop is common. Management: plant windbreaks, apply copper during flush and fruit set, prune out badly infected shoots in dry weather, and remove hopeless trees.",
    cropIds: ["citrus"],
    cropImages: { citrus: "/diseases/citrus-canker.png" },
  },
  citrus_black_spot: {
    scientificName: "Phyllosticta citricarpa",
    symptomsDamage:
      "Hard black circular spots or freckled lesions on fruit; fruit can be unmarketable. Management: apply copper and strobilurin sprays from fruit set through the rainy period, mulch or remove leaf litter, and harvest promptly.",
    cropIds: ["citrus"],
    cropImages: { citrus: "/diseases/citrus-black-spot.png" },
  },
  gummosis: {
    scientificName: "Phytophthora spp.",
    symptomsDamage:
      "Cracked dark bark with amber gum near the trunk base; trees decline if the girdle spreads. Management: bud high, keep the graft union above wet soil, improve drainage, avoid trunk injury, and apply a registered phosphonate or metalaxyl drench or paint.",
    cropIds: ["citrus"],
    cropImages: { citrus: "/diseases/citrus-gummosis.png" },
  },
  tristeza: {
    scientificName: "Citrus tristeza virus",
    symptomsDamage:
      "Tree decline, stem pitting, small fruit and poor canopy, especially on sour orange. Spread by aphids and infected budwood. Management: plant certified budwood on tolerant rootstocks, control aphids, and remove severely pitted or declining trees.",
    cropIds: ["citrus"],
    cropImages: { citrus: "/diseases/citrus-tristeza.png" },
  },
  greasy_spot: {
    scientificName: "Zasmidium citri-griseum",
    symptomsDamage:
      "Dark oily-looking leaf spots followed by early leaf drop, reducing next season’s crop. Management: apply copper after the rainy flush, manage leaf litter under the canopy, and keep trees well pruned for airflow.",
    cropIds: ["citrus"],
    cropImages: { citrus: "/diseases/citrus-greasy-spot.png" },
  },
};

type PestGroupMeta = {
  scientificName: string;
  symptomsDamage: string;
  cropIds: CatalogueCropId[];
};

const PEST_GROUP_META: Record<string, PestGroupMeta> = {
  aphids: {
    scientificName: "Aphididae",
    symptomsDamage:
      "Colonies of small soft insects, sticky leaves and virus transmission risk.",
    cropIds: ["wheat", "maize", "barley", "tobacco", "soybeans", "groundnuts", "potatoes"],
  },
  caterpillars: {
    scientificName: "Lepidoptera larvae",
    symptomsDamage:
      "Windowing, ragged holes, boring and chewing on leaves, stems, pods or fruit.",
    cropIds: [
      "wheat",
      "maize",
      "barley",
      "tobacco",
      "soybeans",
      "groundnuts",
      "potatoes",
      "onions",
      "citrus",
    ],
  },
  cutworms: {
    scientificName: "Agrotis spp.",
    symptomsDamage: "Young plants cut near soil level, often beside a curled larva.",
    cropIds: ["wheat", "maize", "barley", "tobacco", "potatoes", "onions"],
  },
  termites: {
    scientificName: "Microtermes spp.; Macrotermes spp.; Odontotermes spp.",
    symptomsDamage: "Hollowed roots or stems, soil galleries and drying patches.",
    cropIds: ["wheat", "maize", "barley", "groundnuts"],
  },
  mites: {
    scientificName: "Tetranychidae; Rhizoglyphus spp.",
    symptomsDamage: "Fine stippling, bronzing, webbing, or bulb feeding below ground.",
    cropIds: ["maize", "onions"],
  },
  thrips: {
    scientificName: "Thripidae",
    symptomsDamage: "Silvered streaks, scarred leaves and distorted new growth.",
    cropIds: ["tobacco", "groundnuts", "onions", "citrus"],
  },
  whiteflies: {
    scientificName: "Bemisia tabaci complex",
    symptomsDamage: "Small white insects and honeydew beneath leaves.",
    cropIds: ["tobacco", "soybeans"],
  },
  beetles: {
    scientificName: "Coleoptera / Hemiptera",
    symptomsDamage:
      "Chewing, shot-holing, root feeding or shield-shaped bugs on pods and seed.",
    cropIds: ["wheat", "barley", "tobacco", "soybeans", "groundnuts", "citrus"],
  },
  leaf_miners: {
    scientificName: "Lepidoptera / Diptera leaf miners",
    symptomsDamage: "Mines, folded leaflets or silvery serpentine trails.",
    cropIds: ["soybeans", "groundnuts", "potatoes", "onions", "citrus"],
  },
  nematodes: {
    scientificName: "Globodera spp.; Meloidogyne spp.",
    symptomsDamage: "Patchy stunting, root galls or cysts and distorted tubers or bulbs.",
    cropIds: ["potatoes", "onions"],
  },
  fruit_flies: {
    scientificName: "Ceratitis capitata",
    symptomsDamage: "Fruit punctures followed by soft internal larval damage.",
    cropIds: ["citrus"],
  },
  psyllids: {
    scientificName: "Diaphorina citri",
    symptomsDamage: "Mottled adults and waxy nymphs on tender new flush.",
    cropIds: ["citrus"],
  },
};

type ItemMeta = {
  scientificName: string;
  cropIds?: CatalogueCropId[];
};

const PEST_ITEM_META: Record<string, ItemMeta> = {
  cereal_aphids: {
    scientificName: "Sitobion / Rhopalosiphum / Russian wheat aphid",
    cropIds: ["wheat", "maize", "barley"],
  },
  tobacco_aphid: {
    scientificName: "Myzus persicae nicotianae",
    cropIds: ["tobacco"],
  },
  green_peach_aphid: {
    scientificName: "Myzus persicae",
    cropIds: ["tobacco", "potatoes"],
  },
  groundnut_aphid: {
    scientificName: "Aphis craccivora",
    cropIds: ["soybeans", "groundnuts"],
  },
  potato_aphid: {
    scientificName: "Macrosiphum euphorbiae",
    cropIds: ["potatoes"],
  },
  fall_armyworm: {
    scientificName: "Spodoptera frugiperda",
    cropIds: ["maize"],
  },
  african_armyworm: {
    scientificName: "Spodoptera exempta",
    cropIds: ["wheat", "barley"],
  },
  african_bollworm: {
    scientificName: "Helicoverpa armigera",
    cropIds: ["tobacco", "soybeans", "groundnuts"],
  },
  beet_armyworm: {
    scientificName: "Spodoptera exigua",
    cropIds: ["onions"],
  },
  stem_borers: {
    scientificName: "Busseola fusca; Chilo partellus",
    cropIds: ["maize"],
  },
  legume_pod_borer: {
    scientificName: "Maruca vitrata",
    cropIds: ["soybeans"],
  },
  potato_tuber_moth: {
    scientificName: "Phthorimaea operculella",
    cropIds: ["potatoes"],
  },
  false_codling_moth: {
    scientificName: "Thaumatotibia leucotreta",
    cropIds: ["citrus"],
  },
  cutworm: {
    scientificName: "Agrotis spp.",
    cropIds: ["wheat", "maize", "barley", "tobacco", "potatoes", "onions"],
  },
  termite: {
    scientificName: "Microtermes spp.; Macrotermes spp.",
    cropIds: ["wheat", "maize", "barley", "groundnuts"],
  },
  red_spider_mite: {
    scientificName: "Tetranychidae",
    cropIds: ["maize"],
  },
  bulb_mites: {
    scientificName: "Rhizoglyphus spp.",
    cropIds: ["onions"],
  },
  tobacco_thrips: {
    scientificName: "Thrips tabaci",
    cropIds: ["tobacco", "groundnuts"],
  },
  onion_thrips: {
    scientificName: "Thrips tabaci",
    cropIds: ["onions"],
  },
  citrus_thrips: {
    scientificName: "Scirtothrips aurantii",
    cropIds: ["citrus"],
  },
  whitefly: {
    scientificName: "Bemisia tabaci complex",
    cropIds: ["tobacco", "soybeans"],
  },
  cereal_leaf_beetle: {
    scientificName: "Oulema melanopus",
    cropIds: ["wheat", "barley"],
  },
  hessian_fly: {
    scientificName: "Mayetiola destructor",
    cropIds: ["wheat", "barley"],
  },
  false_wireworm: {
    scientificName: "Gonocephalum spp.",
    cropIds: ["tobacco"],
  },
  white_grubs: {
    scientificName: "Scarabaeidae larvae",
    cropIds: ["groundnuts"],
  },
  stink_bugs: {
    scientificName: "Pentatomidae",
    cropIds: ["soybeans"],
  },
  red_scale: {
    scientificName: "Aonidiella aurantii",
    cropIds: ["citrus"],
  },
  soybean_leaf_miner: {
    scientificName: "Aproaerema modicella",
    cropIds: ["soybeans", "groundnuts"],
  },
  potato_leafminer: {
    scientificName: "Liriomyza huidobrensis",
    cropIds: ["potatoes"],
  },
  onion_leafminer: {
    scientificName: "Liriomyza spp.",
    cropIds: ["onions"],
  },
  citrus_leafminer: {
    scientificName: "Phyllocnistis citrella",
    cropIds: ["citrus"],
  },
  potato_cyst_nematodes: {
    scientificName: "Globodera rostochiensis; Globodera pallida",
    cropIds: ["potatoes"],
  },
  root_knot_nematodes: {
    scientificName: "Meloidogyne spp.",
    cropIds: ["potatoes", "onions"],
  },
  mediterranean_fruit_fly: {
    scientificName: "Ceratitis capitata",
    cropIds: ["citrus"],
  },
  citrus_psyllid: {
    scientificName: "Diaphorina citri",
    cropIds: ["citrus"],
  },
};

const WEED_GROUP_META: Record<string, PestGroupMeta> = {
  broadleaf: {
    scientificName: "Dicotyledoneae",
    symptomsDamage:
      "Competes for light, nutrients and moisture. Common in Zambian row crops and cereals.",
    cropIds: ALL,
  },
  grass: {
    scientificName: "Poaceae",
    symptomsDamage:
      "Mimics the crop, reduces tillering and yield. Seed return builds a persistent seedbank.",
    cropIds: ALL,
  },
  sedge: {
    scientificName: "Cyperaceae",
    symptomsDamage:
      "Triangular-stemmed weeds in wet or compacted ground. Competes strongly in row crops.",
    cropIds: ["maize", "soybeans", "groundnuts", "potatoes", "tobacco", "onions"],
  },
  parasitic: {
    scientificName: "Orobanchaceae",
    symptomsDamage:
      "Root parasites that attach to the crop and stunt it. Witchweed hits cereals; broom rape hits tobacco and other solanaceous crops.",
    cropIds: ["maize", "wheat", "barley", "tobacco", "potatoes"],
  },
};

const WEED_ITEM_META: Record<string, ItemMeta> = {
  blackjack: { scientificName: "Bidens pilosa", cropIds: ALL },
  pigweed: { scientificName: "Amaranthus spp.", cropIds: ALL },
  mexican_poppy: { scientificName: "Argemone mexicana", cropIds: ALL },
  wild_sunflower: { scientificName: "Tithonia rotundifolia / Helianthus spp.", cropIds: ALL },
  wandering_jew: { scientificName: "Commelina benghalensis", cropIds: ALL },
  khaki_weed: { scientificName: "Tagetes minuta", cropIds: ALL },
  bristly_starbur: {
    scientificName: "Acanthospermum hispidum",
    cropIds: ["maize", "soybeans", "groundnuts", "tobacco", "potatoes"],
  },
  mexican_clover: {
    scientificName: "Richardia scabra",
    cropIds: ["maize", "soybeans", "groundnuts", "tobacco", "potatoes"],
  },
  wild_poinsettia: {
    scientificName: "Euphorbia heterophylla",
    cropIds: ["maize", "soybeans", "groundnuts", "tobacco"],
  },
  apple_of_peru: {
    scientificName: "Nicandra physalodes",
    cropIds: ["maize", "soybeans", "tobacco", "potatoes"],
  },
  thorn_apple: {
    scientificName: "Datura stramonium",
    cropIds: ["maize", "soybeans", "tobacco", "potatoes", "groundnuts"],
  },
  morning_glory: {
    scientificName: "Ipomoea spp.",
    cropIds: ["maize", "soybeans", "groundnuts", "tobacco", "citrus"],
  },
  purslane: {
    scientificName: "Portulaca oleracea",
    cropIds: ["maize", "soybeans", "groundnuts", "potatoes", "onions", "tobacco"],
  },
  sicklepod: {
    scientificName: "Senna obtusifolia",
    cropIds: ["maize", "soybeans", "groundnuts", "tobacco"],
  },
  goatweed: {
    scientificName: "Ageratum conyzoides",
    cropIds: ALL,
  },
  couch_grass: { scientificName: "Cynodon dactylon", cropIds: ALL },
  goosegrass: { scientificName: "Eleusine indica", cropIds: ALL },
  wild_oats: { scientificName: "Avena fatua", cropIds: CEREALS },
  johnson_grass: { scientificName: "Sorghum halepense", cropIds: ALL },
  itchgrass: {
    scientificName: "Rottboellia cochinchinensis",
    cropIds: ["maize", "soybeans", "groundnuts", "tobacco"],
  },
  jungle_rice: {
    scientificName: "Echinochloa colona",
    cropIds: ["maize", "soybeans", "groundnuts", "potatoes", "onions", "tobacco"],
  },
  crabgrass: {
    scientificName: "Digitaria spp.",
    cropIds: ALL,
  },
  crowfoot_grass: {
    scientificName: "Dactyloctenium aegyptium",
    cropIds: ALL,
  },
  yellow_nutsedge: {
    scientificName: "Cyperus esculentus",
    cropIds: ["maize", "soybeans", "groundnuts", "potatoes", "tobacco", "onions"],
  },
  purple_nutsedge: {
    scientificName: "Cyperus rotundus",
    cropIds: ["maize", "soybeans", "groundnuts", "potatoes", "tobacco", "onions"],
  },
  witchweed: {
    scientificName: "Striga asiatica; Striga hermonthica",
    cropIds: ["maize", "wheat", "barley"],
  },
  broomrape: {
    scientificName: "Orobanche ramosa; Orobanche cernua",
    cropIds: ["tobacco", "potatoes"],
  },
};

function cropImageMap(
  imageSrc: string,
  cropIds: string[],
  overrides?: Partial<Record<string, string>>
): Record<string, string> {
  return Object.fromEntries(
    cropIds.map((cropId) => [cropId, overrides?.[cropId] || imageSrc])
  );
}

function itemCropIds(meta: ItemMeta | undefined, fallback: string[]): string[] {
  return meta?.cropIds ? [...meta.cropIds] : [...fallback];
}

export function createInitialCatalogue(): CatalogueState {
  const diseases: DiseaseGroupEntry[] = DISEASE_CATEGORIES.map((category) => {
    const meta = DISEASE_META[category.id];
    const cropIds = meta?.cropIds ?? [...CEREALS];
    const imageSrc =
      (meta?.cropImages && Object.values(meta.cropImages)[0]) || category.imageSrc;

    return {
      id: category.id,
      label: category.label,
      description: category.description,
      scientificName: meta?.scientificName ?? "",
      symptomsDamage: meta?.symptomsDamage ?? category.description,
      active: true,
      imageSrc,
      cropIds: [...cropIds],
      cropImages: cropImageMap(imageSrc, cropIds, meta?.cropImages),
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
      active: true,
      imageSrc: category.imageSrc,
      cropIds: [...cropIds],
      items: PEST_SPECIFIC_TYPES.filter((item) => item.categoryId === category.id).map(
        (item) => {
          const itemMeta = PEST_ITEM_META[item.id];
          return {
            id: item.id,
            label: item.label,
            description: item.description,
            scientificName: itemMeta?.scientificName ?? "",
            symptomsDamage: item.description,
            active: true,
            imageSrc: item.imageSrc,
            cropIds: itemCropIds(itemMeta, cropIds),
          };
        }
      ),
    };
  });

  const weeds: NestedGroupEntry[] = WEED_CATEGORIES.map((category) => {
    const meta = WEED_GROUP_META[category.id];
    const cropIds = meta?.cropIds ?? [...ALL];

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
        (item) => {
          const itemMeta = WEED_ITEM_META[item.id];
          return {
            id: item.id,
            label: item.label,
            description: item.description,
            scientificName: itemMeta?.scientificName ?? "",
            symptomsDamage: item.description,
            active: true,
            imageSrc: item.imageSrc,
            cropIds: itemCropIds(itemMeta, cropIds),
          };
        }
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
  return [
    { id: "leaf", label: "Leaf", cropIds: [...ALL], archived: false },
    { id: "pod", label: "Pod", cropIds: [...LEGUMES], archived: false },
    { id: "stem", label: "Stem", cropIds: [...ALL], archived: false },
    { id: "roots", label: "Roots", cropIds: [...ALL], archived: false },
    {
      id: "flower",
      label: "Flower",
      cropIds: ["tobacco", "soybeans", "groundnuts", "citrus"],
      archived: false,
    },
    { id: "head", label: "Head", cropIds: ["wheat", "barley"], archived: false },
    { id: "cob", label: "Cob / tassel", cropIds: ["maize"], archived: false },
    { id: "tuber", label: "Tuber", cropIds: ["potatoes"], archived: false },
    { id: "bulb", label: "Bulb", cropIds: ["onions"], archived: false },
    { id: "fruit", label: "Fruit", cropIds: ["citrus"], archived: false },
    { id: "growing-point", label: "Growing point", cropIds: [...ALL], archived: false },
    { id: "whole-plant", label: "Whole plant", cropIds: [...ALL], archived: false },
  ];
}
