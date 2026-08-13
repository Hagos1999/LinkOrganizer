import Link from "next/link";
import { notFound } from "next/navigation";
import { getNiche, getLinksForNiche } from "@/lib/queries";
import LinksView from "@/components/LinksView";
import NicheHeaderActions from "@/components/NicheHeaderActions";
import AddLinkButton from "@/components/AddLinkButton";

export const dynamic = "force-dynamic";

export default async function NichePage(props: PageProps<"/niches/[id]">) {
  const { id } = await props.params;

  const niche = await getNiche(id);
  if (!niche) notFound();

  const links = await getLinksForNiche(id);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-6 sm:pt-10">
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/"
          className="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-black"
          aria-label="Back to niches"
        >
          ←
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-2xl font-semibold text-black">
          {niche.name}
        </h1>
        <NicheHeaderActions niche={niche} />
      </div>

      <LinksView nicheId={niche.id} links={links} />

      <AddLinkButton nicheId={niche.id} />
    </main>
  );
}
