"use client";

import { useEffect, useState } from "react";
import { CameraCaptureView } from "@/components/CameraCaptureView";
import { PestDetailPage } from "@/components/PestDetailPage";
import { PestSymptomMatchPage } from "@/components/PestSymptomMatchPage";
import {
  EMPTY_PEST_DETAILS,
  formatPestSummary,
  getPestCategory,
  getPestSpecificType,
  ObservationMediaItem,
  PestObservationDetails,
} from "@/lib/observations";

type PestFlowStep = "symptom_match" | "detail";
type CameraPurpose = "other" | "detail";

interface PestObservationFlowProps {
  open: boolean;
  commodity: string;
  onClose: () => void;
  onSave: (note: string, details: PestObservationDetails) => void;
}

export function PestObservationFlow({
  open,
  commodity,
  onClose,
  onSave,
}: PestObservationFlowProps) {
  const [step, setStep] = useState<PestFlowStep>("symptom_match");
  const [details, setDetails] = useState<PestObservationDetails>(EMPTY_PEST_DETAILS);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraPurpose, setCameraPurpose] = useState<CameraPurpose>("other");

  useEffect(() => {
    if (open) {
      setStep("symptom_match");
      setDetails(EMPTY_PEST_DETAILS);
      setCameraOpen(false);
      setCameraPurpose("other");
    }
  }, [open]);

  if (!open) return null;

  function handleClose() {
    details.media.forEach((item) => URL.revokeObjectURL(item.url));
    onClose();
  }

  function handleSelectCategory(categoryId: string, specificTypeId?: string) {
    const category = getPestCategory(categoryId);
    if (!category) return;

    const specificType = specificTypeId
      ? getPestSpecificType(specificTypeId)
      : undefined;

    setDetails({
      ...EMPTY_PEST_DETAILS,
      pest: specificType?.label ?? category.label,
      pestLabel: specificType?.label ?? category.label,
      pestImageSrc: specificType?.imageSrc ?? category.imageSrc,
      pestCategoryId: category.id,
      pestCategoryLabel: category.label,
      pestCategoryImageSrc: category.imageSrc,
      pestSpecificTypeId: specificType?.id ?? "",
    });
    setStep("detail");
  }

  function handleNotSure() {
    setCameraPurpose("other");
    setCameraOpen(true);
  }

  function handleDetailCamera() {
    setCameraPurpose("detail");
    setCameraOpen(true);
  }

  function handleCameraCapture(item: Omit<ObservationMediaItem, "id">) {
    const mediaItem: ObservationMediaItem = {
      ...item,
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };

    if (cameraPurpose === "other") {
      setDetails({
        ...EMPTY_PEST_DETAILS,
        pest: "Other",
        pestLabel: "Pest",
        pestCategoryId: "other",
        pestCategoryLabel: "Pest",
        pestImageSrc: mediaItem.url,
        pestCategoryImageSrc: mediaItem.url,
        media: [mediaItem],
      });
      setStep("detail");
      setCameraOpen(false);
      return;
    }

    if (cameraPurpose === "detail") {
      setDetails((prev) => ({
        ...prev,
        media: [...prev.media, mediaItem],
      }));
      setCameraOpen(false);
    }
  }

  function handleBackToSymptomMatch() {
    details.media.forEach((item) => URL.revokeObjectURL(item.url));
    setDetails(EMPTY_PEST_DETAILS);
    setStep("symptom_match");
  }

  function handleSaveDetails() {
    if (details.infectedParts.length === 0) return;

    onSave(formatPestSummary(details), details);
    handleClose();
  }

  return (
    <>
      {step === "symptom_match" ? (
        <PestSymptomMatchPage
          onClose={handleClose}
          onSelect={handleSelectCategory}
          onNotSure={handleNotSure}
        />
      ) : (
        <PestDetailPage
          commodity={commodity}
          details={details}
          onChange={setDetails}
          onBack={handleBackToSymptomMatch}
          onOpenCamera={handleDetailCamera}
          onSave={handleSaveDetails}
        />
      )}

      <CameraCaptureView
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
}
