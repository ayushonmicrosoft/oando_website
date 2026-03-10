import { redirect } from "next/navigation";

export default function WorkstationConfiguratorPage() {
  redirect("/planning?type=workstations");
}
