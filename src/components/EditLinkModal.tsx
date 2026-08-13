"use client";

import { useRef, useState } from "react";
import type { Link as LinkRow } from "@/lib/database.types";
import { updateLink } from "@/lib/actions";
import Modal from "./Modal";

export default function EditLinkModal({
  link,
  nicheId,
  open,
  onClose,
}: {
  link: LinkRow;
  nicheId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await updateLink(link.id, nicheId, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit link">
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600" htmlFor="edit-title">
            Title
          </label>
          <input
            id="edit-title"
            name="title"
            required
            defaultValue={link.title}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black outline-none focus:border-gray-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600" htmlFor="edit-url">
            URL
          </label>
          <input
            id="edit-url"
            name="url"
            required
            defaultValue={link.url}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black outline-none focus:border-gray-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600" htmlFor="edit-notes">
            Notes
          </label>
          <textarea
            id="edit-notes"
            name="notes"
            defaultValue={link.notes ?? ""}
            rows={2}
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black outline-none focus:border-gray-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </Modal>
  );
}
