import type { ClientBadgeData } from "@/components/ClientBadge";

export const ABOUT_PAGE_COPY = {
  heroTitle: "About One and Only Furniture",
  heroSubtitle:
    "We design and deliver workspace systems that stay practical, durable, and scalable as teams grow.",
  sectionKicker: "Who we are",
  sectionTitle: "A planning-first furniture partner for modern offices.",
  paragraphs: [
    "We combine workplace planning, product selection, and execution support so teams can move from concept to handover with fewer delays and better outcomes.",
    "Our projects cover ergonomic seating, modular workstations, meeting environments, storage, and support services tailored to enterprise and institutional needs.",
    "Every engagement is managed for clarity: documented scope, practical timelines, and accountable after-sales support.",
  ],
  confidenceKicker: "Client confidence",
  confidenceTitle: "Trusted by enterprise and institutional teams.",
  confidenceCta: "View all clients",
} as const;

export const CONTACT_PAGE_COPY = {
  heroTitle: "Contact us",
  heroSubtitle: "Share your workspace requirement and our team will respond with next steps.",
  sectionTitle: "Office and support contacts",
  offices: [
    {
      title: "Corporate office",
      lines: ["401, Jagat Trade Centre", "Frazer Road", "Patna - 800 013", "India"],
    },
    {
      title: "Showroom",
      lines: [
        "One and Only Furniture Pvt Ltd",
        "Opp Patliputra Telephone Exchange",
        "North Industrial Estate Road",
        "Patna - 800 010",
        "India",
      ],
    },
  ],
} as const;

export const TRUSTED_BY_PAGE_COPY = {
  heroTitle: "Trusted by",
  heroSubtitle:
    "Trusted by industry leaders across government, manufacturing, finance, automotive, IT, and institutional sectors.",
} as const;

export const PROJECTS_PAGE_COPY = {
  heroTitle: "Our Work",
  heroSubtitleTemplate:
    "{clients} organisations trust One and Only Furniture across Government, Finance, Energy, Manufacturing and more.",
  featuredLabel: "Featured organisations",
  allLabel: "All organisations",
} as const;

export const PROJECTS_PAGE_CLIENTS: ClientBadgeData[] = [
  { name: "Adani Power", sector: "Energy" },
  { name: "Adecco", sector: "Corporate" },
  { name: "Ambuja Neotia", sector: "Corporate" },
  { name: "Annapurna Finance", sector: "Finance" },
  { name: "Asian Paints", sector: "FMCG" },
  { name: "Azim Premji Foundation", sector: "NGO / UN" },
  { name: "BBC Media Action", sector: "NGO / UN" },
  { name: "BHEL", sector: "Energy" },
  { name: "Bureau of Indian Standards", sector: "Government" },
  { name: "BNP Paribas", sector: "Finance" },
  { name: "BSPHCL", sector: "Energy", location: "Bihar" },
  { name: "Bandhan Bank", sector: "Finance" },
  { name: "Big Bazaar", sector: "FMCG" },
  { name: "Government of Bihar", sector: "Government", location: "Patna" },
  { name: "Indian Army", sector: "Government" },
  { name: "Birla School", sector: "Education" },
  { name: "CIMP", sector: "Education", location: "Patna" },
  { name: "CRI Pumps", sector: "Manufacturing" },
  { name: "Canara Bank", sector: "Finance" },
  { name: "Coca-Cola", sector: "FMCG" },
  { name: "DMRC", sector: "Government", location: "New Delhi" },
  { name: "Dalmia Bharat Cement", sector: "Manufacturing" },
  { name: "Essel Utilities", sector: "Energy" },
  { name: "FHI 360", sector: "NGO / UN" },
  { name: "Franklin Templeton Investments", sector: "Finance" },
  { name: "D. Goenka School", sector: "Education" },
  { name: "Government of India", sector: "Government" },
  { name: "HDFC", sector: "Finance" },
  { name: "HelpAge India", sector: "NGO / UN" },
  { name: "Hyundai", sector: "Automotive" },
  { name: "IDBI Bank", sector: "Finance" },
  { name: "ITC Limited", sector: "FMCG" },
  { name: "Income Tax Department", sector: "Government" },
  { name: "Indian Bank", sector: "Finance" },
  { name: "IndianOil", sector: "Energy" },
  { name: "Amara Raja", sector: "Manufacturing" },
  { name: "JSW", sector: "Manufacturing" },
  { name: "Janalakshmi", sector: "Finance" },
  { name: "L&T", sector: "Manufacturing" },
  { name: "Maruti Suzuki", sector: "Automotive" },
  { name: "NTPC", sector: "Energy" },
  { name: "NABARD", sector: "Finance" },
  { name: "SAIL", sector: "Manufacturing" },
  { name: "State Bank of India", sector: "Finance" },
  { name: "SITI Networks", sector: "Telecom" },
  { name: "Shriram", sector: "Finance" },
  { name: "Sonalika International", sector: "Manufacturing" },
  { name: "Survey of India", sector: "Government" },
  { name: "Syndicate Bank", sector: "Finance" },
  { name: "Tata Steel", sector: "Manufacturing" },
  { name: "Tata Motors", sector: "Automotive" },
  { name: "Titan", sector: "Manufacturing", location: "Patna, Bihar" },
  { name: "TVS Group", sector: "Automotive" },
  { name: "United Nations", sector: "NGO / UN" },
  { name: "Usha International", sector: "Manufacturing", location: "New Delhi" },
  { name: "Ujjivan Small Finance Bank", sector: "Finance" },
  { name: "UNICEF", sector: "NGO / UN" },
  { name: "United Spirits", sector: "FMCG" },
  { name: "Vodafone", sector: "Telecom" },
  { name: "World Health Organization", sector: "NGO / UN" },
  { name: "ZTE", sector: "Telecom" },
];

