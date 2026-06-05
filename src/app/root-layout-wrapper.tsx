'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthModalProvider } from '@/providers/AuthModalProvider';
import { LoginModal } from '@/components/LoginModal';
import { SignupModal } from '@/components/SignupModal';

export const RootLayoutWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthModalProvider>
        {children}
        <LoginModal />
        <SignupModal />
      </AuthModalProvider>
    </ThemeProvider>
  );
};
