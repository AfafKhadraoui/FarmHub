export default function FieldHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-6">
      <h1>Field History: {params.id}</h1>
    </div>
  );
}
