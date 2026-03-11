export const HOMEPAGE_HERO_CONTENT = {
  eyebrowPrimary: "",
  eyebrowSecondary: "Premium workspaces",
  title: ["Spaces that work", "as hard as your team.", ""],
  description: "",
  primaryCta: { label: "Guided Planner", href: "/contact" },
  secondaryCta: { label: "View Products", href: "/products" },
  proofCards: [
    { label: "Selected clients", value: "DMRC, Titan, Tata Steel" },
    { label: "Service", value: "Planning, installation, after-sales" },
  ],
  deliverySummary: {
    kicker: "Project delivery",
    title: "From brief to handover.",
    description: "One team through planning, installation, and support.",
  },
  deliveryRows: [
    {
      label: "Plan",
      value: "Scope, layout, and BOQ aligned early.",
    },
    {
      label: "Deliver",
      value: "Dispatch and installation managed together.",
    },
    {
      label: "Support",
      value: "Warranty and after-sales stay traceable.",
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
  logoLabel: "Trusted by India's leading corporations",
  logos: [
    { name: "Titan", src: "/images/home/client-logos/titan.png" },
    { name: "L&T", src: "/images/home/client-logos/lt.png" },
    { name: "JSW", src: "/images/home/client-logos/jsw.png" },
    { name: "Tata Motors", src: "/images/home/client-logos/tata-motors.jpg" },
    { name: "Maruti Suzuki", src: "/images/home/client-logos/maruti-suzuki.png" },
    { name: "HDFC", src: "/images/home/client-logos/hdfc.jpg" },
  ],
  projectsCta: "View all projects",
} as const;

export const HOMEPAGE_WORKSPACES_CONTENT = {
  titlePrimary: "Workspaces we have",
  titleAccent: "transformed.",
  cta: { label: "View Full Gallery", href: "/gallery" },
  cards: [
    {
      sector: "Showroom",
      title: "Experience Centre",
      location: "Patna",
      image: "/images/home/workspaces/showroom-hero.jpg",
    },
    {
      sector: "Corporate",
      title: "Titan Office",
      location: "Patna, Bihar",
      image: "/images/home/workspaces/titan-hero.jpg",
    },
    {
      sector: "Automobile",
      title: "TVS Motors",
      location: "Patna",
      image: "/images/home/workspaces/tvs-hero.jpg",
    },
    {
      sector: "Government",
      title: "Registry Office",
      location: "Government Sector",
      image: "/images/home/workspaces/government-hero.jpg",
    },
  ],
} as const;

export const HOMEPAGE_CLIENT_STORIES_CONTENT = {
  kicker: "Client stories",
  titleLead: "Trusted by",
  titleEmphasis: "Industry Leaders",
  description: "See what our clients have to say about their experience working with us.",
  cards: [
    {
      quote:
        "One and Only Furniture transformed our entire office. The modular workstations are not just beautiful but incredibly functional.",
      client: "TechStart Solutions",
      sector: "IT & Banking",
    },
    {
      quote:
        "Excellent quality and service. They delivered 500+ workstations on time and the installation was seamless for our team.",
      client: "GovTech India",
      sector: "Government",
    },
    {
      quote:
        "The ergonomic chairs have made a real difference for our employees. Great product quality and support.",
      client: "AutoCorp",
      sector: "Automobile",
    },
  ],
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
      outcome:
        "Task and executive seating tuned for posture support, long-hour comfort, and dependable after-sales coverage.",
      href: "/products/seating",
      image: "/images/catalog/oando-seating--fluid-x/image-1.webp",
    },
    {
      title: "Scalable Workstations",
      outcome:
        "Modular systems that scale team by team with practical cable management and planning-friendly layouts.",
      href: "/products/workstations",
      image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
    },
    {
      title: "Secure Storage Systems",
      outcome:
        "Lockers, pedestals, and cabinets built for secure daily use with efficient footprint planning.",
      href: "/products/storages",
      image: "/images/catalog/oando-storage--metal-storages/image-1.webp",
    },
    {
      title: "Collaboration Zones",
      outcome:
        "Flexible settings for huddles and client meetings without breaking operational flow.",
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
    "Bringing world-class manufacturing excellence and sustainable furniture solutions to your workspace.",
  cta: {
    label: "Partner Profile",
    href: "/about",
  },
} as const;
