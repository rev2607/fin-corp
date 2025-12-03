import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { generateId } from '../utils/idGenerator';
import { normalizeDateForStorage } from '../utils/dateUtils';
import { GlassCard } from '../components/GlassCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { InputField } from '../components/InputField';
import { DatePickerField } from '../components/DatePickerField';
import { BankPicker } from '../components/BankPicker';
import { useClients } from '../hooks/useClients';
import { Client, ClientFormData, RootStackParamList } from '../types';

type NewClientScreenRouteProp = RouteProp<RootStackParamList, 'NewClient'>;
type NewClientScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewClient'
>;

export const NewClientScreen: React.FC = () => {
  const navigation = useNavigation<NewClientScreenNavigationProp>();
  const { saveClient } = useClients();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ClientFormData>({
    nameOfCustomer: '',
    nameOfCoApplicant: '',
    contactNumber: '',
    referral: '',
    requiredLoanAmount: '',
    securityInformation: '',
    loginBankName: '',
    followUpDate: null,
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameOfCustomer?.trim()) {
      newErrors.nameOfCustomer = 'Name of Customer is required';
    }

    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = 'Contact Number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Contact Number must be 10 digits';
    }

    if (!formData.loginBankName?.trim()) {
      newErrors.loginBankName = 'Bank Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('=== Starting save process ===');
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Validation failed. Errors:', errors);
      return;
    }

    setLoading(true);

    try {
      const client: Client = {
        id: generateId(),
        nameOfCustomer: formData.nameOfCustomer!.trim(),
        nameOfCoApplicant: formData.nameOfCoApplicant?.trim() || '',
        contactNumber: formData.contactNumber!.trim(),
        referral: formData.referral?.trim() || '',
        requiredLoanAmount: formData.requiredLoanAmount?.trim() || '',
        securityInformation: formData.securityInformation?.trim() || '',
        loginBankName: formData.loginBankName!.trim(),
        followUpDate: formData.followUpDate
          ? normalizeDateForStorage(formData.followUpDate)
          : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Client object to save:', client);
      console.log('Calling saveClient...');
      
      const success = await saveClient(client);
      
      console.log('Save result:', success);
      
      if (success) {
        console.log('Save successful, navigating back...');
        navigation.goBack();
      } else {
        console.error('Save returned false');
        Alert.alert('Error', 'Failed to save client. Please try again.');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      Alert.alert('Error', `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>New Client</Text>

          <GlassCard style={styles.card}>
            <InputField
              label="Name of Customer *"
              value={formData.nameOfCustomer}
              onChangeText={(text) =>
                setFormData({ ...formData, nameOfCustomer: text })
              }
              error={errors.nameOfCustomer}
            />
          </GlassCard>

          <GlassCard style={styles.card}>
            <InputField
              label="Name of Co-Applicant"
              value={formData.nameOfCoApplicant}
              onChangeText={(text) =>
                setFormData({ ...formData, nameOfCoApplicant: text })
              }
            />
          </GlassCard>

          <GlassCard style={styles.card}>
            <InputField
              label="Contact Number *"
              value={formData.contactNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, contactNumber: text })
              }
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.contactNumber}
            />
          </GlassCard>

          <GlassCard style={styles.card}>
            <InputField
              label="Referral"
              value={formData.referral}
              onChangeText={(text) =>
                setFormData({ ...formData, referral: text })
              }
            />
          </GlassCard>

          <GlassCard style={styles.card}>
            <InputField
              label="Required Loan Amount"
              value={formData.requiredLoanAmount}
              onChangeText={(text) =>
                setFormData({ ...formData, requiredLoanAmount: text.replace(/\D/g, '') })
              }
              keyboardType="numeric"
              placeholder="0"
            />
          </GlassCard>

          <GlassCard style={styles.card}>
            <InputField
              label="Security Information"
              value={formData.securityInformation}
              onChangeText={(text) =>
                setFormData({ ...formData, securityInformation: text })
              }
              multiline
              numberOfLines={6}
              placeholder="Enter security details..."
            />
          </GlassCard>

          <GlassCard style={styles.card}>
            <BankPicker
              label="Login (Bank Name) *"
              value={formData.loginBankName || ''}
              onChange={(value) =>
                setFormData({ ...formData, loginBankName: value })
              }
              error={errors.loginBankName}
            />
          </GlassCard>

          <GlassCard style={styles.card}>
            <DatePickerField
              label="Follow-up Date"
              value={formData.followUpDate}
              onChange={(date) =>
                setFormData({ ...formData, followUpDate: date })
              }
            />
          </GlassCard>
        </ScrollView>

        <View style={styles.bottomBar}>
          <PrimaryButton
            title={loading ? 'Saving...' : 'Save Client'}
            onPress={handleSave}
            loading={loading}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    ...theme.shadows.lg,
  },
});

