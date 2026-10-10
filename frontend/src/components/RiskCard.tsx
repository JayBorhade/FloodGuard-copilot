import type { RiskLevel } from '../types/api';
import type { RiskData } from '../services/flood-risk';

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'safe':
      return 'var(--risk-safe)';
    case 'low':
      return 'var(--risk-low)';
    case 'moderate':
      return 'var(--risk-moderate)';
    case 'high':
      return 'var(--risk-high)';
    case 'critical':
      return 'var(--risk-critical)';
    default:
      return 'var(--risk-unknown)';
  }
}

function getSourceLabel(source: string): string {
  switch (source) {
    case 'official':
      return 'Official Alert';
    case 'community':
      return 'Community Report';
    case 'model':
      return 'Model Prediction';
    case 'derived':
      return 'FloodGuard Analysis';
    default:
      return 'System';
  }
}

export function RiskCard({ risk }: { risk: RiskData | null }) {
  if (!risk) {
    return (
      <div className="card risk-card">
        <div className="card-topline">
          <span className="section-label">Current flood risk</span>
        </div>
        <div className="risk-value">—</div>
        <p className="risk-subtitle">Unavailable</p>
      </div>
    );
  }

  const hasEvidence = risk.data_available && !risk.is_stale;

  return (
    <div className="card risk-card">
      <div className="card-topline">
        <span className="section-label">Current flood risk</span>
        {risk.is_stale && <span className="stale-badge">Unknown / stale</span>}
      </div>

      <div className="risk-display">
        <div
          className="risk-level-badge"
          style={{ backgroundColor: getRiskColor(risk.level) }}
        >
          {risk.level.toUpperCase()}
        </div>
        <div className="risk-metrics">
          <div className="metric">
            <span className="metric-label">Score</span>
            <span className="metric-value">{hasEvidence ? risk.score.toFixed(0) : '—'}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Confidence</span>
            <span className="metric-value">{hasEvidence ? `${risk.confidence}%` : 'Unavailable'}</span>
          </div>
        </div>
      </div>

      <p className="risk-summary">{risk.summary}</p>

      <div className="risk-footer">
        <div className="risk-source">
          <span className="source-label">Source:</span>
          <span className="source-value">{getSourceLabel(risk.source)}</span>
        </div>
        <div className="risk-age">
          <span className="age-label">Updated:</span>
          <span className="age-value">
            {!risk.data_available || risk.data_age_minutes === null
              ? 'No live evidence'
              : risk.data_age_minutes < 1
                ? 'just now'
                : `${risk.data_age_minutes} min ago`}
          </span>
        </div>
      </div>
    </div>
  );
}
