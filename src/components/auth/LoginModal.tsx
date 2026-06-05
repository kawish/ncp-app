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
  Tabs,
  Tab,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthModal } from '@/providers/AuthModalProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

type UserType = 'citizen' | 'government' | 'admin';

const ROLE_ROUTES: Record<UserType, string> = {
  citizen: '/user/dashboard',
  government: '/government/dashboard',
  admin: '/admin/dashboard',
};

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
};

export const LoginModal: React.FC = () => {
  const { loginOpen, closeLogin, openSignup } = useAuthModal();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, value: UserType) => {
    setUserType(value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      const docSnap = await getDoc(doc(db, 'users', email));
      const role = (docSnap.data()?.role as UserType) ?? 'citizen';

      setEmail('');
      setPassword('');
      closeLogin();
      router.push(ROLE_ROUTES[role]);
    } catch (err: any) {
      showSnackbar(FIREBASE_ERRORS[err.code] ?? 'Login failed. Please try again.');
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
      closeLogin();
    }
  };

  return (
    <Dialog
      open={loginOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 600, paddingBottom: 1 }}>
        Login
      </DialogTitle>

      <DialogContent sx={{ paddingTop: 2 }}>
        <Tabs value={userType} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Citizen" value="citizen" />
          <Tab label="Government" value="government" />
          <Tab label="Admin" value="admin" />
        </Tabs>

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
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Link
            href="#"
            sx={{ fontSize: '0.875rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
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
              sx={{ textDecoration: 'none', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
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
