import { getSupabase } from "./supabase";
import type { Niche, Link } from "./database.types";

export interface NicheWithCount extends Niche {
  activeCount: number;
}

export async function getNichesWithCounts(): Promise<NicheWithCount[]> {
  const supabase = getSupabase();

  const [
    { data: niches, error: nichesError },
    { data: activeLinks, error: linksError },
  ] = await Promise.all([
    supabase.from("niches").select("*").order("created_at", { ascending: false }),
    supabase.from("links").select("niche_id").eq("status", "active"),
  ]);

  if (nichesError) throw new Error(nichesError.message);
  if (linksError) throw new Error(linksError.message);

  const counts = new Map<string, number>();
  for (const link of activeLinks ?? []) {
    counts.set(link.niche_id, (counts.get(link.niche_id) ?? 0) + 1);
  }

  return (niches ?? []).map((niche) => ({
    ...niche,
    activeCount: counts.get(niche.id) ?? 0,
  }));
}

export async function getNiche(id: string): Promise<Niche | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("niches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getLinksForNiche(nicheId: string): Promise<Link[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("niche_id", nicheId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
