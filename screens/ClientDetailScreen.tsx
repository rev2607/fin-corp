import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format, parseISO } from 'date-fns';
import { theme } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { useClients } from '../hooks/useClients';
import { Client, RootStackParamList } from '../types';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

type ClientDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ClientDetail'
>;
type ClientDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ClientDetail'
>;

export const ClientDetailScreen: React.FC = () => {
  const navigation = useNavigation<ClientDetailScreenNavigationProp>();
  const route = useRoute<ClientDetailScreenRouteProp>();
  const { clientId } = route.params;
  const { deleteClient } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationInfo, setNotificationInfo] =
    useState<{ identifier: string; triggerDate: Date } | null>(null);

  useEffect(() => {
    loadClient();
    loadNotificationInfo();
  }, [clientId]);

  // Reload client when screen comes into focus (e.g., after editing)
  useFocusEffect(
    React.useCallback(() => {
      if (clientId) {
        loadClient();
        loadNotificationInfo();
      }
    }, [clientId])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditClient', { clientId })}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Text style={styles.headerButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, clientId]);

  const loadClient = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading client with ID:', clientId);
      const loadedClient = await storageService.getClientById(clientId);
      if (loadedClient) {
        console.log('Client loaded successfully:', loadedClient.nameOfCustomer);
        setClient(loadedClient);
        setError(null);
      } else {
        console.error('Client not found for ID:', clientId);
        setError('Client not found');
        // Don't navigate away immediately - let user see the error
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    } catch (error) {
      console.error('Error loading client:', error);
      console.error('Error details:', error instanceof Error ? error.stack : error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to load client: ${errorMessage}`);
      // Show error for 3 seconds before navigating back
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationInfo = async () => {
    try {
      // Make notification loading non-blocking - don't let errors prevent screen from loading
      const info = await notificationService.getClientNotificationInfo(clientId);
      if (info) {
        setNotificationInfo(info);
      }
    } catch (error) {
      // Silently ignore notification errors - they're not critical for viewing client details
      console.warn('Could not load notification info (non-critical):', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${client?.nameOfCustomer}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteClient(clientId);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to delete client');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent.gold} />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  if (error || !client) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || 'Client not found'}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Client Details</Text>

        <GlassCard style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Name of Customer</Text>
            <Text style={styles.fieldValue}>{client.nameOfCustomer}</Text>
          </View>
        </GlassCard>

        {client.nameOfCoApplicant && (
          <GlassCard style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Name of Co-Applicant</Text>
              <Text style={styles.fieldValue}>{client.nameOfCoApplicant}</Text>
            </View>
          </GlassCard>
        )}

        <GlassCard style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Contact Number</Text>
            <Text style={styles.fieldValue}>{client.contactNumber}</Text>
          </View>
        </GlassCard>

        {client.referral && (
          <GlassCard style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Referral</Text>
              <Text style={styles.fieldValue}>{client.referral}</Text>
            </View>
          </GlassCard>
        )}

        {client.requiredLoanAmount && client.requiredLoanAmount.trim() && (
          <GlassCard style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Required Loan Amount</Text>
              <Text style={[styles.fieldValue, styles.amountValue]}>
                {(() => {
                  try {
                    const amount = parseInt(client.requiredLoanAmount);
                    return isNaN(amount) 
                      ? `₹${client.requiredLoanAmount}`
                      : `₹${amount.toLocaleString('en-IN')}`;
                  } catch (error) {
                    return `₹${client.requiredLoanAmount}`;
                  }
                })()}
              </Text>
            </View>
          </GlassCard>
        )}

        <GlassCard style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Login (Bank Name)</Text>
            <Text style={styles.fieldValue}>{client.loginBankName}</Text>
          </View>
        </GlassCard>

        {client.securityInformation && (
          <GlassCard style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Security Information</Text>
              <Text style={styles.fieldValue}>{client.securityInformation}</Text>
            </View>
          </GlassCard>
        )}

        {client.followUpDate && (
          <GlassCard style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Follow-up Date</Text>
              <Text style={styles.fieldValue}>
                {(() => {
                  try {
                    return format(parseISO(client.followUpDate), 'dd MMMM yyyy');
                  } catch (error) {
                    console.error('Error formatting follow-up date:', error);
                    return client.followUpDate;
                  }
                })()}
              </Text>
            </View>
          </GlassCard>
        )}

        {notificationInfo && (
          <GlassCard style={StyleSheet.flatten([styles.card, styles.notificationCard])}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Notification</Text>
              <Text style={styles.notificationText}>
                {(() => {
                  try {
                    return `Follow-up reminder scheduled for ${format(notificationInfo.triggerDate, 'h:mm a')} on ${format(notificationInfo.triggerDate, 'dd MMM yyyy')}`;
                  } catch (error) {
                    console.error('Error formatting notification date:', error);
                    return 'Follow-up reminder scheduled';
                  }
                })()}
              </Text>
            </View>
          </GlassCard>
        )}

        <GlassCard style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Created</Text>
            <Text style={styles.fieldValue}>
              {(() => {
                try {
                  return format(parseISO(client.createdAt), 'dd MMM yyyy, h:mm a');
                } catch (error) {
                  console.error('Error formatting createdAt:', error);
                  return client.createdAt;
                }
              })()}
            </Text>
          </View>
          {client.updatedAt && client.updatedAt !== client.createdAt && (
            <View style={[styles.field, styles.fieldTopMargin]}>
              <Text style={styles.fieldLabel}>Last Updated</Text>
              <Text style={styles.fieldValue}>
                {(() => {
                  try {
                    return format(parseISO(client.updatedAt), 'dd MMM yyyy, h:mm a');
                  } catch (error) {
                    console.error('Error formatting updatedAt:', error);
                    return client.updatedAt;
                  }
                })()}
              </Text>
            </View>
          )}
        </GlassCard>

        <View style={styles.actions}>
          <PrimaryButton
            title="Edit"
            onPress={() => navigation.navigate('EditClient', { clientId })}
            fullWidth
            style={styles.actionButton}
          />
          <PrimaryButton
            title="Delete"
            onPress={handleDelete}
            variant="secondary"
            fullWidth
            style={styles.actionButton}
          />
        </View>
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
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  field: {
    marginBottom: theme.spacing.sm,
  },
  fieldTopMargin: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  fieldLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  fieldValue: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  amountValue: {
    ...theme.typography.h3,
    color: theme.colors.accent.gold,
  },
  notificationCard: {
    backgroundColor: theme.colors.background.cardHover,
    borderColor: theme.colors.accent.blue,
  },
  notificationText: {
    ...theme.typography.body,
    color: theme.colors.accent.blue,
  },
  actions: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  headerButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.accent.gold,
    fontSize: 16,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent.gold,
  },
  backButtonText: {
    ...theme.typography.bodyBold,
    color: theme.colors.accent.gold,
  },
});

