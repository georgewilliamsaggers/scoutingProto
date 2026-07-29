"use client";

import { useEffect, useState } from "react";
import { CameraCaptureView } from "@/components/CameraCaptureView";
import { WeedDetailPage } from "@/components/WeedDetailPage";
import { WeedSymptomMatchPage } from "@/components/WeedSymptomMatchPage";
import {
  EMPTY_WEED_DETAILS,
  formatWeedSummary,
  getWeedCategory,
  ObservationMediaItem,
  WeedObservationDetails,
} from "@/lib/observations";

type WeedFlowStep = "category_match" | "detail";
type CameraPurpose = "other" | "detail";

interface WeedObservationFlowProps {
  open: boolean;
  commodity: string;
  onClose: () => void;
  onSave: (note: string, details: WeedObservationDetails) => void;
}

export function WeedObservationFlow({
  open,
  commodity,
  onClose,
  onSave,
}: WeedObservationFlowProps) {
  const [step, setStep] = useState<WeedFlowStep>("category_match");
  const [details, setDetails] = useState<WeedObservationDetails>(EMPTY_WEED_DETAILS);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraPurpose, setCameraPurpose] = useState<CameraPurpose>("other");

  useEffect(() => {
    if (open) {
      setStep("category_match");
      setDetails(EMPTY_WEED_DETAILS);
      setCameraOpen(false);
      setCameraPurpose("other");
    }
  }, [open]);

  if (!open) return null;

  function handleClose() {
    details.media.forEach((item) => URL.revokeObjectURL(item.url));
    onClose();
  }

  function handleSelectCategory(categoryId: string) {
    const category = getWeedCategory(categoryId);
    if (!category) return;

    setDetails({
      ...EMPTY_WEED_DETAILS,
      weed: category.label,
      weedLabel: category.label,
      weedImageSrc: category.imageSrc,
      weedCategoryId: category.id,
      weedCategoryLabel: category.label,
      weedCategoryImageSrc: category.imageSrc,
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
        ...EMPTY_WEED_DETAILS,
        weed: "Other",
        weedLabel: "Weed",
        weedCategoryId: "other",
        weedCategoryLabel: "Weed",
        weedImageSrc: mediaItem.url,
        weedCategoryImageSrc: mediaItem.url,
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

  function handleBackToCategoryMatch() {
    details.media.forEach((item) => URL.revokeObjectURL(item.url));
    setDetails(EMPTY_WEED_DETAILS);
    setStep("category_match");
  }

  function handleSaveDetails() {
    if (!details.weedCategoryId) return;

    onSave(formatWeedSummary(details), details);
    handleClose();
  }

  return (
    <>
      {step === "category_match" ? (
        <WeedSymptomMatchPage
          onClose={handleClose}
          onSelect={handleSelectCategory}
          onNotSure={handleNotSure}
        />
      ) : (
        <WeedDetailPage
          commodity={commodity}
          details={details}
          onChange={setDetails}
          onBack={handleBackToCategoryMatch}
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
