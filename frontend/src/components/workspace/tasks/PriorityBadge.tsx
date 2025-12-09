export function PriorityBadge({ priority }: { priority: string }) {
  const priorityConfig: Record<string, { label: string; bg: string; text: string }> = {
    high: { label: 'High', bg: '#FFEBEE', text: '#F44336' },
    medium: { label: 'Medium', bg: '#FFF3E0', text: '#FF9800' },
    low: { label: 'Low', bg: '#E3F2FD', text: '#2196F3' },
  };

  const config = priorityConfig[priority?.toLowerCase()] || priorityConfig.medium;

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
