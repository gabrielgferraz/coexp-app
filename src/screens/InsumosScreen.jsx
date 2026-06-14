import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { IconUserCircle, IconLogout } from '@tabler/icons-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../theme';
import { SearchBar } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase/firestore';

export default function InsumosScreen({ navigation }) {
  const [search,  setSearch]  = useState('');
  const [insumos, setInsumos] = useState([]);
  const { isAdmin, logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      async function carregarInsumos() {
        try {
          const snapshot = await getDocs(collection(db, 'insumos'));
          setInsumos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.log('Erro ao carregar insumos:', error);
        }
      }
      carregarInsumos();
    }, [])
  );

  const insumosFiltrados = insumos.filter(item =>
    item.nome?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insumos COEXP</Text>

        <View style={styles.headerActions}>
          {/* Only admins see the user management button */}
          {isAdmin && (
            <TouchableOpacity
              onPress={() => navigation.navigate('GestaoAcessos')}
              style={styles.iconBtn}
            >
              <IconUserCircle size={20} color="#000" strokeWidth={1.5} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('Dashboard')}
            style={styles.iconBtn}
          >
            <Text>📊</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
            <IconLogout size={20} color="#000" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <SearchBar value={search} onChangeText={setSearch} />

        {/* Only admins can cadastrar and register movements */}
        {isAdmin && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, styles.cadastrar]}
              onPress={() => navigation.navigate('CadastroInsumo')}
            >
              <Text style={styles.btnText}>+ Cadastrar Insumo</Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.entrada]}
                onPress={() => navigation.navigate('RegistrarEntrada')}
              >
                <Text style={styles.btnText}>↓ Registrar Entrada</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.saida]}
                onPress={() => navigation.navigate('RegistrarSaida')}
              >
                <Text style={styles.btnText}>↑ Registrar Saída</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.tableCard}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.flex,   styles.headerText]}>Nome</Text>
            <Text style={[styles.cell, styles.small,  styles.headerText]}>Qtd</Text>
            <Text style={[styles.cell, styles.small,  styles.headerText]}>Mín</Text>
            <Text style={[styles.cell, styles.medium, styles.headerText]}>Unidade</Text>
          </View>

          {insumosFiltrados.length ? (
            insumosFiltrados.map((item, index) => {
              const qtd    = item.qtd ?? 0;
              const minimo = item.estoqueMinimo ?? null;
              const emPerigo = minimo != null && qtd < minimo;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.row, index % 2 === 1 && styles.altRow]}
                  onPress={() => navigation.navigate('DetalhesInsumo', { insumo: item })}
                >
                  <Text style={[styles.cell, styles.flex]}>{item.nome}</Text>
                  <Text style={[styles.cell, styles.small, emPerigo ? styles.danger : styles.ok]}>
                    {qtd}
                  </Text>
                  <Text style={[styles.cell, styles.small]}>{minimo ?? '-'}</Text>
                  <Text style={[styles.cell, styles.medium]}>{item.unidade}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.empty}>
              <Text>Nenhum insumo encontrado.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
  },
  headerTitle:   { color: colors.white, fontWeight: '700', fontSize: typography.sizes.md },
  headerActions: { flexDirection: 'row', gap: spacing.xs },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  scroll:  { flex: 1 },
  content: { padding: spacing.md, gap: spacing.md },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  cadastrar: { backgroundColor: colors.primary },
  entrada:   { backgroundColor: colors.afirmative },
  saida:     { backgroundColor: colors.danger },
  btnText:   { color: colors.white, fontWeight: '700' },
  tableCard: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  headerRow: { backgroundColor: colors.primary },
  altRow:    { backgroundColor: colors.tableRowAlt },
  cell:      { fontSize: typography.sizes.sm, color: colors.text },
  headerText:{ color: colors.white, fontWeight: '700' },
  flex:      { flex: 1 },
  small:     { width: 40, textAlign: 'center' },
  medium:    { width: 70, textAlign: 'right' },
  danger:    { color: colors.danger,     fontWeight: '700' },
  ok:        { color: colors.afirmative, fontWeight: '700' },
  empty:     { padding: spacing.lg, alignItems: 'center' },
});
