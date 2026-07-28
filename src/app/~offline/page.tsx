export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface px-7 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal">
        Offline
      </p>
      <h1 className="mt-2 text-2xl font-bold text-navy">You&apos;re offline</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        AgOS Scout needs a connection for some features. Reconnect and try again.
      </p>
    </main>
  );
}
