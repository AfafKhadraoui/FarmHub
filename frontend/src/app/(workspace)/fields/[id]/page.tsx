export default function FieldDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-6">
      <h1>Field Detail: {params.id}</h1>
    </div>
  );
}
