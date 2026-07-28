import Image from "next/image";

export function AgOSLogo({
  size = "default",
  variant = "css",
}: {
  size?: "default" | "compact" | "small" | "header";
  variant?: "css" | "image";
}) {
  if (variant === "image") {
    const dimensions = {
      default: { width: 240, height: 214, className: "w-[240px]" },
      compact: { width: 160, height: 142, className: "w-[160px]" },
      small: { width: 130, height: 116, className: "w-[130px]" },
      header: { width: 72, height: 64, className: "w-[72px]" },
    }[size];

    return (
      <Image
        src="/logo.png"
        alt="fX AgOS AI — The AI-Powered Agricultural Operating System"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className={`h-auto shrink-0 object-contain ${dimensions.className}`}
      />
    );
  }

  const isCompact = size === "compact" || size === "small";

  return (
    <div className={`flex flex-col items-center ${isCompact ? "gap-2" : "gap-3"}`}>
      {/* fX mark */}
      <div className="flex items-start justify-center">
        <span
          className={`font-bold tracking-tight text-navy ${
            isCompact ? "text-5xl leading-none" : "text-6xl leading-none"
          }`}
        >
          f
        </span>
        <span className="relative">
          <span
            className={`font-bold tracking-tight gradient-brand-text ${
              isCompact ? "text-5xl leading-none" : "text-6xl leading-none"
            }`}
          >
            X
          </span>
          <sup className="absolute -right-4 -top-0.5 text-[10px] font-semibold tracking-wide text-lime">
            AI
          </sup>
        </span>
      </div>

      {/* AgOS wordmark */}
      <div className="relative flex items-baseline">
        <span
          className={`font-bold tracking-tight text-navy ${
            isCompact ? "text-2xl" : "text-3xl"
          }`}
        >
          Ag
        </span>
        <span
          className={`font-bold tracking-tight text-navy-light/80 ${
            isCompact ? "text-2xl" : "text-3xl"
          }`}
        >
          OS
        </span>
        <sup className="ml-0.5 text-[9px] font-semibold tracking-wide text-lime">
          AI
        </sup>
      </div>

      {/* Gradient divider line with nodes */}
      <div className="flex w-full max-w-[220px] items-center gap-0">
        <div className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-lime bg-transparent" />
        <div className="gradient-line h-[2px] flex-1 rounded-full" />
        <div className="h-2 w-2 shrink-0 rounded-full bg-teal" />
      </div>

      {/* Tagline */}
      <p
        className={`max-w-[260px] text-center font-medium uppercase leading-snug tracking-wide text-navy ${
          isCompact ? "text-[9px]" : "text-[10px]"
        }`}
      >
        The{" "}
        <span className="font-semibold text-lime">AI-Powered</span>{" "}
        Agricultural Operating System
      </p>
    </div>
  );
}
