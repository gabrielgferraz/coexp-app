
/**
 * NativeDatePicker — cross-platform date picker
 * Web:    renders a native <input type="date">
 * Mobile: renders a TouchableOpacity that opens @react-native-community/datetimepicker
 *
 * Props:
 *   value     Date
 *   onChange  (Date) => void
 *   label     string (optional, shown on the button)
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

// Only import the native picker on mobile to avoid web crash
let DateTimePicker = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function NativeDatePicker({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const toInputValue = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleWebChange = (e) => {
    const val = e.target.value;
    if (val) {
      const [year, month, day] = val.split('-').map(Number);
      onChange(new Date(year, month - 1, day));
    }
  };

  // ── WEB ──────────────────────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    return (
      <input
        type="date"
        value={toInputValue(value)}
        onChange={handleWebChange}
        style={webDateStyle}
      />
    );
  }

  // ── MOBILE ────────────────────────────────────────────────────────────────
  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText}>
          {value.toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {showPicker && DateTimePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={(event, selected) => {
            setShowPicker(false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </>
  );
}

const webDateStyle = {
  width: '100%',
  padding: 12,
  fontSize: 16,
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBg,
  color: colors.text,
  boxSizing: 'border-box',
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  triggerText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
  },
});