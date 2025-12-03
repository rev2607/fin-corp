import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';
import { InputField } from './InputField';

const BANK_NAMES = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Indian Bank',
  'Other',
];

interface BankPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export const BankPicker: React.FC<BankPickerProps> = ({
  label,
  value,
  onChange,
  error,
  containerStyle,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [customBank, setCustomBank] = useState('');

  const handleSelectBank = (bank: string) => {
    if (bank === 'Other') {
      setCustomBank(value && !BANK_NAMES.includes(value) ? value : '');
    } else {
      onChange(bank);
      setShowPicker(false);
    }
  };

  const handleSaveCustom = () => {
    if (customBank.trim()) {
      onChange(customBank.trim());
    }
    setShowPicker(false);
  };

  const displayValue = value || 'Select bank';

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.7}>
        <InputField
          label={label}
          value={displayValue}
          editable={false}
          error={error}
          placeholder="Select bank"
          pointerEvents="none"
        />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bank</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {value === 'Other' || (value && !BANK_NAMES.includes(value)) ? (
              <View style={styles.customBankContainer}>
                <InputField
                  label="Enter Bank Name"
                  value={customBank || value}
                  onChangeText={setCustomBank}
                  containerStyle={styles.customInput}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveCustom}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={BANK_NAMES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.bankItem,
                      value === item && styles.bankItemSelected,
                    ]}
                    onPress={() => handleSelectBank(item)}
                  >
                    <Text
                      style={[
                        styles.bankItemText,
                        value === item && styles.bankItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.secondary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  modalClose: {
    ...theme.typography.h3,
    color: theme.colors.text.secondary,
    fontSize: 24,
    lineHeight: 24,
  },
  bankItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  bankItemSelected: {
    backgroundColor: theme.colors.background.card,
  },
  bankItemText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  bankItemTextSelected: {
    color: theme.colors.accent.gold,
    fontWeight: '600',
  },
  customBankContainer: {
    padding: theme.spacing.md,
  },
  customInput: {
    marginBottom: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.accent.gold,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.typography.bodyBold,
    color: '#111217',
  },
});

