'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Link,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuthModal } from '@/providers/AuthModalProvider';
import { useAuth } from '@/providers/AuthProvider';

type UserType = 'citizen' | 'government' | 'admin';

export const LoginModal: React.FC = () => {
  const { loginOpen, closeLogin, openSignup } = useAuthModal();
  const { login } = useAuth();
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (_: React.SyntheticEvent, value: UserType) => {
    setError('');
    setUserType(value);
  };

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Login attempt:', { email, password, userType });
      
      login({ email, role: userType });

      setEmail('');
      setPassword('');
      closeLogin();

      if (userType === 'citizen') {
        router.push('/user/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToSignup = () => {
    closeLogin();
    openSignup();
  };

  const handleClose = () => {
    if (!loading) {
      setUserType('citizen');
      setEmail('');
      setPassword('');
      setError('');
      closeLogin();
    }
  };

  return (
    <Dialog
      open={loginOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 600,
          paddingBottom: 1,
        }}
      >
        Login
      </DialogTitle>

      <DialogContent sx={{ paddingTop: 2 }}>
        <Tabs
          value={userType}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Citizen" value="citizen" />
          <Tab label="Government" value="government" />
          <Tab label="Admin" value="admin" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="example@email.com"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="••••••••"
        />

        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Link
            href="#"
            sx={{
              fontSize: '0.875rem',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={handleSwitchToSignup}
              sx={{
                textDecoration: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={loading}
          sx={{ minWidth: '100px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
