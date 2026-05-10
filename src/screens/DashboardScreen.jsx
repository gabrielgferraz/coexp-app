import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { ScreenHeader } from '../components/UI';
import { colors, spacing, radius, typography } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - spacing.md * 2 - 2;

// ─── Dados mockados ───────────────────────────────────────────────────────────
const INSUMOS = [
  { nome: 'Insumo A', qtd: 34, unidade: 'Litros' },
  { nome: 'Insumo B', qtd: 2,  unidade: 'Un' },
  { nome: 'Insumo C', qtd: 10, unidade: 'Kg' },
  { nome: 'Insumo D', qtd: 5,  unidade: 'Un' },
  { nome: 'Insumo E', qtd: 18, unidade: 'Litros' },
];

const MOVIMENTACOES = [
  { tipo: 'Entrada', insumo: 'Insumo A', qtd: 15, data: '01/04/2026', responsavel: 'Gabriel' },
  { tipo: 'Saída',   insumo: 'Insumo B', qtd: 3,  data: '28/03/2026', responsavel: 'Ana' },
  { tipo: 'Entrada', insumo: 'Insumo C', qtd: 10, data: '25/03/2026', responsavel: 'Gabriel' },
  { tipo: 'Saída',   insumo: 'Insumo A', qtd: 20, data: '15/03/2026', responsavel: 'Ana' },
  { tipo: 'Entrada', insumo: 'Insumo E', qtd: 18, data: '10/03/2026', responsavel: 'Gabriel' },
];

const LIMITE_BAIXO = 6;

// ─── Cálculos ─────────────────────────────────────────────────────────────────
const totalInsumos = INSUMOS.length;
const totalEstoque = INSUMOS.reduce((acc, i) => acc + i.qtd, 0);
const estoqueBaixo = INSUMOS.filter((i) => i.qtd < LIMITE_BAIXO).length;

// Dados para gráfico de barras
const barData = {
  labels: INSUMOS.map((i) => i.nome.replace('Insumo ', '')),
  datasets: [{ data: INSUMOS.map((i) => i.qtd) }],
};

// Dados para gráfico de pizza (por unidade)
const unidades = INSUMOS.reduce((acc, i) => {
  acc[i.unidade] = (acc[i.unidade] || 0) + i.qtd;
  return acc;
}, {});

const PIE_COLORS = ['#1A3A2A', '#4CAF50', '#81C784', '#FF8F00', '#42A5F5'];
const pieData = Object.entries(unidades).map(([name, population], idx) => ({
  name,
  population,
  color: PIE_COLORS[idx % PIE_COLORS.length],
  legendFontColor: colors.text,
  legendFontSize: 13,
}));

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  color: (opacity = 1) => `rgba(26, 58, 42, ${opacity})`,
  labelColor: () => colors.textSecondary,
  barPercentage: 0.6,
  decimalPlaces: 0,
  propsForBackgroundLines: {
    stroke: colors.borderLight,
    strokeDasharray: '',
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Dashboard" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>

        {/* ── Cards de resumo ── */}
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.cardsRow}>
          <SummaryCard
            label="Insumos"
            value={totalInsumos}
            sub="cadastrados"
            color={colors.primary}
          />
          <SummaryCard
            label="Em Estoque"
            value={totalEstoque}
            sub="unidades totais"
            color="#2E7D32"
          />
          <SummaryCard
            label="Estoque Baixo"
            value={estoqueBaixo}
            sub={`abaixo de ${LIMITE_BAIXO}`}
            color={estoqueBaixo > 0 ? '#C62828' : '#2E7D32'}
          />
        </View>

        {/* ── Gráfico de barras ── */}
        <Text style={styles.sectionTitle}>Quantidade por Insumo</Text>
        <View style={styles.chartCard}>
          <BarChart
            data={barData}
            width={CHART_WIDTH}
            height={200}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            withInnerLines
            style={styles.chart}
          />
        </View>

        {/* ── Gráfico de pizza ── */}
        <Text style={styles.sectionTitle}>Distribuição por Unidade</Text>
        <View style={styles.chartCard}>
          <PieChart
            data={pieData}
            width={CHART_WIDTH}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            style={styles.chart}
          />
        </View>

        {/* ── Movimentações recentes ── */}
        <Text style={styles.sectionTitle}>Movimentações Recentes</Text>
        <View style={styles.tableCard}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.col, styles.colTipo,  styles.headerText]}>Tipo</Text>
            <Text style={[styles.col, styles.colInsumo,styles.headerText]}>Insumo</Text>
            <Text style={[styles.col, styles.colQtd,   styles.headerText]}>Qtd</Text>
            <Text style={[styles.col, styles.colData,  styles.headerText]}>Data</Text>
            <Text style={[styles.col, styles.colResp,  styles.headerText]}>Resp.</Text>
          </View>

          {MOVIMENTACOES.map((item, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.rowAlt]}>
              <Text
                style={[
                  styles.col, styles.colTipo, styles.cellText,
                  item.tipo === 'Entrada' ? styles.entradaText : styles.saidaText,
                ]}
              >
                {item.tipo}
              </Text>
              <Text style={[styles.col, styles.colInsumo, styles.cellText]}>{item.insumo}</Text>
              <Text style={[styles.col, styles.colQtd,    styles.cellText]}>{item.qtd}</Text>
              <Text style={[styles.col, styles.colData,   styles.cellText]}>{item.data}</Text>
              <Text style={[styles.col, styles.colResp,   styles.cellText]}>{item.responsavel}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Card de resumo ───────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, color }) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },

  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    letterSpacing: 0.3,
  },

  // Cards
  cardsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
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
  cardValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
  },
  cardLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  cardSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // Charts
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
  chart: {
    borderRadius: radius.lg,
  },

  // Table
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
  rowAlt: { backgroundColor: colors.tableRowAlt },
  tableHeader: { backgroundColor: colors.primary, borderBottomWidth: 0 },
  headerText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  col: { fontSize: typography.sizes.xs },
  colTipo:   { flex: 1.2 },
  colInsumo: { flex: 1.4 },
  colQtd:    { width: 30, textAlign: 'center' },
  colData:   { flex: 1.5, textAlign: 'center' },
  colResp:   { flex: 1.2, textAlign: 'right' },
  cellText:  { color: colors.text },
  entradaText: { color: '#2E7D32', fontWeight: '700' },
  saidaText:   { color: '#C62828', fontWeight: '700' },
});