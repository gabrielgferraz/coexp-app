import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/UI';
import { colors, spacing, radius, typography } from '../theme';
import { BarChartComp, PieChartComp } from '../components/Charts';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import db from '../firebase/firestore';

const PIE_COLORS = ['#1A3A2A', '#4CAF50', '#81C784', '#FF8F00', '#42A5F5'];

export default function DashboardScreen({ navigation }) {
  const [insumos,       setInsumos]       = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [usuarios,      setUsuarios]      = useState([]);
  const [loading,       setLoading]       = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        setLoading(true);
        try {
          const [insSnap, movSnap, usrSnap] = await Promise.all([
            getDocs(collection(db, 'insumos')),
            getDocs(query(collection(db, 'movimentacoes'), orderBy('criadoEm', 'desc'), limit(20))),
            getDocs(collection(db, 'usuarios')),
          ]);
          setInsumos(insSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          setMovimentacoes(movSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          setUsuarios(usrSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
          console.log('Erro dashboard:', e);
        } finally {
          setLoading(false);
        }
      }
      carregar();
    }, [])
  );

  // Computed values
  const totalInsumos = insumos.length;
  const totalEstoque = insumos.reduce((acc, i) => acc + (i.qtd ?? 0), 0);
  const estoqueBaixo = insumos.filter(
    i => i.estoqueMinimo != null && (i.qtd ?? 0) < i.estoqueMinimo
  ).length;

  // Map uid → nome for resolving legacy records that stored uid instead of name
  const uidToNome = usuarios.reduce((acc, u) => {
    if (u.uid) acc[u.uid] = u.nome;
    acc[u.id]  = u.nome;
    return acc;
  }, {});

  const barInsumos = insumos.slice(0, 8);

  const unidades = insumos.reduce((acc, i) => {
    acc[i.unidade] = (acc[i.unidade] || 0) + (i.qtd ?? 0);
    return acc;
  }, {});
  const pieData = Object.entries(unidades).map(([name, value], idx) => ({
    name,
    value,
    color: PIE_COLORS[idx % PIE_COLORS.length],
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Dashboard" onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Dashboard" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Summary cards */}
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.cardsRow}>
          <SummaryCard label="Insumos"       value={totalInsumos} sub="cadastrados"       color={colors.primary} />
          <SummaryCard label="Em Estoque"    value={totalEstoque} sub="unidades totais"   color={colors.accent}  />
          <SummaryCard label="Estoque Baixo" value={estoqueBaixo} sub="abaixo do mínimo"
            color={estoqueBaixo > 0 ? colors.danger : colors.accent} />
        </View>

        {/* Bar chart */}
        {barInsumos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Quantidade por Insumo</Text>
            <View style={styles.chartCard}>
              <BarChartComp data={barInsumos} />
            </View>
          </>
        )}

        {/* Pie chart */}
        {pieData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Distribuição por Unidade</Text>
            <View style={styles.chartCard}>
              <PieChartComp data={pieData} />
            </View>
          </>
        )}

        {/* Recent movimentações */}
        <Text style={styles.sectionTitle}>Movimentações Recentes</Text>
        <View style={styles.tableCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.col, styles.colTipo,   styles.headerText]}>Tipo</Text>
                <Text style={[styles.col, styles.colInsumo, styles.headerText]}>Insumo</Text>
                <Text style={[styles.col, styles.colQtd,    styles.headerText]}>Qtd</Text>
                <Text style={[styles.col, styles.colData,   styles.headerText]}>Data</Text>
                <Text style={[styles.col, styles.colResp,   styles.headerText]}>Responsável</Text>
              </View>

              {movimentacoes.length === 0 ? (
                <View style={styles.emptyRow}>
                  <Text style={styles.emptyText}>Nenhuma movimentação registrada.</Text>
                </View>
              ) : (
                movimentacoes.map((item, idx) => (
                  <View key={item.id} style={[styles.tableRow, idx % 2 === 1 && styles.rowAlt]}>
                    <Text style={[
                      styles.col, styles.colTipo, styles.cellText,
                      item.tipo === 'Entrada' ? styles.entradaText : styles.saidaText,
                    ]} numberOfLines={1}>
                      {item.tipo}
                    </Text>
                    <Text style={[styles.col, styles.colInsumo, styles.cellText]} numberOfLines={1}>{item.insumoNome}</Text>
                    <Text style={[styles.col, styles.colQtd,    styles.cellText]} numberOfLines={1}>{item.qtd}</Text>
                    <Text style={[styles.col, styles.colData,   styles.cellText]} numberOfLines={1}>{item.data}</Text>
                    <Text style={[styles.col, styles.colResp,   styles.cellText]} numberOfLines={1}>
                      {uidToNome[item.responsavel] ?? item.responsavel}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ label, value, sub, color }) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.background },
  content:     { padding: spacing.md, paddingBottom: spacing.xl },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  loadingText: { color: colors.textSecondary, fontSize: typography.sizes.sm },

  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    letterSpacing: 0.3,
  },

  cardsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderTopWidth: 4,
    padding: spacing.sm + 2,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardValue: { fontSize: typography.sizes.xxl, fontWeight: '800' },
  cardLabel: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text, marginTop: 2 },
  cardSub:   { fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
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
  col:       { fontSize: typography.sizes.xs },
  colTipo:   { width: 65 },
  colInsumo: { width: 105 },
  colQtd:    { width: 32, textAlign: 'center' },
  colData:   { width: 78, textAlign: 'center' },
  colResp:   { width: 110, textAlign: 'right' },
  cellText:  { color: colors.text },
  entradaText: { color: colors.accent, fontWeight: '700' },
  saidaText:   { color: colors.danger, fontWeight: '700' },
  emptyRow:  { padding: spacing.lg, alignItems: 'center' },
  emptyText: { color: colors.textSecondary, fontSize: typography.sizes.sm, fontStyle: 'italic' },
});