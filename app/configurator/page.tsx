import { redirect } from "next/navigation";

export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (typeof entry === "string" && entry.length > 0) nextParams.append(key, entry);
      });
      continue;
    }
    if (typeof value === "string" && value.length > 0) nextParams.set(key, value);
  }

  const suffix = nextParams.toString();
  redirect(suffix ? `/planning?${suffix}` : "/planning");
}
