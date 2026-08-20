import { redirect } from "next/navigation";
import { getDefaultScoutingRoute } from "@/lib/scouting-tasks";

export default function DashboardPage() {
  redirect(getDefaultScoutingRoute());
}
