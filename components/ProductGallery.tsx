"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && images.length < 5) {
      console.warn(
        "ProductGallery: Fewer than 5 images provided for product:",
        productName,
      );
    }
  }, [images, productName]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    },
    [images.length],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const fallbackImg = "/images/products/imported/fluid/image-1.webp";

  // Ensure selectedIndex is valid (e.g. if images array changes)
  const safeIndex = selectedIndex >= images.length ? 0 : selectedIndex;
  const currentImage = images[safeIndex] || fallbackImg;

  return (
    <div className="grid h-full w-full grid-cols-1 gap-5 md:grid-cols-[88px_1fr]">
      {/* Thumbnails */}
      <div className="scrollbar-hide order-2 flex gap-2 overflow-x-auto px-4 py-2 md:order-1 md:flex-col md:overflow-y-auto md:px-0 md:py-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={clsx(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:h-20 md:w-20",
              safeIndex === idx
                ? "border-neutral-900 bg-white opacity-100 shadow-[0_18px_34px_-24px_rgba(15,23,42,0.28)]"
                : "border-neutral-200 bg-white opacity-70 hover:opacity-100 hover:border-neutral-300",
            )}
            title={`View image ${idx + 1}`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 18vw, 80px"
              style={{ objectFit: "contain" }}
              className="p-1.5"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="order-1 relative flex min-h-[50vw] w-full flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-4 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.2)] md:order-2 md:min-h-125 lg:min-h-0">
        <Image
          src={currentImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 70vw"
          style={{ objectFit: "contain" }}
          className="p-8 transition-opacity duration-500 lg:p-16"
        />

        {/* Image count badge */}
        {images.length > 0 && (
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-full border border-neutral-200 bg-white/92 px-3 py-1 text-[11px] font-bold tracking-widest text-neutral-800 shadow-sm backdrop-blur">
            {safeIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
