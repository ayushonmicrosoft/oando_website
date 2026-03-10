export const HOMEPAGE_HERO_CONTENT = {
  eyebrowPrimary: "Workspace planning for Bihar and beyond",
  eyebrowSecondary: "",
  imageAlt:
    "Ergonomic seating and workstations expertly installed at Titan Patna HQ by One and Only Furniture",
  title: ["Workspace Design,", "Reimagined."],
  description: "",
  primaryCta: { label: "Plan project", href: "/contact" },
  secondaryCta: { label: "Browse products", href: "/products" },
  proofCards: [
    { label: "Clients", value: "DMRC, Titan, Tata Steel" },
    { label: "Coverage", value: "Planning to after-sales" },
  ],
  deliverySummary: {
    kicker: "Delivery view",
    title: "Procurement stays clear.",
    description:
      "Layout, BOQ, dispatch, and installation stay aligned.",
  },
  deliveryRows: [
    {
      label: "Plan",
      value: "Scope and BOQ aligned early.",
    },
    {
      label: "Deliver",
      value: "Dispatch and installation managed together.",
    },
    {
      label: "Support",
      value: "Warranty and service stay traceable.",
    },
  ],
} as const;

export const HOMEPAGE_TRUST_CONTENT = {
  kicker: "Execution credibility",
  title: "Trusted by teams that value clarity and dependable execution.",
  description:
    "Furniture, planning, and installation handled with one accountable flow.",
  brands: ["DMRC", "Tata Steel", "Titan"],
  summary: "Selected clients and current execution scale",
  kpiLabels: {
    organisationsServed: "Organisations served",
    projectsDelivered: "Projects delivered",
    yearsExperience: "Years experience",
    sectorsServed: "Sectors served",
  },
} as const;

export const HOMEPAGE_CONTACT_CONTENT = {
  kicker: "Get in touch",
  title: "Start with one clear brief.",
  description:
    "Use the guided planner, or speak to the team directly.",
  primary: {
    kicker: "Primary route",
    title: "Guided planner",
    description: "Share seats, timeline, and city in a few steps.",
    cta: "Open planner",
  },
  secondary: {
    kicker: "Secondary route",
    title: "AI chatbot",
    description: "Ask quick product questions and compare options.",
    cta: "Open chatbot",
  },
  direct: {
    kicker: "Direct contact",
    title: "Need a human response?",
    description: "Call, WhatsApp, or email the team directly.",
  },
} as const;

export const HOMEPAGE_EXPERIENCE_CONTENT = {
  kicker: "Execution proof",
  title: "Execution strength at scale.",
  description:
    "Trusted by client organisations across public, private, and institutional projects.",
  trustedByLabel: "Trusted by",
  trustedByCta: "View all clients",
  recentDeliveriesLabel: "Recent deliveries",
  portfolioCta: "View portfolio",
  featuredClients: ["DMRC", "Tata Steel", "HDFC", "IndianOil", "L&T", "NTPC"],
  projectCards: [
    {
      title: "DMRC",
      subtitle: "Delhi Metro Rail Corporation",
      image: "/projects/DMRC/IMG_20200612_123416.webp",
      link: "/gallery",
    },
    {
      title: "Titan",
      subtitle: "Titan Company Limited",
      image: "/projects/Titan/27-06-2025 Image 05_edited_edited.webp",
      link: "/gallery",
    },
  ],
} as const;

export const HOMEPAGE_OUR_WORK_CONTENT = {
  kicker: "Trusted Clients",
  title: "Trusted by India's most respected organisations.",
  cta: "View all clients",
  featuredClients: [
    { name: "Titan", sector: "Manufacturing" },
    { name: "Usha International", sector: "Manufacturing" },
    { name: "DMRC", sector: "Government" },
    { name: "Government of Bihar", sector: "Government" },
    { name: "Tata Steel", sector: "Manufacturing" },
    { name: "Tata Motors", sector: "Automotive" },
    { name: "L&T", sector: "Manufacturing" },
    { name: "HDFC", sector: "Finance" },
    { name: "State Bank of India", sector: "Finance" },
    { name: "NTPC", sector: "Energy" },
    { name: "IndianOil", sector: "Energy" },
    { name: "Maruti Suzuki", sector: "Automotive" },
    { name: "Asian Paints", sector: "FMCG" },
    { name: "ITC Limited", sector: "FMCG" },
    { name: "Indian Army", sector: "Government" },
    { name: "BHEL", sector: "Energy" },
  ],
} as const;

export const HOMEPAGE_PROJECTS_CONTENT = {
  kicker: "Featured Work",
  title: ["Spaces Designed For", "Excellence."],
  portfolioCta: "View Complete Portfolio",
  projects: [
    {
      client: "Titan",
      location: "Patna, Bihar",
      category: "Corporate Office",
      image: "/photos/Titan/hero.webp",
      slug: "titan-patna",
    },
    {
      client: "DMRC",
      location: "New Delhi",
      category: "Government Infrastructure",
      image: "/photos/DMRC/hero.webp",
      slug: "dmrc-delhi",
    },
    {
      client: "Usha International",
      location: "New Delhi",
      category: "Corporate Headquarters",
      image: "/photos/Usha/hero.webp",
      slug: "usha-delhi",
    },
  ],
} as const;

