import { MemberWorkoutDetail } from "./workout-detail";

export default async function MemberWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MemberWorkoutDetail workoutId={id} />;
}
