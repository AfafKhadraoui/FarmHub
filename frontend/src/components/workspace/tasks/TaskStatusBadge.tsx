export function TaskStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    pending: { label: 'Pending', bg: '#FFF7E6', text: '#F4B400' },
    inprogress: { label: 'In Progress', bg: '#E6F0FF', text: '#2196F3' },
    completed: { label: 'Completed', bg: '#E8F5E9', text: '#4CAF50' },
    todo: { label: 'Todo', bg: '#FFF7E6', text: '#F4B400' },
    overdue: { label: 'Overdue', bg: '#FFEBEE', text: '#F44336' },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
