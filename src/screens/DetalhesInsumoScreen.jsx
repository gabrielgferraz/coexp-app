import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, HoldButton } from '../components/UI';
import NativePicker from '../components/NativePicker';

import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';

import db from '../firebase/firestore';

const UNIDADES = ['Litros', 'Kg', 'Un', 'Caixas', 'Metros', 'Gramas'];
const UNIDADE_OPTIONS = UNIDADES.map(u => ({ label: u, value: u }));

export default function DetalhesInsumoScreen({ navigation, route }) {
  const insumo = route.params?.insumo;
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [editando,  setEditando]  = useState(false);
  const [salvando,  setSalvando]  = useState(false);
  const [novoNome,         setNovoNome]         = useState(insumo?.nome ?? '');
  const [novaUnidade,      setNovaUnidade]      = useState(insumo?.unidade ?? '');
  const [novoEstoqueMinimo, setNovoEstoqueMinimo] = useState(insumo?.estoqueMinimo ?? 0);

  const temMovimentacoes = movimentacoes.length > 0;

  // Compute stock status for circle color
  const qtd = insumo?.qtd ?? 0;
  const minimo = insumo?.estoqueMinimo ?? null;
  const estoqueStatus = minimo != null; // true if minimum is defined
  const estoqueCircleColor =
    !estoqueStatus       ? colors.primary :
    qtd <= 0             ? colors.danger  :
    qtd <= minimo        ? '#F59E0B'      : // warning amber
                           colors.accent;   // healthy green

  useEffect(() => {
    async function carregarMovimentacoes() {
      if (!insumo?.id) return;

      try {
        // Fixed: query by 'insumoId' field using insumo.id (not insumo.nome)
        const q = query(
          collection(db, 'movimentacoes'),
          where('insumoId', '==', insumo.id)
        );

        const snapshot = await getDocs(q);

        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by criadoEm descending (most recent first)
        lista.sort((a, b) => {
          const ta = a.criadoEm?.toMillis?.() ?? 0;
          const tb = b.criadoEm?.toMillis?.() ?? 0;
          return tb - ta;
        });

        setMovimentacoes(lista);

      } catch (error) {
        console.log('Erro buscando movimentações:', error);
      }
    }

    carregarMovimentacoes();
  }, [insumo]);

  const handleExcluir = () => {
    if (movimentacoes.length > 0) {
      Alert.alert('Exclusão bloqueada', 'Item com movimentações, não é permitido deletar.');
      return;
    }
    Alert.alert(
      'Excluir insumo',
      `Deseja remover "${insumo?.nome}" permanentemente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'insumos', insumo.id));
              navigation.goBack();
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível excluir o insumo.');
            }
          },
        },
      ]
    );
  };

  const handleSalvar = async () => {
    const nomeFinal = novoNome.trim();
    if (!nomeFinal)    { Alert.alert('Atenção', 'Informe o nome do insumo.'); return; }
    if (!novaUnidade)  { Alert.alert('Atenção', 'Selecione a unidade de medida.'); return; }

    setSalvando(true);
    try {
      const updates = { estoqueMinimo: novoEstoqueMinimo };

      if (!temMovimentacoes) {
        // Duplicate name check only if name changed
        if (nomeFinal.toLowerCase() !== insumo.nome.toLowerCase()) {
          const dupSnap = await getDocs(
            query(collection(db, 'insumos'), where('nomeLower', '==', nomeFinal.toLowerCase()))
          );
          if (!dupSnap.empty) {
            Alert.alert('Nome duplicado', `Já existe um insumo chamado "${nomeFinal}".`);
            return;
          }
        }
        updates.nome      = nomeFinal;
        updates.nomeLower = nomeFinal.toLowerCase();
        updates.unidade   = novaUnidade;
      }

      await updateDoc(doc(db, 'insumos', insumo.id), updates);
      Alert.alert('Salvo!', 'Insumo atualizado com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={`Detalhes: ${insumo?.nome ?? '—'}`}
        onBack={() => navigation.goBack()}
        rightAction={{ label: 'Excluir', onPress: handleExcluir, danger: true }}
      />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Saldo atual */}
        <View style={styles.saldoCard}>
          <Text style={styles.saldoLabel}>Saldo atual:</Text>
          <View style={[styles.saldoCircle, { borderColor: estoqueCircleColor }]}>
            <Text style={[styles.saldoValue, { color: estoqueCircleColor }]}>
              {insumo?.qtd ?? '—'}
            </Text>
          </View>
          <Text style={styles.saldoUnidade}>{insumo?.unidade ?? '—'}</Text>

          {minimo != null && (
            <View style={styles.minimoContainer}>
              <Text style={styles.minimoLabel}>Est. mín.</Text>
              <Text style={[styles.minimoValue, { color: estoqueCircleColor }]}>
                {minimo}
              </Text>
            </View>
          )}
        </View>

        {/* Edit toggle button */}
        <TouchableOpacity
          style={[styles.editToggleBtn, editando && styles.editToggleBtnActive]}
          onPress={() => setEditando(v => !v)}
        >
          <Text style={[styles.editToggleBtnText, editando && styles.editToggleBtnTextActive]}>
            {editando ? 'Cancelar edição' : '✎  Editar insumo'}
          </Text>
        </TouchableOpacity>

        {/* Inline edit form */}
        {editando && (
          <View style={styles.editCard}>
            {temMovimentacoes && (
              <View style={styles.lockBanner}>
                <Text style={styles.lockBannerText}>
                  Nome e unidade bloqueados — item possui movimentações.
                </Text>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome</Text>
              {temMovimentacoes ? (
                <View style={styles.lockedField}>
                  <Text style={styles.lockedText}>{novoNome}</Text>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  value={novoNome}
                  onChangeText={setNovoNome}
                  placeholder="Nome do insumo..."
                />
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Unidade de medida</Text>
              {temMovimentacoes ? (
                <View style={styles.lockedField}>
                  <Text style={styles.lockedText}>{novaUnidade}</Text>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              ) : (
                <NativePicker
                  value={novaUnidade}
                  onChange={setNovaUnidade}
                  placeholder="Selecione a unidade..."
                  options={UNIDADE_OPTIONS}
                />
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Estoque mínimo</Text>
              <View style={styles.quantidadeRow}>
                <HoldButton style={styles.qtyBtn} onAction={() => setNovoEstoqueMinimo(q => Math.max(0, q - 1))}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </HoldButton>
                <TextInput
                  style={styles.qtyInput}
                  value={String(novoEstoqueMinimo)}
                  onChangeText={text => {
                    const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    setNovoEstoqueMinimo(isNaN(parsed) ? 0 : parsed);
                  }}
                  keyboardType="numeric"
                  textAlign="center"
                />
                <HoldButton style={styles.qtyBtn} onAction={() => setNovoEstoqueMinimo(q => q + 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </HoldButton>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, salvando && { opacity: 0.7 }]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              <Text style={styles.saveBtnText}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Movimentações */}
        <View style={styles.tableCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.col, styles.colTipo, styles.headerText]}>Tipo</Text>
                <Text style={[styles.col, styles.colQtd,  styles.headerText]}>Qtd.</Text>
                <Text style={[styles.col, styles.colData,  styles.headerText]}>Data</Text>
                <Text style={[styles.col, styles.colForn,  styles.headerText]}>Fornecedor</Text>
                <Text style={[styles.col, styles.colResp,  styles.headerText]}>Responsável</Text>
              </View>

              {movimentacoes.length > 0 ? (
                movimentacoes.map((item, idx) => (
                  <View
                    key={item.id}
                    style={[styles.tableRow, idx % 2 === 1 && styles.rowAlt]}
                  >
                    <Text
                      style={[
                        styles.col, styles.colTipo, styles.cellText,
                        item.tipo === 'Entrada' && styles.entradaText,
                        item.tipo === 'Saída'   && styles.saidaText,
                      ]}
                      numberOfLines={1}
                    >
                      {item.tipo}
                    </Text>
                    <Text style={[styles.col, styles.colQtd,  styles.cellText]} numberOfLines={1}>{item.qtd}</Text>
                    <Text style={[styles.col, styles.colData,  styles.cellText]} numberOfLines={1}>{item.data}</Text>
                    <Text style={[styles.col, styles.colForn,  styles.cellText]} numberOfLines={1}>{item.fornecedor || '—'}</Text>
                    <Text style={[styles.col, styles.colResp,  styles.cellText]} numberOfLines={1}>{item.responsavel}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyRow}>
                  <Text style={styles.emptyText}>Nenhuma movimentação registrada.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },

  saldoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  saldoLabel: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  saldoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  saldoValue: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.primary,
  },
  saldoUnidade: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  minimoContainer: {
    marginLeft: 'auto',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  minimoLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  minimoValue: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
  },

  // Table
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowAlt:      { backgroundColor: colors.tableRowAlt },
  tableHeader: { backgroundColor: colors.primary, borderBottomWidth: 0 },
  headerText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  col:      { fontSize: typography.sizes.sm },
  colTipo:  { width: 68 },
  colQtd:   { width: 38, textAlign: 'center' },
  colData:  { width: 82, textAlign: 'center' },
  colForn:  { width: 96, textAlign: 'center' },
  colResp:  { width: 110, textAlign: 'right' },
  cellText: { color: colors.text },
  entradaText: { color: colors.accent,  fontWeight: '600' },
  saidaText:   { color: colors.danger,  fontWeight: '600' },

  emptyRow: { padding: spacing.lg, alignItems: 'center' },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },

  // Edit toggle
  editToggleBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  editToggleBtnActive: {
    borderColor: colors.textSecondary,
    backgroundColor: colors.tableRowAlt,
  },
  editToggleBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: typography.sizes.sm,
  },
  editToggleBtnTextActive: {
    color: colors.textSecondary,
  },

  // Edit card
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  lockBanner: {
    backgroundColor: colors.tableRowAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  lockBannerText: {
    fontSize: typography.sizes.xs,
    color: colors.warning,
    fontWeight: '600',
  },
  fieldGroup: { gap: spacing.xs },
  label: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  lockedField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tableRowAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  lockedText: { flex: 1, fontSize: typography.sizes.md, color: colors.textSecondary },
  lockIcon:   { fontSize: 14 },
  quantidadeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qtyBtn: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 22, color: colors.text, lineHeight: 26 },
  qtyInput: {
    flex: 1, height: 44, backgroundColor: colors.inputBg,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    fontSize: typography.sizes.md, color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: { color: colors.white, fontWeight: '700', fontSize: typography.sizes.md },
});
