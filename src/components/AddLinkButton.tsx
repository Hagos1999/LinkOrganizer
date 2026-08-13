"use client";

import { useRef, useState } from "react";
import { createLink } from "@/lib/actions";
import Modal from "./Modal";

export default function AddLinkButton({ nicheId }: { nicheId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await createLink(nicheId, formData);
      formRef.current?.reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg transition hover:bg-gray-800"
        aria-label="Add link"
      >
        +
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add link">
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600" htmlFor="add-title">
              Title
            </label>
            <input
              id="add-title"
              name="title"
              required
              autoFocus
              placeholder="e.g. Great article about X"
              className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600" htmlFor="add-url">
              URL
            </label>
            <input
              id="add-url"
              name="url"
              required
              placeholder="https://example.com"
              className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600" htmlFor="add-notes">
              Notes (optional)
            </label>
            <textarea
              id="add-notes"
              name="notes"
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
            {isPending ? "Adding…" : "Add link"}
          </button>
        </form>
      </Modal>
    </>
  );
}
