import { redirect } from "next/navigation";

interface ScoutingSessionPageProps {
  params: Promise<{ taskId: string }>;
}

export default async function ScoutingSessionPage({
  params,
}: ScoutingSessionPageProps) {
  await params;
  redirect("/scouting");
}
