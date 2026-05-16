import { CoachClientDetail } from "./coach-client-detail";

export default async function CoachClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CoachClientDetail clientId={id} />;
}
