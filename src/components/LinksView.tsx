"use client";

import { useMemo, useState } from "react";
import type { Link as LinkRow } from "@/lib/database.types";
import LinkItem from "./LinkItem";

export default function LinksView({
  nicheId,
  links,
}: {
  nicheId: string;
  links: LinkRow[];
}) {
  const [showDone, setShowDone] = useState(false);

  const activeCount = useMemo(
    () => links.filter((l) => l.status === "active").length,
    [links]
  );
  const doneCount = links.length - activeCount;

  const visible = useMemo(
    () => (showDone ? links : links.filter((l) => l.status === "active")),
    [links, showDone]
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {activeCount} active{doneCount > 0 ? ` · ${doneCount} done` : ""}
        </span>
        {doneCount > 0 && (
          <button
            type="button"
            onClick={() => setShowDone((v) => !v)}
            className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            {showDone ? "Hide done" : "Show done"}
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-gray-500">
          {links.length === 0
            ? "No links yet. Tap + to add one."
            : "No active links."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((link) => (
            <LinkItem key={link.id} link={link} nicheId={nicheId} />
          ))}
        </ul>
      )}
    </div>
  );
}
