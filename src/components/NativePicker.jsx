/**
 * NativePicker — cross-platform dropdown
 * Web:    renders a native <select>
 * Mobile: renders a modal with a scrollable list of TouchableOpacity rows
 *
 * Props:
 *   value        string          currently selected value
 *   onChange     (value) => void called when selection changes
 *   options      { label, value }[]
 *   placeholder  string
 *   style        optional extra style for the trigger button (mobile)
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export default function NativePicker({
  value,
  onChange,
  options = [],
  placeholder = 'Selecione...',
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label ?? '';

  // ── WEB ──────────────────────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={webSelectStyle}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }

  // ── MOBILE ────────────────────────────────────────────────────────────────
  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value ? selectedLabel : placeholder}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{placeholder}</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={item => String(item.value)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  item.value === value && styles.optionSelected,
                ]}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  item.value === value && styles.optionTextSelected,
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

// Web <select> is a plain DOM element — StyleSheet values don't apply to it
const webSelectStyle = {
  width: '100%',
  padding: 12,
  fontSize: 16,
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.inputBg,
  color: colors.text,
  cursor: 'pointer',
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
  placeholder: {
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
  },

  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '60%',
    paddingBottom: spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sheetTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    fontSize: 18,
    color: colors.textSecondary,
    padding: spacing.xs,
  },
  option: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionSelected: {
    backgroundColor: colors.primary + '18',
  },
  optionText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
});
