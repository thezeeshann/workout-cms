import { AdminClientDetail } from "./admin-client-detail";

export default async function AdminClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminClientDetail clientId={id} />;
}
