import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { SearchBar, SelectField } from '../components/UI';

const MOCK_INSUMOS = [
  { id: '1', nome: 'Insumo A', qtd: 34, unidade: 'Litros' },
  { id: '2', nome: 'Insumo B', qtd: 2, unidade: 'Un' },
  { id: '3', nome: '—', qtd: null, unidade: null },
  { id: '4', nome: '—', qtd: null, unidade: null },
  { id: '5', nome: '—', qtd: null, unidade: null },
  { id: '6', nome: '—', qtd: null, unidade: null },
  { id: '7', nome: '—', qtd: null, unidade: null },
  { id: '8', nome: '—', qtd: null, unidade: null },
  { id: '9', nome: '—', qtd: null, unidade: null },
  { id: '10', nome: '—', qtd: null, unidade: null },
  { id: '11', nome: '—', qtd: null, unidade: null },
  { id: '12', nome: '—', qtd: null, unidade: null },
  { id: '13', nome: '—', qtd: null, unidade: null },
  { id: '14', nome: '—', qtd: null, unidade: null },
  { id: '15', nome: '—', qtd: null, unidade: null },
  { id: '16', nome: '—', qtd: null, unidade: null },
  { id: '17', nome: '—', qtd: null, unidade: null },
  { id: '18', nome: '—', qtd: null, unidade: null },
  { id: '19', nome: '—', qtd: null, unidade: null },
  { id: '20', nome: '—', qtd: null, unidade: null },
];

export default function InsumosScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [movimentacao, setMovimentacao] = useState('Registrar nova movimentação');

  const handleEntrada = () => navigation.navigate('RegistrarEntrada');
  const handleSaida = () => navigation.navigate('RegistrarSaida');
  const handleGestao = () => navigation.navigate('GestaoAcessos');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insumos COEXP</Text>
        <View style={styles.headerRight}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity onPress={handleGestao} style={styles.gestaoBtn}>
          <Text style={styles.gestaoBtnText}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Movimentação dropdown */}
        <View style={styles.section}>
          <SelectField value={movimentacao} placeholder="Registrar nova movimentação" />
        </View>

        {/* Ação buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEntrada]}
            onPress={handleEntrada}
            activeOpacity={0.75}
          >
            <Text style={styles.actionBtnIcon}>↓</Text>
            <Text style={styles.actionBtnText}>Entrada</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnSaida]}
            onPress={handleSaida}
            activeOpacity={0.75}
          >
            <Text style={[styles.actionBtnIcon, { color: colors.primary }]}>↑</Text>
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Saída</Text>
          </TouchableOpacity>
        </View>

        {/* Tabela de Insumos */}
        <View style={styles.tableCard}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableHeaderText, styles.cellFlex]}>
              Nome do Insumo
            </Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, styles.cellSmall]}>Qtd.</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, styles.cellMedium]}>
              Unidade
            </Text>
          </View>

          {/* Table Rows */}
          {MOCK_INSUMOS.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
              onPress={() =>
                item.qtd !== null && navigation.navigate('DetalhesInsumo', { insumo: item })
              }
              activeOpacity={item.qtd !== null ? 0.7 : 1}
            >
              <Text style={[styles.tableCell, styles.cellFlex, styles.tableCellText]}>
                {item.nome}
              </Text>
              <Text style={[styles.tableCell, styles.cellSmall, styles.tableCellText]}>
                {item.qtd ?? '—'}
              </Text>
              <Text style={[styles.tableCell, styles.cellMedium, styles.tableCellText]}>
                {item.unidade ?? '—'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.primary,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
    flexShrink: 0,
    marginRight: spacing.xs,
  },
  headerRight: {
    flex: 1,
  },
  gestaoBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestaoBtnText: {
    fontSize: 16,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  actionBtnEntrada: {
    backgroundColor: '#1A3A2A',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  actionBtnSaida: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1A3A2A',
    shadowColor: '#1A3A2A',
  },
  actionBtnIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
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
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableRowAlt: {
    backgroundColor: colors.tableRowAlt,
  },
  tableHeader: {
    backgroundColor: colors.primary,
    borderBottomWidth: 0,
  },
  tableHeaderText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sizes.xs,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tableCell: {
    fontSize: typography.sizes.sm,
  },
  tableCellText: {
    color: colors.text,
  },
  cellFlex: {
    flex: 1,
  },
  cellSmall: {
    width: 40,
    textAlign: 'center',
  },
  cellMedium: {
    width: 70,
    textAlign: 'right',
  },
});
