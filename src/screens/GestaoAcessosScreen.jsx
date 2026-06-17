import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, PrimaryButton } from '../components/UI';
import NativePicker from '../components/NativePicker';
import { useAuth } from '../context/AuthContext';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import db from '../firebase/firestore';

const PERMISSAO_OPTIONS = [
  { label: 'Admin',  value: 'Admin'  },
  { label: 'Padrão', value: 'Padrão' },
];

export default function GestaoAcessosScreen({ navigation }) {
  const { isAdmin } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [criando,  setCriando]  = useState(false);

  const [nome,      setNome]      = useState('');
  const [email,     setEmail]     = useState('');
  const [senha,     setSenha]     = useState('');
  const [permissao, setPermissao] = useState('');

  // Redirect non-admins immediately
  useEffect(() => {
    if (!isAdmin) {
      Alert.alert('Acesso negado', 'Apenas administradores podem acessar esta tela.');
      navigation.goBack();
    }
  }, [isAdmin]);

  useFocusEffect(
    useCallback(() => {
      if (isAdmin) carregarUsuarios();
    }, [isAdmin])
  );

  async function carregarUsuarios() {
    setLoading(true);
    try {
      const q = query(collection(db, 'usuarios'), orderBy('criadoEm', 'desc'));
      const snap = await getDocs(q);
      setUsuarios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log('Erro carregando usuários:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleCriarUsuario = async () => {
    if (!nome.trim())     { Alert.alert('Atenção', 'Informe o nome.');      return; }
    if (!email.trim())    { Alert.alert('Atenção', 'Informe o e-mail.');    return; }
    if (!senha)           { Alert.alert('Atenção', 'Informe a senha.');     return; }
    if (senha.length < 6) { Alert.alert('Atenção', 'Senha precisa ter pelo menos 6 caracteres.'); return; }
    if (!permissao)       { Alert.alert('Atenção', 'Selecione a permissão.'); return; }

    setCriando(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), senha);

      await setDoc(doc(db, 'usuarios', credential.user.uid), {
        uid:      credential.user.uid,
        email:    email.trim(),
        nome:     nome.trim(),
        permissao,
        aprovado: true, // accounts created by an admin are pre-approved
        criadoEm: new Date(),
      });

      setNome('');
      setEmail('');
      setSenha('');
      setPermissao('');

      Alert.alert('Usuário criado!', `Conta criada para ${nome.trim()}.`);
      carregarUsuarios();

    } catch (e) {
      const msgs = {
        'auth/email-already-in-use': 'Este e-mail já está em uso.',
        'auth/invalid-email':        'E-mail inválido.',
        'auth/weak-password':        'Senha muito fraca.',
      };
      Alert.alert('Erro', msgs[e.code] ?? 'Não foi possível criar o usuário.');
    } finally {
      setCriando(false);
    }
  };

  const handleExcluir = (usuario) => {
    Alert.alert(
      'Excluir usuário',
      `Remover "${usuario.nome}" do sistema?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'usuarios', usuario.id));
              setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível excluir o usuário.');
            }
          },
        },
      ]
    );
  };

  const handleAprovar = async (usuario) => {
    try {
      await updateDoc(doc(db, 'usuarios', usuario.id), { aprovado: true });
      setUsuarios(prev =>
        prev.map(u => u.id === usuario.id ? { ...u, aprovado: true } : u)
      );
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível aprovar o usuário.');
    }
  };

  const handleRecusar = (usuario) => {
    Alert.alert(
      'Recusar cadastro',
      `Recusar e remover o cadastro de "${usuario.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'usuarios', usuario.id));
              setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível recusar o cadastro.');
            }
          },
        },
      ]
    );
  };

  const handleTogglePermissao = async (usuario) => {
    const nova = usuario.permissao === 'Admin' ? 'Padrão' : 'Admin';
    try {
      await updateDoc(doc(db, 'usuarios', usuario.id), { permissao: nova });
      setUsuarios(prev =>
        prev.map(u => u.id === usuario.id ? { ...u, permissao: nova } : u)
      );
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível alterar a permissão.');
    }
  };

  // Render nothing while redirect fires
  if (!isAdmin) return null;

  const pendentes = usuarios.filter(u => u.aprovado === false);
  const aprovados = usuarios.filter(u => u.aprovado !== false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Gestão de Acessos" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Criar usuário</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} placeholder="Nome completo..." value={nome} onChangeText={setNome} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input} placeholder="email@exemplo.com..." value={email}
              onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoCorrect={false}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} placeholder="Mínimo 6 caracteres..." value={senha} onChangeText={setSenha} secureTextEntry />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Permissão</Text>
            <NativePicker value={permissao} onChange={setPermissao} options={PERMISSAO_OPTIONS} placeholder="Selecione a permissão..." />
          </View>

          <PrimaryButton title={criando ? 'Criando...' : 'Criar usuário'} onPress={handleCriarUsuario} disabled={criando} />
        </View>

        {pendentes.length > 0 && (
          <View style={styles.card}>
            <View style={styles.pendingTitleRow}>
              <Text style={styles.cardTitle}>Pendências de aprovação</Text>
              <View style={styles.pendingCount}>
                <Text style={styles.pendingCountText}>{pendentes.length}</Text>
              </View>
            </View>

            {pendentes.map((item) => (
              <View key={item.id} style={styles.pendingRow}>
                <View style={styles.pendingInfo}>
                  <Text style={styles.cellText}>{item.nome}</Text>
                  <Text style={styles.cellSub}>{item.email}</Text>
                </View>
                <View style={styles.pendingActions}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleAprovar(item)}>
                    <Text style={styles.approveBtnText}>Aprovar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => handleRecusar(item)}>
                    <Text style={styles.rejectBtnText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.tableCard}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.col, styles.colNome, styles.headerText]}>Nome</Text>
            <Text style={[styles.col, styles.colPerm, styles.headerText]}>Permissão</Text>
            <Text style={[styles.col, styles.colAcao, styles.headerText]}>Ações</Text>
          </View>

          {loading ? (
            <View style={styles.emptyRow}><ActivityIndicator color={colors.primary} /></View>
          ) : aprovados.length === 0 ? (
            <View style={styles.emptyRow}><Text style={styles.emptyText}>Nenhum usuário cadastrado.</Text></View>
          ) : (
            aprovados.map((item, idx) => (
              <View key={item.id} style={[styles.tableRow, idx % 2 === 1 && styles.rowAlt]}>

                <View style={[styles.col, styles.colNome]}>
                  <Text style={styles.cellText}>{item.nome}</Text>
                  <Text style={styles.cellSub}>{item.email}</Text>
                </View>

                <TouchableOpacity style={[styles.col, styles.colPerm]} onPress={() => handleTogglePermissao(item)}>
                  <View style={[styles.permBadge, item.permissao === 'Admin' ? styles.badgeAdmin : styles.badgePadrao]}>
                    <Text style={styles.permBadgeText}>{item.permissao ?? '—'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.col, styles.colAcao]} onPress={() => handleExcluir(item)}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>

              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.md, gap: spacing.md,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  cardTitle:  { fontSize: typography.sizes.md, fontWeight: '600', color: colors.text },
  fieldGroup: { gap: spacing.xs },
  label:      { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
  input: {
    backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md,
    fontSize: typography.sizes.md, color: colors.text,
  },
  tableCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden',
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  rowAlt:      { backgroundColor: colors.tableRowAlt },
  tableHeader: { backgroundColor: colors.primary, borderBottomWidth: 0 },
  headerText: {
    color: colors.white, fontWeight: '700',
    fontSize: typography.sizes.xs, textTransform: 'uppercase', letterSpacing: 0.3,
  },
  col:     { fontSize: typography.sizes.sm },
  colNome: { flex: 1 },
  colPerm: { width: 80, alignItems: 'center' },
  colAcao: { width: 52, alignItems: 'center' },
  cellText: { color: colors.text, fontSize: typography.sizes.sm, fontWeight: '500' },
  cellSub:  { color: colors.textSecondary, fontSize: typography.sizes.xs, marginTop: 1 },
  permBadge:      { paddingHorizontal: spacing.xs + 2, paddingVertical: 3, borderRadius: radius.sm },
  badgeAdmin:     { backgroundColor: colors.primary + '22' },
  badgePadrao:    { backgroundColor: colors.borderLight },
  permBadgeText:  { fontSize: typography.sizes.xs, fontWeight: '700', color: colors.text },
  deleteBtn:      { color: colors.danger, fontSize: 16, fontWeight: '700' },
  emptyRow:       { padding: spacing.lg, alignItems: 'center' },
  emptyText:      { color: colors.textSecondary, fontSize: typography.sizes.sm, fontStyle: 'italic' },

  // Pending approvals
  pendingTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pendingCount: {
    minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6,
    backgroundColor: colors.warning, alignItems: 'center', justifyContent: 'center',
  },
  pendingCountText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: '700' },
  pendingRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.borderLight,
  },
  pendingInfo:    { flex: 1 },
  pendingActions: { flexDirection: 'row', gap: spacing.xs },
  approveBtn: {
    paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm, backgroundColor: colors.afirmative,
  },
  approveBtnText: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: '700' },
  rejectBtn: {
    paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.danger,
  },
  rejectBtnText: { color: colors.danger, fontSize: typography.sizes.xs, fontWeight: '700' },
});