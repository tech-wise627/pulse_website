export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="h-3 w-20 rounded bg-muted-surface" />
            <div className="mt-3 h-7 w-12 rounded bg-muted-surface" />
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 h-4 w-28 rounded bg-muted-surface" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="h-5 w-24 rounded bg-muted-surface" />
              <div className="mt-4 h-3 w-32 rounded bg-muted-surface" />
              <div className="mt-6 h-8 w-16 rounded bg-muted-surface" />
              <div className="mt-3 h-2 w-full rounded-full bg-muted-surface" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
