"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { hasConsentChoice } from "@/lib/consent";
import { sanitizeDisplayText } from "@/lib/displayText";

type UseCase =
  | "workstations"
  | "seating"
  | "meeting"
  | "storage"
  | "acoustics"
  | "reception"
  | "cafeteria"
  | "full-office"
  | "other";
type Timeline = "immediately" | "one-to-three" | "three-to-six" | "exploring";

type GuidedState = {
  useCase: UseCase | "";
  seats: string;
  company: string;
  city: string;
  timeline: Timeline | "";
  budget: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
};

type AdvisorRecommendation = {
  productUrlKey?: string;
  productId: string;
  productName: string;
  category: string;
  why: string;
  budgetEstimate: string;
};

type AdvisorResult = {
  recommendations: AdvisorRecommendation[];
  totalBudget: string;
  summary: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  result?: AdvisorResult;
};

const AI_STARTERS = [
  "Recommend workstations for a 60-person operations team in Patna.",
  "Suggest a storage plan for HR and finance records in one floor.",
  "Need seating + collaboration furniture for a growing sales office.",
  "Budget-focused workspace options for 40 users with 3-month timeline.",
];

const AI_REFINERS = [
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

const initialGuided: GuidedState = {
  useCase: "",
  seats: "",
  company: "",
  city: "",
  timeline: "",
  budget: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
};

const useCaseLabel: Record<UseCase, string> = {
  workstations: "Workstations",
  seating: "Seating",
  meeting: "Meeting and conference",
  storage: "Storage",
  acoustics: "Acoustics",
  reception: "Reception and lounge",
  cafeteria: "Cafeteria and breakout",
  "full-office": "Full office",
  other: "Other",
};

const timelineLabel: Record<Timeline, string> = {
  immediately: "Immediate (0-4 weeks)",
  "one-to-three": "1-3 months",
  "three-to-six": "3-6 months",
  exploring: "Exploring options",
};

const categoryRoute: Record<string, string> = {
  seating: "seating",
  workstations: "workstations",
  tables: "tables",
  storages: "storages",
  storage: "storages",
  "soft-seating": "soft-seating",
  education: "education",
  "oando-seating": "seating",
  "oando-chairs": "seating",
  "oando-other-seating": "seating",
  "oando-workstations": "workstations",
  "oando-tables": "tables",
  "oando-storage": "storages",
  "oando-soft-seating": "soft-seating",
  "oando-collaborative": "soft-seating",
  "oando-educational": "education",
};

function buildGuidedSummary(guided: GuidedState) {
  const lines = ["Guided planner intake"];
  if (guided.useCase) lines.push(`Use case: ${useCaseLabel[guided.useCase]}`);
  if (guided.seats.trim()) lines.push(`Seats/units: ${guided.seats.trim()}`);
  if (guided.company.trim()) lines.push(`Company: ${guided.company.trim()}`);
  if (guided.city.trim()) lines.push(`City: ${guided.city.trim()}`);
  if (guided.timeline) lines.push(`Timeline: ${timelineLabel[guided.timeline]}`);
  if (guided.budget.trim()) lines.push(`Budget: ${guided.budget.trim()}`);
  if (guided.notes.trim()) lines.push(`Notes: ${guided.notes.trim()}`);
  return lines.join("\n");
}

function recommendationHref(rec: AdvisorRecommendation) {
  const normalized = (rec.category || "").trim().toLowerCase();
  const mapped = categoryRoute[normalized] || normalized.replace(/^oando-/, "") || "";
  if (!mapped) return "/products";
  const key = rec.productUrlKey || rec.productId || "";
  return key ? `/products/${mapped}/${key}` : `/products/${mapped}`;
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function UnifiedAssistant() {
  const pathname = usePathname();
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileLauncherOpen, setMobileLauncherOpen] = useState(false);
  const [consentChosen, setConsentChosen] = useState(true);

  const [guidedStep, setGuidedStep] = useState(0);
  const [guided, setGuided] = useState<GuidedState>(initialGuided);
  const [guidedSaving, setGuidedSaving] = useState(false);
  const [guidedError, setGuidedError] = useState("");
  const [guidedSubmittedId, setGuidedSubmittedId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: generateId("assistant"),
      role: "assistant",
      text: "Hi, I’m your workspace AI assistant. Share your requirement and I’ll suggest practical options.",
    },
  ]);

  useEffect(() => {
    setConsentChosen(hasConsentChoice());

    const handleGuidedOpen = (event: Event) => {
      const custom = event as CustomEvent<{ tab?: "guided" | "ai" }>;
      if (custom.detail?.tab === "ai") {
        setChatOpen(true);
      } else {
        setGuidedOpen(true);
      }
    };
    const handleChatbotOpen = () => setChatOpen(true);
    const handleConsent = () => setConsentChosen(true);

    window.addEventListener("oando-assistant:open", handleGuidedOpen as EventListener);
    window.addEventListener("oando-chatbot:open", handleChatbotOpen as EventListener);
    window.addEventListener("oando-cookie-consent", handleConsent as EventListener);
    return () => {
      window.removeEventListener("oando-assistant:open", handleGuidedOpen as EventListener);
      window.removeEventListener("oando-chatbot:open", handleChatbotOpen as EventListener);
      window.removeEventListener("oando-cookie-consent", handleConsent as EventListener);
    };
  }, []);

  const stepValid = useMemo(() => {
    if (guidedStep === 0) return Boolean(guided.useCase && guided.seats.trim());
    if (guidedStep === 1) return Boolean(guided.city.trim() && guided.timeline);
    return Boolean(guided.name.trim() && guided.email.trim());
  }, [guided, guidedStep]);

  const guidedSummary = useMemo(() => buildGuidedSummary(guided), [guided]);
  const lastUserQuery = useMemo(() => {
    const users = chatMessages.filter((message) => message.role === "user");
    return users.length > 0 ? users[users.length - 1].text : "";
  }, [chatMessages]);

  async function completeGuidedFlow() {
    if (guidedSaving || guidedSubmittedId) return;
    setGuidedSaving(true);
    setGuidedError("");

    try {
      const response = await fetch("/api/customer-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guided.name,
          company: guided.company || undefined,
          email: guided.email,
          phone: guided.phone || undefined,
          message: guidedSummary,
          requirement: guided.useCase || undefined,
          budget: guided.budget || undefined,
          timeline: guided.timeline ? timelineLabel[guided.timeline] : undefined,
          preferredContact: guided.phone.trim() ? "phone" : "email",
          source: "homepage-chatbot",
          sourcePath: pathname,
        }),
      });

      const json = (await response.json()) as { queryId?: string; error?: string };
      if (!response.ok || !json.queryId) {
        setGuidedError(json.error || "Unable to save planner intake right now.");
        return;
      }

      setGuidedSubmittedId(json.queryId);
    } catch {
      setGuidedError("Network error while saving intake.");
    } finally {
      setGuidedSaving(false);
    }
  }

  function handleGuidedNext() {
    if (!stepValid || guidedSaving) return;
    if (guidedStep < 2) {
      setGuidedStep((prev) => prev + 1);
      return;
    }
    void completeGuidedFlow();
  }

  function resetGuided() {
    setGuided(initialGuided);
    setGuidedStep(0);
    setGuidedError("");
    setGuidedSubmittedId(null);
  }

  async function submitAiQuery(inputQuery: string) {
    const trimmed = inputQuery.trim();
    if (!trimmed || aiLoading) return;

    setAiLoading(true);
    setAiError("");
    setQuery("");
    setChatMessages((prev) => [
      ...prev,
      {
        id: generateId("user"),
        role: "user",
        text: trimmed,
      },
    ]);

    try {
      const response = await fetch("/api/ai-advisor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const json = (await response.json()) as AdvisorResult & { error?: string };
      if (!response.ok || !json.recommendations) {
        const errorText = json.error || "Unable to generate recommendations right now.";
        setAiError(errorText);
        setChatMessages((prev) => [
          ...prev,
          {
            id: generateId("assistant"),
            role: "assistant",
            text: `I hit a snag: ${errorText}`,
          },
        ]);
        return;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: generateId("assistant"),
          role: "assistant",
          text: json.summary || "Here are recommended options for your requirement.",
          result: {
            recommendations: json.recommendations,
            totalBudget: json.totalBudget,
            summary: json.summary,
          },
        },
      ]);
    } catch {
      const errorText = "Network error while generating recommendations.";
      setAiError(errorText);
      setChatMessages((prev) => [
        ...prev,
        {
          id: generateId("assistant"),
          role: "assistant",
          text: `I couldn’t reach the advisor right now. ${errorText}`,
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleAiSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    await submitAiQuery(query);
  }

  function applyStarter(text: string) {
    setQuery(text);
    setAiError("");
  }

  function useSurprisePrompt() {
    const index = Math.floor(Math.random() * AI_STARTERS.length);
    applyStarter(AI_STARTERS[index]);
  }

  const mobileLauncherOffset = consentChosen ? "bottom-4" : "bottom-36";
  const mobilePanelOffset = consentChosen ? "bottom-20" : "bottom-52";

  return (
    <>
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setMobileLauncherOpen((prev) => !prev)}
          aria-label="Open workspace assistant"
          aria-expanded={mobileLauncherOpen}
          className={`fixed left-3 z-50 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-xl transition-colors hover:bg-primary ${mobileLauncherOffset}`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">Workspace assistant</span>
        </button>

        {mobileLauncherOpen ? (
          <div
            className={`fixed left-3 right-20 z-50 rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl ${mobilePanelOffset}`}
          >
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileLauncherOpen(false);
                  setGuidedOpen(true);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white"
              >
                <MessageSquareText className="h-4 w-4" />
                Open Guided Planner
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileLauncherOpen(false);
                  setChatOpen(true);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" />
                Open AI Chatbot
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="hidden sm:block">
        <button
          type="button"
          onClick={() => setGuidedOpen(true)}
          aria-label="Open guided planner"
          className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-xl transition-colors hover:bg-primary"
        >
          <MessageSquareText className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wide">Guided planner</span>
        </button>

        <button
          type="button"
          onClick={() => setChatOpen(true)}
          aria-label="Open AI chatbot"
          className="fixed bottom-24 left-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-xl transition-colors hover:bg-primary-hover"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wide">AI chatbot</span>
        </button>
      </div>

      {guidedOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Guided planner"
        >
          <div className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Guided Planner</p>
                  <p className="text-xs text-neutral-500">Structured intake with auto lead capture</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGuidedOpen(false)}
                className="rounded-full bg-neutral-100 p-2 text-neutral-700 transition-colors hover:bg-neutral-200"
                aria-label="Close guided planner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {guidedSubmittedId ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-900">
                    <CheckCircle2 className="h-4 w-4" />
                    Intake submitted
                  </p>
                  <p className="text-sm text-emerald-800">Reference: {guidedSubmittedId}</p>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGuidedOpen(false);
                        setChatOpen(true);
                      }}
                      className="text-xs font-semibold uppercase tracking-wide text-neutral-900 underline"
                    >
                      Open AI chatbot
                    </button>
                    <button
                      type="button"
                      onClick={resetGuided}
                      className="text-xs font-semibold uppercase tracking-wide text-neutral-500 underline"
                    >
                      New intake
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {guidedStep === 0 ? (
                    <>
                      <p className="text-sm text-neutral-700">
                        What project are you planning, and roughly how many seats/units?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(useCaseLabel) as UseCase[]).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setGuided({ ...guided, useCase: key })}
                            className={`rounded-full border px-3 py-1.5 text-xs ${
                              guided.useCase === key
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300 text-neutral-700"
                            }`}
                          >
                            {useCaseLabel[key]}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Seats/units (e.g. 60 workstations)"
                        value={guided.seats}
                        onChange={(event) => setGuided({ ...guided, seats: event.target.value })}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                    </>
                  ) : null}

                  {guidedStep === 1 ? (
                    <>
                      <p className="text-sm text-neutral-700">Add project details.</p>
                      <input
                        type="text"
                        placeholder="Company (optional)"
                        value={guided.company}
                        onChange={(event) => setGuided({ ...guided, company: event.target.value })}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                      <input
                        type="text"
                        placeholder="City and state"
                        value={guided.city}
                        onChange={(event) => setGuided({ ...guided, city: event.target.value })}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(timelineLabel) as Timeline[]).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setGuided({ ...guided, timeline: key })}
                            className={`rounded-full border px-3 py-1.5 text-xs ${
                              guided.timeline === key
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300 text-neutral-700"
                            }`}
                          >
                            {timelineLabel[key]}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Budget (optional)"
                        value={guided.budget}
                        onChange={(event) => setGuided({ ...guided, budget: event.target.value })}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                      <textarea
                        rows={3}
                        placeholder="Notes (optional)"
                        value={guided.notes}
                        onChange={(event) => setGuided({ ...guided, notes: event.target.value })}
                        className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                    </>
                  ) : null}

                  {guidedStep === 2 ? (
                    <>
                      <p className="text-sm text-neutral-700">
                        Add contact details. We save this automatically when you finish.
                      </p>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={guided.name}
                        onChange={(event) => setGuided({ ...guided, name: event.target.value })}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                      <input
                        type="email"
                        placeholder="Work email"
                        value={guided.email}
                        onChange={(event) => setGuided({ ...guided, email: event.target.value })}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={guided.phone}
                        onChange={(event) => setGuided({ ...guided, phone: event.target.value })}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                      />
                    </>
                  ) : null}

                  {guidedError ? <p className="text-sm text-red-600">{guidedError}</p> : null}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setGuidedStep((prev) => (prev > 0 ? prev - 1 : prev))}
                      className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                      disabled={guidedStep === 0 || guidedSaving}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleGuidedNext}
                      disabled={!stepValid || guidedSaving}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {guidedSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : guidedStep === 2 ? (
                        <>
                          Finish
                          <CheckCircle2 className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {chatOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="AI chatbot"
        >
          <div className="relative flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">AI Chatbot</p>
                  <p className="text-xs text-neutral-500">Interactive recommendations with memory in this chat</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="rounded-full bg-neutral-100 p-2 text-neutral-700 transition-colors hover:bg-neutral-200"
                aria-label="Close AI chatbot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-neutral-100 bg-primary/5 px-5 py-3">
              <div className="flex flex-wrap gap-2">
                {AI_STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => applyStarter(starter)}
                    className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {starter}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={useSurprisePrompt}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary"
              >
                <Wand2 className="h-3.5 w-3.5" />
                Surprise me
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-4 py-3 text-sm ${
                      message.role === "user"
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-200 bg-neutral-50 text-neutral-800"
                    }`}
                  >
                    <p>{sanitizeDisplayText(message.text)}</p>

                    {message.result ? (
                      <div className="mt-3 space-y-3">
                        <div className="rounded-lg border border-neutral-200 bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Estimated total
                          </p>
                          <p className="mt-1 text-sm font-semibold text-neutral-900">
                            {message.result.totalBudget}
                          </p>
                        </div>

                        {message.result.recommendations.map((item) => (
                          <div key={`${message.id}-${item.productId}`} className="rounded-lg border border-neutral-200 bg-white p-3">
                            <div className="mb-1 flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-neutral-900">{item.productName}</p>
                              <Link href={recommendationHref(item)} className="text-xs font-semibold uppercase tracking-wide text-primary underline">
                                View
                              </Link>
                            </div>
                            <p className="text-xs text-neutral-700">{item.why}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {aiLoading ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking through options...
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-neutral-100 p-4">
              {lastUserQuery ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  {AI_REFINERS.map((refiner) => (
                    <button
                      key={refiner.label}
                      type="button"
                      onClick={() => void submitAiQuery(refiner.apply(lastUserQuery))}
                      className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {refiner.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setChatOpen(false);
                      setGuidedOpen(true);
                    }}
                    className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    Switch to guided planner
                  </button>
                </div>
              ) : null}

              <form onSubmit={handleAiSubmit} className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ask about layouts, pricing bands, category mix, alternatives..."
                  className="min-h-11 flex-1 resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || aiLoading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
              {aiError ? <p className="mt-2 text-xs text-red-600">{aiError}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
