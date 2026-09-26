'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthModal } from '@/providers/AuthModalProvider';

export default function UserLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const { openLogin } = useAuthModal();
  const router = useRouter();
  const wasLoggedIn = useRef(false);

  useEffect(() => {
    if (isLoggedIn) wasLoggedIn.current = true;
  }, [isLoggedIn]);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/');
      // Only prompt for login on a direct unauthenticated visit, not right after logout.
      if (!wasLoggedIn.current) {
        openLogin();
      }
    }
  }, [loading, isLoggedIn, router, openLogin]);

  if (loading || !isLoggedIn) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
