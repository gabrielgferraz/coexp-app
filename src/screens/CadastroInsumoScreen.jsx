import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  colors,
  spacing,
  radius,
  typography
} from '../theme';

import {
  ScreenHeader,
  InputField,
  NumberInput,
  PrimaryButton
} from '../components/UI';

import { addDoc, collection } from 'firebase/firestore';
import db from '../firebase/firestore';


const UNIDADES = ['Litros', 'Kg', 'Un', 'Caixas', 'Metros', 'Gramas'];


export default function CadastroInsumoScreen({ navigation }) {

  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState(1);


  const handleCadastrar = async () => {

    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do insumo.');
      return;
    }

    if (!unidade) {
      Alert.alert('Atenção', 'Selecione a unidade de medida.');
      return;
    }

    try {
      await addDoc(collection(db, 'insumos'), {
        nome: nome.trim(),
        unidade,
        estoqueMinimo,
        qtd: 0,          // Fixed: always initialize stock to 0
        criadoEm: new Date()
      });

      // Reset form
      setNome('');
      setUnidade('');
      setEstoqueMinimo(1);

      Alert.alert('Cadastro feito', `"${nome.trim()}" foi adicionado com sucesso.`);

    } catch (error) {
      console.log('Erro Firebase:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o insumo.');
    }
  };


  return (
    <SafeAreaView style={styles.safe}>

      <ScreenHeader
        title="Cadastro de Insumo"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
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

            {/* Unidade — native <select> for web compatibility */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Unidade de medida</Text>
              <select
                value={unidade}
                onChange={e => setUnidade(e.target.value)}
                style={styles.webSelect}
              >
                <option value="">Selecione a unidade...</option>
                {UNIDADES.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </View>

            {/* Estoque mínimo */}
            <View style={styles.fieldGroup}>
              <NumberInput
                label="Estoque mínimo"
                value={estoqueMinimo}
                onIncrement={() => setEstoqueMinimo(v => v + 1)}
                onDecrement={() => setEstoqueMinimo(v => Math.max(0, v - 1))}
              />
            </View>

            <PrimaryButton
              title="Cadastrar insumo"
              onPress={handleCadastrar}
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: colors.background
  },

  flex: { flex: 1 },

  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3
  },

  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.text
  },

  fieldGroup: { gap: spacing.xs },

  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text
  },

  webSelect: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    color: colors.text,
    cursor: 'pointer',
  },
});