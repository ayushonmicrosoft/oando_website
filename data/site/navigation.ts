import {
  Catalog_CATEGORY_ORDER,
  buildCatalogCategoryNav,
} from "@/lib/catalogCategories";
import { SITE_CONTACT } from "@/data/site/contact";

export const SITE_NAV_LINKS = [
  { label: "Products", href: "/products", hasMega: true },
  { label: "Configurator", href: "/planning" },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Trusted by", href: "/trusted-by" },
  { label: "About", href: "/about" },
  { label: "Sustainability", href: "/sustainability" },
] as const;

export const SITE_CTA_LINKS = [
  { label: "Get Quote", href: "/contact", variant: "primary" as const },
  { label: "View Products", href: "/products", variant: "outline" as const },
] as const;

const productLinks = [
  { href: "/products", label: "All Products" },
  ...buildCatalogCategoryNav(Catalog_CATEGORY_ORDER),
];

export const SITE_FOOTER_NAV = [
  {
    heading: "Products",
    links: productLinks,
  },
  {
    heading: "Solutions",
    links: [
      { href: "/solutions", label: "All Solutions" },
      { href: "/products/seating", label: "Seating" },
      { href: "/products/workstations", label: "Workstations" },
      { href: "/products/tables", label: "Meeting Rooms" },
      { href: "/products/storages", label: "Storage and Filing" },
      { href: "/solutions", label: "Space Planning" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/trusted-by", label: "Trusted By" },
      { href: "/projects", label: "Projects" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/sustainability", label: "Sustainability" },
      { href: "/service", label: "After Sales" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/planning", label: "Workspace Planner" },
      { href: "/contact", label: "Get Quote" },
      { href: "/refund-and-return-policy", label: "Refund Policy" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
] as const;

export const SITE_SOCIAL_LINKS = SITE_CONTACT.socialLinks;
