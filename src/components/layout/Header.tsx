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
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuthModal } from '@/providers/AuthModalProvider';

export const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { openLogin, openSignup } = useAuthModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
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

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <Button
              color="inherit"
              component={Link}
              href="/"
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="#about"
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              About
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="#complaints"
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Complaints
            </Button>
            <Button
              color="inherit"
              component={Link}
              href="#contact"
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Contact
            </Button>
          </Box>

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
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginRight: 1 }}
            onClick={openLogin}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={openSignup}
          >
            Sign Up
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
