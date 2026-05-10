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
import { ScreenHeader, SearchBar, NumberInput, PrimaryButton } from '../components/UI';

export default function RegistrarSaidaScreen({ navigation }) {
  const [insumo, setInsumo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [destino, setDestino] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [data, setData] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirmar = () => {
    Alert.alert('Saída registrada!', 'A saída foi registrada com sucesso.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Registrar Saída" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>

            {/* Insumo */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Insumo</Text>
              <SearchBar
                value={insumo}
                onChangeText={setInsumo}
                placeholder="Nome do insumo..."
              />
            </View>

            {/* Quantidade */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Quantidade</Text>
              <NumberInput
                value={quantidade}
                onIncrement={() => setQuantidade((q) => q + 1)}
                onDecrement={() => setQuantidade((q) => Math.max(0, q - 1))}
              />
            </View>

            {/* Destino / Setor */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Destino / Setor</Text>
              <SearchBar
                value={destino}
                onChangeText={setDestino}
                placeholder="Nome do setor..."
              />
            </View>

            {/* Responsável */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Responsável</Text>
              <SearchBar
                value={responsavel}
                onChangeText={setResponsavel}
                placeholder="Nome do responsável..."
              />
            </View>

            {/* Data da saída */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data da saída</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.75}
              >
                <Text style={styles.dateButtonText}>
                  {data.toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.dateChevron}>›</Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={data}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) setData(selectedDate);
                  }}
                />
              )}
            </View>

            <PrimaryButton title="Confirmar saída" onPress={handleConfirmar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,         // espaçamento uniforme entre todos os campos
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  fieldGroup: {
    gap: spacing.xs,         // espaço consistente entre label e campo
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  dateButtonText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  dateChevron: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});