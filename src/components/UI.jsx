import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { IconSearch } from '@tabler/icons-react-native';
import { colors, radius, spacing, typography } from '../theme';

// ─── Header ───────────────────────────────────────────────────────────────────
export function ScreenHeader({ title, onBack, rightAction }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerBtn} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={[styles.headerBtnRight, rightAction.danger && styles.headerBtnRightDanger]}
          activeOpacity={0.75}
        >
          <Text style={[styles.headerBtnText, rightAction.danger && styles.headerBtnDanger]}>
            {rightAction.label}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerBtn} />
      )}
    </View>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
export function SearchBar({ value, onChangeText, placeholder = 'Buscar insumo...' }) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
      />
      <IconSearch size={18} color={colors.textSecondary} strokeWidth={1.5} />
    </View>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
export function InputField({ label, placeholder, value, onChangeText, keyboardType, secureTextEntry, icon }) {
  return (
    <View>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          secureTextEntry={secureTextEntry || false}
        />
        {icon ? <View style={styles.inputIcon}>{icon}</View> : null}
      </View>
    </View>
  );
}

// ─── Number Input ─────────────────────────────────────────────────────────────
export function NumberInput({ label, value, onIncrement, onDecrement }) {
  return (
    <View>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <View style={styles.numberRow}>
        <Text style={styles.numberValue}>{value}</Text>
        <View style={styles.numberControls}>
          <TouchableOpacity onPress={onIncrement} style={styles.numberBtn}>
            <Text style={styles.numberBtnText}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDecrement} style={styles.numberBtn}>
            <Text style={styles.numberBtnText}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Hold Button (fires immediately, keeps repeating while held) ──────────────
export function HoldButton({ onAction, style, children }) {
  const delay    = useRef(null);
  const interval = useRef(null);

  const start = () => {
    onAction();
    delay.current = setTimeout(() => {
      interval.current = setInterval(onAction, 80);
    }, 350);
  };

  const stop = () => {
    clearTimeout(delay.current);
    clearInterval(interval.current);
  };

  return (
    <TouchableOpacity onPressIn={start} onPressOut={stop} style={style} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

// ─── Primary Button ───────────────────────────────────────────────────────────
export function PrimaryButton({ title, onPress, loading }) {
  return (
    <TouchableOpacity style={styles.primaryBtn} onPress={onPress} activeOpacity={0.85}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.primaryBtnText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Outline Button ───────────────────────────────────────────────────────────
export function OutlineButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.outlineBtn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.outlineBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────
export function SelectField({ label, value, onChange, options = [], placeholder }) {
  const [open, setOpen] = useState(false);
  const [hoveredOpt, setHoveredOpt] = useState(null);

  return (
    <View>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}

      <TouchableOpacity
        style={styles.selectRow}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.selectValue : styles.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={styles.selectChevron}>{open ? '▴' : '▾'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.selectDropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.selectOption,
                value === opt && styles.selectOptionActive,
                hoveredOpt === opt && value !== opt && styles.selectOptionHovered,
              ]}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
              onPressIn={() => setHoveredOpt(opt)}
              onPressOut={() => setHoveredOpt(null)}
              activeOpacity={1}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  value === opt && styles.selectOptionTextActive,
                  hoveredOpt === opt && value !== opt && styles.selectOptionTextHovered,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <View style={styles.divider} />;
}


// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnRight: {
    minWidth: 36,
    height: 30,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  headerBtnRightDanger: {
    borderColor: colors.dangerLight,
    backgroundColor: 'rgba(198,40,40,0.18)',
  },
  headerBtnText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 30,
  },
  headerBtnDanger: {
    color: colors.dangerLight,
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    lineHeight: typography.sizes.sm + 2,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
    paddingVertical: 10,
  },

  // Input
  inputLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  inputIcon: {
    marginLeft: spacing.sm,
  },

  // Number Input
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  numberValue: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  numberControls: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  numberBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignItems: 'center',
  },
  numberBtnText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  outlineBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },

  // Select
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  selectValue: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  selectPlaceholder: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPlaceholder,
  },
  selectChevron: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectDropdown: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  selectOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectOptionActive: {
    backgroundColor: colors.primary,
  },
  selectOptionHovered: {
    backgroundColor: colors.primaryLight,
  },
  selectOptionText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  selectOptionTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  selectOptionTextHovered: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },


  
});