"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "./supabase";
import type { LinkStatus } from "./database.types";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function createNiche(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const supabase = getSupabase();
  const { error } = await supabase.from("niches").insert({ name });
  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function renameNiche(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const supabase = getSupabase();
  const { error } = await supabase.from("niches").update({ name }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/niches/${id}`);
}

export async function deleteNiche(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("niches").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}

export async function createLink(nicheId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title || !url) throw new Error("Title and URL are required");

  const supabase = getSupabase();
  const { error } = await supabase.from("links").insert({
    niche_id: nicheId,
    title,
    url: normalizeUrl(url),
    notes: notes || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/niches/${nicheId}`);
  revalidatePath("/");
}

export async function updateLink(id: string, nicheId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title || !url) throw new Error("Title and URL are required");

  const supabase = getSupabase();
  const { error } = await supabase
    .from("links")
    .update({ title, url: normalizeUrl(url), notes: notes || null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/niches/${nicheId}`);
}

export async function setLinkStatus(id: string, nicheId: string, status: LinkStatus) {
  const supabase = getSupabase();
  const { error } = await supabase.from("links").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/niches/${nicheId}`);
  revalidatePath("/");
}

export async function deleteLink(id: string, nicheId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/niches/${nicheId}`);
  revalidatePath("/");
}
