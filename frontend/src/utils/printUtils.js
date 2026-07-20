/**
 * Ouvre la boîte de dialogue d'impression du navigateur pour un élément donné,
 * en isolant son contenu (le reste de la page n'apparaît pas à l'impression).
 */
export function printElement(elementId, title = 'Impression') {
  const content = document.getElementById(elementId);
  if (!content) {
    console.error(`printElement: aucun élément trouvé avec l'id "${elementId}"`);
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert("Impossible d'ouvrir la fenêtre d'impression (bloqueur de pop-up ?)");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #222; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 13px; }
          th { background-color: #0066cc; color: white; }
          h1, h2, h3 { color: #222; }
        </style>
      </head>
      <body>${content.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

/**
 * Déclenche le téléchargement d'un blob (ex: PDF reçu de l'API) sous un nom de fichier donné.
 */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