export const PORTFOLIO_PAGE_COPY = {
  heroTitle: "Portfolio",
  heroSubtitle: "Real delivery photos grouped by client projects.",
  eyebrow: "Project gallery",
  title: "Client portfolio snapshots",
  totalTemplate: "{clients} clients - {photos} photos",
} as const;

export const PORTFOLIO_CLIENTS = [
  {
    id: "titan",
    folder: "Titan",
    name: "Titan",
    location: "Patna, Bihar",
    summary: "Collaborative office zones with modular seating and meeting layouts.",
  },
  {
    id: "tvs",
    folder: "TVS",
    name: "TVS",
    location: "Patna, Bihar",
    summary: "Workspace planning across leadership cabins, desking, and collaboration bays.",
  },
  {
    id: "usha",
    folder: "Usha",
    name: "Usha",
    location: "Patna, Bihar",
    summary: "End-to-end supply and on-site setup with execution-ready furniture systems.",
  },
  {
    id: "dmrc",
    folder: "DMRC",
    name: "DMRC",
    location: "New Delhi",
    summary: "Operational office furniture delivery built for high-use enterprise teams.",
  },
  {
    id: "franklin-templeton",
    folder: "FranklinTempleton",
    name: "Franklin Templeton",
    location: "India",
    summary: "Formal workspace setups with consistent finishes and executive-ready detailing.",
  },
  {
    id: "government",
    folder: "Govenment",
    name: "Government",
    location: "Patna, Bihar",
    summary: "Durable institutional deployments with practical day-to-day usability.",
  },
] as const;

export const GALLERY_PAGE_COPY = {
  heroTitle: "Project Gallery",
  heroSubtitle:
    "Selected workspace deliveries across corporate, public, and institutional environments.",
  kicker: "Recent visual highlights",
  title: "Real projects, real installations.",
  description:
    "Browse completed site photos to understand finish quality, layout styles, and delivery scale across different project types.",
} as const;

export const GALLERY_PROJECTS = [
  {
    title: "Titan Workspace",
    location: "Patna",
    image: "/projects/Titan/27-06-2025 Image 05_edited_edited.webp",
    category: "Corporate fit-out",
  },
  {
    title: "TVS Office",
    location: "Patna",
    image: "/projects/TVS/27-06-2025 Image 03.webp",
    category: "Operations floor",
  },
  {
    title: "DMRC Facility",
    location: "New Delhi",
    image: "/projects/DMRC/IMG_20200612_145931.webp",
    category: "Institutional workspace",
  },
  {
    title: "Usha Setup",
    location: "Patna",
    image: "/projects/Usha/DSC_0077_edited.webp",
    category: "Workspace modernization",
  },
  {
    title: "Government Office",
    location: "Patna",
    image: "/projects/Govenment/20140707_124458_compressed.webp",
    category: "Public sector project",
  },
  {
    title: "Franklin Templeton",
    location: "India",
    image: "/projects/FranklinTempleton/WhatsApp Image 2020-08-28 at 12.40.51.webp",
    category: "Enterprise deployment",
  },
] as const;

