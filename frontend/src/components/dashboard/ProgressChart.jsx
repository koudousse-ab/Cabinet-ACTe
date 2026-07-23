import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './ChartCard.css';

export default function ProgressChart({ data }) {
  const chartData = (data || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }));

  return (
    <div className="chart-card">
      <h3>Cycle d'avancement (7 derniers jours)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData}>
          <XAxis dataKey="label" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3D2B1F" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
