import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { statusLabel } from '../utils/statusUtils';
import { formatDate } from '../utils/dateUtils';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 8, fontFamily: 'Helvetica' },
  
  // En-tête avec Logo et Titre
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 10,
  },
  logo: {
    width: 70,
    height: 40,
    objectFit: 'contain',
  },
  titleGroup: {
    textAlign: 'right',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 9, color: '#64748b', marginTop: 2 },

  // Tableau principal
  table: {
    display: 'table',
    width: '100%',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderStyle: 'solid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cbd5e1',
    borderBottomStyle: 'solid',
    alignItems: 'stretch',
  },
  tableHeaderRow: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Configuration des Colonnes (Total = 100%)
  colDay: { width: '18%', padding: 5, borderRightWidth: 0.5, borderRightColor: '#cbd5e1' },
  colTitle: { width: '37%', padding: 5, borderRightWidth: 0.5, borderRightColor: '#cbd5e1' },
  colTime: { width: '23%', padding: 5, borderRightWidth: 0.5, borderRightColor: '#cbd5e1' },
  colUser: { width: '22%', padding: 5 },

  // En-têtes de colonnes spécifiques
  headerText: { fontSize: 8, fontWeight: 'bold', color: '#ffffff' },

  // Cellules
  dayDateText: { fontSize: 7.5, color: '#475569', marginTop: 2 },
  dayNameText: { fontWeight: 'bold', color: '#0f172a' },
  
  activityType: { fontSize: 7, color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase' },
  activityTitle: { fontWeight: 'bold', color: '#1e293b', marginBottom: 2 },
  statusText: { fontSize: 7, color: '#475569' },
  
  metaText: { fontSize: 7.5, color: '#334155' },
  userText: { fontSize: 7.5, color: '#334155', fontStyle: 'italic' },
  
  emptyText: { color: '#94a3b8', fontStyle: 'italic', padding: 5 },

  // Pied de page
  footer: { marginTop: 15, textAlign: 'center', color: '#94a3b8', fontSize: 7 },
});

export const WeeklyProgramPDF = ({ weekStart, weekEnd, activitiesByDay, enseignantName, logoUrl }) => {
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
        
        {/* En-tête avec Logo */}
        <View style={styles.headerContainer}>
          {logoUrl ? (
            <Image style={styles.logo} src={logo.png} />
          ) : (
            <View style={{ width: 70 }} /> {/* Espace vide réservé si pas de logo */}
          )}
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Programme de la semaine</Text>
            <Text style={styles.subtitle}>
              Du {formatDate(start)} au {formatDate(end)}
              {enseignantName && ` | ${enseignantName}`}
            </Text>
          </View>
        </View>

        {/* Tableau */}
        <View style={styles.table}>
          
          {/* Ligne d'en-tête du tableau */}
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <Text style={[styles.colDay, styles.headerText]}>Jour & Date</Text>
            <Text style={[styles.colTitle, styles.headerText]}>Activité & Statut</Text>
            <Text style={[styles.colTime, styles.headerText]}>Horaires / Dates</Text>
            <Text style={[styles.colUser, styles.headerText]}>Assigné à</Text>
          </View>

          {/* Contenu par jour */}
          {days.map((day, idx) => {
            const activities = getDayActivities(idx);
            const dayDate = getDayDate(idx);

            // Si aucune activité le jour J
            if (activities.length === 0) {
              return (
                <View key={idx} style={styles.tableRow}>
                  <View style={styles.colDay}>
                    <Text style={styles.dayNameText}>{day}</Text>
                    <Text style={styles.dayDateText}>{formatDate(dayDate)}</Text>
                  </View>
                  <View style={{ width: '82%' }}>
                    <Text style={styles.emptyText}>Aucune activité prévue</Text>
                  </View>
                </View>
              );
            }

            // Si des activités existent pour la journée
            return activities.map((act, actIdx) => {
              const isCourse = act.type === 'course';
              const startTime = isCourse ? act.startTime : act.scheduledTime;
              const endTime = isCourse ? act.endTime : null;
              const dateLabel = isCourse
                ? `${formatDate(act.startDate)}${act.endDate && act.endDate !== act.startDate ? ` au ${formatDate(act.endDate)}` : ''}`
                : (act.dueDate ? formatDate(act.dueDate) : '-');

              return (
                <View key={`${idx}-${actIdx}`} style={styles.tableRow}>
                  {/* Colonne Jour (Affichée uniquement sur la première activité de la journée) */}
                  <View style={styles.colDay}>
                    {actIdx === 0 && (
                      <>
                        <Text style={styles.dayNameText}>{day}</Text>
                        <Text style={styles.dayDateText}>{formatDate(dayDate)}</Text>
                      </>
                    )}
                  </View>

                  {/* Colonne Activité */}
                  <View style={styles.colTitle}>
                    <Text style={styles.activityType}>{isCourse ? 'Cours' : 'Tâche'}</Text>
                    <Text style={styles.activityTitle}>{act.title}</Text>
                    <Text style={styles.statusText}>Statut : {statusLabel(act.status)}</Text>
                  </View>

                  {/* Colonne Horaires/Dates */}
                  <View style={styles.colTime}>
                    {startTime && (
                      <Text style={styles.metaText}>
                        {startTime}{endTime ? ` - ${endTime}` : ''}
                      </Text>
                    )}
                    <Text style={styles.metaText}>Réf: {dateLabel}</Text>
                  </View>

                  {/* Colonne Assigné à */}
                  <View style={styles.colUser}>
                    <Text style={styles.userText}>
                      {act.assignedUsersLabel || act.assignedToName || 'Non assigné'}
                    </Text>
                  </View>
                </View>
              );
            });
          })}
        </View>

        {/* Pied de page */}
        <Text style={styles.footer}>
          Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
        </Text>
      </Page>
    </Document>
  );
};
