import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ViewStyle,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { theme } from '../theme';
import { InputField } from './InputField';

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  containerStyle?: ViewStyle;
  minimumDate?: Date;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  containerStyle,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => value || new Date());

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
      return;
    }

    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShowPicker(false);
  };

  const displayValue = value ? format(value, 'dd MMM yyyy') : '';

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={() => {
          setTempDate(value || new Date());
          setShowPicker(true);
        }}
        activeOpacity={0.7}
      >
        <InputField
          label={label}
          value={displayValue}
          editable={false}
          error={error}
          placeholder="Select date"
          pointerEvents="none"
        />
      </TouchableOpacity>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <Pressable style={styles.modalOverlay} onPress={handleCancel}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={[styles.modalButtonText, styles.modalConfirm]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                style={styles.picker}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: '100%',
    backgroundColor: theme.colors.background.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.secondary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingBottom: theme.spacing.xl,
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
    ...theme.typography.bodyBold,
    color: theme.colors.text.primary,
  },
  modalButtonText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  modalConfirm: {
    color: theme.colors.accent.gold,
    fontWeight: '600',
  },
});

