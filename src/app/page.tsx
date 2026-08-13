import Link from "next/link";
import { getNichesWithCounts } from "@/lib/queries";
import CreateNicheButton from "@/components/CreateNicheButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const niches = await getNichesWithCounts();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-6 sm:pt-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-black">LinkOrganizer</h1>
      </header>

      {niches.length === 0 ? (
        <p className="mt-16 text-center text-gray-500">
          No niches yet. Tap + to create one.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {niches.map((niche) => (
            <li key={niche.id}>
              <Link
                href={`/niches/${niche.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="truncate font-medium text-black">{niche.name}</span>
                <span className="ml-3 shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-sm text-gray-600">
                  {niche.activeCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <CreateNicheButton />
    </main>
  );
}
