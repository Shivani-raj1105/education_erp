import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import studentListService from '../../src/services/studentList.service';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import ErrorBox from '../../src/components/ui/ErrorBox';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  green: '#22c55e',
};

export default function StudentsScreen() {
  const [semester, setSemester] = useState(null);
  const [section, setSection] = useState(null);

  const { data: semData, isLoading: isSemLoading, isError: isSemError, error: semError, refetch: refetchSemesters } = useQuery({
    queryKey: ['student-semesters'],
    queryFn: () => studentListService.getSemesters(),
  });

  const semesters = useMemo(() => semData?.data || semData || [], [semData]);

  useEffect(() => {
    if (semesters.length && !semester) {
      setSemester(semesters[0]);
    }
  }, [semesters, semester]);

  const { data: sectionData, isLoading: isSectionLoading, isError: isSectionError, error: sectionError } = useQuery({
    queryKey: ['student-sections', semester],
    queryFn: () => studentListService.getSections(semester),
    enabled: !!semester,
  });

  const sections = useMemo(() => sectionData?.data || sectionData || [], [sectionData]);

  useEffect(() => {
    if (sections.length && !section) {
      setSection(sections[0]);
    }
  }, [sections, section]);

  const { data: dashboardData, isLoading: isDashboardLoading, isError: isDashboardError, error: dashboardError, refetch: refetchDashboard } = useQuery({
    queryKey: ['student-section-dashboard', semester, section],
    queryFn: () => studentListService.getSectionDashboard(semester, section),
    enabled: !!semester && !!section,
  });

  const dashboard = dashboardData?.data || dashboardData || {};
  const students = dashboard?.students?.data || [];
  const timetable = dashboard?.timetable || [];
  const mappings = dashboard?.subjectFacultyMapping || [];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isSemLoading || isSectionLoading || isDashboardLoading}
            onRefresh={() => {
              refetchSemesters();
              refetchDashboard();
            }}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <Text style={styles.title}>Student List</Text>
        <Text style={styles.subtitle}>Browse students by semester and section</Text>

        {isSemLoading && <LoadingSpinner message="Loading semesters..." />}
        {isSemError && <ErrorBox message={semError?.response?.data?.message || 'Failed to load semesters'} onRetry={refetchSemesters} />}

        {!isSemLoading && semesters.length > 0 && (
          <View style={styles.selectCard}>
            <Text style={styles.sectionTitle}>Semester</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {semesters.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, semester === item && styles.chipActive]}
                  onPress={() => setSemester(item)}
                >
                  <Text style={[styles.chipText, semester === item && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {!isSectionLoading && sections.length > 0 && (
          <View style={styles.selectCard}>
            <Text style={styles.sectionTitle}>Section</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {sections.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, section === item && styles.chipActive]}
                  onPress={() => setSection(item)}
                >
                  <Text style={[styles.chipText, section === item && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {isSectionError && <ErrorBox message={sectionError?.response?.data?.message || 'Failed to load sections'} />}
        {isDashboardError && <ErrorBox message={dashboardError?.response?.data?.message || 'Failed to load student dashboard'} onRetry={refetchDashboard} />}

        {dashboard && !isDashboardLoading && (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryBox}>
                <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                <Text style={styles.summaryValue}>{students.length}</Text>
                <Text style={styles.summaryLabel}>Students</Text>
              </View>
              <View style={styles.summaryBox}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.green} />
                <Text style={styles.summaryValue}>{timetable.length}</Text>
                <Text style={styles.summaryLabel}>Timetable Slots</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Subject Faculty Mapping</Text>
              {mappings.length > 0 ? mappings.map((item, index) => (
                <View key={`${item.subject || index}`} style={[styles.listRow, index < mappings.length - 1 && styles.listBorder]}>
                  <Text style={styles.listText}>{item.subject || item.subjectName || 'Subject'}</Text>
                  <Text style={styles.listTextMuted}>{item.faculty?.name || item.facultyName || 'Unassigned'}</Text>
                </View>
              )) : <Text style={styles.emptyText}>No subject assignments found.</Text>}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Students</Text>
              {students.length > 0 ? students.map((student, index) => (
                <View key={student.id || `${student.name}-${index}`} style={[styles.listRow, index < students.length - 1 && styles.listBorder]}>
                  <Text style={styles.listText}>{student.name || student.studentName || 'Student'}</Text>
                  <Text style={styles.listTextMuted}>{student.rollNo || student.registerNo || '—'}</Text>
                </View>
              )) : <Text style={styles.emptyText}>No students available for this section.</Text>}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  selectCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  chipsRow: {
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  summaryCard: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 8,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 10,
  },
  listBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listText: {
    color: COLORS.text,
    fontSize: 13,
    flex: 1,
  },
  listTextMuted: {
    color: COLORS.textMuted,
    fontSize: 12,
    maxWidth: '45%',
    textAlign: 'right',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