export const SHOWROOMS_PAGE_COPY = {
  heroTitle: "Showrooms, journey, and client delivery.",
  heroSubtitle:
    "A closer look at our execution model, project footprint, and the teams who trust us.",
  trustedKicker: "Trusted at a glance",
  aboutKicker: "About us",
  aboutTitle:
    "Building workspaces with clear planning, reliable supply, and accountable delivery.",
  aboutDescription:
    "We started with regional office projects and expanded into multi-city execution. Our operating model remains consistent: defined scope, practical timelines, and strong after-sales support.",
  clientsKicker: "Clients we have served",
  clientsCta: "View full client list",
  highlightsKicker: "Signature deliveries",
  highlightsCta: "Explore portfolio",
  sustainabilityTitle: "Designed responsibly, delivered practically.",
  sustainabilitySubtitle: "Sustainability",
  sustainabilityDescription:
    "From material choices to long-life product planning, we focus on workspace systems that reduce waste and improve lifecycle value.",
  sustainabilityCta: "Read sustainability commitments",
} as const;

export const SHOWROOMS_CLIENTS = [
  "DMRC",
  "Tata Steel",
  "HDFC",
  "IndianOil",
  "L&T",
  "NTPC",
  "Titan",
  "Bihar Tourism",
] as const;

export const SHOWROOMS_HIGHLIGHTS = [
  {
    title: "DMRC Offices",
    detail: "Workspace systems delivered with phase-wise planning and installation handover.",
  },
  {
    title: "Titan Patna HQ",
    detail: "Ergonomic seating and workstation deployment aligned to team-level needs.",
  },
  {
    title: "Enterprise Fit-outs",
    detail: "Turnkey planning, supply, and execution for large office and institutional spaces.",
  },
] as const;

export const SOLUTIONS_PAGE_COPY = {
  metadataTitle: "Workspace Planning Approach",
  metadataDescription:
    "See how One and Only Furniture plans, specifies, and delivers workspace projects from brief to after-sales support.",
  heroTitle: "How we deliver workspace projects",
  heroSubtitle:
    "A structured approach for planning, procurement alignment, execution, and support.",
  deliveryKicker: "Delivery model",
  deliveryTitle: "Built for teams that need predictability and speed.",
  deliveryDescription:
    "Every project is managed through clear scope definition, practical planning outputs, and accountable on-site execution. The result is smoother approvals and fewer surprises during rollout.",
  stats: [
    { value: "14+", label: "Years in workspace projects" },
    { value: "120+", label: "Projects delivered" },
    { value: "250+", label: "Client organizations served" },
    { value: "20+", label: "Cities supported" },
  ],
  processKicker: "Process detail",
  processTitle: "Three phases from brief to handover.",
  planningKicker: "Start planning",
  planningTitle: "Discuss your project brief with our planning team.",
  planningDescription:
    "Share site details, timelines, and seat count. We will suggest a practical approach for products, layout, and execution.",
  planningPrimaryCta: "Request planning call",
  planningSecondaryCta: "Browse product categories",
} as const;

export const SOLUTIONS_DELIVERY_STEPS = [
  {
    title: "Brief and business requirements",
    detail:
      "We align on team structure, workflow priorities, budget range, and decision checkpoints.",
    image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
  },
  {
    title: "Layout, specification, and BOQ",
    detail:
      "Design options are translated into practical category selections and quantity plans for approval.",
    image: "/images/catalog/oando-tables--curvivo-meet/image-1.webp",
  },
  {
    title: "Execution and handover support",
    detail:
      "Delivery, installation, and warranty onboarding are managed with clear communication and accountability.",
    image: "/images/catalog/oando-soft-seating--accent/image-1.webp",
  },
] as const;

