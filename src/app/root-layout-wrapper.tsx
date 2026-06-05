'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { AuthModalProvider } from '@/providers/AuthModalProvider';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';

export const RootLayoutWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
      <AuthModalProvider>
        {children}
        <LoginModal />
        <SignupModal />
      </AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
