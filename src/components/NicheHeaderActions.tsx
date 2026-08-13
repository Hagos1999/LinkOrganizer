"use client";

import { useRef, useState } from "react";
import type { Niche } from "@/lib/database.types";
import { renameNiche, deleteNiche } from "@/lib/actions";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

export default function NicheHeaderActions({ niche }: { niche: Niche }) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleRename(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await renameNiche(niche.id, formData);
      setRenameOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    setIsPending(true);
    try {
      await deleteNiche(niche.id);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex shrink-0 gap-1">
      <button
        type="button"
        onClick={() => setRenameOpen(true)}
        className="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-black"
        aria-label="Rename niche"
      >
        ✎
      </button>
      <button
        type="button"
        onClick={() => setDeleteOpen(true)}
        className="rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-red-600"
        aria-label="Delete niche"
      >
        🗑
      </button>

      <Modal open={renameOpen} onClose={() => setRenameOpen(false)} title="Rename niche">
        <form ref={formRef} action={handleRename} className="flex flex-col gap-4">
          <input
            name="name"
            required
            autoFocus
            defaultValue={niche.name}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black outline-none focus:border-gray-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </form>
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={isPending}
        title="Delete niche?"
        message={`This will permanently delete "${niche.name}" and all its links. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
