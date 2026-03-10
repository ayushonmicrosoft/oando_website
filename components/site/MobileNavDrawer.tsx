"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, Sparkles, X } from "lucide-react";
import { OneAndOnlyLogo } from "@/components/ui/Logo";
import {
  NAV_CATEGORY_GROUP_ORDER,
  NAV_CATEGORY_GROUPS,
  groupCategories,
  type GroupedCategory,
} from "@/lib/navigation";
import { SITE_NAV_LINKS, SITE_CTA_LINKS } from "@/lib/siteNav";
import { cn } from "@/lib/utils";

function prettify(id: string): string {
  return id
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

const FALLBACK_CATEGORY_GROUPS: GroupedCategory[] = NAV_CATEGORY_GROUP_ORDER.map((groupId) => ({
  groupId,
  groupLabel: NAV_CATEGORY_GROUPS[groupId].label,
  items: NAV_CATEGORY_GROUPS[groupId].ids.map((id) => ({
    id,
    name: prettify(id),
    count: undefined,
    href: `/products/${id}`,
  })),
}));

interface NavSearchResult {
  id: string;
  title: string;
  href: string;
  type: "product" | "category" | "page";
  source: "ai" | "local";
}

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileNavDrawer({ open, onClose, closeButtonRef }: MobileNavDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [accordion, setAccordion] = useState<Record<string, boolean>>({});
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>(
    FALLBACK_CATEGORY_GROUPS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NavSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  useEffect(() => {
    fetch("/api/nav-categories/")
      .then((res) => res.json())
      .then((payload: { groups?: GroupedCategory[]; categories?: Array<{ id: string; name: string; count?: number }> }) => {
        if (Array.isArray(payload.groups) && payload.groups.length > 0) {
          setGroupedCategories(payload.groups);
          return;
        }
        if (Array.isArray(payload.categories) && payload.categories.length > 0) {
          setGroupedCategories(groupCategories(payload.categories));
          return;
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setSearchLoading(false);
      setShowSearchPanel(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input, [tabindex]:not([tabindex='-1'])",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch("/api/nav-search/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit: 8, context: "mobile" }),
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          results?: NavSearchResult[];
        };

        if (!response.ok) {
          setSearchResults([]);
          return;
        }
        setSearchResults(Array.isArray(payload.results) ? payload.results : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 260);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [open, searchQuery]);

  const handleClose = () => {
    onClose();
    setTimeout(() => closeButtonRef.current?.focus(), 50);
  };

  const onSearchResultClick = () => {
    setShowSearchPanel(false);
    setSearchQuery("");
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-neutral-900/30 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={handleClose}
          />

          <motion.div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="drawer-shell fixed inset-y-0 right-0 z-[70] flex w-[92vw] max-w-md flex-col overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <OneAndOnlyLogo className="h-8" variant="orange" />
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleClose}
                aria-label="Close navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile primary navigation">
              <div className="mb-4">
                <div className="drawer-search">
                  <Search className="h-4 w-4 text-neutral-500" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setShowSearchPanel(true)}
                    placeholder="AI search products..."
                    className="w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                    aria-label="Mobile AI product search"
                  />
                  <Sparkles className="h-4 w-4 text-primary/70" />
                </div>

                {(showSearchPanel || searchQuery.trim().length >= 2) && (
                  <div className="mt-2 rounded-[1.5rem] border border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfe_100%)] p-3 shadow-[0_18px_36px_-28px_rgba(16,24,40,0.12)]">
                    <p className="mb-2 text-[10px] font-normal tracking-[0.04em] text-neutral-500">
                      {searchLoading
                        ? "Searching"
                        : searchResults.length > 0
                          ? "Results"
                          : "No results"}
                    </p>
                    {searchLoading ? (
                      <p className="text-sm text-neutral-500">Searching...</p>
                    ) : searchResults.length > 0 ? (
                      <ul className="space-y-1">
                        {searchResults.map((result) => (
                          <li key={result.id}>
                            <Link
                              href={result.href}
                              onClick={onSearchResultClick}
                              className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-neutral-700 shadow-[0_10px_22px_-20px_rgba(16,24,40,0.12)]"
                            >
                              <span>{result.title}</span>
                              <span className="text-[10px] tracking-[0.04em] text-neutral-400">
                                {result.type}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-neutral-500">
                        Type at least 2 characters to search.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <ul className="space-y-1">
                {SITE_NAV_LINKS.map((link) => {
                  if ("hasMega" in link && link.hasMega) {
                    const isOpen = Boolean(accordion.products);
                    return (
                      <li key={link.label}>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() =>
                            setAccordion((prev) => ({ ...prev, products: !prev.products }))
                          }
                          className="drawer-link w-full justify-between"
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-neutral-400 transition-transform",
                              isOpen && "rotate-180",
                            )}
                          />
                        </button>

                        {isOpen && (
                          <div className="mt-1 space-y-2 rounded-xl border border-neutral-100 bg-neutral-50 p-2">
                            <Link
                              href="/products"
                              onClick={handleClose}
                              className="drawer-subtle-link text-primary"
                            >
                              All Products
                            </Link>

                            {groupedCategories.map((group) => (
                              <div key={group.groupId}>
                                <p className="typ-label px-3 pb-1 pt-2 text-neutral-400">
                                  {group.groupLabel}
                                </p>
                                <ul className="space-y-1">
                                  {group.items.map((item) => (
                                    <li key={item.id}>
                                      {item.name.trim().toLowerCase() !== group.groupLabel.trim().toLowerCase() && (
                                        <Link
                                          href={item.href}
                                          onClick={handleClose}
                                          className="drawer-subtle-link"
                                        >
                                          <span>{item.name}</span>
                                          {typeof item.count === "number" && (
                                            <span className="text-[10px] text-neutral-400">{item.count}</span>
                                          )}
                                        </Link>
                                      )}

                                      {Array.isArray(item.subcategories) &&
                                        item.subcategories.length > 0 && (
                                        <ul className="ml-5 mt-1 space-y-0.5 border-l border-neutral-200 pl-3">
                                          {item.subcategories.map((subcategory) => (
                                            <li key={`${item.id}-${subcategory.id}`}>
                                              <Link
                                                href={subcategory.href}
                                                onClick={handleClose}
                                                className="drawer-subcategory-link"
                                              >
                                                <span>{subcategory.name}</span>
                                                {typeof subcategory.count === "number" && (
                                                  <span className="text-[10px] text-neutral-400">
                                                    {subcategory.count}
                                                  </span>
                                                )}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                        )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={handleClose}
                        className="drawer-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="sticky bottom-0 border-t border-neutral-100 bg-white px-5 py-4">
              <a
                href="tel:+919835630940"
                onClick={handleClose}
                className="mb-3 flex min-h-12 items-center justify-center rounded-full border border-neutral-300 bg-white text-sm font-medium tracking-[0.02em] text-neutral-900 transition-colors hover:border-primary/30 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Call +91 98356 30940"
              >
                Call +91 98356 30940
              </a>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SITE_CTA_LINKS.map((cta) => (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    onClick={handleClose}
                    className={cn(
                      cta.variant === "primary" ? "btn-primary" : "btn-outline",
                      "w-full justify-center",
                    )}
                  >
                    {cta.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
