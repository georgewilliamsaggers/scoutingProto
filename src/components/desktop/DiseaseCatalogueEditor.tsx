"use client";

import { useState } from "react";
import { CATALOGUE_CROPS } from "@/lib/catalogue";
import { useCatalogue } from "@/components/desktop/CatalogueContext";
import {
  AddButton,
  AllCropsCheckbox,
  AllCropsHeaderCell,
  CatalogueSearch,
  CropHeaderCells,
  DragHandle,
  EditDialog,
  EntryFields,
  ImagePicker,
  LineItemCopy,
  matchesCatalogueQuery,
  PenButton,
  SectionCard,
  useRowDrag,
} from "@/components/desktop/CatalogueUi";

export function DiseaseCatalogueEditor() {
  const {
    catalogue,
    updateDisease,
    reorderDiseases,
    addDisease,
    toggleDiseaseCrop,
    setDiseaseCropImage,
    toggleDiseaseAllCrops,
  } = useCatalogue();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const editing = catalogue.diseases.find((item) => item.id === editingId);
  const drag = useRowDrag(reorderDiseases);
  const visibleDiseases = catalogue.diseases
    .map((group, index) => ({ group, index }))
    .filter(({ group }) =>
      matchesCatalogueQuery(
        search,
        group.label,
        group.description,
        group.scientificName,
        group.symptomsDamage
      )
    );

  function handleAdd() {
    setEditingId(addDisease());
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Disease groups"
        subtitle="Rows are groups. Crops run along the top. Add a crop image and tick whether the group appears for that crop."
        action={
          <>
            <CatalogueSearch
              value={search}
              onChange={setSearch}
              placeholder="Search disease groups"
            />
            <AddButton onClick={handleAdd}>Add disease group</AddButton>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-stone-50">
                <th className="sticky left-0 z-10 min-w-[280px] border-b border-stone-200 bg-stone-50 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                  Disease group
                </th>
                <AllCropsHeaderCell />
                <CropHeaderCells />
              </tr>
            </thead>
            <tbody>
              {visibleDiseases.length === 0 ? (
                <tr>
                  <td
                    colSpan={CATALOGUE_CROPS.length + 2}
                    className="px-3 py-8 text-center text-sm text-stone-500"
                  >
                    No disease groups match “{search.trim()}”.
                  </td>
                </tr>
              ) : (
                visibleDiseases.map(({ group, index }) => (
                <tr
                  key={group.id}
                  draggable
                  onDragStart={drag.onDragStart(index)}
                  onDragOver={drag.onDragOver(index)}
                  onDragEnd={drag.onDragEnd}
                  className="align-top hover:bg-stone-50"
                >
                  <td className="sticky left-0 border-b border-stone-100 bg-white px-3 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <DragHandle />
                      </div>
                      <LineItemCopy
                        label={group.label}
                        description={group.description}
                        active={group.active}
                        meta={group.scientificName}
                      />
                      <PenButton onClick={() => setEditingId(group.id)} />
                    </div>
                  </td>
                  <td className="border-b border-stone-100 px-3 py-3 text-center">
                    <AllCropsCheckbox
                      cropIds={group.cropIds}
                      onToggleAll={(enabled) =>
                        toggleDiseaseAllCrops(group.id, enabled)
                      }
                      label={`Show ${group.label} on all crops`}
                    />
                  </td>
                  {CATALOGUE_CROPS.map((crop) => {
                    const enabled = group.cropIds.includes(crop.id);
                    const imageSrc = group.cropImages[crop.id] ?? "";

                    return (
                      <td key={crop.id} className="border-b border-stone-100 px-3 py-3">
                        <div className="flex flex-col items-center gap-2">
                          <ImagePicker
                            compact
                            src={imageSrc}
                            onChange={(src) =>
                              setDiseaseCropImage(group.id, crop.id, src)
                            }
                          />
                          <label className="flex items-center gap-1.5 text-[11px] text-stone-600">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(event) =>
                                toggleDiseaseCrop(
                                  group.id,
                                  crop.id,
                                  event.target.checked
                                )
                              }
                              className="h-3.5 w-3.5 rounded border-stone-300 text-[#2a8f7b] accent-[#2a8f7b]"
                            />
                            Show
                          </label>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-500">
          Drag the handle to change order. Use the pen to edit details. All selects or
          clears every crop.
        </p>
      </SectionCard>

      <EditDialog
        open={Boolean(editing)}
        title={editing?.label || "Edit disease"}
        subtitle="Active hides this group from every crop even if boxes are ticked."
        active={editing?.active}
        onActiveChange={(active) => {
          if (editing) updateDisease(editing.id, { active });
        }}
        onClose={() => setEditingId(null)}
      >
        {editing && (
          <EntryFields
            entry={editing}
            onChange={(patch) => updateDisease(editing.id, patch)}
          />
        )}
      </EditDialog>
    </div>
  );
}
