import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader } from '../components/UI';
import { MOCK_MOVIMENTACOES } from '../data/mockData';

export default function DetalhesInsumoScreen({ navigation, route }) {
  const insumo = route.params?.insumo ?? { nome: 'Insumo A', qtd: 34, unidade: 'Litros', estoqueMinimo: 10 };

  const estoqueStatus =
    insumo.estoqueMinimo == null
      ? null
      : insumo.qtd < insumo.estoqueMinimo
      ? 'danger'
      : insumo.qtd === insumo.estoqueMinimo
      ? 'warning'
      : 'afirmative';

  const estoqueCircleColor =
    estoqueStatus === 'danger'
      ? colors.danger
      : estoqueStatus === 'warning'
      ? colors.warning
      : colors.afirmative;

  // Filtra somente as movimentações deste insumo
  const movimentacoes = MOCK_MOVIMENTACOES.filter(
    (m) => m.insumo === insumo.nome
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={`Detalhes do ${insumo.nome}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Saldo atual */}
        <View style={styles.saldoCard}>
          <Text style={styles.saldoLabel}>Saldo atual:</Text>
          <View style={[styles.saldoCircle, estoqueStatus && { borderColor: estoqueCircleColor }]}>
            <Text style={[styles.saldoValue, estoqueStatus && { color: estoqueCircleColor }]}>
              {insumo.qtd ?? '—'}
            </Text>
          </View>
          <Text style={styles.saldoUnidade}>{insumo.unidade ?? '—'}</Text>

          {insumo.estoqueMinimo != null && (
            <View style={styles.minimoContainer}>
              <Text style={styles.minimoLabel}>Est. mín.</Text>
              <Text style={[styles.minimoValue, { color: estoqueCircleColor }]}>
                {insumo.estoqueMinimo}
              </Text>
            </View>
          )}
        </View>

        {/* Movimentações filtradas */}
        <View style={styles.tableCard}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.col, styles.colTipo, styles.headerText]}>Tipo</Text>
            <Text style={[styles.col, styles.colQtd,  styles.headerText]}>Qtd.</Text>
            <Text style={[styles.col, styles.colData,  styles.headerText]}>Data</Text>
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
                >
                  {item.tipo}
                </Text>
                <Text style={[styles.col, styles.colQtd,  styles.cellText]}>{item.qtd}</Text>
                <Text style={[styles.col, styles.colData,  styles.cellText]}>{item.data}</Text>
                <Text style={[styles.col, styles.colResp,  styles.cellText]}>{item.responsavel}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>Nenhuma movimentação registrada.</Text>
            </View>
          )}
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
  colTipo:  { flex: 1.2 },
  colQtd:   { width: 36, textAlign: 'center' },
  colData:  { flex: 1.5, textAlign: 'center' },
  colResp:  { flex: 1.2, textAlign: 'right' },
  cellText: { color: colors.text },
  entradaText: { color: colors.accent,  fontWeight: '600' },
  saidaText:   { color: colors.danger,  fontWeight: '600' },

  emptyRow: { padding: spacing.lg, alignItems: 'center' },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },
});