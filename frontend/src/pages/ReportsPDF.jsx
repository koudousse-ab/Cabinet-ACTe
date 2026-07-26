import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { statusLabel, priorityLabel } from '../utils/statusUtils';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9 },
  title: { fontSize: 18, marginBottom: 12, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 16, textAlign: 'center', color: '#555' },
  table: { display: 'table', width: '100%', marginTop: 10, borderWidth: 1, borderColor: '#000', borderStyle: 'solid' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid' },
  headerRow: { backgroundColor: '#e9ecef', fontWeight: 'bold' },
  col1: { width: '25%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', borderRightStyle: 'solid' },
  col2: { width: '20%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', borderRightStyle: 'solid' },
  col3: { width: '18%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', borderRightStyle: 'solid' },
  col4: { width: '18%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', borderRightStyle: 'solid' },
  col5: { width: '19%', padding: 4 },
  footer: { marginTop: 20, textAlign: 'center', color: '#888', fontSize: 8 },
});

export const ReportsPDF = ({ tasks, title = 'Rapport des tâches', project, enseignant }) => {
  const enhancedTasks = tasks.map(task => ({
    ...task,
    statusLabel: statusLabel(task.status),
    priorityLabel: priorityLabel(task.priority)
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        {project && <Text style={styles.subtitle}>Projet : {project}</Text>}
        {enseignant && <Text style={styles.subtitle}>Enseignant : {enseignant}</Text>}
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.col1}>Titre</Text>
            <Text style={styles.col2}>Assigné à</Text>
            <Text style={styles.col3}>Statut</Text>
            <Text style={styles.col4}>Priorité</Text>
            <Text style={styles.col5}>Date limite</Text>
          </View>
          {enhancedTasks.map(task => (
            <View key={task.id} style={styles.row}>
              <Text style={styles.col1}>{task.title}</Text>
              <Text style={styles.col2}>{task.assignedToName || 'Non assigné'}</Text>
              <Text style={styles.col3}>{task.statusLabel}</Text>
              <Text style={styles.col4}>{task.priorityLabel}</Text>
              <Text style={styles.col5}>{task.dueDate || '-'}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer}>Généré le {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );
};
