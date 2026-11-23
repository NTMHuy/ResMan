import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyRound, Lock, Mail, ShieldCheck, Utensils } from 'lucide-react-native';
import { APP_CONFIG } from '@/src/constants/config';
import { ROLE_LABELS } from '@/src/constants/rbac';
import { useTheme } from '@/src/theme/ThemeContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useLoginForm } from '@/src/features/auth/hooks/useLoginForm';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';

export function LoginScreen() {
  const { theme } = useTheme();
  const { isMobile } = useResponsive();
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    submitting,
    submitError,
    quickAccounts,
    handleLogin,
  } = useLoginForm();

  return (
    <SafeAreaView style={[styles.safeRoot, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: isMobile ? 16 : 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.wrapper,
            {
              flexDirection: isMobile ? 'column' : 'row',
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          {/* Left Brand / Overview Panel */}
          <View
            style={[
              styles.brandPanel,
              {
                backgroundColor: theme.colors.primaryContainer,
                padding: isMobile ? 20 : 32,
              },
            ]}
          >
            <View style={styles.brandHeader}>
              <View style={[styles.logoBox, { backgroundColor: theme.colors.secondary }]}>
                <Utensils size={22} color="#ffffff" />
              </View>
              <View>
                <Text style={[styles.brandName, { fontFamily: theme.typography.display }]}>
                  {APP_CONFIG.APP_NAME}
                </Text>
                <Text style={[styles.brandTag, { fontFamily: theme.typography.body }]}>
                  Hệ thống vận hành nhà hàng · {APP_CONFIG.BRANCH_NAME}
                </Text>
              </View>
            </View>

            <View style={styles.brandCopy}>
              <Text style={[styles.heroHeadline, { fontFamily: theme.typography.display }]}>
                Điều phối đặt món, Bếp KDS và Tồn kho trên một nền tảng thống nhất.
              </Text>
              <Text style={[styles.heroSub, { fontFamily: theme.typography.body }]}>
                Phân quyền rõ ràng theo từng vai trò nhân sự và trải nghiệm đặt món trực tiếp cho thực khách tại bàn.
              </Text>
            </View>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <ShieldCheck size={16} color="#93c5fd" />
                <Text style={styles.featureText}>Phân quyền RBAC 5 vai trò độc lập</Text>
              </View>
              <View style={styles.featureItem}>
                <KeyRound size={16} color="#93c5fd" />
                <Text style={styles.featureText}>Đồng bộ đơn hàng POS · KDS · Kho</Text>
              </View>
            </View>
          </View>

          {/* Right Form & Quick Role Switcher */}
          <View style={[styles.formPanel, { padding: isMobile ? 20 : 32 }]}>
            <View style={styles.formHeader}>
              <Text
                style={[
                  styles.formTitle,
                  { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                ]}
              >
                Đăng nhập hệ thống
              </Text>
              <Text
                style={[
                  styles.formDesc,
                  { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
                ]}
              >
                Nhập thông tin tài khoản hoặc chọn nhanh vai trò để kiểm thử nghiệp vụ.
              </Text>
            </View>

            {submitError ? (
              <View
                style={[
                  styles.errorBanner,
                  {
                    backgroundColor: theme.colors.errorContainer,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                <Text style={[styles.errorBannerText, { color: theme.colors.onErrorContainer }]}>
                  {submitError}
                </Text>
              </View>
            ) : null}

            <View style={styles.fields}>
              <Input
                label="Email đăng nhập"
                value={email}
                onChangeText={setEmail}
                placeholder="name@resman.vn"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon={<Mail size={16} color={theme.colors.outline} />}
              />
              <Input
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                secureTextEntry
                error={errors.password}
                leftIcon={<Lock size={16} color={theme.colors.outline} />}
                onSubmitEditing={() => void handleLogin()}
              />
              <Button
                label="Đăng nhập"
                onPress={() => void handleLogin()}
                loading={submitting}
                size="lg"
                fullWidth
              />
            </View>

            {quickAccounts.length > 0 ? (
              <View style={styles.quickSection}>
                <Text
                  style={[
                    styles.quickHeading,
                    { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
                  ]}
                >
                  Đăng nhập nhanh theo vai trò (Mật khẩu: 123456)
                </Text>
                <View style={styles.quickGrid}>
                  {quickAccounts.map((acc) => (
                    <Pressable
                      key={acc.id}
                      disabled={submitting}
                      onPress={() => {
                        setEmail(acc.email);
                        setPassword(acc.password);
                        void handleLogin(acc.email, acc.password);
                      }}
                      style={({ pressed }) => [
                        styles.quickCard,
                        {
                          backgroundColor: theme.colors.surfaceLow,
                          borderColor: theme.colors.border,
                          borderRadius: theme.radius.md,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <View style={styles.quickTop}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.quickName,
                            { color: theme.colors.onSurface, fontFamily: theme.typography.body },
                          ]}
                        >
                          {acc.fullName}
                        </Text>
                        <Badge label={ROLE_LABELS[acc.role]} tone="info" />
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.quickSub,
                          {
                            color: theme.colors.onSurfaceVariant,
                            fontFamily: theme.typography.mono,
                          },
                        ]}
                      >
                        {acc.email}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    maxWidth: 980,
    borderWidth: 1,
    overflow: 'hidden',
  },
  brandPanel: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 24,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  brandTag: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  brandCopy: {
    gap: 10,
  },
  heroHeadline: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 21,
    color: '#cbd5e1',
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  formPanel: {
    flex: 1.15,
    gap: 18,
  },
  formHeader: {
    gap: 4,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  formDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  errorBanner: {
    padding: 12,
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  fields: {
    gap: 12,
  },
  quickSection: {
    gap: 10,
    paddingTop: 6,
  },
  quickHeading: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickGrid: {
    gap: 8,
  },
  quickCard: {
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  quickTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  quickSub: {
    fontSize: 11,
  },
});
