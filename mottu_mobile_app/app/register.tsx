import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, AlertCircle, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

// Tela de Registro: cadastro de novo usuário
export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading, authError, clearAuthError } = useAuth();
  const { colors } = useTheme();

  // Estados controlados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  // Função chamada ao pressionar "Registrar"
  const handleRegister = async () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Validação dos campos
    if (!name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Senha fraca (mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo)';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);

    // Se não houver erros, realiza registro
    if (!newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      await register(email, password, name);
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
    registerButton: {
      backgroundColor: colors.primary.main,
      borderRadius: 12,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
    },
    registerButtonText: {
      color: colors.neutral.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginLink: {
      marginTop: 16,
      alignItems: 'center',
    },
    loginText: {
      color: colors.neutral.gray,
      fontSize: 14,
    },
    loginTextBold: {
      color: colors.primary.main,
      fontWeight: 'bold',
    },
    registerButtonDisabled: {
      opacity: 0.6,
    },
  });

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {/* Cabeçalho visual do app */}
      <View style={styles.header}>
        <Text style={styles.title}>Mottu</Text>
        <Text style={styles.subtitle}>Criar Conta</Text>
      </View>

      {/* Formulário de registro */}
      <View style={styles.form}>
        {/* Campo de nome */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
            <User size={20} color={colors.neutral.gray} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={name}
              onChangeText={(text) => {
                setName(text);
                clearAuthError();
              }}
              autoCapitalize="words"
              autoComplete="name"
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          {errors.name ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.status.quarantine} />
              <Text style={styles.errorText}>{errors.name}</Text>
            </View>
          ) : null}
        </View>

        {/* Campo de email */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.email || authError ? styles.inputError : null]}>
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
          {(errors.email || authError) ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.status.quarantine} />
              <Text style={styles.errorText}>{errors.email || authError}</Text>
            </View>
          ) : null}
        </View>

        {/* Campo de senha */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
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
              autoComplete="password-new"
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          {errors.password ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.status.quarantine} />
              <Text style={styles.errorText}>{errors.password}</Text>
            </View>
          ) : null}
        </View>

        {/* Campo de confirmação de senha */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, errors.confirmPassword ? styles.inputError : null]}>
            <Lock size={20} color={colors.neutral.gray} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearAuthError();
              }}
              secureTextEntry
              autoComplete="password-new"
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          {errors.confirmPassword ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.status.quarantine} />
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            </View>
          ) : null}
        </View>

        {/* Botão de registro */}
        <TouchableOpacity
          style={[styles.registerButton, loading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.neutral.white} />
          ) : (
            <Text style={styles.registerButtonText}>Registrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para login */}
        <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Já tem conta? <Text style={styles.loginTextBold}>Entrar</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
