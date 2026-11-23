
import React from 'react';
import { Redirect } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';
import { getDefaultRouteForRole } from '@/src/constants/rbac';
import { LoginScreen } from '@/src/features/auth/screens/LoginScreen';

export default function LoginRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const target = getDefaultRouteForRole(user.role);

    return <Redirect href={`/(main)/${target}`} />;
  }

  return <LoginScreen />;
}
