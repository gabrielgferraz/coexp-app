import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../theme';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/config';
import db from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email,   setEmail]   = useState('');
  const [senha,   setSenha]   = useState('');
  const [loading, setLoading] = useState(false);

  const { user, aprovado, loading: authLoading, logout } = useAuth();

  // Handle an already-resolved session (e.g. persisted login on web).
  // Runs once after auth state finishes resolving on mount.
  useEffect(() => {
    if (authLoading || !user) return;
    if (aprovado) {
      navigation.replace('Insumos');
    } else {
      logout();
      Alert.alert('Conta pendente', 'Sua conta ainda não foi liberada por um administrador.');
    }
  }, [authLoading]);

  // Show spinner while auth state is being resolved (avoids flash)
  if (authLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const handleEntrar = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), senha);

      // Block accounts that are still awaiting (or were denied) approval.
      const snap   = await getDoc(doc(db, 'usuarios', credential.user.uid));
      const perfil = snap.exists() ? snap.data() : null;
      const liberado = !!perfil && perfil.aprovado !== false;

      if (!liberado) {
        await signOut(auth);
        Alert.alert(
          'Conta pendente de aprovação',
          'Sua conta ainda não foi liberada por um administrador. Tente novamente mais tarde.'
        );
        return;
      }

      navigation.replace('Insumos');
    } catch (error) {
      const mensagens = {
        'auth/invalid-email':          'E-mail inválido.',
        'auth/user-not-found':         'Usuário não encontrado.',
        'auth/wrong-password':         'Senha incorreta.',
        'auth/invalid-credential':     'E-mail ou senha incorretos.',
        'auth/too-many-requests':      'Muitas tentativas. Tente novamente mais tarde.',
        'auth/network-request-failed': 'Sem conexão com a internet.',
      };
      Alert.alert('Erro ao entrar', mensagens[error.code] ?? 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>

          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/logo.webp')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.form}>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail..."
                placeholderTextColor={colors.textPlaceholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha..."
                placeholderTextColor={colors.textPlaceholder}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleEntrar}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color={colors.white} />
                : <Text style={styles.buttonText}>Entrar</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => navigation.navigate('CadastroUsuario')}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.signupText}>
                Não tem conta? <Text style={styles.signupTextBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.background },
  flex:    { flex: 1 },
  centered:{ flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl + 8,
  },
  logo: { width: 300, height: 200 },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  fieldGroup:    { marginBottom: spacing.md },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signupLink: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  signupText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  signupTextBold: {
    color: colors.primary,
    fontWeight: '700',
  },
});