export const HOMEPAGE_TRUSTED_CLIENTS_CONTENT = {
  kicker: "Trusted by India's leading corporations",
  cta: "View all projects",
  clients: [
    { name: "Titan Company", src: "/images/clients/logos/Titan.png" },
    { name: "Larsen & Toubro", src: "/images/clients/logos/LandT.png" },
    { name: "JSW Group", src: "/images/clients/logos/JSW.png" },
    { name: "Tata Motors", src: "/images/clients/logos/TataMotors.jpg" },
    { name: "Maruti Suzuki", src: "/images/clients/logos/MarutiSuzuki.png" },
    { name: "HDFC Bank", src: "/images/clients/logos/HDFCLogo.jpg" },
  ],
} as const;

export const HOMEPAGE_WHY_CHOOSE_US_CONTENT = {
  kicker: "Why One & Only",
  titleLead: "We engineer workspace systems",
  titleEmphasis: "not just furniture.",
  description:
    "We engineer workspace systems that improve productivity, health, and scalability - trusted by corporate, government, and institutional clients across Bihar and beyond.",
  bullets: [
    "Performance-graded components",
    "Enterprise-grade durability",
    "Sustainable engineering",
  ],
  features: [
    {
      icon: "activity",
      title: "Performance-Graded Components",
      description:
        "Every system is rated for sustained enterprise use - tested for load, cycle, and ergonomic compliance.",
    },
    {
      icon: "shield",
      title: "Enterprise-Grade Durability",
      description:
        "Built for institutions that demand reliability. BIFMA-compliant structures with a 5-year performance warranty.",
    },
    {
      icon: "leaf",
      title: "Sustainable Engineering",
      description:
        "Low-emission materials, recycled substrates, and responsible supply chains - engineered for a net-positive future.",
    },
    {
      icon: "zap",
      title: "Scalable System Design",
      description:
        "Modular by design. Configure for 5 or 500 workpoints without retrofitting - engineered to scale with you.",
    },
  ],
} as const;

export const HOMEPAGE_PROCESS_CONTENT = {
  kicker: "How we work",
  title: "A clear four-step delivery system.",
  description:
    "Each project follows a transparent sequence so procurement, facilities, and leadership teams stay aligned from day one.",
  cta: { label: "Start your project brief", href: "/contact" },
  steps: [
    {
      title: "Scope and align",
      sla: "Day 1-2",
      deliverable: "Signed scope brief",
      detail:
        "Capture requirement scope, budget range, timeline, and approval checkpoints before design starts.",
    },
    {
      title: "Design and validate",
      sla: "Day 3-7",
      deliverable: "Approved layout and BOQ options",
      detail:
        "Study the layout and BOQ, then suggest the best options to ensure a client-friendly outcome.",
    },
    {
      title: "Supply and install",
      sla: "As per approved schedule",
      deliverable: "Installed and handed-over workspace",
      detail:
        "Coordinate production windows, dispatch schedules, and on-site installation with minimum disruption.",
    },
    {
      title: "Support after handover",
      sla: "Ongoing",
      deliverable: "Warranty and service response support",
      detail:
        "Manage warranty registration, issue response, and after-sales support through one accountable team.",
    },
  ],
} as const;

export const HOMEPAGE_SOLUTIONS_CONTENT = {
  kicker: "Workspace routes",
  title: "Browse by workspace need.",
  compareCta: "Compare product options",
  catalogCta: "Browse full catalog",
  mobileHint: "Swipe to browse categories",
  capabilities: [
    {
      title: "Ergonomic Seating",
      outcome: "Task, executive, and visitor chairs. Backed by warranty and on-site service.",
      href: "/products/seating",
      image: "/images/catalog/oando-seating--fluid-x/image-1.webp",
    },
    {
      title: "Scalable Workstations",
      outcome: "Linear, cluster, and panel systems. Planned around your team size and floor.",
      href: "/products/workstations",
      image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
    },
    {
      title: "Storage Systems",
      outcome: "Lockers, pedestals, and cabinets. Measured, specified, and installed.",
      href: "/products/storages",
      image: "/images/catalog/oando-storage--metal-storages/image-1.webp",
    },
    {
      title: "Collaboration Zones",
      outcome: "Soft seating and lounge systems for meeting rooms, break zones, and reception.",
      href: "/products/soft-seating",
      image: "/images/products/imported/cocoon/image-1.webp",
    },
  ],
} as const;

export const HOMEPAGE_PARTNERSHIP_CONTENT = {
  image: {
    src: "/catalog-logo-sharp.webp",
    alt: "AFC - Authorized Franchise Partner",
  },
  kicker: "Official Strategic Partnership",
  title: ["Authorized Franchise", "Partner"],
  description:
    "Access a stronger manufacturing backbone without losing local planning, installation, and support accountability.",
  cta: {
    label: "Partner Profile",
    href: "/about",
  },
} as const;

export const HOMEPAGE_CTA_SECTION_CONTENT = {
  titleLead: "Ready to",
  titleEmphasis: "Transform",
  titleTail: "Your Space?",
  description:
    "Connect with our design experts today to discuss your project requirements.",
  cta: {
    label: "Start Your Project",
    href: "/contact",
  },
} as const;
