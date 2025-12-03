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

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) {
      return clients;
    }

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.nameOfCustomer.toLowerCase().includes(query) ||
        client.contactNumber.includes(query) ||
        (client.nameOfCoApplicant &&
          client.nameOfCoApplicant.toLowerCase().includes(query)) ||
        client.loginBankName.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const getFollowUpBadgeStyle = (followUpDate: string | null) => {
    if (!followUpDate) return null;
    
    const date = parseISO(followUpDate);
    if (isPast(date) && !isToday(date)) {
      return { backgroundColor: theme.colors.error };
    }
    if (isToday(date)) {
      return { backgroundColor: theme.colors.accent.gold };
    }
    return { backgroundColor: theme.colors.accent.blue };
  };

  const renderClientCard = ({ item }: { item: Client }) => (
    <GlassCard
      style={styles.clientCard}
      onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
      variant="hover"
    >
      <View style={styles.clientHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{item.nameOfCustomer}</Text>
          {item.nameOfCoApplicant && (
            <Text style={styles.coApplicant}>
              + {item.nameOfCoApplicant}
            </Text>
          )}
        </View>
        {item.followUpDate && (
          <View
            style={[styles.followUpBadge, getFollowUpBadgeStyle(item.followUpDate)]}
          >
            <Text style={styles.followUpBadgeText}>
              {isToday(parseISO(item.followUpDate))
                ? 'Today'
                : format(parseISO(item.followUpDate), 'dd MMM')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.clientDetails}>
        <Text style={styles.clientDetailText}>
          {item.loginBankName}
        </Text>
        <Text style={styles.clientDetailText}>{item.contactNumber}</Text>
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
  },
  searchInput: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  clientCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs / 2,
  },
  coApplicant: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  followUpBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  followUpBadgeText: {
    ...theme.typography.small,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  clientDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  clientDetailText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
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

