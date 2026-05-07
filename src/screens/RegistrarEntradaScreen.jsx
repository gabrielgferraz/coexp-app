import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, InputField, NumberInput, PrimaryButton } from '../components/UI';

export default function RegistrarEntradaScreen({ navigation }) {
  const [insumo, setInsumo] = useState('');
  const [quantidade, setQuantidade] = useState(5);
  const [fornecedor, setFornecedor] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [data, setData] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirmar = () => {
    Alert.alert('Entrada registrada!', 'A entrada foi registrada com sucesso.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Registrar Entrada" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {/* Insumo */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Insumo:</Text>
              <InputField
                placeholder="Nome do insumo..."
                value={insumo}
                onChangeText={setInsumo}
                icon="🔍"
              />
            </View>

            {/* Quantidade */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Quantidade:</Text>
              <NumberInput
                value={quantidade}
                onIncrement={() => setQuantidade((q) => q + 1)}
                onDecrement={() => setQuantidade((q) => Math.max(0, q - 1))}
              />
            </View>

            {/* Fornecedor */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Fornecedor:</Text>
              <InputField
                placeholder="Nome do fornecedor..."
                value={fornecedor}
                onChangeText={setFornecedor}
                icon="🔍"
              />
            </View>

            {/* Responsável */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Responsável:</Text>
              <InputField
                placeholder="Nome do Responsável..."
                value={responsavel}
                onChangeText={setResponsavel}
                icon="🔍"
              />
            </View>

            {/* Data da entrada */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data da entrada:</Text>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {data.toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={data}
                  mode="date"
                  display="default"
                  locale="pt-BR"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) setData(selectedDate);
                  }}
                />
              )}
            </View>

            <View style={styles.submitWrapper}>
              <PrimaryButton title="Confirmar entrada" onPress={handleConfirmar} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  fieldGroup: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateSep: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  calendarBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  calendarIcon: { fontSize: 20 },
  submitWrapper: {
    marginTop: spacing.md,
  },
});
