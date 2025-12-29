// Экран авторизации

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { signIn, signUp, signInAnonymously } from '../services/auth';
import { useUserStore } from '../stores/userStore';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/design';
import { FirebaseError } from 'firebase/app';

type AuthMode = 'signin' | 'signup';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const setUser = useUserStore(state => state.setUser);

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация формы
  const validate = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    };

    let isValid = true;

    // Проверка email
    if (!email.trim()) {
      newErrors.email = 'Введите email';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Неверный формат email';
      isValid = false;
    }

    // Проверка пароля
    if (!password) {
      newErrors.password = 'Введите пароль';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
      isValid = false;
    }

    // Проверки для регистрации
    if (mode === 'signup') {
      // Проверка имени
      if (!displayName.trim()) {
        newErrors.displayName = 'Введите имя';
        isValid = false;
      }

      // Проверка подтверждения пароля
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Подтвердите пароль';
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработка ошибок Firebase
  const getFirebaseErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Пользователь не найден';
      case 'auth/wrong-password':
        return 'Неверный пароль';
      case 'auth/email-already-in-use':
        return 'Email уже используется';
      case 'auth/weak-password':
        return 'Пароль слишком простой';
      case 'auth/invalid-email':
        return 'Неверный формат email';
      case 'auth/too-many-requests':
        return 'Слишком много попыток. Попробуйте позже';
      case 'auth/network-request-failed':
        return 'Ошибка сети. Проверьте подключение';
      default:
        return 'Произошла ошибка. Попробуйте позже';
    }
  };

  // Вход
  const handleSignIn = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await signIn(email.trim(), password);
      setUser(user);
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? getFirebaseErrorMessage(error)
        : 'Произошла ошибка при входе';
      Alert.alert('Ошибка входа', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация
  const handleSignUp = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await signUp(email.trim(), password, displayName.trim());
      setUser(user);
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? getFirebaseErrorMessage(error)
        : 'Произошла ошибка при регистрации';
      Alert.alert('Ошибка регистрации', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Анонимный вход
  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously();
      const firebaseUser = userCredential.user;
      
      // Создаём временного пользователя для анонимного входа
      const anonymousUser = {
        id: firebaseUser.uid,
        email: 'anonymous',
        displayName: 'Гость',
        level: 1,
        totalPoints: 0,
        createdAt: new Date()
      };
      
      setUser(anonymousUser);
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? getFirebaseErrorMessage(error)
        : 'Произошла ошибка при входе';
      Alert.alert('Ошибка', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Забыл пароль
  const handleForgotPassword = () => {
    Alert.alert('Восстановление пароля', 'Функция в разработке');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.title}>ArchiGo</Text>
            <Text style={styles.subtitle}>Собирай архитектуру города</Text>
          </View>

          {/* Переключатель режима */}
          <View style={styles.modeSwitch}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'signin' && styles.modeButtonActive]}
              onPress={() => setMode('signin')}
              disabled={isLoading}
            >
              <Text style={[styles.modeButtonText, mode === 'signin' && styles.modeButtonTextActive]}>
                Вход
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}
              onPress={() => setMode('signup')}
              disabled={isLoading}
            >
              <Text style={[styles.modeButtonText, mode === 'signup' && styles.modeButtonTextActive]}>
                Регистрация
              </Text>
            </TouchableOpacity>
          </View>

          {/* Форма */}
          <View style={styles.form}>
            {/* Имя (только для регистрации) */}
            {mode === 'signup' && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, !!errors.displayName && styles.inputError]}
                  placeholder="Имя"
                  placeholderTextColor={Colors.textTertiary}
                  value={displayName}
                  onChangeText={(text) => {
                    setDisplayName(text);
                    if (errors.displayName) {
                      setErrors({ ...errors, displayName: '' });
                    }
                  }}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
                {errors.displayName ? (
                  <Text style={styles.errorText}>{errors.displayName}</Text>
                ) : null}
              </View>
            )}

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, !!errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: '' });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Пароль */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, !!errors.password && styles.inputError]}
                placeholder="Пароль"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Подтверждение пароля (только для регистрации) */}
            {mode === 'signup' && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, !!errors.confirmPassword && styles.inputError]}
                  placeholder="Подтвердите пароль"
                  placeholderTextColor={Colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>
            )}

            {/* Забыл пароль (только для входа) */}
            {mode === 'signin' && (
              <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                <Text style={styles.forgotPassword}>Забыл пароль</Text>
              </TouchableOpacity>
            )}

            {/* Основная кнопка */}
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={mode === 'signin' ? handleSignIn : handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === 'signin' ? 'Войти' : 'Зарегистрироваться'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Анонимный вход */}
            <TouchableOpacity
              style={[styles.secondaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleAnonymousSignIn}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>Войти анонимно</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background
  },
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: Spacing.xxxl
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    marginBottom: Spacing.xl
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.base
  },
  modeButtonActive: {
    backgroundColor: Colors.primary
  },
  modeButtonText: {
    ...Typography.button,
    color: Colors.textSecondary
  },
  modeButtonTextActive: {
    color: Colors.surface
  },
  form: {
    gap: Spacing.base
  },
  inputContainer: {
    marginBottom: Spacing.sm
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    ...Typography.body,
    color: Colors.textPrimary
  },
  inputError: {
    borderColor: Colors.error
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs
  },
  forgotPassword: {
    ...Typography.body,
    color: Colors.primary,
    textAlign: 'right',
    marginTop: -Spacing.xs,
    marginBottom: Spacing.sm
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.surface
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'center'
  },
  secondaryButtonText: {
    ...Typography.button,
    color: Colors.textSecondary
  },
  buttonDisabled: {
    opacity: 0.6
  }
});
