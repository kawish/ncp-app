'use client';

import React, { useState } from 'react';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthModal } from '@/providers/AuthModalProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
};

export const SignupModal: React.FC = () => {
  const { signupOpen, closeSignup, openLogin } = useAuthModal();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.fullName.trim()) { showSnackbar('Please enter your full name', 'warning'); return; }
    if (!formData.email) { showSnackbar('Please enter your email address', 'warning'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { showSnackbar('Please enter a valid email address', 'warning'); return; }
    if (!formData.password) { showSnackbar('Please enter a password', 'warning'); return; }
    if (formData.password.length < 8) { showSnackbar('Password must be at least 8 characters long', 'warning'); return; }
    if (formData.password !== formData.confirmPassword) { showSnackbar('Passwords do not match', 'warning'); return; }
    if (!formData.agreeToTerms) { showSnackbar('Please agree to the Terms and Conditions', 'warning'); return; }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      await updateProfile(credential.user, { displayName: formData.fullName });

      await setDoc(doc(db, 'users', formData.email), {
        displayName: formData.fullName,
        email: formData.email,
        role: 'citizen',
        createdAt: serverTimestamp(),
      });

      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', agreeToTerms: false });
      closeSignup();
    } catch (err: any) {
      showSnackbar(FIREBASE_ERRORS[err.code] ?? 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => { closeSignup(); openLogin(); };

  const handleClose = () => {
    if (!loading) {
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', agreeToTerms: false });
      closeSignup();
    }
  };

  return (
    <Dialog
      open={signupOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 600, paddingBottom: 1 }}>
        Create Account
      </DialogTitle>

      <DialogContent sx={{ paddingTop: 2 }}>
        <TextField
          fullWidth label="Full Name" variant="outlined" margin="normal"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          disabled={loading} placeholder="John Doe"
        />
        <TextField
          fullWidth label="Email Address" type="email" variant="outlined" margin="normal"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={loading} placeholder="example@email.com"
        />
        <TextField
          fullWidth label="Password" type="password" variant="outlined" margin="normal"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          disabled={loading} placeholder="••••••••" helperText="At least 8 characters"
        />
        <TextField
          fullWidth label="Confirm Password" type="password" variant="outlined" margin="normal"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          disabled={loading} placeholder="••••••••"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              disabled={loading}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <Link href="#" sx={{ textDecoration: 'none' }}>Terms and Conditions</Link>
            </Typography>
          }
          sx={{ marginTop: 2 }}
        />

        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link
              component="button" variant="body2" onClick={handleSwitchToLogin}
              sx={{ textDecoration: 'none', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSignup} disabled={loading} sx={{ minWidth: '100px' }}>
          {loading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