export const SUSTAINABILITY_PAGE_COPY = {
  heroTitle: "Thinking Green.",
  heroSubtitle:
    "Sustainability is deeply rooted in our corporate philosophy. For us, sustainable action means thinking about tomorrow, today.",
  introTitleLead: "Our Responsibility for the ",
  introTitleEmphasis: "Future.",
  introDescription:
    "Sustainable furniture construction starts with the selection of materials and does not end with production. We take a holistic view of our ecological footprint.",
  pillars: [
    {
      title: "Eco-friendly materials",
      detail:
        "We use responsibly sourced wood and low-emission materials that reduce impact without compromising durability.",
      icon: "leaf",
    },
    {
      title: "Circular economy",
      detail:
        "Our products are designed to be disassembled and recycled. Up to 98% of materials can return to the cycle in a closed-loop system.",
      icon: "recycle",
    },
    {
      title: "Energy efficiency",
      detail:
        "Our production workflow prioritizes efficient energy use and cleaner power sources across operations.",
      icon: "lightbulb",
    },
  ],
  ecoScoreTitle: "Our Eco-Score System",
  ecoScoreDescription:
    "Transparency is the foundation of structural change. We use an Eco-Score rating (1 to 10) for every product in our catalog. This metric evaluates the complete lifecycle of our furniture systems.",
  ecoScoreItems: [
    {
      index: "1",
      title: "Materials",
      detail:
        "Preference for recycled aluminum, responsibly sourced woods, and post-consumer plastics.",
    },
    {
      index: "2",
      title: "Manufacturing",
      detail:
        "Partnering with local factories to reduce transit emissions significantly.",
    },
    {
      index: "3",
      title: "Longevity",
      detail:
        "Heavy-duty construction and verified quality benchmarks help keep products out of landfills for longer.",
    },
  ],
  badges: [
    {
      title: "Eco-Score: 8+",
      detail:
        "Products in this range use a majority of recycled or renewable materials, are produced with lower freight impact, and are designed for long service life.",
    },
    {
      title: "Eco-Score: 5-7",
      detail:
        "These products meet core environmental baselines with selected sustainable inputs, safer adhesives, and replaceable wear components.",
    },
  ],
  verifiedTitle: "Verified sustainability",
  verifiedDescription:
    "Our sustainability program is tracked with independent benchmarks and regular internal quality audits.",
  verifiedLabels: ["Low emission", "Responsible source", "Long life"],
} as const;

export const CAREER_PAGE_COPY = {
  heroTitle: "Careers",
  heroSubtitle:
    "Join a team that builds practical, high-impact workspaces for organizations across India.",
  introKicker: "Why join us",
  introTitle: "Build your career in workspace delivery.",
  introDescription:
    "We work across planning, product consulting, project delivery, and support. If you care about reliable execution and customer outcomes, you will fit well here.",
  pillars: [
    {
      title: "Collaborative teams",
      detail:
        "Sales, planning, and operations work closely so decisions are clear and execution stays fast.",
      icon: "users",
    },
    {
      title: "Learning-focused work",
      detail:
        "You gain practical exposure to real client briefs, procurement cycles, and installation realities.",
      icon: "graduation-cap",
    },
    {
      title: "Meaningful responsibility",
      detail:
        "We give ownership early, with mentorship and clear accountability standards.",
      icon: "briefcase",
    },
  ],
  openingsTitle: "Current openings",
  openingsAvailableTemplate: "{count} roles available",
  fallbackTitle: "No matching role yet?",
  fallbackDescription:
    "Send your profile and let us know where you can contribute. We review applications for sales, operations, planning, and support functions on a rolling basis.",
  careersEmail: "careers@oando.co.in",
} as const;

export const CAREER_PAGE_JOBS = [
  {
    title: "Project Sales Manager",
    department: "Enterprise Sales",
    location: "Patna",
  },
  {
    title: "Workspace Planner",
    department: "Planning and Design",
    location: "Patna",
  },
  {
    title: "Site Execution Coordinator",
    department: "Operations",
    location: "Patna and travel",
  },
  {
    title: "Customer Support Executive",
    department: "After-sales Support",
    location: "Patna",
  },
] as const;

