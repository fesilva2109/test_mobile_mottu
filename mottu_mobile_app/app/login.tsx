import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';

// Tela de Login: autenticação simples para acesso ao app
export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, authError, clearAuthError } = useAuth();
  const { colors } = useTheme();

  // Estados controlados para os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Validação básica de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de senha forte (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo)
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
    return passwordRegex.test(password);
  };

  // Função chamada ao pressionar "Entrar"
  const handleLogin = async () => {
    const newErrors = {
      email: '',
      password: ''
    };

    // Validação dos campos
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }
    else if (!validatePassword(password)) {
    newErrors.password = 'Senha fraca (mín. 8 caracteres, 1 maiúscula, 1 símbolo)';
     }

    setErrors(newErrors);

    // Se não houver erros, realiza login (contexto de autenticação)
      if (!newErrors.email && !newErrors.password) {
        await login(email, password);
      }
  };

  const getStyles = (colors: any) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral.lightGray,
    },
    header: {
      backgroundColor: colors.primary.main,
      padding: 24,
      paddingTop: 60,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.neutral.white,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.neutral.white,
      opacity: 0.9,
      textAlign: 'center',
      marginTop: 8,
    },
    form: {
      padding: 24,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.neutral.white,
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 56,
      borderWidth: 1,
      borderColor: colors.neutral.lightGray,
    },
    inputError: {
      borderColor: colors.status.quarantine,
    },
    input: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: colors.neutral.darkGray,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#ffe6e6',
      borderWidth: 1,
      borderColor: colors.status.quarantine,
      borderRadius: 8,
      marginBottom: 12,
    },
    errorText: {
      color: colors.status.quarantine,
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
    },
    loginButton: {
      backgroundColor: colors.primary.main,
      borderRadius: 12,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
    },
    loginButtonText: {
      color: colors.neutral.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    registerLink: {
      marginTop: 16,
      alignItems: 'center',
    },
    registerText: {
      color: colors.neutral.gray,
      fontSize: 14,
    },
    registerTextBold: {
      color: colors.primary.main,
      fontWeight: 'bold',
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
  });

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {/* Cabeçalho visual do app */}
      <View style={styles.header}>
        <Text style={styles.title}>Mottu</Text>
        <Text style={styles.subtitle}>Mapeamento Inteligente de Pátios</Text>
      </View>

      {/* Formulário de login */}
      <View style={styles.form}>
        {/* Campo de email */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
            <Mail size={20} color={colors.neutral.gray} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearAuthError();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          {/* Exibe erro de email, se houver */}
          {errors.email ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.status.quarantine} />
              <Text style={styles.errorText}>{errors.email}</Text>
            </View>
          ) : null}
        </View>

        {/* Campo de senha */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.password || authError ? styles.inputError : null]}>
            <Lock size={20} color={colors.neutral.gray} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearAuthError();
              }}
              secureTextEntry
              autoComplete="password"
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          {/* Exibe erro de senha ou authError, se houver */}
          {(errors.password || authError) ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.status.quarantine} />
              <Text style={styles.errorText}>{errors.password || authError}</Text>
            </View>
          ) : null}
        </View>

        {/* Botão de login */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.neutral.white} />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para registro */}
        <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>Não tem conta? <Text style={styles.registerTextBold}>Registrar</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


