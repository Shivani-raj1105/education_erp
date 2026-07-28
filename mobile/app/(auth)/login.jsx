import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { authService } from '../../src/services/auth.service';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  red: '#ef4444',
  green: '#22c55e',
};

const DEMO_CREDENTIALS = [
  { departmentCode: 'CSE', username: 'hod_cse', password: 'hod@cse123', label: 'CSE Department' },
];

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    departmentCode: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.departmentCode.trim()) newErrors.departmentCode = 'Department code is required';
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password && form.password.length < 4) newErrors.password = 'Password too short';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login({
        departmentCode: form.departmentCode.trim().toUpperCase(),
        username: form.username.trim(),
        password: form.password,
      });

      if (res.success && res.data) {
        const { token, faculty } = res.data;
        login(faculty, token);
        router.replace('/(app)/dashboard');
      } else {
        Alert.alert('Login Failed', res.message || 'Invalid credentials');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Unable to connect. Check your network and try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (cred) => {
    setForm({
      departmentCode: cred.departmentCode,
      username: cred.username,
      password: cred.password,
    });
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <Ionicons name="school" size={36} color="#fff" />
            </View>
            <Text style={styles.appName}>Dept Portal</Text>
            <Text style={styles.appSubtitle}>HOD Management System</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSub}>Sign in to your department account</Text>

            {/* Department Code */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Department Code</Text>
              <View style={[styles.inputWrap, errors.departmentCode && styles.inputError]}>
                <Ionicons name="business-outline" size={18} color={COLORS.textDim} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.departmentCode}
                  onChangeText={(v) => updateField('departmentCode', v)}
                  placeholder="e.g. CSE, ECE, MECH"
                  placeholderTextColor={COLORS.textDim}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              {errors.departmentCode ? <Text style={styles.errorText}>{errors.departmentCode}</Text> : null}
            </View>

            {/* Username */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputWrap, errors.username && styles.inputError]}>
                <Ionicons name="person-outline" size={18} color={COLORS.textDim} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.username}
                  onChangeText={(v) => updateField('username', v)}
                  placeholder="Enter username"
                  placeholderTextColor={COLORS.textDim}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrap, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textDim} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={form.password}
                  onChangeText={(v) => updateField('password', v)}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.textDim}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={COLORS.textDim}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={18} color="#fff" />
                  <Text style={styles.submitText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Demo Credentials */}
          <View style={styles.demoCard}>
            <View style={styles.demoHeader}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
              <Text style={styles.demoTitle}>Demo Credentials</Text>
            </View>
            {DEMO_CREDENTIALS.map((cred, i) => (
              <TouchableOpacity
                key={i}
                style={styles.demoItem}
                onPress={() => fillDemo(cred)}
                activeOpacity={0.7}
              >
                <View style={styles.demoInfo}>
                  <Text style={styles.demoLabel}>{cred.label}</Text>
                  <Text style={styles.demoCredText}>
                    Dept: {cred.departmentCode} · User: {cred.username}
                  </Text>
                </View>
                <View style={styles.fillBtn}>
                  <Text style={styles.fillBtnText}>Fill</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    gap: 8,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    gap: 16,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  cardSub: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: -8,
  },
  fieldWrap: {
    gap: 6,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    marginTop: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  demoCard: {
    marginTop: 20,
    backgroundColor: '#1e293b88',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  demoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
  },
  demoInfo: {
    flex: 1,
  },
  demoLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  demoCredText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  fillBtn: {
    backgroundColor: COLORS.primary + '33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  fillBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
