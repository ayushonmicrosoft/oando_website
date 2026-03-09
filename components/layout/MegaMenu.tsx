"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  label: string;
  href: string;
}

interface CardItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  cards: CardItem[];
}

export function MegaMenu({ isOpen, items, cards, onClose }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-neutral-100 z-[998]"
          onMouseLeave={onClose}
          role="menu"
          aria-label="Product categories"
        >
          <div className="container px-6 2xl:px-0 py-10">
            <div className="flex gap-12">
              {/* Left Column: Link List */}
              <div className="w-1/4 pt-2">
                <ul className="flex flex-col gap-3" role="none">
                  {items.map((item) => (
                    <li key={item.label} role="none">
                      <Link
                        href={item.href}
                        prefetch={false}
                        role="menuitem"
                        className="text-[15px] font-normal text-neutral-800 hover:text-primary transition-colors block py-1 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Cards Grid */}
              <div className="w-3/4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      prefetch={false}
                      role="menuitem"
                      className="group block focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                    >
                      <div className="relative aspect-[16/9] bg-neutral-100 mb-3 overflow-hidden">
                        {card.image && (
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      </div>
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-primary transition-colors mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-neutral-500 font-light">
                        {card.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
