"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { HoldToRecordVoiceNote } from "@/components/HoldToRecordVoiceNote";
import {
  formatMediaUploadTime,
  getWeedDisplayName,
  getWeedSpecificType,
  getWeedSpecificTypesForCategory,
  ObservationMediaItem,
  WEED_DENSITY_OPTIONS,
  WEED_SIZE_OPTIONS,
  WeedObservationDetails,
} from "@/lib/observations";

interface WeedDetailPageProps {
  commodity: string;
  details: WeedObservationDetails;
  onChange: (details: WeedObservationDetails) => void;
  onBack: () => void;
  onOpenCamera: () => void;
  onSave: () => void;
}

export function WeedDetailPage({
  commodity,
  details,
  onChange,
  onBack,
  onOpenCamera,
  onSave,
}: WeedDetailPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const canSave = Boolean(details.weedCategoryId);

  const collapseDistance = 96;
  const collapse = Math.min(scrollTop / collapseDistance, 1);
  const imageSize = 64 - collapse * 36;
  const flagSize = 40 - collapse * 8;
  const titleSize = 20 - collapse * 4;
  const backSpacing = 16 - collapse * 12;
  const headerSpacing = 24 - collapse * 24;
  const showMeta = collapse < 0.45;
  const showSpecificSubtitle = collapse < 0.3;

  function updateField<K extends keyof WeedObservationDetails>(
    key: K,
    value: WeedObservationDetails[K]
  ) {
    onChange({ ...details, [key]: value });
  }

  function toggleSpecificType(typeId: string) {
    const specificType = getWeedSpecificType(typeId);
    if (!specificType) return;

    if (details.weedSpecificTypeId === typeId) {
      onChange({
        ...details,
        weedSpecificTypeId: "",
        weedLabel: details.weedCategoryLabel,
        weed: details.weedCategoryLabel,
        weedImageSrc: details.weedCategoryImageSrc,
      });
      return;
    }

    onChange({
      ...details,
      weedSpecificTypeId: typeId,
      weedLabel: specificType.label,
      weed: specificType.weedValue,
      weedImageSrc: specificType.imageSrc,
    });
  }

  const specificTypes = getWeedSpecificTypesForCategory(details.weedCategoryId);
  const isOtherFlow = details.weedCategoryId === "other";
  const selectedSpecificType = details.weedSpecificTypeId
    ? getWeedSpecificType(details.weedSpecificTypeId)
    : undefined;
  const headerTitle = getWeedDisplayName(details);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface-elevated">
      <div
        className={[
          "shrink-0 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] transition-[border-color,padding]",
          collapse > 0.05 ? "border-b border-border/60" : "border-b border-transparent",
        ].join(" ")}
        style={{ paddingBottom: `${8 + (1 - collapse) * 8}px` }}
      >
        <div style={{ marginBottom: `${backSpacing}px` }}>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-sm font-semibold text-navy transition-colors active:text-teal"
          >
            <ChevronLeftIcon />
            Back
          </button>
        </div>

        <div
          className="flex items-center gap-3"
          style={{ marginBottom: `${headerSpacing}px` }}
        >
          <div
            className="relative shrink-0 overflow-hidden rounded-xl border border-border/60 bg-surface transition-[width,height,border-radius]"
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              borderRadius: `${12 - collapse * 4}px`,
            }}
          >
            {details.weedImageSrc ? (
              details.weedImageSrc.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={details.weedImageSrc}
                  alt={headerTitle}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={details.weedImageSrc}
                  alt={headerTitle}
                  fill
                  unoptimized={details.weedImageSrc.endsWith(".svg")}
                  className="object-cover"
                  sizes="64px"
                />
              )
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            {showMeta && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                {commodity} weed
              </p>
            )}
            <p
              className="truncate font-bold leading-tight text-navy"
              style={{ fontSize: `${titleSize}px` }}
            >
              {headerTitle}
            </p>
            {!isOtherFlow && selectedSpecificType && showSpecificSubtitle && (
              <p className="truncate text-sm font-semibold text-teal">
                {selectedSpecificType.label}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              updateField("flaggedForFollowUp", !details.flaggedForFollowUp)
            }
            aria-label={
              details.flaggedForFollowUp
                ? "Remove follow up flag"
                : "Flag for follow up"
            }
            aria-pressed={details.flaggedForFollowUp}
            className={[
              "flex shrink-0 items-center justify-center rounded-full transition-colors",
              details.flaggedForFollowUp
                ? "bg-amber-100 text-amber-700"
                : "text-muted hover:bg-surface hover:text-navy",
            ].join(" ")}
            style={{ width: `${flagSize}px`, height: `${flagSize}px` }}
          >
            <FlagIcon filled={details.flaggedForFollowUp} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={() => setScrollTop(scrollRef.current?.scrollTop ?? 0)}
        className="flex-1 overflow-y-auto px-5 pb-4"
      >
        {isOtherFlow ? (
          <section className="mb-8">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Weed name
            </p>
            <h2 className="mb-1 text-lg font-bold text-navy">What did you find?</h2>
            <p className="mb-4 text-sm text-muted">
              Optional — leave blank if you are not sure
            </p>
            <input
              type="text"
              value={details.weedOther}
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  ...details,
                  weedOther: value,
                  weedLabel: value.trim() || "Weed",
                });
              }}
              placeholder="Enter weed name…"
              className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20"
            />
          </section>
        ) : (
          specificTypes.length > 0 && (
            <section className="mb-8">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Specific type
              </p>
              <h2 className="mb-1 text-lg font-bold text-navy">
                Which {details.weedCategoryLabel.toLowerCase()} is it?
              </h2>
              <p className="mb-4 text-sm text-muted">Optional — select if you can identify it</p>

              <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {specificTypes.map((type) => {
                  const selected = details.weedSpecificTypeId === type.id;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleSpecificType(type.id)}
                      aria-pressed={selected}
                      className={[
                        "w-[9.5rem] shrink-0 overflow-hidden rounded-2xl border text-left transition-all active:scale-[0.98]",
                        selected
                          ? "border-lime bg-lime/5 ring-2 ring-lime/30"
                          : "border-border/80 bg-surface-elevated",
                      ].join(" ")}
                    >
                      <div className="relative aspect-[4/3] w-full bg-surface">
                        <Image
                          src={type.imageSrc}
                          alt={type.label}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="152px"
                        />
                      </div>
                      <div className="px-2.5 py-2">
                        <p className="text-xs font-bold leading-tight text-navy">{type.label}</p>
                        <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-muted">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )
        )}

        <WeedScaleSection
          title="Size"
          question="How developed is it?"
          value={details.sizeScale}
          options={WEED_SIZE_OPTIONS}
          variant="size"
          onChange={(value) => updateField("sizeScale", value)}
        />

        <WeedScaleSection
          title="Density"
          question="How many are here?"
          value={details.densityScale}
          options={WEED_DENSITY_OPTIONS}
          variant="density"
          onChange={(value) => updateField("densityScale", value)}
        />

        <section className="mb-8">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Photos
          </p>
          <h2 className="mb-4 text-lg font-bold text-navy">Add supporting images</h2>
          <ObservationMediaSection
            media={details.media}
            onMediaChange={(media) => updateField("media", media)}
            onOpenCamera={onOpenCamera}
          />
        </section>

        <section className="mb-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Notes
          </p>
          <h2 className="mb-4 text-lg font-bold text-navy">Anything else to add?</h2>
          <textarea
            value={details.otherNotes}
            onChange={(e) => updateField("otherNotes", e.target.value)}
            rows={4}
            placeholder="Add any additional observations…"
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20"
          />
          <HoldToRecordVoiceNote
            value={details.voiceNote}
            onChange={(voiceNote) => updateField("voiceNote", voiceNote)}
          />
        </section>
      </div>

      <div className="shrink-0 border-t border-border/60 px-5 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold text-white shadow-lg shadow-lime/25 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Save observation
        </button>
      </div>
    </div>
  );
}

