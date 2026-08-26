"use client";

import { CATALOGUE_CROPS } from "@/lib/catalogue";
import { useCatalogue } from "@/components/desktop/CatalogueContext";
import {
  AddButton,
  AllCropsCheckbox,
  AllCropsHeaderCell,
  CropHeaderCells,
  DragHandle,
  SectionCard,
  useRowDrag,
} from "@/components/desktop/CatalogueUi";

export function PlantPartsEditor() {
  const {
    catalogue,
    updatePlantPart,
    reorderPlantParts,
    addPlantPart,
    togglePlantPartArchived,
    togglePlantPartCrop,
    togglePlantPartAllCrops,
  } = useCatalogue();
  const drag = useRowDrag(reorderPlantParts);

  return (
    <SectionCard
      title="Plant parts"
      subtitle="Add parts such as leaf, pod or stem, then tick which crops they belong to."
      action={<AddButton onClick={addPlantPart}>Add plant part</AddButton>}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-stone-50">
              <th className="sticky left-0 z-10 min-w-[240px] border-b border-stone-200 bg-stone-50 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                Plant part
              </th>
              <AllCropsHeaderCell />
              <CropHeaderCells />
            </tr>
          </thead>
          <tbody>
            {catalogue.plantParts.map((part, index) => (
              <tr
                key={part.id}
                draggable={!part.archived}
                onDragStart={(event) => {
                  if (
                    part.archived ||
                    (event.target as HTMLElement).closest("input, button")
                  ) {
                    event.preventDefault();
                    return;
                  }
                  drag.onDragStart(index)(event);
                }}
                onDragOver={drag.onDragOver(index)}
                onDragEnd={drag.onDragEnd}
                className={[
                  "align-middle",
                  part.archived ? "bg-stone-100" : "hover:bg-stone-50",
                ].join(" ")}
              >
                <td
                  className={[
                    "sticky left-0 border-b border-stone-100 px-3 py-2.5",
                    part.archived ? "bg-stone-100" : "bg-white",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex items-center gap-3",
                      part.archived ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <DragHandle />
                    <input
                      type="text"
                      value={part.label}
                      disabled={part.archived}
                      onChange={(event) =>
                        updatePlantPart(part.id, { label: event.target.value })
                      }
                      placeholder="e.g. Leaf"
                      className={[
                        "h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm font-medium outline-none transition-colors placeholder:text-stone-400",
                        part.archived
                          ? "border-stone-200 bg-stone-100 text-stone-400"
                          : "border-stone-200 bg-white text-stone-800 focus:border-[#2a8f7b] focus:ring-2 focus:ring-[#2a8f7b]/15",
                      ].join(" ")}
                    />
                    {part.archived && (
                      <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                        Archived
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => togglePlantPartArchived(part.id)}
                      className="inline-flex h-7 shrink-0 items-center rounded-md border border-stone-200 bg-white px-2 text-[11px] font-semibold text-stone-600 hover:border-stone-300 hover:text-stone-800"
                    >
                      {part.archived ? "Unarchive" : "Archive"}
                    </button>
                  </div>
                </td>
                <td
                  className={[
                    "border-b border-stone-100 px-3 py-2.5 text-center",
                    part.archived ? "bg-stone-100 opacity-50" : "",
                  ].join(" ")}
                >
                  <AllCropsCheckbox
                    cropIds={part.cropIds}
                    disabled={part.archived}
                    onToggleAll={(enabled) =>
                      togglePlantPartAllCrops(part.id, enabled)
                    }
                    label={`Show ${part.label || "plant part"} on all crops`}
                  />
                </td>
                {CATALOGUE_CROPS.map((crop) => (
                  <td
                    key={crop.id}
                    className={[
                      "border-b border-stone-100 px-3 py-2.5 text-center",
                      part.archived ? "bg-stone-100 opacity-50" : "",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={part.cropIds.includes(crop.id)}
                      disabled={part.archived}
                      onChange={(event) =>
                        togglePlantPartCrop(part.id, crop.id, event.target.checked)
                      }
                      className="h-4 w-4 rounded border-stone-300 accent-[#2a8f7b] disabled:cursor-not-allowed"
                      aria-label={`${part.label || "Plant part"} on ${crop.label}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        Type the part name in the row. Archive greys a part out without deleting it.
      </p>
    </SectionCard>
  );
}
