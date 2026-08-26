"use client";

import { MutableRefObject, useRef, useState } from "react";
import { CATALOGUE_CROPS, NestedGroupEntry } from "@/lib/catalogue";
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
  PlusButton,
  SectionCard,
  useRowDrag,
} from "@/components/desktop/CatalogueUi";

export function NestedCatalogueEditor({
  section,
  groupNoun,
  itemNoun,
}: {
  section: "pests" | "weeds";
  groupNoun: string;
  itemNoun: string;
}) {
  const {
    catalogue,
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
  } = useCatalogue();

  const groups = catalogue[section];
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(groups[0] ? [groups[0].id] : [])
  );
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{
    groupId: string;
    itemId: string;
  } | null>(null);

  const dragKind = useRef<"group" | "item" | null>(null);
  const itemDragGroupId = useRef<string | null>(null);

  const editingGroup = groups.find((group) => group.id === editingGroupId);
  const editingItemGroup = groups.find((group) => group.id === editingItem?.groupId);
  const editingItemEntry = editingItemGroup?.items.find(
    (item) => item.id === editingItem?.itemId
  );

  const groupDrag = useRowDrag((from, to) => {
    if (dragKind.current !== "group") return;
    reorderNestedGroups(section, from, to);
  });

  const itemDrag = useRowDrag((from, to) => {
    if (dragKind.current !== "item" || !itemDragGroupId.current) return;
    reorderNestedItems(section, itemDragGroupId.current, from, to);
  });

  function isExpanded(id: string) {
    return expandedIds.has(id);
  }

  function toggleExpanded(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandGroup(id: string) {
    setExpandedIds((current) => new Set(current).add(id));
  }

  function handleAddGroup() {
    const id = addNestedGroup(section);
    expandGroup(id);
    setEditingGroupId(id);
  }

  function handleAddItem(groupId: string) {
    const id = addNestedItem(section, groupId);
    expandGroup(groupId);
    setEditingItem({ groupId, itemId: id });
  }

  const query = search.trim();
  const visibleGroups = groups
    .map((group, groupIndex) => {
      const groupMatches = matchesCatalogueQuery(
        query,
        group.label,
        group.description,
        group.scientificName,
        group.symptomsDamage
      );
      const matchingItemIds = group.items
        .filter((item) =>
          matchesCatalogueQuery(
            query,
            item.label,
            item.description,
            item.scientificName,
            item.symptomsDamage
          )
        )
        .map((item) => item.id);

      return {
        group,
        groupIndex,
        groupMatches,
        matchingItemIds,
        visible: !query || groupMatches || matchingItemIds.length > 0,
      };
    })
    .filter((entry) => entry.visible);

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title={`${groupNoun} groups`}
        subtitle={`Expand a group to see its ${itemNoun}s indented underneath. One generic image per row — not per crop.`}
        action={
          <>
            <CatalogueSearch
              value={search}
              onChange={setSearch}
              placeholder={`Search ${itemNoun}s`}
            />
            <AddButton onClick={handleAddGroup}>Add {groupNoun} group</AddButton>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-stone-50">
                <th className="sticky left-0 z-10 min-w-[320px] border-b border-stone-200 bg-stone-50 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
                  Group / {itemNoun}
                </th>
                <AllCropsHeaderCell />
                <CropHeaderCells />
              </tr>
            </thead>
            <tbody>
              {visibleGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={CATALOGUE_CROPS.length + 2}
                    className="px-3 py-8 text-center text-sm text-stone-500"
                  >
                    No {itemNoun}s match “{query}”.
                  </td>
                </tr>
              ) : (
                visibleGroups.map(
                  ({ group, groupIndex, groupMatches, matchingItemIds }) => {
                    const expanded = Boolean(query) || isExpanded(group.id);

                    return (
                      <GroupRows
                        key={group.id}
                        group={group}
                        groupIndex={groupIndex}
                        expanded={expanded}
                        itemNoun={itemNoun}
                        visibleItemIds={
                          query && !groupMatches ? matchingItemIds : null
                        }
                        dragKind={dragKind}
                    itemDragGroupId={itemDragGroupId}
                    groupDrag={groupDrag}
                    itemDrag={itemDrag}
                    onToggleExpanded={() => toggleExpanded(group.id)}
                    onEditGroup={() => setEditingGroupId(group.id)}
                    onAddItem={() => handleAddItem(group.id)}
                    onEditItem={(itemId) =>
                      setEditingItem({ groupId: group.id, itemId })
                    }
                    onToggleGroupCrop={(cropId, enabled) =>
                      toggleNestedGroupCrop(section, group.id, cropId, enabled)
                    }
                    onToggleItemCrop={(itemId, cropId, enabled) =>
                      toggleNestedItemCrop(section, group.id, itemId, cropId, enabled)
                    }
                    onToggleGroupAll={(enabled) =>
                      toggleNestedGroupAllCrops(section, group.id, enabled)
                    }
                    onToggleItemAll={(itemId, enabled) =>
                      toggleNestedItemAllCrops(section, group.id, itemId, enabled)
                    }
                    onGroupImage={(imageSrc) =>
                      updateNestedGroup(section, group.id, { imageSrc })
                    }
                    onItemImage={(itemId, imageSrc) =>
                      updateNestedItem(section, group.id, itemId, { imageSrc })
                    }
                      />
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-500">
          Use the chevron to expand or collapse. Drag within a group to reorder{" "}
          {itemNoun}s.
        </p>
      </SectionCard>

      <EditDialog
        open={Boolean(editingGroup)}
        title={editingGroup?.label || `Edit ${itemNoun} group`}
        subtitle="Group details. Active hides the whole group from scouting."
        active={editingGroup?.active}
        onActiveChange={(active) => {
          if (editingGroup) {
            updateNestedGroup(section, editingGroup.id, { active });
          }
        }}
        onClose={() => setEditingGroupId(null)}
      >
        {editingGroup && (
          <EntryFields
            showImage
            entry={editingGroup}
            onChange={(patch) => updateNestedGroup(section, editingGroup.id, patch)}
          />
        )}
      </EditDialog>

      <EditDialog
        open={Boolean(editingItemEntry)}
        title={editingItemEntry?.label || `Edit ${itemNoun}`}
        subtitle={`Details for this ${itemNoun}. Active hides it everywhere, even if crop boxes are ticked.`}
        active={editingItemEntry?.active}
        onActiveChange={(active) => {
          if (editingItem && editingItemEntry) {
            updateNestedItem(section, editingItem.groupId, editingItem.itemId, {
              active,
            });
          }
        }}
        onClose={() => setEditingItem(null)}
      >
        {editingItem && editingItemEntry && (
          <EntryFields
            showImage
            entry={editingItemEntry}
            onChange={(patch) =>
              updateNestedItem(
                section,
                editingItem.groupId,
                editingItem.itemId,
                patch
              )
            }
          />
        )}
      </EditDialog>
    </div>
  );
}

function GroupRows({
  group,
  groupIndex,
  expanded,
  itemNoun,
  visibleItemIds,
  dragKind,
  itemDragGroupId,
  groupDrag,
  itemDrag,
  onToggleExpanded,
  onEditGroup,
  onAddItem,
  onEditItem,
  onToggleGroupCrop,
  onToggleItemCrop,
  onToggleGroupAll,
  onToggleItemAll,
  onGroupImage,
  onItemImage,
}: {
  group: NestedGroupEntry;
  groupIndex: number;
  expanded: boolean;
  itemNoun: string;
  visibleItemIds: string[] | null;
  dragKind: MutableRefObject<"group" | "item" | null>;
  itemDragGroupId: MutableRefObject<string | null>;
  groupDrag: ReturnType<typeof useRowDrag>;
  itemDrag: ReturnType<typeof useRowDrag>;
  onToggleExpanded: () => void;
  onEditGroup: () => void;
  onAddItem: () => void;
  onEditItem: (itemId: string) => void;
  onToggleGroupCrop: (cropId: string, enabled: boolean) => void;
  onToggleItemCrop: (itemId: string, cropId: string, enabled: boolean) => void;
  onToggleGroupAll: (enabled: boolean) => void;
  onToggleItemAll: (itemId: string, enabled: boolean) => void;
  onGroupImage: (imageSrc: string) => void;
  onItemImage: (itemId: string, imageSrc: string) => void;
}) {
  const items = group.items
    .map((item, itemIndex) => ({ item, itemIndex }))
    .filter(({ item }) => !visibleItemIds || visibleItemIds.includes(item.id));

  return (
    <>
      <tr
        draggable
        onDragStart={(event) => {
          dragKind.current = "group";
          groupDrag.onDragStart(groupIndex)(event);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (dragKind.current !== "group") return;
          groupDrag.onDragOver(groupIndex)(event);
        }}
        onDragEnd={groupDrag.onDragEnd}
        className="align-top hover:bg-stone-50"
      >
        <td className="sticky left-0 border-b border-stone-100 bg-white px-3 py-3">
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={onToggleExpanded}
              aria-expanded={expanded}
              aria-label={`${expanded ? "Collapse" : "Expand"} ${group.label}`}
              className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            >
              <ChevronIcon open={expanded} />
            </button>
            <div className="mt-1">
              <DragHandle />
            </div>
            <ImagePicker compact src={group.imageSrc} onChange={onGroupImage} />
            <LineItemCopy
              label={group.label}
              description={group.description}
              active={group.active}
              meta={`${group.items.length} ${itemNoun}${group.items.length === 1 ? "" : "s"}`}
            />
            <PlusButton
              label={`Add ${itemNoun} to ${group.label}`}
              onClick={onAddItem}
            />
            <PenButton onClick={onEditGroup} />
          </div>
        </td>
        <td className="border-b border-stone-100 px-3 py-3 text-center">
          <AllCropsCheckbox
            cropIds={group.cropIds}
            onToggleAll={onToggleGroupAll}
            label={`Show ${group.label} on all crops`}
          />
        </td>
        {CATALOGUE_CROPS.map((crop) => (
          <td key={crop.id} className="border-b border-stone-100 px-3 py-3 text-center">
            <input
              type="checkbox"
              checked={group.cropIds.includes(crop.id)}
              onChange={(event) =>
                onToggleGroupCrop(crop.id, event.target.checked)
              }
              className="h-4 w-4 rounded border-stone-300 accent-[#2a8f7b]"
              aria-label={`Show ${group.label} on ${crop.label}`}
            />
          </td>
        ))}
      </tr>

      {expanded && items.length === 0 && (
        <tr>
          <td
            colSpan={CATALOGUE_CROPS.length + 2}
            className="border-b border-stone-100 bg-stone-50/70 px-3 py-3 pl-14 text-sm text-stone-500"
          >
            No {itemNoun}s in this group yet.
          </td>
        </tr>
      )}

      {expanded &&
        items.map(({ item, itemIndex }) => (
          <tr
            key={item.id}
            draggable
            onDragStart={(event) => {
              dragKind.current = "item";
              itemDragGroupId.current = group.id;
              itemDrag.onDragStart(itemIndex)(event);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (dragKind.current !== "item" || itemDragGroupId.current !== group.id) {
                return;
              }
              itemDrag.onDragOver(itemIndex)(event);
            }}
            onDragEnd={itemDrag.onDragEnd}
            className="align-top hover:bg-stone-50"
          >
            <td className="sticky left-0 border-b border-stone-100 bg-[#f7f8f8] px-3 py-2.5">
              <div className="flex items-start gap-2 pl-8">
                <span className="mt-2 h-6 w-px shrink-0 bg-stone-300" aria-hidden="true" />
                <div className="mt-1">
                  <DragHandle />
                </div>
                <ImagePicker
                  compact
                  src={item.imageSrc}
                  onChange={(imageSrc) => onItemImage(item.id, imageSrc)}
                />
                <LineItemCopy
                  label={item.label}
                  description={item.description}
                  active={item.active}
                  meta={item.scientificName}
                />
                <PenButton onClick={() => onEditItem(item.id)} />
              </div>
            </td>
            <td className="border-b border-stone-100 bg-[#fafafa] px-3 py-2.5 text-center">
              <AllCropsCheckbox
                cropIds={item.cropIds}
                onToggleAll={(enabled) => onToggleItemAll(item.id, enabled)}
                label={`Show ${item.label} on all crops`}
              />
            </td>
            {CATALOGUE_CROPS.map((crop) => (
              <td
                key={crop.id}
                className="border-b border-stone-100 bg-[#fafafa] px-3 py-2.5 text-center"
              >
                <input
                  type="checkbox"
                  checked={item.cropIds.includes(crop.id)}
                  onChange={(event) =>
                    onToggleItemCrop(item.id, crop.id, event.target.checked)
                  }
                  className="h-4 w-4 rounded border-stone-300 accent-[#2a8f7b]"
                  aria-label={`Show ${item.label} on ${crop.label}`}
                />
              </td>
            ))}
          </tr>
        ))}
    </>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={["transition-transform", open ? "rotate-90" : ""].join(" ")}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
