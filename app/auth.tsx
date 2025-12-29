// Экран авторизации — Структурная эстетика

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

    if (!email.trim()) {
      newErrors.email = 'Введите email';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Неверный формат email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Введите пароль';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
      isValid = false;
    }

    if (mode === 'signup') {
      if (!displayName.trim()) {
        newErrors.displayName = 'Введите имя';
        isValid = false;
      }

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

          {/* Форма */}
          <View style={styles.formContainer}>
            {/* Переключатель режима */}
            <View style={styles.modeSwitch}>
              <TouchableOpacity
                onPress={() => setMode('signin')}
                disabled={isLoading}
              >
                <Text style={[styles.modeText, mode === 'signin' && styles.modeTextActive]}>
                  Вход
                </Text>
              </TouchableOpacity>
              <Text style={styles.modeSeparator}>·</Text>
              <TouchableOpacity
                onPress={() => setMode('signup')}
                disabled={isLoading}
              >
                <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>
                  Регистрация
                </Text>
              </TouchableOpacity>
            </View>

            {/* Имя (только для регистрации) */}
            {mode === 'signup' && (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, !!errors.displayName && styles.inputError]}
                  placeholder="Имя"
                  placeholderTextColor="#8C959F"
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
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, !!errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor="#8C959F"
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
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, !!errors.password && styles.inputError]}
                placeholder="Пароль"
                placeholderTextColor="#8C959F"
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
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, !!errors.confirmPassword && styles.inputError]}
                  placeholder="Подтвердите пароль"
                  placeholderTextColor="#8C959F"
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
              <TouchableOpacity 
                onPress={handleForgotPassword} 
                disabled={isLoading}
                style={styles.forgotPasswordContainer}
              >
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
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === 'signin' ? 'Войти' : 'Зарегистрироваться'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Анонимный вход */}
            <TouchableOpacity
              style={[styles.ghostButton, isLoading && styles.buttonDisabled]}
              onPress={handleAnonymousSignIn}
              disabled={isLoading}
            >
              <Text style={styles.ghostButtonText}>Войти анонимно</Text>
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
    backgroundColor: '#F6F8FA'
  },
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 64
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: '#24292F',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#57606A',
    lineHeight: 20
  },
  formContainer: {
    maxWidth: 320,
    width: '100%',
    alignSelf: 'center'
  },
  modeSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12
  },
  modeText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#57606A'
  },
  modeTextActive: {
    color: '#24292F',
    fontWeight: '500',
    textDecorationLine: 'underline'
  },
  modeSeparator: {
    fontSize: 14,
    color: '#D0D7DE'
  },
  inputWrapper: {
    marginBottom: 12
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D7DE',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '400',
    color: '#24292F',
    lineHeight: 20
  },
  inputError: {
    borderColor: '#CF222E'
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#CF222E',
    marginTop: 6,
    marginLeft: 2
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: 8
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: '400',
    color: '#0969DA'
  },
  primaryButton: {
    backgroundColor: '#0969DA',
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF'
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D0D7DE',
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  ghostButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#57606A'
  },
  buttonDisabled: {
    opacity: 0.5
  }
});
