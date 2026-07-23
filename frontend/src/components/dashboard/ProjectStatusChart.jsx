import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PROJECT_STATUS_COLORS, projectStatusLabel } from '../../utils/statusUtils';
import './ChartCard.css';

export default function ProjectStatusChart({ data }) {
  const chartData = Object.entries(data || {})
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({ name: projectStatusLabel(status), value, status }));

  // Couleurs personnalisées pour le projet (on garde celles de statusUtils)
  const getColor = (status) => {
    const colors = {
      EN_COURS: '#17a2b8',   // bleu visible
      TERMINE: '#28a745',    // vert
      EN_ATTENTE: '#ffc107', // jaune (mais avec fond blanc, ça reste lisible)
      ANNULE: '#dc3545'      // rouge
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="chart-card">
      <h3>Répartition des projets par statut</h3>
      {chartData.length === 0 ? (
        <p>Aucune donnée</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={getColor(entry.status)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
