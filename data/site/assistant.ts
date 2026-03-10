export const AI_ASSISTANT_WELCOME_MESSAGE =
  "Hi, I am your workspace AI assistant. Share your requirement and I will suggest practical options.";

export const AI_ASSISTANT_STARTERS = [
  "Recommend workstations for a 60-person operations team in Patna.",
  "Suggest a storage plan for HR and finance records in one floor.",
  "Need seating and collaboration furniture for a growing sales office.",
  "Budget-focused workspace options for 40 users with 3-month timeline.",
] as const;

export const AI_ASSISTANT_REFINERS = [
  {
    label: "Lower budget",
    apply: (query: string) => `Give lower-budget alternatives for: ${query}`,
  },
  {
    label: "Premium options",
    apply: (query: string) => `Give premium alternatives for: ${query}`,
  },
  {
    label: "Faster delivery",
    apply: (query: string) => `Prioritize faster delivery options for: ${query}`,
  },
  {
    label: "More ergonomic",
    apply: (query: string) => `Focus more on ergonomic performance for: ${query}`,
  },
] as const;

export const AI_ADVISOR_SAMPLE_QUERIES = [
  "Ergonomic seating for Bihar government project, 50 people",
  "Modular workstations for a 20-person tech startup in Patna",
  "Conference room furniture for corporate head office",
  "Complete office setup for 100-seat BPO centre",
] as const;

export const AI_ADVISOR_COPY = {
  subtitle: "Powered by One and Only x ChatGPT 5.4",
  intro:
    "Describe your workspace project - team size, industry, location, and budget - and I will engineer a curated system recommendation from our live catalog.",
  surpriseLabel: "Try a sample",
  loading: "Analysing catalog and engineering your recommendations...",
  placeholder:
    "e.g. Ergonomic seating for Bihar government project, 50 people...",
} as const;

export const GUIDED_PLANNER_COPY = {
  title: "Guided Planner",
  subtitle: "Structured intake with auto lead capture",
  summaryTitle: "Guided planner intake",
  stepOneIntro: "What project are you planning, and roughly how many seats or units?",
  stepTwoIntro: "Add project details.",
  stepThreeIntro: "Add contact details. We save this automatically when you finish.",
  submittedTitle: "Intake submitted",
  submittedFollowUp: "Open AI chatbot",
  submittedReset: "New intake",
  back: "Back",
  continue: "Continue",
  finish: "Finish",
  saving: "Saving",
  placeholders: {
    seats: "Seats or units (e.g. 60 workstations)",
    company: "Company (optional)",
    city: "City and state",
    budget: "Budget (optional)",
    notes: "Notes (optional)",
    name: "Your name",
    email: "Work email",
    phone: "Phone (optional)",
  },
  errors: {
    saveFailed: "Unable to save planner intake right now.",
    network: "Network error while saving intake.",
  },
} as const;

export const GUIDED_PLANNER_USE_CASES = [
  { id: "workstations", label: "Workstations" },
  { id: "seating", label: "Seating" },
  { id: "meeting", label: "Meeting and conference" },
  { id: "storage", label: "Storage" },
  { id: "acoustics", label: "Acoustics" },
  { id: "reception", label: "Reception and lounge" },
  { id: "cafeteria", label: "Cafeteria and breakout" },
  { id: "full-office", label: "Full office" },
  { id: "other", label: "Other" },
] as const;

export const GUIDED_PLANNER_TIMELINES = [
  { id: "immediately", label: "Immediate (0-4 weeks)" },
  { id: "one-to-three", label: "1-3 months" },
  { id: "three-to-six", label: "3-6 months" },
  { id: "exploring", label: "Exploring options" },
] as const;

export const AI_CHATBOT_COPY = {
  title: "AI Chatbot",
  subtitle: "Interactive recommendations with memory in this chat",
  summaryFallback: "Here are recommended options for your requirement.",
  advisorUnavailable: "Unable to generate recommendations right now.",
  advisorNetwork: "Network error while generating recommendations.",
  errorPrefix: "I hit a snag:",
  networkPrefix: "I could not reach the advisor right now.",
  totalLabel: "Estimated total",
  switchToPlanner: "Switch to guided planner",
  thinking: "Thinking through options...",
  placeholder: "Ask about layouts, pricing bands, category mix, alternatives...",
  send: "Send",
} as const;

export const MOBILE_ASSISTANT_COPY = {
  launcher: "Workspace assistant",
  planner: "Open Guided Planner",
  chatbot: "Open AI Chatbot",
} as const;
