"use client";

import { useState, useTransition } from "react";
import type { Link as LinkRow } from "@/lib/database.types";
import { setLinkStatus, deleteLink } from "@/lib/actions";
import EditLinkModal from "./EditLinkModal";
import ConfirmModal from "./ConfirmModal";

export default function LinkItem({
  link,
  nicheId,
}: {
  link: LinkRow;
  nicheId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isDone = link.status === "done";

  function toggleStatus() {
    startTransition(async () => {
      await setLinkStatus(link.id, nicheId, isDone ? "active" : "done");
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      await deleteLink(link.id, nicheId);
      setDeleteOpen(false);
    });
  }

  return (
    <li
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${
        isDone ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`min-w-0 flex-1 truncate font-medium text-black hover:underline ${
            isDone ? "line-through" : ""
          }`}
        >
          {link.title}
        </a>
        <button
          type="button"
          onClick={toggleStatus}
          disabled={isPending}
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium disabled:opacity-50 ${
            isDone
              ? "border-gray-300 text-gray-500 hover:bg-gray-100"
              : "border-black bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isDone ? "Mark active" : "Mark done"}
        </button>
      </div>

      {link.notes && (
        <p className="mt-1 truncate text-sm text-gray-500">{link.notes}</p>
      )}

      <div className="mt-2 flex gap-4 text-sm text-gray-400">
        <button type="button" onClick={() => setEditOpen(true)} className="hover:text-black">
          Edit
        </button>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="hover:text-red-600"
        >
          Delete
        </button>
      </div>

      <EditLinkModal
        link={link}
        nicheId={nicheId}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        isPending={isPending}
        title="Delete link?"
        message={`This will permanently delete "${link.title}". This cannot be undone.`}
        confirmLabel="Delete"
      />
    </li>
  );
}
