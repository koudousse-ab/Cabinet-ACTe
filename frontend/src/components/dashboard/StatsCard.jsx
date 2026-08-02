import './StatsCard.css';

// tone : 'navy' | 'info' | 'success' | 'warning' | 'danger' — détermine le liseré de couleur.
export default function StatsCard({ value, label, tone = 'navy' }) {
  return (
    <div className={`stats-card tone-${tone}`}>
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}
