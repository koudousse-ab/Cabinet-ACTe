import './StatsCard.css';

export default function StatsCard({ icon, value, label }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div>
        <div className="stats-value">{value}</div>
        <div className="stats-label">{label}</div>
      </div>
    </div>
  );
}
