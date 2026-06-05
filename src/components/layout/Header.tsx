'use client';

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Box,
  Typography,
  Badge,
} from '@mui/material';
import { NotificationsModal } from '@/components/notifications/NotificationsModal';
import { Brightness4, Brightness7, Notifications as NotificationsIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthModal } from '@/providers/AuthModalProvider';
import { useAuth } from '@/providers/AuthProvider';

export const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openLogin, openSignup } = useAuthModal();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* Logo/Brand */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                cursor: 'pointer',
                marginRight: 4,
              }}
            >
              NCP Portal
            </Typography>
          </Link>

          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{ marginRight: 2 }}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <>
                <IconButton color="inherit" sx={{ marginRight: 1 }} onClick={() => setNotifOpen(true)}>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Button variant="outlined" color="error" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ marginRight: 1 }}
                  onClick={openLogin}
                >
                  Login
                </Button>
                <Button variant="contained" color="primary" onClick={openSignup}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

      <NotificationsModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={[
          { title: 'Complaint NCP-2026-001 resolved', time: '2 hours ago' },
          { title: 'Your complaint is under review', time: 'Yesterday' },
          { title: 'Welcome to NCP Portal!', time: '3 days ago' },
        ]}
      />
    </>
  );
};
