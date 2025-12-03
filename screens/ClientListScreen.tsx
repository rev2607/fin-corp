import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { theme } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { ProfilePicture } from '../components/ProfilePicture';
import { StatusBadge } from '../components/StatusBadge';
import { useClients } from '../hooks/useClients';
import { Client } from '../types';
import { RootStackParamList } from '../types';

type ClientListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ClientList'
>;

export const ClientListScreen: React.FC = () => {
  const navigation = useNavigation<ClientListScreenNavigationProp>();
  const { clients, loading } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  const filteredClients = useMemo(() => {
    let result = clients;
    
    // Apply filter
    if (filter === 'today') {
      result = result.filter((client) => {
        if (!client.followUpDate) return false;
        return isToday(parseISO(client.followUpDate));
      });
    } else if (filter === 'upcoming') {
      result = result.filter((client) => {
        if (!client.followUpDate) return false;
        const date = parseISO(client.followUpDate);
        return !isPast(date) || isToday(date);
      });
    }

    // Apply search
    if (!searchQuery.trim()) {
      return result;
    }

    const query = searchQuery.toLowerCase();
    return result.filter(
      (client) =>
        client.nameOfCustomer.toLowerCase().includes(query) ||
        client.contactNumber.includes(query) ||
        (client.nameOfCoApplicant &&
          client.nameOfCoApplicant.toLowerCase().includes(query)) ||
        client.loginBankName.toLowerCase().includes(query)
    );
  }, [clients, searchQuery, filter]);

  const getStatusVariant = (followUpDate: string | null) => {
    if (!followUpDate) return 'dueSoon' as const;
    const date = parseISO(followUpDate);
    if (isPast(date) && !isToday(date)) return 'urgent' as const;
    if (isToday(date)) return 'today' as const;
    return 'dueSoon' as const;
  };

  const renderClientCard = ({ item }: { item: Client }) => (
    <GlassCard
      style={styles.clientCard}
      onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
      variant="hover"
    >
      <View style={styles.clientCardContent}>
        <ProfilePicture
          name={item.nameOfCustomer}
          size="medium"
          style={styles.profilePicture}
        />
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.nameOfCustomer}</Text>
          {item.followUpDate && (
            <View style={styles.followUpRow}>
              <Text style={styles.followUpLabel}>Follow-up </Text>
              <Text style={styles.followUpDate}>
                {format(parseISO(item.followUpDate), 'dd MMMM')}
              </Text>
            </View>
          )}
          <Text style={styles.bankName}>{item.loginBankName}</Text>
        </View>
        {item.followUpDate && (
          <StatusBadge variant={getStatusVariant(item.followUpDate)}>
            {isToday(parseISO(item.followUpDate))
              ? 'Today'
              : isPast(parseISO(item.followUpDate))
              ? 'Urgent'
              : format(parseISO(item.followUpDate), 'dd MMM')}
          </StatusBadge>
        )}
      </View>
      {item.requiredLoanAmount && (
        <Text style={styles.loanAmount}>
          ₹{parseInt(item.requiredLoanAmount).toLocaleString('en-IN')}
        </Text>
      )}
    </GlassCard>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clients</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone, or bank..."
          placeholderTextColor={theme.colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'today' && styles.filterTabActive]}
          onPress={() => setFilter('today')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'today' && styles.filterTabTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'upcoming' && styles.filterTabActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'upcoming' && styles.filterTabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredClients}
        renderItem={renderClientCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No clients found'
                : loading
                ? 'Loading...'
                : 'No clients yet'}
            </Text>
            {!searchQuery && !loading && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('NewClient')}
              >
                <Text style={styles.emptyButtonText}>Add Your First Client</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  searchContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchInput: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    height: 52,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterTab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: theme.colors.accent.gold,
    borderColor: theme.colors.accent.gold,
  },
  filterTabText: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  filterTabTextActive: {
    color: '#111217',
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  clientCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  clientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    marginRight: theme.spacing.md,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  followUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs / 2,
  },
  followUpLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  followUpDate: {
    ...theme.typography.caption,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  bankName: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontSize: 12,
  },
  loanAmount: {
    ...theme.typography.bodyBold,
    color: theme.colors.accent.gold,
    marginTop: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.md,
  },
  emptyButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent.gold,
  },
  emptyButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.accent.gold,
  },
});
