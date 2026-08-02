import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { statusLabel } from '../utils/statusUtils';
import { formatDate } from '../utils/dateUtils';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9 },
  title: { fontSize: 18, marginBottom: 12, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 16, textAlign: 'center', color: '#555' },
  table: { display: 'table', width: '100%', marginTop: 10, borderWidth: 1, borderColor: '#000', borderStyle: 'solid' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid' },
  headerRow: { backgroundColor: '#e9ecef', fontWeight: 'bold' },
  dayCol: { width: '18%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', borderRightStyle: 'solid' },
  activitiesCol: { width: '82%', padding: 4 },
  activityBlock: { marginBottom: 6, paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#ccc', borderBottomStyle: 'solid' },
  activityLine: { fontSize: 8, marginBottom: 1 },
  activityTitleLine: { fontSize: 8, fontWeight: 'bold', color: '#1e293b', marginBottom: 1 },
  activityMeta: { fontSize: 7.5, color: '#334155' },
  activityUsers: { fontSize: 7.5, color: '#475569', fontStyle: 'italic' },
  footer: { marginTop: 20, textAlign: 'center', color: '#888', fontSize: 8 },
});

export const WeeklyProgramPDF = ({ weekStart, weekEnd, activitiesByDay, enseignantName }) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const start = new Date(weekStart);
  const end = new Date(weekEnd);

  const getDayActivities = (dayIndex) => {
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    const dateStr = date.toISOString().split('T')[0];
    return activitiesByDay[dateStr] || [];
  };

  const getDayDate = (dayIndex) => {
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    return date;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Programme de la semaine</Text>
        <Text style={styles.subtitle}>
          Du {formatDate(start)} au {formatDate(end)}
          {enseignantName && ` - ${enseignantName}`}
        </Text>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.dayCol}>Jour</Text>
            <Text style={styles.activitiesCol}>Activités (nom, date, horaires, utilisateurs assignés)</Text>
          </View>
          {days.map((day, idx) => {
            const activities = getDayActivities(idx);
            const dayDate = getDayDate(idx);
            return (
              <View key={idx} style={styles.row}>
                <Text style={styles.dayCol}>{day}{'\n'}{formatDate(dayDate)}</Text>
                <View style={styles.activitiesCol}>
                  {activities.length === 0 ? (
                    <Text style={styles.activityLine}>Aucune activité</Text>
                  ) : (
                    activities.map((act, index) => {
                      const isCourse = act.type === 'course';
                      const startTime = isCourse ? act.startTime : act.scheduledTime;
                      const endTime = isCourse ? act.endTime : null;
                      const dateLabel = isCourse
                        ? `${formatDate(act.startDate)}${act.endDate && act.endDate !== act.startDate ? ` au ${formatDate(act.endDate)}` : ''}`
                        : (act.dueDate ? formatDate(act.dueDate) : 'Sans date');
                      return (
                        <View key={index} style={styles.activityBlock}>
                          <Text style={styles.activityTitleLine}>
                            {isCourse ? 'Cours' : 'Tâche'} : {act.title} — {statusLabel(act.status)}
                          </Text>
                          <Text style={styles.activityMeta}>
                            Date : {dateLabel}
                            {startTime ? `  |  Heure : ${startTime}${endTime ? ` - ${endTime}` : ''}` : ''}
                          </Text>
                          <Text style={styles.activityUsers}>
                            Assigné à : {act.assignedUsersLabel || act.assignedToName || 'Non assigné'}
                          </Text>
                        </View>
                      );
                    })
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <Text style={styles.footer}>Généré le {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );
};
