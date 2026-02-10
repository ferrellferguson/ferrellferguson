"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { StravaPhoto } from "@/lib/strava";

export function PhotoGallery({ photos }: { photos: StravaPhoto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<StravaPhoto | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="relative group/gallery">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 border border-border/50 text-foreground shadow-lg backdrop-blur-sm opacity-0 transition-opacity group-hover/gallery:opacity-100"
          aria-label="Scroll left"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-6 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {photos.map((photo) => {
            const url = photo.urls?.["2048"] || photo.urls?.["1800"] || Object.values(photo.urls || {})[0];
            if (!url) return null;

            return (
              <button
                key={photo.unique_id}
                onClick={() => setSelected(photo)}
                className="relative h-64 w-80 shrink-0 snap-start overflow-hidden rounded-xl md:h-80 md:w-96 focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <Image
                  src={url}
                  alt={photo.caption || photo.activity_name || "Ride photo"}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 320px, 384px"
                />
                {/* Caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-10">
                  {photo.activity_name && (
                    <p className="text-sm font-medium text-white truncate">
                      {photo.activity_name}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 border border-border/50 text-foreground shadow-lg backdrop-blur-sm opacity-0 transition-opacity group-hover/gallery:opacity-100"
          aria-label="Scroll right"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.urls?.["2048"] || selected.urls?.["1800"] || Object.values(selected.urls || {})[0]}
              alt={selected.caption || selected.activity_name || "Ride photo"}
              width={2048}
              height={1536}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
            {selected.activity_name && (
              <p className="mt-3 text-center text-sm text-white/80">
                {selected.activity_name}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
