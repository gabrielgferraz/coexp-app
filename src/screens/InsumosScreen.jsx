import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { IconUserCircle, IconLogout, IconSearch } from '@tabler/icons-react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { SearchBar, SelectField } from '../components/UI';

const MOCK_INSUMOS = [
  { id: '1', nome: 'Insumo A', qtd: 34, unidade: 'Litros' },
  { id: '2', nome: 'Insumo B', qtd: 2, unidade: 'Un' },
  { id: '3', nome: 'Insumo C', qtd: 10, unidade: 'Kg' },
  { id: '4', nome: 'Insumo D', qtd: 5, unidade: 'Un' },
  { id: '5', nome: 'Insumo E', qtd: 18, unidade: 'Litros' },
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

  const insumosFiltrados = MOCK_INSUMOS.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  const [movimentacao, setMovimentacao] = useState('Registrar nova movimentação');

  const handleEntrada = () => navigation.navigate('RegistrarEntrada');
  const handleSaida = () => navigation.navigate('RegistrarSaida');
  const handleGestao = () => navigation.navigate('GestaoAcessos');
  const handleLogout = () => navigation.navigate('Login');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insumos COEXP</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleGestao} style={styles.iconBtn}>
            <IconUserCircle size={20} color="#000000" strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
            <IconLogout size={20} color="#000000" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Ação buttons */}
        <View style={{ marginBottom: spacing.md }}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEntrada]}
            onPress={handleEntrada}
            activeOpacity={0.75}
          >
            <Text style={styles.actionBtnIcon}>↓</Text>
            <Text style={styles.actionBtnText}>Registrar Entrada</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnSaida]}
            onPress={handleSaida}
            activeOpacity={0.75}
          >
            <Text style={[styles.actionBtnIcon, { color: colors.primary }]}>↑</Text>
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Registrar Saída</Text>
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
          {insumosFiltrados.length > 0 ? (
          insumosFiltrados.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
              onPress={() => navigation.navigate('DetalhesInsumo', { insumo: item })}
              activeOpacity={0.7}
            >
              <Text style={[styles.tableCell, styles.cellFlex, styles.tableCellText]}>
                {item.nome}
              </Text>
              <Text style={[styles.tableCell, styles.cellSmall, styles.tableCellText]}>
                {item.qtd}
              </Text>
              <Text style={[styles.tableCell, styles.cellMedium, styles.tableCellText]}>
                {item.unidade}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>Nenhum insumo encontrado.</Text>
          </View>
        )}
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    flex: 1,
    left: 0,
    right: 0,
    position: 'absolute',
    textAlign: 'center',     
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
  },
    headerActions: {
      flexDirection: 'row',
      gap: spacing.xs,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    backgroundColor: 'rgba(241, 93, 25, 0.36)',
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
    backgroundColor: '#368dc7',
    borderColor: '#94cbdb',
    shadowColor: 'rgba(26, 58, 42, 0.12)',
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
  emptyRow: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },
});
