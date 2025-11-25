export function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div>
      {title}: {value}
    </div>
  );
}
