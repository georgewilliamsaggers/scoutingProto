"use client";

import { useEffect, useState } from "react";
import { CameraCaptureView } from "@/components/CameraCaptureView";
import { DiseaseDetailPage } from "@/components/DiseaseDetailPage";
import { DiseaseSymptomMatchPage } from "@/components/DiseaseSymptomMatchPage";
import {
  DiseaseObservationDetails,
  EMPTY_DISEASE_DETAILS,
  formatDiseaseSummary,
  getDiseaseCategory,
  getDiseaseSpecificType,
  ObservationMediaItem,
} from "@/lib/observations";

type DiseaseFlowStep = "symptom_match" | "detail";
type CameraPurpose = "other" | "detail";

interface DiseaseObservationFlowProps {
  open: boolean;
  commodity: string;
  onClose: () => void;
  onSave: (note: string, details: DiseaseObservationDetails) => void;
}

export function DiseaseObservationFlow({
  open,
  commodity,
  onClose,
  onSave,
}: DiseaseObservationFlowProps) {
  const [step, setStep] = useState<DiseaseFlowStep>("symptom_match");
  const [details, setDetails] = useState<DiseaseObservationDetails>(
    EMPTY_DISEASE_DETAILS
  );
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraPurpose, setCameraPurpose] = useState<CameraPurpose>("other");

  useEffect(() => {
    if (open) {
      setStep("symptom_match");
      setDetails(EMPTY_DISEASE_DETAILS);
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
    const category = getDiseaseCategory(categoryId);
    if (!category) return;

    const specificType = specificTypeId
      ? getDiseaseSpecificType(specificTypeId)
      : undefined;

    setDetails({
      ...EMPTY_DISEASE_DETAILS,
      disease: specificType?.diseaseValue ?? category.label,
      diseaseLabel: specificType?.label ?? category.label,
      diseaseImageSrc: specificType?.imageSrc ?? category.imageSrc,
      diseaseCategoryId: category.id,
      diseaseCategoryLabel: category.label,
      diseaseCategoryImageSrc: category.imageSrc,
      diseaseSpecificTypeId: specificType?.id ?? "",
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
        ...EMPTY_DISEASE_DETAILS,
        disease: "Other",
        diseaseLabel: "Disease",
        diseaseCategoryId: "other",
        diseaseCategoryLabel: "Disease",
        diseaseImageSrc: mediaItem.url,
        diseaseCategoryImageSrc: mediaItem.url,
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
    setDetails(EMPTY_DISEASE_DETAILS);
    setStep("symptom_match");
  }

  function handleSaveDetails() {
    if (details.plantLocations.length === 0) return;

    onSave(formatDiseaseSummary(details), details);
    handleClose();
  }

  return (
    <>
      {step === "symptom_match" ? (
        <DiseaseSymptomMatchPage
          onClose={handleClose}
          onSelect={handleSelectCategory}
          onNotSure={handleNotSure}
        />
      ) : (
        <DiseaseDetailPage
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
