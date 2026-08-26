"use client";

import { useState } from "react";
import { CatalogueSection } from "@/lib/catalogue";
import { DiseaseCatalogueEditor } from "@/components/desktop/DiseaseCatalogueEditor";
import { NestedCatalogueEditor } from "@/components/desktop/NestedCatalogueEditor";
import { PlantPartsEditor } from "@/components/desktop/PlantPartsEditor";
import { useCatalogue } from "@/components/desktop/CatalogueContext";

const TABS: { id: CatalogueSection; label: string; hint: string }[] = [
  { id: "plant-parts", label: "Plant parts", hint: "Leaf, pod, stem and which crops they belong to" },
  { id: "diseases", label: "Diseases", hint: "Groups × crops, with a photo per cell" },
  { id: "pests", label: "Pests", hint: "Groups and pests, one generic photo" },
  { id: "weeds", label: "Weeds", hint: "Groups and weeds, one generic photo" },
];

export function CatalogueConfigPage() {
  const { catalogue } = useCatalogue();
  const [section, setSection] = useState<CatalogueSection>("plant-parts");

  const counts = {
    "plant-parts": catalogue.plantParts.length,
    diseases: catalogue.diseases.length,
    pests: catalogue.pests.reduce((sum, group) => sum + group.items.length, 0),
    weeds: catalogue.weeds.reduce((sum, group) => sum + group.items.length, 0),
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          Setup
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
          Catalogue configuration
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          {catalogue.plantParts.length} plant parts · {catalogue.diseases.length} disease
          groups · {catalogue.pests.length} pest groups · {catalogue.weeds.length} weed
          groups
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TABS.map((tab) => {
          const active = tab.id === section;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={[
                "rounded-xl border px-4 py-4 text-left transition-colors",
                active
                  ? "border-[#2a8f7b] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                  : "border-stone-200 bg-white hover:border-stone-300",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{tab.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">{tab.hint}</p>
                </div>
                <span
                  className={[
                    "flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold",
                    active ? "bg-[#2a8f7b] text-white" : "bg-stone-100 text-stone-600",
                  ].join(" ")}
                >
                  {counts[tab.id]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {section === "plant-parts" && <PlantPartsEditor />}
      {section === "diseases" && <DiseaseCatalogueEditor />}
      {section === "pests" && (
        <NestedCatalogueEditor section="pests" groupNoun="Pest" itemNoun="pest" />
      )}
      {section === "weeds" && (
        <NestedCatalogueEditor section="weeds" groupNoun="Weed" itemNoun="weed" />
      )}
    </div>
  );
}
