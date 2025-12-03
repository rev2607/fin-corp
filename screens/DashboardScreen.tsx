import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { ProfilePicture } from '../components/ProfilePicture';
import { StatusBadge } from '../components/StatusBadge';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Checkbox } from '../components/Checkbox';
import { useClients } from '../hooks/useClients';
import { RootStackParamList } from '../types';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { clients, loading, loadClients, getTodaysFollowUps, getOverdueFollowUps, getUpcomingFollowUps, markFollowUpCompleted } =
    useClients();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const todaysFollowUps = useMemo(() => getTodaysFollowUps(), [getTodaysFollowUps]);
  const overdueFollowUps = useMemo(() => getOverdueFollowUps(), [getOverdueFollowUps]);
  const upcomingFollowUps = useMemo(() => getUpcomingFollowUps(3), [getUpcomingFollowUps]);

  const handleToggleFollowUp = async (clientId: string, currentStatus: boolean) => {
    await markFollowUpCompleted(clientId, !currentStatus);
  };

  const formatFollowUpDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'dd MMM');
  };

  const getStatusVariant = (followUpDate: string | null) => {
    if (!followUpDate) return 'dueSoon';
    const date = parseISO(followUpDate);
    if (isPast(date) && !isToday(date)) return 'urgent';
    if (isToday(date)) return 'today';
    return 'dueSoon';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadClients}
            tintColor={theme.colors.accent.gold}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>Your client overview</Text>
        </View>

        {/* Total Clients Card - Premium Style */}
        <GlassCard
          style={styles.statsCard}
          onPress={() => navigation.navigate('ClientList')}
          variant="hover"
        >
          <Text style={styles.statsLabel}>TOTAL CLIENTS</Text>
          <Text style={styles.statsValue}>{clients.length}</Text>
        </GlassCard>

        {/* Follow-ups Today Card */}
        <GlassCard style={styles.followUpsCard}>
          <View style={styles.followUpsHeader}>
            <Text style={styles.cardTitle}>Follow-ups Today</Text>
            {todaysFollowUps.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{todaysFollowUps.length}</Text>
              </View>
            )}
          </View>

          {todaysFollowUps.length === 0 ? (
            <Text style={styles.emptyText}>No follow-ups scheduled for today</Text>
          ) : (
            <View style={styles.followUpsList}>
              {todaysFollowUps.slice(0, 3).map((client) => {
                const isCompleted = client.followUpCompleted || false;
                return (
                  <View key={client.id} style={styles.followUpItem}>
                    <Checkbox
                      checked={isCompleted}
                      onPress={() => handleToggleFollowUp(client.id, isCompleted)}
                      size={22}
                      style={styles.checkbox}
                    />
                    <TouchableOpacity
                      style={styles.followUpContent}
                      onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.followUpLeft}>
                        <ProfilePicture
                          name={client.nameOfCustomer}
                          size="small"
                          style={styles.profilePic}
                        />
                        <View style={styles.followUpInfo}>
                          <Text
                            style={[
                              styles.followUpName,
                              isCompleted && styles.strikethrough,
                            ]}
                          >
                            {client.nameOfCustomer}
                          </Text>
                          <Text
                            style={[
                              styles.followUpTime,
                              isCompleted && styles.strikethroughMuted,
                            ]}
                          >
                            9:00 AM
                          </Text>
                        </View>
                      </View>
                      <View style={styles.followUpRight}>
                        <StatusBadge
                          variant={getStatusVariant(client.followUpDate)}
                          style={styles.statusBadge}
                        >
                          Today
                        </StatusBadge>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </GlassCard>

        {/* Overdue Follow-ups */}
        {overdueFollowUps.length > 0 && (
          <GlassCard style={styles.overdueCard}>
            <View style={styles.followUpsHeader}>
              <Text style={styles.cardTitle}>Overdue</Text>
              <View style={[styles.badge, styles.urgentBadge]}>
                <Text style={styles.badgeText}>{overdueFollowUps.length}</Text>
              </View>
            </View>
            <View style={styles.followUpsList}>
              {overdueFollowUps.slice(0, 5).map((client) => {
                const isCompleted = client.followUpCompleted || false;
                return (
                  <View key={client.id} style={styles.followUpItem}>
                    <Checkbox
                      checked={isCompleted}
                      onPress={() => handleToggleFollowUp(client.id, isCompleted)}
                      size={22}
                      style={styles.checkbox}
                    />
                    <TouchableOpacity
                      style={styles.followUpContent}
                      onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.followUpLeft}>
                        <ProfilePicture
                          name={client.nameOfCustomer}
                          size="small"
                          style={styles.profilePic}
                        />
                        <View style={styles.followUpInfo}>
                          <Text
                            style={[
                              styles.followUpName,
                              isCompleted && styles.strikethrough,
                            ]}
                          >
                            {client.nameOfCustomer}
                          </Text>
                          <Text
                            style={[
                              styles.followUpTime,
                              isCompleted && styles.strikethroughMuted,
                            ]}
                          >
                            {client.followUpDate
                              ? format(parseISO(client.followUpDate), 'dd MMM yyyy')
                              : 'No date'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.followUpRight}>
                        <StatusBadge variant="urgent" style={styles.statusBadge}>
                          Overdue
                        </StatusBadge>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        )}

        {/* Upcoming Follow-ups */}
        {upcomingFollowUps.length > 0 && (
          <GlassCard style={styles.upcomingCard}>
            <Text style={styles.cardTitle}>Upcoming</Text>
            <View style={styles.upcomingList}>
              {upcomingFollowUps.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.upcomingItem}
                  onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.upcomingDate}>
                    <Text style={styles.upcomingDateText}>
                      {formatFollowUpDate(client.followUpDate!)}
                    </Text>
                  </View>
                  <View style={styles.upcomingContent}>
                    <Text style={styles.upcomingName}>
                      {client.nameOfCustomer}
                    </Text>
                    <Text style={styles.upcomingBank}>{client.loginBankName}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() => navigation.navigate('NewClient')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Space for FAB
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  statsCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: theme.colors.accent.gold,
    borderWidth: 1,
  },
  statsLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  statsValue: {
    ...theme.typography.h1,
    color: theme.colors.accent.gold,
    fontSize: 48,
  },
  followUpsCard: {
    marginBottom: theme.spacing.md,
  },
  followUpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  badge: {
    backgroundColor: theme.colors.accent.gold,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    ...theme.typography.bodyBold,
    color: '#111217',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    fontStyle: 'italic',
  },
  followUpsList: {
    gap: theme.spacing.md,
  },
  followUpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  checkbox: {
    marginRight: theme.spacing.md,
  },
  followUpContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followUpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    marginRight: theme.spacing.md,
  },
  followUpInfo: {
    flex: 1,
  },
  followUpName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  followUpTime: {
    ...theme.typography.caption,
    color: theme.colors.accent.gold,
  },
  followUpRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    marginBottom: theme.spacing.xs,
  },
  upcomingCard: {
    marginBottom: theme.spacing.md,
  },
  upcomingList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  upcomingDate: {
    width: 80,
  },
  upcomingDateText: {
    ...theme.typography.caption,
    color: theme.colors.accent.blue,
    fontWeight: '600',
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  upcomingBank: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  overdueCard: {
    marginBottom: theme.spacing.md,
  },
  urgentBadge: {
    backgroundColor: theme.colors.urgent || '#FF4444',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  strikethroughMuted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
});