export const PLANNING_PAGE_COPY = {
  heroTitle: "Planning Service",
  heroSubtitle:
    "Workspace planning that balances workflow, budget, and execution timelines.",
  workflowKicker: "Planning workflow",
  workflowTitle: "From intent to implementation-ready plans.",
  deliverablesKicker: "What you receive",
  deliverablesTitle: "Clear deliverables your team can execute.",
  bestForKicker: "Best for",
  bestForDescription:
    "New offices, floor expansions, workspace modernization, and enterprise fit-outs where planning quality directly impacts cost and timeline.",
  primaryCta: "Request planning call",
  secondaryCta: "View products",
} as const;

export const PLANNING_PAGE_STEPS = [
  {
    title: "Discovery and brief alignment",
    detail:
      "We map team structure, workflow patterns, budget constraints, and approval checkpoints before design begins.",
  },
  {
    title: "Layout and specification",
    detail:
      "Our team develops 2D/3D concepts and furniture specifications tailored to headcount, zoning, and performance targets.",
  },
  {
    title: "Execution readiness",
    detail:
      "You receive BOQ-ready documentation, phased implementation options, and a clear handover plan for procurement and fit-out teams.",
  },
] as const;

export const PLANNING_PAGE_DELIVERABLES = [
  "Workplace planning workshop",
  "Space zoning and furniture layout",
  "Category-wise furniture recommendations",
  "Budget-aligned BOQ draft",
  "Implementation roadmap",
] as const;

export const SERVICE_PAGE_COPY = {
  heroTitle: "Service and Support",
  heroSubtitle:
    "After-sales support designed for reliability, accountability, and long-term performance.",
  frameworkKicker: "Support framework",
  frameworkTitle:
    "One service partner from installation through after-sales support.",
  channelsKicker: "Service channels",
  channelsTitle: "Reach our support team directly.",
  supportKicker: "Need immediate support?",
  supportDescription:
    "Share your project or service reference number and issue summary. Our support team will route it to the right specialist and respond with next steps.",
  primaryCta: "Raise a support request",
  secondaryCta: "Track order",
} as const;

export const SERVICE_PAGE_PILLARS = [
  {
    title: "Installation and commissioning",
    detail:
      "On-site assembly, placement, and functional checks coordinated with your facility and project teams.",
  },
  {
    title: "Warranty and issue management",
    detail:
      "Structured support for warranty claims, replacements, and corrective service actions with clear tracking.",
  },
  {
    title: "Preventive care",
    detail:
      "Periodic inspection and maintenance guidance to preserve ergonomics, finish quality, and long-term performance.",
  },
] as const;

export const SERVICE_PAGE_CHANNELS = [
  {
    label: "Phone support",
    kind: "supportPhone",
  },
  {
    label: "Email support",
    kind: "salesEmail",
  },
  {
    label: "WhatsApp support",
    kind: "whatsapp",
    value: "Start chat",
    href: "https://wa.me/919031022875?text=Hi,%20I%20need%20support%20for%20an%20installed%20workspace%20project.",
  },
] as const;

export const DOWNLOADS_PAGE_COPY = {
  heroTitle: "Downloads",
  heroSubtitle:
    "Get product catalogs, technical sheets, and planning resources for your project.",
  resourceKicker: "Resource center",
  resourceTitle: "Documentation packs tailored to your workspace requirement.",
  urgentKicker: "Need files now?",
  urgentDescription:
    "Share your project brief and required categories. Our team will send the relevant documents directly with version details and support contacts.",
  primaryCta: "Request documents",
  secondaryCta: "Email support",
} as const;

export const DOWNLOADS_RESOURCE_CATEGORIES = [
  {
    title: "Product catalogs",
    detail: "Collection overviews, category snapshots, and recommended product mixes.",
    cta: "Request catalog pack",
    href: "/contact",
  },
  {
    title: "Technical sheets",
    detail: "Material specifications, dimensions, warranty terms, and usage guidance.",
    cta: "Request technical sheets",
    href: "/contact",
  },
  {
    title: "Planning references",
    detail: "Layout examples, workstation densities, and execution best practices.",
    cta: "Request planning references",
    href: "/planning",
  },
] as const;

export const CONFIGURATOR_PAGE_COPY = {
  heroTitle: "Workspace Module Configurator",
  heroSubtitle:
    "Configure workstation or storage modules with room dimensions, screens, modesty panels, raceways, and power/data points, then send a full enquiry.",
  statsLabels: [
    "Client organizations served",
    "Projects delivered",
    "Sectors served",
  ],
} as const;
