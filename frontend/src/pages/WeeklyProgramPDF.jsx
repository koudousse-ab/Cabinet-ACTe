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
  activityItem: { fontSize: 8, marginBottom: 2 },
  activityType: { fontWeight: 'bold', color: '#1e293b' },
  footer: { marginTop: 20, textAlign: 'center', color: '#888', fontSize: 8 },
});

export const WeeklyProgramPDF = ({ weekStart, weekEnd, activitiesByDay, employeeName }) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const start = new Date(weekStart);
  const end = new Date(weekEnd);

  const getDayActivities = (dayIndex) => {
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    const dateStr = date.toISOString().split('T')[0];
    return activitiesByDay[dateStr] || [];
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Programme de la semaine</Text>
        <Text style={styles.subtitle}>
          Du {formatDate(start)} au {formatDate(end)}
          {employeeName && ` - ${employeeName}`}
        </Text>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.dayCol}>Jour</Text>
            <Text style={styles.activitiesCol}>Activités</Text>
          </View>
          {days.map((day, idx) => {
            const activities = getDayActivities(idx);
            return (
              <View key={idx} style={styles.row}>
                <Text style={styles.dayCol}>{day}</Text>
                <View style={styles.activitiesCol}>
                  {activities.length === 0 ? (
                    <Text style={styles.activityItem}>Aucune activité</Text>
                  ) : (
                    activities.map((act, index) => (
                      <Text key={index} style={styles.activityItem}>
                        {act.type === 'course' ? '🎓 Cours' : '📋 Tâche'} - {act.title}
                        {act.type === 'course' && act.startTime && ` (${act.startTime})`}
                        {' - '}
                        <Text style={styles.activityType}>
                          {act.type === 'course' ? statusLabel(act.status) : statusLabel(act.status)}
                        </Text>
                      </Text>
                    ))
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
