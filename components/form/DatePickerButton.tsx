import React, { useState, useEffect } from 'react'; // Added useEffect
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';
import { format, parseISO, isValid as isValidDate } from 'date-fns'; // For formatting and parsing

interface DatePickerButtonProps {
  onDatePicked: (isoDateString: string | null) => void; // Now expects ISO string or null
  label: string;
  currentIsoDateString?: string | null; // Expects ISO string or YYYY-MM-DD for initial value
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  onDatePicked,
  label,
  currentIsoDateString,
}) => {
  const colors = useColorTheme();
  const [showPicker, setShowPicker] = useState(false);

  // Initialize date state: try parsing ISO, then YYYY-MM-DD, then default to now
  const initializeDate = () => {
    if (currentIsoDateString) {
      let parsedDate = parseISO(currentIsoDateString); // Try parsing as full ISO
      if (isValidDate(parsedDate)) return parsedDate;

      // Try parsing as YYYY-MM-DD if ISO parse failed (common for form defaults)
      // Ensure it's treated as local date to avoid timezone shifts converting to UTC midnight
      const parts = currentIsoDateString.split('-');
      if (parts.length === 3) {
        parsedDate = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2])
        );
        if (isValidDate(parsedDate)) return parsedDate;
      }
    }
    return new Date(); // Default to today if no valid current date
  };

  const [date, setDate] = useState<Date>(initializeDate());

  // Update internal date if currentIsoDateString prop changes
  useEffect(() => {
    setDate(initializeDate());
  }, [currentIsoDateString]);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date; // Use selectedDate if available
    setShowPicker(Platform.OS === 'ios'); // Keep open on iOS until "Done"
    if (event.type === 'set' && selectedDate) {
      // "set" means user confirmed a date
      setDate(currentDate);
      onDatePicked(currentDate.toISOString()); // Output as full ISO string
    } else if (event.type === 'dismissed') {
      // User dismissed picker, do nothing or call onDatePicked(null) if desired
    }
  };

  // Display format for the button text (YYYY-MM-DD)
  const displayDate = isValidDate(date)
    ? format(date, 'yyyy-MM-dd')
    : 'Select Date';
  // Use currentIsoDateString for display if it's just YYYY-MM-DD and valid, otherwise format internal date
  const buttonText =
    currentIsoDateString &&
    /^\d{4}-\d{2}-\d{2}$/.test(currentIsoDateString) &&
    isValidDate(parseISO(currentIsoDateString + 'T00:00:00.000Z'))
      ? currentIsoDateString
      : displayDate;

  return (
    <View style={styles.container}>
      <Text style={[styles.labelStyle, { color: colors['gray-700'] }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderColor: colors['gray-300'],
            backgroundColor: colors['gray-50'],
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text
          style={[
            styles.dateText,
            {
              color:
                currentIsoDateString || isValidDate(date)
                  ? colors['gray-800']
                  : colors['gray-500'],
            },
          ]}
        >
          {/* Display YYYY-MM-DD for user-friendliness */}
          {isValidDate(date) ? format(date, 'yyyy-MM-dd') : 'Select Date'}
        </Text>
        <Ionicons
          name='calendar-outline'
          size={20}
          color={colors['gray-500']}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          testID='dateTimePicker'
          value={date} // Use the internal Date object
          mode='date'
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          maximumDate={new Date()} // User cannot select future date for DOB
        />
      )}
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  labelStyle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  button: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});

export default DatePickerButton;
