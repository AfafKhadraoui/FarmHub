export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1>Task Detail: {params.id}</h1>
    </div>
  );
}
