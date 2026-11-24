import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Armchair,
  BarChart3,
  BookOpen,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  ShoppingBag,
  Sun,
  User,
  Users,
  Utensils,
} from 'lucide-react-native';
import { APP_CONFIG } from '@/src/constants/config';
import { APP_ROUTES_META, ROLE_LABELS } from '@/src/constants/rbac';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAppNavigation } from '@/src/contexts/NavigationContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { useTheme } from '@/src/theme/ThemeContext';
import type { AppRoute } from '@/src/types/common';
import { ModalDialog } from '@/src/components/common/ModalDialog';
import { Badge } from '@/src/components/common/Badge';
import { Button } from '@/src/components/common/Button';

const ROUTE_ORDER: AppRoute[] = [
  'dashboard',
  'menu',
  'customer-order',
  'tables',
  'orders',
  'kitchen',
  'inventory',
  'employees',
  'reports',
];

function renderRouteIcon(route: AppRoute, color: string, size = 18) {
  switch (route) {
    case 'dashboard':
      return <LayoutDashboard size={size} color={color} />;
    case 'menu':
      return <BookOpen size={size} color={color} />;
    case 'customer-order':
      return <ShoppingBag size={size} color={color} />;
    case 'tables':
      return <Armchair size={size} color={color} />;
    case 'orders':
      return <ClipboardList size={size} color={color} />;
    case 'kitchen':
      return <ChefHat size={size} color={color} />;
    case 'inventory':
      return <Package size={size} color={color} />;
    case 'employees':
      return <Users size={size} color={color} />;
    case 'reports':
      return <BarChart3 size={size} color={color} />;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, canAccessRoute, logout } = useAuth();
  const { currentRoute, navigate } = useAppNavigation();
  const { isMobile, isTablet } = useResponsive();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleRoutes = useMemo(
    () => ROUTE_ORDER.filter((route) => canAccessRoute(route)),
    [canAccessRoute]
  );

  const activeMeta = APP_ROUTES_META[currentRoute];
  const mobileBottomRoutes = visibleRoutes.slice(0, 4);

  const handleSelectRoute = (route: AppRoute) => {
    navigate(route);
    setDrawerOpen(false);
  };

  return (
    <SafeAreaView style={[styles.safeRoot, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.shellRow, { backgroundColor: theme.colors.background }]}>
        {!isMobile ? (
          <View
            style={[
              styles.sidebar,
              {
                width: isTablet ? 210 : 244,
                backgroundColor: theme.colors.surface,
                borderRightColor: theme.colors.border,
              },
            ]}
          >
            <View style={[styles.brandRow, { borderBottomColor: theme.colors.border }]}>
              <View style={[styles.brandIcon, { backgroundColor: theme.colors.primary }]}>
                <Utensils size={18} color={theme.colors.onPrimary} />
              </View>
              <View style={styles.brandTextWrap}>
                <Text
                  style={[
                    styles.brandTitle,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                  ]}
                >
                  {APP_CONFIG.APP_NAME}
                </Text>
                <Text
                  style={[
                    styles.brandSub,
                    { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
                  ]}
                >
                  {APP_CONFIG.BRANCH_NAME}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.navScroll} contentContainerStyle={styles.navList}>
              {visibleRoutes.map((route) => {
                const meta = APP_ROUTES_META[route];
                const isActive = currentRoute === route;
                const iconColor = isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant;
                return (
                  <Pressable
                    key={route}
                    onPress={() => handleSelectRoute(route)}
                    style={[
                      styles.navItem,
                      {
                        backgroundColor: isActive ? theme.colors.primaryContainer : 'transparent',
                        borderRadius: theme.radius.md,
                      },
                    ]}
                  >
                    {renderRouteIcon(route, iconColor, 18)}
                    <View style={styles.navTextCol}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.navLabel,
                          {
                            color: isActive ? theme.colors.onPrimary : theme.colors.onSurface,
                            fontFamily: theme.typography.body,
                          },
                        ]}
                      >
                        {meta.label}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.navSub,
                          {
                            color: isActive
                              ? theme.colors.onPrimaryContainer
                              : theme.colors.onSurfaceVariant,
                            fontFamily: theme.typography.body,
                          },
                        ]}
                      >
                        {meta.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={[styles.sidebarFooter, { borderTopColor: theme.colors.border }]}>
              <Pressable
                onPress={() => setProfileOpen(true)}
                style={[styles.userCard, { backgroundColor: theme.colors.surfaceLow }]}
              >
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                    {user?.avatarInitials || 'NV'}
                  </Text>
                </View>
                <View style={styles.userMeta}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.userName,
                      { color: theme.colors.onSurface, fontFamily: theme.typography.body },
                    ]}
                  >
                    {user?.fullName || 'Người dùng'}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.userRole,
                      { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
                    ]}
                  >
                    {user ? ROLE_LABELS[user.role] : ''}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.mainColumn}>
          <View
            style={[
              styles.topBar,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.topLeft}>
              {isMobile ? (
                <Pressable
                  onPress={() => setDrawerOpen(true)}
                  style={[styles.iconButton, { backgroundColor: theme.colors.surfaceLow }]}
                >
                  <Menu size={20} color={theme.colors.onSurface} />
                </Pressable>
              ) : null}
              <View style={styles.topTitleWrap}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.pageTitle,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                  ]}
                >
                  {activeMeta.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.pageSub,
                    { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
                  ]}
                >
                  {activeMeta.subtitle} · {APP_CONFIG.BRANCH_NAME}
                </Text>
              </View>
            </View>

            <View style={styles.topActions}>
              {!isMobile && user ? (
                <Badge label={ROLE_LABELS[user.role]} tone="info" />
              ) : null}
              <Pressable
                onPress={toggleTheme}
                style={[styles.iconButton, { backgroundColor: theme.colors.surfaceLow }]}
                accessibilityLabel="Chuyển giao diện Sáng/Tối"
              >
                {isDark ? (
                  <Sun size={18} color={theme.colors.warning} />
                ) : (
                  <Moon size={18} color={theme.colors.onSurfaceVariant} />
                )}
              </Pressable>
              <Pressable
                onPress={() => setProfileOpen(true)}
                style={[styles.iconButton, { backgroundColor: theme.colors.surfaceLow }]}
                accessibilityLabel="Thông tin tài khoản"
              >
                <User size={18} color={theme.colors.onSurface} />
              </Pressable>
            </View>
          </View>

          <View style={styles.contentArea}>{children}</View>

          {isMobile ? (
            <View
              style={[
                styles.bottomTabs,
                {
                  backgroundColor: theme.colors.surface,
                  borderTopColor: theme.colors.border,
                },
              ]}
            >
              {mobileBottomRoutes.map((route) => {
                const meta = APP_ROUTES_META[route];
                const isActive = currentRoute === route;
                const color = isActive ? theme.colors.secondary : theme.colors.onSurfaceVariant;
                return (
                  <Pressable
                    key={route}
                    onPress={() => handleSelectRoute(route)}
                    style={styles.bottomTabItem}
                  >
                    {renderRouteIcon(route, color, 20)}
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.bottomTabLabel,
                        {
                          color,
                          fontWeight: isActive ? '700' : '500',
                          fontFamily: theme.typography.body,
                        },
                      ]}
                    >
                      {meta.shortLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>

      <ModalDialog
        visible={drawerOpen}
        title="Điều hướng ResMan"
        subtitle={APP_CONFIG.BRANCH_NAME}
        onClose={() => setDrawerOpen(false)}
        maxWidth={360}
      >
        <View style={styles.drawerList}>
          {visibleRoutes.map((route) => {
            const meta = APP_ROUTES_META[route];
            const isActive = currentRoute === route;
            const iconColor = isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant;
            return (
              <Pressable
                key={route}
                onPress={() => handleSelectRoute(route)}
                style={[
                  styles.navItem,
                  {
                    backgroundColor: isActive
                      ? theme.colors.primaryContainer
                      : theme.colors.surfaceLow,
                    borderRadius: theme.radius.md,
                  },
                ]}
              >
                {renderRouteIcon(route, iconColor, 18)}
                <View style={styles.navTextCol}>
                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: isActive ? theme.colors.onPrimary : theme.colors.onSurface,
                        fontFamily: theme.typography.body,
                      },
                    ]}
                  >
                    {meta.label}
                  </Text>
                  <Text
                    style={[
                      styles.navSub,
                      {
                        color: isActive
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurfaceVariant,
                        fontFamily: theme.typography.body,
                      },
                    ]}
                  >
                    {meta.subtitle}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ModalDialog>

      <ModalDialog
        visible={profileOpen}
        title="Thông tin tài khoản"
        subtitle="Phiên đăng nhập hiện tại"
        onClose={() => setProfileOpen(false)}
        maxWidth={420}
        footer={
          <>
            <Button label="Đóng" variant="secondary" onPress={() => setProfileOpen(false)} />
            <Button
              label="Đăng xuất"
              variant="danger"
              leftIcon={<LogOut size={16} color={theme.colors.onErrorContainer} />}
              onPress={() => {
                setProfileOpen(false);
                void logout();
              }}
            />
          </>
        }
      >
        {user ? (
          <View style={styles.profileBox}>
            <View style={[styles.profileHeader, { backgroundColor: theme.colors.surfaceLow }]}>
              <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.profileAvatarText, { color: theme.colors.onPrimary }]}>
                  {user.avatarInitials}
                </Text>
              </View>
              <View style={styles.profileMeta}>
                <Text
                  style={[
                    styles.profileName,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.display },
                  ]}
                >
                  {user.fullName}
                </Text>
                <Text
                  style={[
                    styles.profileEmail,
                    { color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.body },
                  ]}
                >
                  {user.email} · {user.code}
                </Text>
                <Badge label={ROLE_LABELS[user.role]} tone="info" />
              </View>
            </View>

            <View style={[styles.detailList, { borderColor: theme.colors.border }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, { color: theme.colors.onSurfaceVariant }]}>
                  Khu vực phụ trách
                </Text>
                <Text style={[styles.detailVal, { color: theme.colors.onSurface }]}>
                  {user.station || 'Downtown #04'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, { color: theme.colors.onSurfaceVariant }]}>
                  Ca làm việc
                </Text>
                <Text style={[styles.detailVal, { color: theme.colors.onSurface }]}>
                  {user.shift || 'Toàn thời gian'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailKey, { color: theme.colors.onSurfaceVariant }]}>
                  Số điện thoại
                </Text>
                <Text
                  style={[
                    styles.detailVal,
                    { color: theme.colors.onSurface, fontFamily: theme.typography.mono },
                  ]}
                >
                  {user.phone}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </ModalDialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
  },
  shellRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    borderRightWidth: 1,
    justifyContent: 'space-between',
  },
  brandRow: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  brandSub: {
    fontSize: 11,
  },
  navScroll: {
    flex: 1,
  },
  navList: {
    padding: 10,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    minHeight: 44,
  },
  navTextCol: {
    flex: 1,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  navSub: {
    fontSize: 11,
  },
  sidebarFooter: {
    padding: 12,
    borderTopWidth: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
  },
  userRole: {
    fontSize: 11,
  },
  mainColumn: {
    flex: 1,
  },
  topBar: {
    height: 64,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  topLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  topTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  pageSub: {
    fontSize: 12,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentArea: {
    flex: 1,
  },
  bottomTabs: {
    height: 62,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  bottomTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 48,
  },
  bottomTabLabel: {
    fontSize: 11,
  },
  drawerList: {
    gap: 6,
  },
  profileBox: {
    gap: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 12,
  },
  detailList: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  detailKey: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
});
