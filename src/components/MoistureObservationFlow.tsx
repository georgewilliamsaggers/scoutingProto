"use client";

import { useEffect, useState } from "react";
import { MoistureCheckPage } from "@/components/MoistureCheckPage";
import {
  formatMoistureSummary,
  MOISTURE_DEPTHS,
  MoistureDepthReading,
  MoistureObservationDetails,
} from "@/lib/observations";

interface MoistureObservationFlowProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: string, details: MoistureObservationDetails) => void;
}

export function MoistureObservationFlow({
  open,
  onClose,
  onSave,
}: MoistureObservationFlowProps) {
  const [activeDepthId, setActiveDepthId] = useState<string>(MOISTURE_DEPTHS[0].id);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [confirmedDepthIds, setConfirmedDepthIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setActiveDepthId(MOISTURE_DEPTHS[0].id);
      setLevels({});
      setConfirmedDepthIds([]);
    }
  }, [open]);

  if (!open) return null;

  function getLevelForDepth(depthId: string): number {
    return levels[depthId] ?? 3;
  }

  function handleLevelChange(level: number) {
    setLevels((prev) => ({ ...prev, [activeDepthId]: level }));
  }

  function handleSaveDepth() {
    const level = getLevelForDepth(activeDepthId);
    setLevels((prev) => ({ ...prev, [activeDepthId]: level }));

    const updatedConfirmed = confirmedDepthIds.includes(activeDepthId)
      ? confirmedDepthIds
      : [...confirmedDepthIds, activeDepthId];

    setConfirmedDepthIds(updatedConfirmed);

    const nextDepth = MOISTURE_DEPTHS.find(
      (depth) => !updatedConfirmed.includes(depth.id)
    );

    if (nextDepth) {
      setActiveDepthId(nextDepth.id);
    }
  }

  function handleFinish() {
    if (confirmedDepthIds.length === 0) return;

    const readings: MoistureDepthReading[] = confirmedDepthIds.map((depthId) => ({
      depthId,
      level: levels[depthId] ?? 3,
    }));

    const details: MoistureObservationDetails = { readings };
    onSave(formatMoistureSummary(details), details);
    onClose();
  }

  return (
    <MoistureCheckPage
      activeDepthId={activeDepthId}
      level={getLevelForDepth(activeDepthId)}
      confirmedDepthIds={confirmedDepthIds}
      onSelectDepth={setActiveDepthId}
      onLevelChange={handleLevelChange}
      onSaveDepth={handleSaveDepth}
      onFinish={handleFinish}
      onClose={onClose}
    />
  );
}
