import { notFound } from "next/navigation";
import { ScoutingSessionView } from "@/components/ScoutingSessionView";
import { getScoutingTaskById } from "@/lib/scouting-tasks";

interface ScoutingSessionPageProps {
  params: Promise<{ taskId: string }>;
}

export default async function ScoutingSessionPage({
  params,
}: ScoutingSessionPageProps) {
  const { taskId } = await params;
  const task = getScoutingTaskById(taskId);

  if (!task) {
    notFound();
  }

  return <ScoutingSessionView task={task} />;
}
