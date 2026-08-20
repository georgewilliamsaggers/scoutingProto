import { getDefaultScoutingRoute } from "@/lib/scouting-tasks";

export const DEMO_EMAIL = "demo@farm.com";

export function getPostLoginRoute(): string {
  return getDefaultScoutingRoute();
}
