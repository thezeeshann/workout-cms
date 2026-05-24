import {
  CoachClientsGridSkeleton,
  SectionHeaderSkeleton,
} from "@/components/layout/loading-skeletons";

export default function CoachLoading() {
  return (
    <div className="space-y-8">
      <SectionHeaderSkeleton />
      <CoachClientsGridSkeleton />
    </div>
  );
}
