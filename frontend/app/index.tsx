
import React from 'react';
import { Redirect } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingState } from '@/src/components/common/StateViews';
import { getDefaultRouteForRole } from '@/src/constants/rbac';

export default function IndexRoute() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingState message="Đang khởi tạo ResMan..." />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/login" />;
  }

  const target = getDefaultRouteForRole(user.role);

  return <Redirect href={`/(main)/${target}`} />;
}
