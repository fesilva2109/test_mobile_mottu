import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, AlertCircle } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useAuth } from '@/context/AuthContext';

// Tela de Login: autenticação simples para acesso ao app
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

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
  const handleLogin = () => {
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
      login(email); 
    }
  };

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
              onChangeText={setEmail}
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
          <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
            <Lock size={20} color={colors.neutral.gray} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          {/* Exibe erro de senha, se houver */}
          {errors.password ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={colors.status.quarantine} />
              <Text style={styles.errorText}>{errors.password}</Text>
            </View>
          ) : null}
        </View>

        {/* Botão de login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos organizados para visual limpo e responsivo
const styles = StyleSheet.create({
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
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: colors.status.quarantine,
    marginLeft: 8,
    fontSize: 12,
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
});