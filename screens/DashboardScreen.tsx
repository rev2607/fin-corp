import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, isToday, isTomorrow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useClients } from '../hooks/useClients';
import { RootStackParamList } from '../types';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { clients, loading, loadClients, getTodaysFollowUps, getUpcomingFollowUps } =
    useClients();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const todaysFollowUps = useMemo(() => getTodaysFollowUps(), [getTodaysFollowUps]);
  const upcomingFollowUps = useMemo(() => getUpcomingFollowUps(3), [getUpcomingFollowUps]);

  const formatFollowUpDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'dd MMM');
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

        <GlassCard style={styles.statsCard}>
          <Text style={styles.statsLabel}>Total Clients</Text>
          <Text style={styles.statsValue}>{clients.length}</Text>
        </GlassCard>

        <GlassCard style={styles.followUpsCard}>
          <View style={styles.followUpsHeader}>
            <Text style={styles.cardTitle}>Follow-ups Today</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{todaysFollowUps.length}</Text>
            </View>
          </View>

          {todaysFollowUps.length === 0 ? (
            <Text style={styles.emptyText}>No follow-ups scheduled for today</Text>
          ) : (
            <View style={styles.followUpsList}>
              {todaysFollowUps.slice(0, 3).map((client) => (
                <View key={client.id} style={styles.followUpItem}>
                  <View style={styles.followUpContent}>
                    <Text style={styles.followUpName}>
                      {client.nameOfCustomer}
                    </Text>
                    <Text style={styles.followUpTime}>9:00 AM</Text>
                  </View>
                  <Text style={styles.followUpBank}>{client.loginBankName}</Text>
                </View>
              ))}
            </View>
          )}
        </GlassCard>

        {upcomingFollowUps.length > 0 && (
          <GlassCard style={styles.upcomingCard}>
            <Text style={styles.cardTitle}>Upcoming</Text>
            <View style={styles.upcomingList}>
              {upcomingFollowUps.map((client) => (
                <View key={client.id} style={styles.upcomingItem}>
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
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        <PrimaryButton
          title="New Client"
          onPress={() => navigation.navigate('NewClient')}
          fullWidth
          style={styles.newClientButton}
        />

        <PrimaryButton
          title="View All Clients"
          onPress={() => navigation.navigate('ClientList')}
          variant="secondary"
          fullWidth
          style={styles.viewAllButton}
        />
      </ScrollView>
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
    paddingBottom: theme.spacing.xxl,
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
  },
  statsLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  statsValue: {
    ...theme.typography.h1,
    color: theme.colors.accent.gold,
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
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  followUpContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  followUpName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
  },
  followUpTime: {
    ...theme.typography.caption,
    color: theme.colors.accent.gold,
  },
  followUpBank: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
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
  newClientButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  viewAllButton: {
    marginBottom: theme.spacing.md,
  },
});

