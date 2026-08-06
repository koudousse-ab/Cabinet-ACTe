import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { statusLabel } from '../utils/statusUtils';
import { formatDate } from '../utils/dateUtils';

const COLORS = {
  course: '#2563eb',
  task: '#d97706',
  border: '#000',
  headerBg: '#1e293b',
  dayBg: '#f1f5f9',
  muted: '#64748b',
};

const styles = StyleSheet.create({
  page: { padding: 30, paddingBottom: 50, fontSize: 9, fontFamily: 'Helvetica' },

  // En-tête fixe (répété sur chaque page)
  headerFixed: { marginBottom: 16, borderBottomWidth: 2, borderBottomColor: COLORS.headerBg, paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 11, marginTop: 4, textAlign: 'center', color: COLORS.muted },

  // Section par jour (une View = un jour, casse proprement entre pages)
  daySection: { marginBottom: 10 },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.dayBg,
    padding: 6,
    borderRadius: 2,
  },
  dayName: { fontSize: 11, fontWeight: 'bold' },
  dayDate: { fontSize: 9, color: COLORS.muted },
  dayCount: { fontSize: 8, color: COLORS.muted },

  emptyDay: { padding: 6, fontSize: 8, color: COLORS.muted, fontStyle: 'italic' },

  // Carte d'activité
  activityCard: {
    flexDirection: 'row',
    marginTop: 4,
    paddingLeft: 6,
    borderLeftWidth: 3,
  },
  activityCourse: { borderLeftColor: COLORS.course },
  activityTask: { borderLeftColor: COLORS.task },
  activityBody: { flex: 1, paddingVertical: 2 },
  activityTitleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  activityTitle: { fontSize: 8.5, fontWeight: 'bold', color: '#1e293b' },
  badge: { fontSize: 7, color: '#fff', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 },
  badgeCourse: { backgroundColor: COLORS.course },
  badgeTask: { backgroundColor: COLORS.task },
  activityMeta: { fontSize: 7.5, color: '#334155', marginTop: 1 },
  activityUsers: { fontSize: 7.5, color: COLORS.muted, fontStyle: 'italic', marginTop: 1 },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: COLORS.muted,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 4,
  },
});

const getActivityTime = (act) => {
  const isCourse = act.type === 'course';
  return isCourse ? act.startTime : act.scheduledTime;
};

export const WeeklyProgramPDF = ({ weekStart, weekEnd, activitiesByDay, enseignantName }) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const start = new Date(weekStart);
  const end = new Date(weekEnd);

  const getDayDate = (dayIndex) => {
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    return date;
  };

  const getDayActivities = (dayIndex) => {
    const date = getDayDate(dayIndex);
    const dateStr = date.toISOString().split('T')[0];
    const activities = activitiesByDay[dateStr] || [];
    // Tri chronologique : activités avec heure d'abord, "sans heure" en dernier
    return [...activities].sort((a, b) => {
      const timeA = getActivityTime(a) || '99:99';
      const timeB = getActivityTime(b) || '99:99';
      return timeA.localeCompare(timeB);
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerFixed} fixed>
          <Text style={styles.title}>Programme de la semaine</Text>
          <Text style={styles.subtitle}>
            Du {formatDate(start)} au {formatDate(end)}
            {enseignantName && ` — ${enseignantName}`}
          </Text>
        </View>

        {days.map((day, idx) => {
          const activities = getDayActivities(idx);
          const dayDate = getDayDate(idx);

          return (
            <View key={idx} style={styles.daySection} wrap={false}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{day} — {formatDate(dayDate)}</Text>
                <Text style={styles.dayCount}>
                  {activities.length} activité{activities.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {activities.length === 0 ? (
                <Text style={styles.emptyDay}>Aucune activité</Text>
              ) : (
                activities.map((act, index) => {
                  const isCourse = act.type === 'course';
                  const startTime = getActivityTime(act);
                  const endTime = isCourse ? act.endTime : null;
                  const dateLabel = isCourse
                    ? `${formatDate(act.startDate)}${act.endDate && act.endDate !== act.startDate ? ` au ${formatDate(act.endDate)}` : ''}`
                    : (act.dueDate ? formatDate(act.dueDate) : 'Sans date');

                  return (
                    <View
                      key={index}
                      style={[styles.activityCard, isCourse ? styles.activityCourse : styles.activityTask]}
                    >
                      <View style={styles.activityBody}>
                        <View style={styles.activityTitleRow}>
                          <Text style={styles.activityTitle}>{act.title}</Text>
                          <Text style={[styles.badge, isCourse ? styles.badgeCourse : styles.badgeTask]}>
                            {isCourse ? 'COURS' : 'TÂCHE'} · {statusLabel(act.status)}
                          </Text>
                        </View>
                        <Text style={styles.activityMeta}>
                          {dateLabel}
                          {startTime ? `  •  ${startTime}${endTime ? ` - ${endTime}` : ''}` : ''}
                        </Text>
                        <Text style={styles.activityUsers}>
                          {act.assignedUsersLabel || act.assignedToName || 'Non assigné'}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          );
        })}

        <View style={styles.footer} fixed>
          <Text>Généré le {new Date().toLocaleDateString('fr-FR')}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
