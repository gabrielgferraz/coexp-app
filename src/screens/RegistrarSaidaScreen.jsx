import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, PrimaryButton } from '../components/UI';
import NativePicker from '../components/NativePicker';
import NativeDatePicker from '../components/NativeDatePicker';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import db from '../firebase/firestore';


export default function RegistrarSaidaScreen({ navigation }) {

  const [insumos, setInsumos] = useState([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [destino, setDestino] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [data, setData] = useState(new Date());

  useEffect(() => {
    async function carregarInsumos() {
      try {
        const snapshot = await getDocs(collection(db, 'insumos'));
        setInsumos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.log('Erro carregando insumos:', error);
      }
    }
    carregarInsumos();
  }, []);


  const handleConfirmar = async () => {
    const insumo = insumos.find(item => item.id === insumoSelecionado);

    if (!insumo) { Alert.alert('Atenção', 'Selecione um insumo.'); return; }
    if (quantidade <= 0) { Alert.alert('Atenção', 'Informe uma quantidade válida.'); return; }
    if (quantidade > (insumo.qtd ?? 0)) {
      Alert.alert('Estoque insuficiente', `Quantidade disponível: ${insumo.qtd ?? 0}`);
      return;
    }

    try {
      await updateDoc(doc(db, 'insumos', insumo.id), {
        qtd: (insumo.qtd ?? 0) - quantidade
      });
      await addDoc(collection(db, 'movimentacoes'), {
        insumoId: insumo.id,
        insumoNome: insumo.nome,
        tipo: 'Saída',
        qtd: quantidade,
        destino,
        responsavel,
        data: data.toLocaleDateString('pt-BR'),
        criadoEm: new Date()
      });

      setInsumoSelecionado('');
      setQuantidade(1);
      setDestino('');
      setResponsavel('');
      setData(new Date());

      Alert.alert('Movimentação registrada', 'Saída salva com sucesso.');

    } catch (error) {
      console.log('Erro Firebase:', error);
      Alert.alert('Erro', 'Não foi possível registrar saída.');
    }
  };


  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Registrar Saída" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Insumo</Text>
              <NativePicker
                value={insumoSelecionado}
                onChange={setInsumoSelecionado}
                placeholder="Selecione o insumo..."
                options={insumos.map(item => ({
                  label: `${item.nome} (${item.qtd ?? 0})`,
                  value: item.id,
                }))}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Quantidade</Text>
              <View style={styles.quantidadeRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantidade(q => Math.max(0, q - 1))}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.qtyInput}
                  value={String(quantidade)}
                  onChangeText={text => {
                    const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    setQuantidade(isNaN(parsed) ? 0 : parsed);
                  }}
                  keyboardType="numeric"
                  textAlign="center"
                />

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantidade(q => q + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Destino / Setor</Text>
              <TextInput
                value={destino}
                onChangeText={setDestino}
                placeholder="Nome do setor..."
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Responsável</Text>
              <TextInput
                value={responsavel}
                onChangeText={setResponsavel}
                placeholder="Nome do responsável..."
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data da saída</Text>
              <NativeDatePicker value={data} onChange={setData} />
            </View>

            <PrimaryButton title="Confirmar saída" onPress={handleConfirmar} />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.background },
  flex:       { flex: 1 },
  content:    { padding: spacing.md, paddingBottom: spacing.xl },
  card:       { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md, gap: spacing.md },
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
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md,
  },
});