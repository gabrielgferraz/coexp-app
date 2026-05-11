import React, { useState } from 'react';
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
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, InputField, SelectField, NumberInput, PrimaryButton } from '../components/UI';

const UNIDADES = ['Litros', 'Kg', 'Un', 'Caixas', 'Metros', 'Gramas'];

import { MOCK_INSUMOS_CADASTRADOS } from '../data/mockData';

export default function CadastroInsumoScreen({ navigation }) {
  const [nome, setNome]                   = useState('');
  const [unidade, setUnidade]             = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState(1);
  const [insumos, setInsumos]             = useState(MOCK_INSUMOS_CADASTRADOS);

  const handleCadastrar = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do insumo.');
      return;
    }
    if (!unidade) {
      Alert.alert('Atenção', 'Selecione a unidade de medida.');
      return;
    }

    const novoInsumo = {
      id: String(Date.now()),
      nome: nome.trim(),
      unidade,
      estoqueMinimo,
    };

    setInsumos((prev) => [novoInsumo, ...prev]);

    Alert.alert('Insumo cadastrado!', `"${nome.trim()}" foi adicionado com sucesso.`, [
      { text: 'OK' },
    ]);

    setNome('');
    setUnidade('');
    setEstoqueMinimo(1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Cadastro de Insumo" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Formulário ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Novo insumo</Text>

            {/* Nome */}
            <View style={styles.fieldGroup}>
              <InputField
                label="Nome do insumo"
                placeholder="Ex: Álcool Isopropílico..."
                value={nome}
                onChangeText={setNome}
              />
            </View>

            {/* Unidade de medida */}
            <View style={styles.fieldGroup}>
              <SelectField
                label="Unidade de medida"
                value={unidade}
                onChange={setUnidade}
                options={UNIDADES}
                placeholder="Selecione a unidade..."
              />
            </View>

            {/* Estoque mínimo */}
            <View style={styles.fieldGroup}>
              <NumberInput
                label="Estoque mínimo"
                value={estoqueMinimo}
                onIncrement={() => setEstoqueMinimo((v) => v + 1)}
                onDecrement={() => setEstoqueMinimo((v) => Math.max(0, v - 1))}
              />
            </View>

            <PrimaryButton title="Cadastrar insumo" onPress={handleCadastrar} />
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
    gap: spacing.md,
  },

  // Card do formulário
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
});