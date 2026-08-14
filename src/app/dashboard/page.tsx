import Link from "next/link";
import { getDashboardData } from "@/lib/queries";

export const dynamic = "force-dynamic";

const ACTIVE_COLOR = "#2a78d6";

function formatDayLabel(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const maxNicheTotal = Math.max(
    1,
    ...data.perNiche.map((n) => n.active + n.done)
  );
  const maxDayCount = Math.max(1, ...data.last14Days.map((d) => d.count));
  const peakDayIndex = data.last14Days.reduce(
    (best, d, i) => (d.count > data.last14Days[best].count ? i : best),
    0
  );

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6 sm:pt-10">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/"
          className="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-black"
          aria-label="Back to niches"
        >
          ←
        </Link>
        <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
      </div>

      {/* Overview stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Niches</p>
          <p className="mt-1 text-3xl font-semibold text-black">
            {data.totalNiches}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Active links</p>
          <p className="mt-1 text-3xl font-semibold text-black">
            {data.totalActive}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Done links</p>
          <p className="mt-1 text-3xl font-semibold text-black">
            {data.totalDone}
          </p>
        </div>
      </div>

      {/* Per-niche breakdown */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-gray-600">
          Links by niche
        </h2>
        {data.perNiche.length === 0 ? (
          <p className="text-sm text-gray-500">No niches yet.</p>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ACTIVE_COLOR }}
                />
                Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />
                Done
              </span>
            </div>
            <ul className="flex flex-col gap-3">
              {data.perNiche.map((niche) => {
                const total = niche.active + niche.done;
                const trackPercent = (total / maxNicheTotal) * 100;
                const activePercent =
                  total > 0 ? (niche.active / total) * trackPercent : 0;
                const donePercent =
                  total > 0 ? (niche.done / total) * trackPercent : 0;

                return (
                  <li key={niche.id} className="flex items-center gap-3">
                    <Link
                      href={`/niches/${niche.id}`}
                      className="w-24 shrink-0 truncate text-sm text-black hover:underline sm:w-32"
                      title={niche.name}
                    >
                      {niche.name}
                    </Link>
                    <div className="flex h-3 flex-1 gap-0.5 rounded-full bg-gray-100">
                      {total === 0 ? null : (
                        <>
                          <div
                            className="h-3"
                            style={{
                              width: `${activePercent}%`,
                              backgroundColor: ACTIVE_COLOR,
                              borderRadius:
                                niche.done > 0
                                  ? "9999px 0 0 9999px"
                                  : "9999px",
                            }}
                            title={`${niche.name}: ${niche.active} active`}
                          />
                          {niche.done > 0 && (
                            <div
                              className="h-3 rounded-r-full bg-gray-300"
                              style={{ width: `${donePercent}%` }}
                              title={`${niche.name}: ${niche.done} done`}
                            />
                          )}
                        </>
                      )}
                    </div>
                    <span className="w-24 shrink-0 text-right text-xs tabular-nums text-gray-500 sm:w-28">
                      {niche.active} active · {niche.done} done
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Daily activity */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-600">
          Links added, last 14 days
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex h-28 items-end gap-1.5">
            {data.last14Days.map((day, i) => {
              const heightPercent = (day.count / maxDayCount) * 100;
              return (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center justify-end gap-1"
                >
                  {i === peakDayIndex && day.count > 0 && (
                    <span className="text-[10px] tabular-nums text-gray-500">
                      {day.count}
                    </span>
                  )}
                  <div
                    className="w-full rounded-t-[4px]"
                    style={{
                      height: day.count > 0 ? `${Math.max(heightPercent, 6)}%` : "2px",
                      backgroundColor: day.count > 0 ? ACTIVE_COLOR : "#e1e0d9",
                    }}
                    title={`${formatDayLabel(day.date)}: ${day.count} link${day.count === 1 ? "" : "s"}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
            <span>{formatDayLabel(data.last14Days[0].date)}</span>
            <span>{formatDayLabel(data.last14Days[data.last14Days.length - 1].date)}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
