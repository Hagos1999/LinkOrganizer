"use client";

import { useRef, useState } from "react";
import { createNiche } from "@/lib/actions";
import Modal from "./Modal";

export default function CreateNicheButton() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      await createNiche(formData);
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
        aria-label="Add niche"
      >
        +
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="New niche">
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            required
            autoFocus
            placeholder="Niche name"
            className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-black outline-none focus:border-gray-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {isPending ? "Adding…" : "Add niche"}
          </button>
        </form>
      </Modal>
    </>
  );
}
