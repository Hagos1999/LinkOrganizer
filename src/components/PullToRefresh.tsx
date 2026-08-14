"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const THRESHOLD = 70;
const MAX_PULL = 100;

export default function PullToRefresh({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      startY.current = window.scrollY <= 0 && !isPending ? e.touches[0].clientY : null;
    }

    function onTouchMove(e: TouchEvent) {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY <= 0) {
        setPull(Math.min(delta * 0.5, MAX_PULL));
      } else {
        setPull(0);
        startY.current = null;
      }
    }

    function onTouchEnd() {
      if (startY.current === null) return;
      startY.current = null;
      setPull((current) => {
        if (current >= THRESHOLD) {
          startTransition(() => {
            router.refresh();
          });
        }
        return 0;
      });
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isPending, router, startTransition]);

  const progress = Math.min(pull / THRESHOLD, 1);
  const visible = isPending || pull > 0;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
        style={{
          opacity: visible ? 1 : 0,
          transition: visible && !isPending ? "none" : "opacity 200ms ease",
        }}
      >
        <div className="mt-2 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
          <div
            className={`h-4 w-4 rounded-full border-2 border-gray-300 border-t-black ${
              isPending ? "animate-spin" : ""
            }`}
            style={!isPending ? { transform: `rotate(${progress * 360}deg)` } : undefined}
          />
        </div>
      </div>
      {children}
    </>
  );
}
