import { useState } from 'react';
import reportApi from '../../api/reportApi';
import { downloadBlob, printElement } from '../../utils/printUtils';

export default function ReportExport({ weekStart, employeeId }) {
 const [exporting, setExporting] = useState(false);

 const handleExportPdf = () => {
 setExporting(true);
 reportApi
 .exportPDF(weekStart, employeeId)
 .then((res) => downloadBlob(res.data, `bilan-hebdomadaire-${weekStart}.pdf`))
 .catch(() => alert("Erreur lors de l'export PDF"))
 .finally(() => setExporting(false));
 };

 return (
 <div style={{ display: 'flex', gap: 8 }}>
 <button
 className="btn-primary"
 style={{ , , border: 'none', padding: '8px 14px', borderRadius: 4, cursor: 'pointer' }}
 onClick={handleExportPdf}
 disabled={exporting}
 >
 {exporting ? 'Export...' : 'Export PDF'}
 </button>
 <button
 style={{ , , border: 'none', padding: '8px 14px', borderRadius: 4, cursor: 'pointer' }}
 onClick={() => printElement('weekly-report-content', 'Bilan hebdomadaire')}
 >
 Imprimer
 </button>
 </div>
);
}
