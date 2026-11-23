
import React from 'react';
import { Redirect, Slot } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';
import { AppShell } from '@/src/components/layout/AppShell';
import { LoadingState } from '@/src/components/common/StateViews';

export default function MainGroupLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <LoadingState message="Đang xác thực quyền truy cập..." />
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}
