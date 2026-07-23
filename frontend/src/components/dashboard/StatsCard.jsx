import './StatsCard.css';

export default function StatsCard({ value, label }) {
  return (
    <div className="stats-card">
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}
