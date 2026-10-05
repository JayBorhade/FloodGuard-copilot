type StatusTone =
  | 'safe'
  | 'low'
  | 'moderate'
  | 'high'
  | 'critical'
  | 'unknown'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: StatusTone;
}) {
  return <span className={`status-badge ${tone}`}>{label}</span>;
}
