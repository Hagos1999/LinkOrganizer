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

export interface NicheBreakdown {
  id: string;
  name: string;
  active: number;
  done: number;
}

export interface DayCount {
  date: string;
  count: number;
}

export interface DashboardData {
  totalNiches: number;
  totalActive: number;
  totalDone: number;
  perNiche: NicheBreakdown[];
  last14Days: DayCount[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = getSupabase();

  const [
    { data: niches, error: nichesError },
    { data: links, error: linksError },
  ] = await Promise.all([
    supabase.from("niches").select("id, name"),
    supabase.from("links").select("niche_id, status, created_at"),
  ]);

  if (nichesError) throw new Error(nichesError.message);
  if (linksError) throw new Error(linksError.message);

  const allLinks = links ?? [];

  const perNicheCounts = new Map<string, { active: number; done: number }>();
  for (const link of allLinks) {
    const entry = perNicheCounts.get(link.niche_id) ?? { active: 0, done: 0 };
    if (link.status === "active") entry.active += 1;
    else entry.done += 1;
    perNicheCounts.set(link.niche_id, entry);
  }

  const perNiche: NicheBreakdown[] = (niches ?? [])
    .map((niche) => {
      const counts = perNicheCounts.get(niche.id) ?? { active: 0, done: 0 };
      return { id: niche.id, name: niche.name, ...counts };
    })
    .sort((a, b) => b.active + b.done - (a.active + a.done));

  const totalActive = allLinks.filter((l) => l.status === "active").length;
  const totalDone = allLinks.length - totalActive;

  const last14Days: DayCount[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last14Days.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  const dayIndex = new Map(last14Days.map((d, idx) => [d.date, idx]));
  for (const link of allLinks) {
    const key = link.created_at.slice(0, 10);
    const idx = dayIndex.get(key);
    if (idx !== undefined) last14Days[idx].count += 1;
  }

  return {
    totalNiches: (niches ?? []).length,
    totalActive,
    totalDone,
    perNiche,
    last14Days,
  };
}
