import { useNavigate } from 'react-router-dom';
import './RecentActivity.css';

export default function RecentActivity({ recentProjects, recentTasks }) {
 const navigate = useNavigate();

 return (
 <div className="recent-activity">
 <h3>Activités récentes</h3>
 <div className="recent-columns">
 <div>
 <h4>Derniers projets créés</h4>
 {(recentProjects || []).length === 0 && <p>Aucun</p>}
 {(recentProjects || []).map((p) => (
 <div key={p.id} className="recent-item" onClick={() => navigate(`/projects/${p.id}`)}>
 {p.name}
 </div>
))}
 </div>
 <div>
 <h4>Dernières tâches modifiées</h4>
 {(recentTasks || []).length === 0 && <p>Aucune</p>}
 {(recentTasks || []).map((t) => (
 <div key={t.id} className="recent-item" onClick={() => navigate(`/tasks?edit=${t.id}`)}>
 {t.title}
 </div>
))}
 </div>
 </div>
 </div>
);
}
