import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, InputField, SelectField, PrimaryButton } from '../components/UI';

const MOCK_USUARIOS = [
  { id: '1', usuario: 'Gabriel', permissao: 'Padrão' },
  { id: '2', usuario: 'Ana', permissao: 'Admin' },
  { id: '3', usuario: '—', permissao: null },
  { id: '4', usuario: '—', permissao: null },
];

export default function GestaoAcessosScreen({ navigation }) {
  const [novoUsuario, setNovoUsuario] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [permissao, setPermissao] = useState('');

  const handleCriarUsuario = () => {
    if (!novoUsuario || !novaSenha) {
      Alert.alert('Atenção', 'Preencha o usuário e a senha.');
      return;
    }
    Alert.alert('Usuário criado!', `Usuário "${novoUsuario}" criado com permissão ${permissao}.`);
    setNovoUsuario('');
    setNovaSenha('');
    setPermissao('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Gestão de Acessos" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>

        {/* Criar usuário */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Criar usuário</Text>

          <InputField
            placeholder="Digite o nome do usuário..."
            value={novoUsuario}
            onChangeText={setNovoUsuario}
          />

          <InputField
            placeholder="Digite a senha..."
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
          />

          <SelectField
            value={permissao}
            onChange={setPermissao}
            options={['Admin', 'Padrão']}
            placeholder="Selecione a permissão"
          />

          <PrimaryButton title="Criar usuário" onPress={handleCriarUsuario} />
        </View>

        {/* Tabela de usuários */}
        <View style={styles.tableCard}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.col, styles.colUser, styles.headerText]}>Usuário</Text>
            <Text style={[styles.col, styles.colPerm, styles.headerText]}>Permissões</Text>
          </View>

          {MOCK_USUARIOS.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.tableRow, idx % 2 === 1 && styles.rowAlt]}
            >
              <Text style={[styles.col, styles.colUser, styles.cellText]}>
                {item.usuario}
              </Text>
              <Text
                style={[
                  styles.col,
                  styles.colPerm,
                  styles.cellText,
                  item.permissao === 'Admin' && styles.adminText,
                ]}
              >
                {item.permissao ?? '—'}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

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
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.text,
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
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowAlt: { backgroundColor: colors.tableRowAlt },
  tableHeader: {
    backgroundColor: colors.primary,
    borderBottomWidth: 0,
  },
  headerText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  col: { fontSize: typography.sizes.sm },
  colUser: { flex: 1 },
  colPerm: { flex: 1, textAlign: 'right' },
  cellText: { color: colors.text },
  adminText: {
    color: colors.primary,
    fontWeight: '700',
  },
});