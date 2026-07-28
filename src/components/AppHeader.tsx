import { AgOSLogo } from "@/components/AgOSLogo";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AppHeader({
  title = "Explore fields",
  subtitle,
}: AppHeaderProps) {
  return (
    <header className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">
          Good morning
        </p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-navy">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-muted">{subtitle}</p>
        )}
      </div>
      <AgOSLogo variant="image" size="header" />
    </header>
  );
}
