import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
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
  NumberInput,
  PrimaryButton,
} from '../components/UI';

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';

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
        const lista = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setInsumos(lista);
      } catch (error) {
        console.log('Erro carregando insumos:', error);
      }
    }
    carregarInsumos();
  }, []);


  const handleConfirmar = async () => {

    const insumo = insumos.find(item => item.id === insumoSelecionado);

    if (!insumo) {
      Alert.alert('Atenção', 'Selecione um insumo.');
      return;
    }

    if (quantidade <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade válida.');
      return;
    }

    if (quantidade > (insumo.qtd ?? 0)) {
      Alert.alert(
        'Estoque insuficiente',
        `Quantidade disponível: ${insumo.qtd ?? 0}`
      );
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

      // Reset fields
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


  // Web-safe date change handler
  const handleDateChange = (e) => {
    const value = e.target.value; // "YYYY-MM-DD"
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      setData(new Date(year, month - 1, day));
    }
  };

  // Format date to YYYY-MM-DD for the web input
  const toInputValue = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };


  return (
    <SafeAreaView style={styles.safe}>

      <ScreenHeader
        title="Registrar Saída"
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

            {/* Insumo — native <select> works on all platforms */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Insumo</Text>
              <select
                value={insumoSelecionado}
                onChange={e => setInsumoSelecionado(e.target.value)}
                style={styles.webSelect}
              >
                <option value="">Selecione o insumo...</option>
                {insumos.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nome} ({item.qtd ?? 0})
                  </option>
                ))}
              </select>
            </View>

            {/* Quantidade */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Quantidade</Text>
              <NumberInput
                value={quantidade}
                onIncrement={() => setQuantidade(q => q + 1)}
                onDecrement={() => setQuantidade(q => Math.max(0, q - 1))}
              />
            </View>

            {/* Destino */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Destino / Setor</Text>
              <TextInput
                value={destino}
                onChangeText={setDestino}
                placeholder="Nome do setor..."
                style={styles.input}
              />
            </View>

            {/* Responsável */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Responsável</Text>
              <TextInput
                value={responsavel}
                onChangeText={setResponsavel}
                placeholder="Nome do responsável..."
                style={styles.input}
              />
            </View>

            {/* Data — native <input type="date"> works everywhere on web */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data da saída</Text>
              <input
                type="date"
                value={toInputValue(data)}
                onChange={handleDateChange}
                style={styles.webDateInput}
              />
            </View>

            <PrimaryButton
              title="Confirmar saída"
              onPress={handleConfirmar}
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

  flex: {
    flex: 1
  },

  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md
  },

  fieldGroup: {
    gap: spacing.xs
  },

  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text
  },

  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md
  },

  // Inline styles for web-only elements (StyleSheet doesn't apply to HTML elements)
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

  webDateInput: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.inputBg,
    color: colors.text,
    boxSizing: 'border-box',
  },
});