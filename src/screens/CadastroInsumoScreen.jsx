import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, InputField, PrimaryButton } from '../components/UI';
import NativePicker from '../components/NativePicker';
import { addDoc, collection } from 'firebase/firestore';
import db from '../firebase/firestore';


const UNIDADES = ['Litros', 'Kg', 'Un', 'Caixas', 'Metros', 'Gramas'];
const UNIDADE_OPTIONS = UNIDADES.map(u => ({ label: u, value: u }));


export default function CadastroInsumoScreen({ navigation }) {

  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState(1);


  const handleCadastrar = async () => {
    if (!nome.trim()) { Alert.alert('Atenção', 'Informe o nome do insumo.'); return; }
    if (!unidade)     { Alert.alert('Atenção', 'Selecione a unidade de medida.'); return; }

    try {
      const nomeCadastrado = nome.trim();

      await addDoc(collection(db, 'insumos'), {
        nome: nomeCadastrado,
        unidade,
        estoqueMinimo,
        qtd: 0,
        criadoEm: new Date()
      });

      Alert.alert(
        'Cadastro feito',
        `"${nomeCadastrado}" foi adicionado com sucesso. Deseja cadastrar mais um insumo?`,
        [
          {
            text: 'Não, voltar',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Sim, cadastrar mais',
            onPress: () => {
              setNome('');
              setUnidade('');
              setEstoqueMinimo(1);
            },
          },
        ]
      );

    } catch (error) {
      console.log('Erro Firebase:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o insumo.');
    }
  };


  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Cadastro de Insumo" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>

            <Text style={styles.cardTitle}>Novo insumo</Text>

            <View style={styles.fieldGroup}>
              <InputField
                label="Nome do insumo"
                placeholder="Ex: Álcool Isopropílico..."
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Unidade de medida</Text>
              <NativePicker
                value={unidade}
                onChange={setUnidade}
                placeholder="Selecione a unidade..."
                options={UNIDADE_OPTIONS}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Estoque mínimo</Text>
              <View style={styles.quantidadeRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setEstoqueMinimo(q => Math.max(0, q - 1))}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.qtyInput}
                  value={String(estoqueMinimo)}
                  onChangeText={text => {
                    const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    setEstoqueMinimo(isNaN(parsed) ? 0 : parsed);
                  }}
                  keyboardType="numeric"
                  textAlign="center"
                />

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setEstoqueMinimo(q => q + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <PrimaryButton title="Cadastrar insumo" onPress={handleCadastrar} />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.background },
  flex:       { flex: 1 },
  content:    { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
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
  cardTitle:  { fontSize: typography.sizes.md, fontWeight: '600', color: colors.text },
  fieldGroup: { gap: spacing.xs },
  label:      { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
  quantidadeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 22,
    color: colors.text,
    lineHeight: 26,
  },
  qtyInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
});