import { MemberPageLoading } from "@/components/layout/loading-skeletons";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-5xl flex-col px-4 py-8">
      <MemberPageLoading variant="home" />
    </div>
  );
}