type ScaleOption = { label: string; subtitle: string };

function WeedScaleSection({
  title,
  question,
  value,
  options,
  variant,
  onChange,
}: {
  title: string;
  question: string;
  value: number;
  options: readonly ScaleOption[];
  variant: "size" | "density";
  onChange: (value: number) => void;
}) {
  const clampedValue = Math.min(5, Math.max(1, value));
  const selected = options[clampedValue - 1] ?? options[2];
  const fillPercent = ((clampedValue - 1) / 4) * 100;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {title}
          </p>
          <h2 className="mt-1 text-lg font-bold text-navy">{question}</h2>
        </div>
        <span className="text-3xl font-bold tabular-nums text-lime">{clampedValue}</span>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-[#f3f6f0] px-4 py-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime/20 text-lime">
          {variant === "size" ? (
            <SizeIcon level={clampedValue} />
          ) : (
            <DensityIcon level={clampedValue} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-navy">{selected.label}</p>
          <p className="text-sm text-muted">{selected.subtitle}</p>
        </div>
      </div>

      <div className="relative px-1 py-4">
        <div className="pointer-events-none relative h-3 rounded-full bg-lime/20">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-lime"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={clampedValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="weed-scale-slider absolute inset-x-0 top-1/2 h-10 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
          aria-label={question}
          aria-valuetext={`${selected.label}: ${selected.subtitle}`}
        />
      </div>

      <div className="mt-1 flex justify-between gap-1">
        {options.map((option, index) => {
          const optionValue = index + 1;
          const isSelected = clampedValue === optionValue;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(optionValue)}
              aria-pressed={isSelected}
              className={[
                "flex flex-1 flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition-all",
                isSelected ? "bg-lime/15 ring-1 ring-lime/25" : "bg-transparent",
              ].join(" ")}
            >
              <span className={isSelected ? "text-lime" : "text-muted/50"}>
                {variant === "size" ? (
                  <SizeIcon level={optionValue} small />
                ) : (
                  <DensityIcon level={optionValue} small />
                )}
              </span>
              <span
                className={[
                  "text-center text-[10px] font-semibold leading-tight",
                  isSelected ? "text-lime" : "text-muted",
                ].join(" ")}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SizeIcon({ level, small }: { level: number; small?: boolean }) {
  const size = small ? 20 : 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {level >= 1 && (
        <circle cx="12" cy="10" r="1.5" fill="currentColor" opacity="0.6" />
      )}
      {level >= 2 && (
        <>
          <path d="M12 12C10 10 8 8 7 6c2 1 3.5 3 5 5" fill="currentColor" opacity="0.7" />
          <path d="M12 12c2-2 4-4 5-6-2 1-3.5 3-5 5" fill="currentColor" opacity="0.7" />
        </>
      )}
      {level >= 3 && (
        <>
          <path d="M12 12C9 9 6 7 4 4c3 1.5 5.5 4 8 7" fill="currentColor" opacity="0.85" />
          <path d="M12 12c3-3 6-5 8-8-3 1.5-5.5 4-8 7" fill="currentColor" opacity="0.85" />
        </>
      )}
      {level >= 4 && (
        <>
          <path d="M12 12C8 8 4 5 2 2c4 2 7 5.5 10 9" fill="currentColor" />
          <path d="M12 12c4-4 8-7 10-10-4 2-7 5.5-10 9" fill="currentColor" />
        </>
      )}
      {level >= 5 && (
        <circle cx="12" cy="5" r="2.5" fill="currentColor" opacity="0.7" />
      )}
    </svg>
  );
}

function DensityIcon({ level, small }: { level: number; small?: boolean }) {
  const size = small ? 20 : 24;
  const dotCount = level;
  const spacing = size / (dotCount + 1);

  return (
    <svg
      width={size}
      height={size / 2}
      viewBox={`0 0 ${size} ${size / 2}`}
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: dotCount }, (_, i) => (
        <circle
          key={i}
          cx={spacing * (i + 1)}
          cy={size / 4}
          r={small ? 2 : 2.5}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function FlagIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 22V4" />
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    </svg>
  );
}

function ObservationMediaSection({
  media,
  onMediaChange,
  onOpenCamera,
}: {
  media: ObservationMediaItem[];
  onMediaChange: (media: ObservationMediaItem[]) => void;
  onOpenCamera: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newMedia = files.map((file) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
      url: URL.createObjectURL(file),
      name: formatMediaUploadTime(),
      pendingAnalysis: file.type.startsWith("video/") ? true : undefined,
    }));

    onMediaChange([...media, ...newMedia]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeMedia(id: string) {
    const item = media.find((entry) => entry.id === id);
    if (item) {
      URL.revokeObjectURL(item.url);
    }

    onMediaChange(media.filter((entry) => entry.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="weed-detail-media-upload"
        />
        <label
          htmlFor="weed-detail-media-upload"
          className="flex h-16 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-teal/40 bg-teal/5 text-sm text-muted transition-colors active:bg-teal/10"
        >
          <UploadIcon />
          <span className="mt-1.5 text-center text-xs">Upload image or video</span>
        </label>
        <span className="shrink-0 text-xs font-medium text-muted">or</span>
        <button
          type="button"
          onClick={onOpenCamera}
          className="flex h-16 flex-1 flex-col items-center justify-center rounded-xl border border-teal/40 bg-teal/5 text-sm text-muted transition-colors active:bg-teal/10"
        >
          <CameraIcon />
          <span className="mt-1.5 text-center text-xs">Take photo or video</span>
        </button>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.name}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="relative aspect-[4/3] w-full">
                  <video
                    src={item.url}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  {item.pendingAnalysis && (
                    <span className="absolute left-2 top-2 rounded-full bg-navy/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                      Pending
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <p className="truncate text-[10px] text-muted">{item.name}</p>
                <button
                  type="button"
                  onClick={() => removeMedia(item.id)}
                  className="shrink-0 text-[10px] font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 8 5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
