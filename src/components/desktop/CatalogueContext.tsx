"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  allCropIds,
  CatalogueEntry,
  CatalogueState,
  createDiseaseGroup,
  createInitialCatalogue,
  createNestedGroup,
  createNestedItem,
  createPlantPart,
  DiseaseGroupEntry,
  NestedGroupEntry,
  PlantPartEntry,
  reorderItems,
} from "@/lib/catalogue";

interface CatalogueContextValue {
  catalogue: CatalogueState;
  updateDisease: (id: string, patch: Partial<DiseaseGroupEntry>) => void;
  reorderDiseases: (fromIndex: number, toIndex: number) => void;
  addDisease: () => string;
  toggleDiseaseCrop: (id: string, cropId: string, enabled: boolean) => void;
  setDiseaseCropImage: (id: string, cropId: string, imageSrc: string) => void;
  toggleDiseaseAllCrops: (id: string, enabled: boolean) => void;
  updateNestedGroup: (
    section: "pests" | "weeds",
    id: string,
    patch: Partial<NestedGroupEntry>
  ) => void;
  reorderNestedGroups: (
    section: "pests" | "weeds",
    fromIndex: number,
    toIndex: number
  ) => void;
  addNestedGroup: (section: "pests" | "weeds") => string;
  toggleNestedGroupCrop: (
    section: "pests" | "weeds",
    id: string,
    cropId: string,
    enabled: boolean
  ) => void;
  toggleNestedGroupAllCrops: (
    section: "pests" | "weeds",
    id: string,
    enabled: boolean
  ) => void;
  updateNestedItem: (
    section: "pests" | "weeds",
    groupId: string,
    itemId: string,
    patch: Partial<CatalogueEntry>
  ) => void;
  reorderNestedItems: (
    section: "pests" | "weeds",
    groupId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  addNestedItem: (section: "pests" | "weeds", groupId: string) => string;
  toggleNestedItemCrop: (
    section: "pests" | "weeds",
    groupId: string,
    itemId: string,
    cropId: string,
    enabled: boolean
  ) => void;
  toggleNestedItemAllCrops: (
    section: "pests" | "weeds",
    groupId: string,
    itemId: string,
    enabled: boolean
  ) => void;
  updatePlantPart: (id: string, patch: Partial<PlantPartEntry>) => void;
  reorderPlantParts: (fromIndex: number, toIndex: number) => void;
  addPlantPart: () => string;
  togglePlantPartArchived: (id: string) => void;
  togglePlantPartCrop: (id: string, cropId: string, enabled: boolean) => void;
  togglePlantPartAllCrops: (id: string, enabled: boolean) => void;
}

const CatalogueContext = createContext<CatalogueContextValue | null>(null);

function patchCrops(cropIds: string[], cropId: string, enabled: boolean): string[] {
  if (enabled) {
    return cropIds.includes(cropId) ? cropIds : [...cropIds, cropId];
  }
  return cropIds.filter((id) => id !== cropId);
}

export function CatalogueProvider({ children }: { children: ReactNode }) {
  const [catalogue, setCatalogue] = useState<CatalogueState>(createInitialCatalogue);

  const updateDisease = useCallback((id: string, patch: Partial<DiseaseGroupEntry>) => {
    setCatalogue((prev) => ({
      ...prev,
      diseases: prev.diseases.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  }, []);

  const reorderDiseases = useCallback((fromIndex: number, toIndex: number) => {
    setCatalogue((prev) => ({
      ...prev,
      diseases: reorderItems(prev.diseases, fromIndex, toIndex),
    }));
  }, []);

  const addDisease = useCallback(() => {
    const entry = createDiseaseGroup(Date.now());
    setCatalogue((prev) => ({ ...prev, diseases: [...prev.diseases, entry] }));
    return entry.id;
  }, []);

  const toggleDiseaseCrop = useCallback(
    (id: string, cropId: string, enabled: boolean) => {
      setCatalogue((prev) => ({
        ...prev,
        diseases: prev.diseases.map((item) => {
          if (item.id !== id) return item;
          return { ...item, cropIds: patchCrops(item.cropIds, cropId, enabled) };
        }),
      }));
    },
    []
  );

  const setDiseaseCropImage = useCallback(
    (id: string, cropId: string, imageSrc: string) => {
      setCatalogue((prev) => ({
        ...prev,
        diseases: prev.diseases.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            cropImages: { ...item.cropImages, [cropId]: imageSrc },
            imageSrc: item.imageSrc || imageSrc,
          };
        }),
      }));
    },
    []
  );

  const toggleDiseaseAllCrops = useCallback((id: string, enabled: boolean) => {
    setCatalogue((prev) => ({
      ...prev,
      diseases: prev.diseases.map((item) => {
        if (item.id !== id) return item;
        const cropIds = enabled ? allCropIds() : [];
        const cropImages = { ...item.cropImages };
        if (enabled && item.imageSrc) {
          for (const cropId of cropIds) {
            if (!cropImages[cropId]) cropImages[cropId] = item.imageSrc;
          }
        }
        return { ...item, cropIds, cropImages };
      }),
    }));
  }, []);

  const updateNestedGroup = useCallback(
    (
      section: "pests" | "weeds",
      id: string,
      patch: Partial<NestedGroupEntry>
    ) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === id ? { ...group, ...patch } : group
        ),
      }));
    },
    []
  );

  const reorderNestedGroups = useCallback(
    (section: "pests" | "weeds", fromIndex: number, toIndex: number) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: reorderItems(prev[section], fromIndex, toIndex),
      }));
    },
    []
  );

  const addNestedGroup = useCallback((section: "pests" | "weeds") => {
    const kind = section === "pests" ? "pest" : "weed";
    const group = createNestedGroup(kind, Date.now());
    setCatalogue((prev) => ({
      ...prev,
      [section]: [...prev[section], group],
    }));
    return group.id;
  }, []);

  const toggleNestedGroupCrop = useCallback(
    (section: "pests" | "weeds", id: string, cropId: string, enabled: boolean) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === id
            ? { ...group, cropIds: patchCrops(group.cropIds, cropId, enabled) }
            : group
        ),
      }));
    },
    []
  );

  const toggleNestedGroupAllCrops = useCallback(
    (section: "pests" | "weeds", id: string, enabled: boolean) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === id
            ? { ...group, cropIds: enabled ? allCropIds() : [] }
            : group
        ),
      }));
    },
    []
  );

  const updateNestedItem = useCallback(
    (
      section: "pests" | "weeds",
      groupId: string,
      itemId: string,
      patch: Partial<CatalogueEntry>
    ) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === groupId
            ? {
                ...group,
                items: group.items.map((item) =>
                  item.id === itemId ? { ...item, ...patch } : item
                ),
              }
            : group
        ),
      }));
    },
    []
  );

  const reorderNestedItems = useCallback(
    (
      section: "pests" | "weeds",
      groupId: string,
      fromIndex: number,
      toIndex: number
    ) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === groupId
            ? { ...group, items: reorderItems(group.items, fromIndex, toIndex) }
            : group
        ),
      }));
    },
    []
  );

  const addNestedItem = useCallback(
    (section: "pests" | "weeds", groupId: string) => {
      const kind = section === "pests" ? "pest" : "weed";
      const item = createNestedItem(kind, Date.now());
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === groupId
            ? { ...group, items: [...group.items, { ...item, cropIds: [...group.cropIds] }] }
            : group
        ),
      }));
      return item.id;
    },
    []
  );

  const toggleNestedItemCrop = useCallback(
    (
      section: "pests" | "weeds",
      groupId: string,
      itemId: string,
      cropId: string,
      enabled: boolean
    ) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === groupId
            ? {
                ...group,
                items: group.items.map((item) =>
                  item.id === itemId
                    ? { ...item, cropIds: patchCrops(item.cropIds, cropId, enabled) }
                    : item
                ),
              }
            : group
        ),
      }));
    },
    []
  );

  const toggleNestedItemAllCrops = useCallback(
    (
      section: "pests" | "weeds",
      groupId: string,
      itemId: string,
      enabled: boolean
    ) => {
      setCatalogue((prev) => ({
        ...prev,
        [section]: prev[section].map((group) =>
          group.id === groupId
            ? {
                ...group,
                items: group.items.map((item) =>
                  item.id === itemId
                    ? { ...item, cropIds: enabled ? allCropIds() : [] }
                    : item
                ),
              }
            : group
        ),
      }));
    },
    []
  );

  const updatePlantPart = useCallback((id: string, patch: Partial<PlantPartEntry>) => {
    setCatalogue((prev) => ({
      ...prev,
      plantParts: prev.plantParts.map((part) =>
        part.id === id ? { ...part, ...patch } : part
      ),
    }));
  }, []);

  const reorderPlantParts = useCallback((fromIndex: number, toIndex: number) => {
    setCatalogue((prev) => ({
      ...prev,
      plantParts: reorderItems(prev.plantParts, fromIndex, toIndex),
    }));
  }, []);

  const addPlantPart = useCallback(() => {
    const part = createPlantPart(Date.now());
    setCatalogue((prev) => ({
      ...prev,
      plantParts: [...prev.plantParts, part],
    }));
    return part.id;
  }, []);

  const togglePlantPartArchived = useCallback((id: string) => {
    setCatalogue((prev) => ({
      ...prev,
      plantParts: prev.plantParts.map((part) =>
        part.id === id ? { ...part, archived: !part.archived } : part
      ),
    }));
  }, []);

  const togglePlantPartCrop = useCallback(
    (id: string, cropId: string, enabled: boolean) => {
      setCatalogue((prev) => ({
        ...prev,
        plantParts: prev.plantParts.map((part) =>
          part.id === id
            ? { ...part, cropIds: patchCrops(part.cropIds, cropId, enabled) }
            : part
        ),
      }));
    },
    []
  );

  const togglePlantPartAllCrops = useCallback((id: string, enabled: boolean) => {
    setCatalogue((prev) => ({
      ...prev,
      plantParts: prev.plantParts.map((part) =>
        part.id === id ? { ...part, cropIds: enabled ? allCropIds() : [] } : part
      ),
    }));
  }, []);

  const value = useMemo(
    () => ({
      catalogue,
      updateDisease,
      reorderDiseases,
      addDisease,
      toggleDiseaseCrop,
      setDiseaseCropImage,
      toggleDiseaseAllCrops,
      updateNestedGroup,
      reorderNestedGroups,
      addNestedGroup,
      toggleNestedGroupCrop,
      toggleNestedGroupAllCrops,
      updateNestedItem,
      reorderNestedItems,
      addNestedItem,
      toggleNestedItemCrop,
      toggleNestedItemAllCrops,
      updatePlantPart,
      reorderPlantParts,
      addPlantPart,
      togglePlantPartArchived,
      togglePlantPartCrop,
      togglePlantPartAllCrops,
    }),
    [
      catalogue,
      updateDisease,
      reorderDiseases,
      addDisease,
      toggleDiseaseCrop,
      setDiseaseCropImage,
      toggleDiseaseAllCrops,
      updateNestedGroup,
      reorderNestedGroups,
      addNestedGroup,
      toggleNestedGroupCrop,
      toggleNestedGroupAllCrops,
      updateNestedItem,
      reorderNestedItems,
      addNestedItem,
      toggleNestedItemCrop,
      toggleNestedItemAllCrops,
      updatePlantPart,
      reorderPlantParts,
      addPlantPart,
      togglePlantPartArchived,
      togglePlantPartCrop,
      togglePlantPartAllCrops,
    ]
  );

  return (
    <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
  );
}

export function useCatalogue() {
  const context = useContext(CatalogueContext);
  if (!context) {
    throw new Error("useCatalogue must be used within CatalogueProvider");
  }
  return context;
}
