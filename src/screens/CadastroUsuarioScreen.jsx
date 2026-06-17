import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { ScreenHeader, PrimaryButton } from '../components/UI';

import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import db from '../firebase/firestore';

export default function CadastroUsuarioScreen({ navigation }) {
  const [nome,  setNome]  = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleCadastrar = async () => {
    if (!nome.trim())     { Alert.alert('Atenção', 'Informe o seu nome.');   return; }
    if (!email.trim())    { Alert.alert('Atenção', 'Informe o seu e-mail.'); return; }
    if (!senha)           { Alert.alert('Atenção', 'Informe uma senha.');    return; }
    if (senha.length < 6) { Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.'); return; }

    setSalvando(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), senha);

      // New self-registered accounts start as "Padrão" and await admin approval.
      await setDoc(doc(db, 'usuarios', credential.user.uid), {
        uid:      credential.user.uid,
        email:    email.trim(),
        nome:     nome.trim(),
        permissao: 'Padrão',
        aprovado:  false,
        criadoEm:  new Date(),
      });

      // Sign back out so the pending user doesn't slip into the app.
      await signOut(auth);

      Alert.alert(
        'Cadastro enviado!',
        'Sua conta foi criada e está aguardando aprovação de um administrador.',
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );

    } catch (e) {
      const msgs = {
        'auth/email-already-in-use': 'Este e-mail já está em uso.',
        'auth/invalid-email':        'E-mail inválido.',
        'auth/weak-password':        'Senha muito fraca.',
        'auth/network-request-failed': 'Sem conexão com a internet.',
      };
      Alert.alert('Erro ao cadastrar', msgs[e.code] ?? 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Criar conta" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>

            <Text style={styles.cardTitle}>Cadastre-se</Text>
            <Text style={styles.cardSubtitle}>
              Após o cadastro, um administrador precisa aprovar o seu acesso.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input} placeholder="Nome completo..."
                value={nome} onChangeText={setNome}
              />
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
              <TextInput
                style={styles.input} placeholder="Mínimo 6 caracteres..."
                value={senha} onChangeText={setSenha} secureTextEntry
              />
            </View>

            <PrimaryButton
              title={salvando ? 'Enviando...' : 'Cadastrar'}
              onPress={handleCadastrar}
              loading={salvando}
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: colors.background },
  flex:        { flex: 1 },
  content:     { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.md, gap: spacing.md,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  cardTitle:    { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.text },
  cardSubtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  fieldGroup:   { gap: spacing.xs },
  label:        { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.text },
  input: {
    backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.md,
    fontSize: typography.sizes.md, color: colors.text,
  },
});
