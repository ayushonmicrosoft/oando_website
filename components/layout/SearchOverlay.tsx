"use client";

import { X, Search, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface SearchResult {
  name: string;
  slug: string;
  category_id: string;
}

const SUGGESTIONS = [
  { label: "Seating", href: "/products/seating" },
  { label: "Workstations", href: "/products/workstations" },
  { label: "Tables", href: "/products/tables" },
  { label: "Soft Seating", href: "/products/soft-seating" },
  { label: "Storage", href: "/products/storages" },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Focus input when opened
  useEffect(() => {
    if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    if (isOpen) {
      focusTimeoutRef.current = setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
    return () => {
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    };
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const performSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/nav-search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 8) : []);
      }
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-sm z-60 flex flex-col items-center justify-start pt-32 px-6"
          role="dialog"
          aria-label="Search"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            title="Close Search"
            className="absolute top-8 right-8 p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-8 h-8 text-neutral-400 hover:text-neutral-900" />
          </button>

          {/* Search Input */}
          <div className="w-full max-w-3xl relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search for products, solutions..."
              className="w-full text-4xl md:text-5xl font-light text-neutral-900 placeholder:text-neutral-300 bg-transparent border-b-2 border-neutral-200 focus:border-primary outline-none py-4 pr-12 transition-colors"
            />
            {isSearching ? (
              <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-neutral-400 animate-spin" />
            ) : (
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-neutral-400" />
            )}
          </div>

          {/* Results / Suggestions */}
          <div className="w-full max-w-3xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400 mb-6">
                {query.length >= 2 && results.length > 0 ? "Results" : "Browse Categories"}
              </h3>
              {query.length >= 2 && results.length > 0 ? (
                <ul className="space-y-4">
                  {results.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/products/${item.category_id}/${item.slug}`}
                        onClick={onClose}
                        className="text-lg md:text-xl font-light text-neutral-600 hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query.length >= 2 && !isSearching ? (
                <p className="text-neutral-500">No products found.</p>
              ) : (
                <ul className="space-y-4">
                  {SUGGESTIONS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="text-lg md:text-xl font-light text-neutral-600 hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
