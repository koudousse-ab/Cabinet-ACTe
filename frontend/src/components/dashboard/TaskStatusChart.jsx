import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_COLORS, statusLabel } from '../../utils/statusUtils';
import './ChartCard.css';

export default function TaskStatusChart({ data }) {
  const chartData = Object.entries(data || {}).map(([status, value]) => ({
    name: statusLabel(status),
    value,
    status
  }));

  return (
    <div className="chart-card">
      <h3>Répartition des tâches par statut</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
