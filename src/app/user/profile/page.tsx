'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  IconButton,
  Badge,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UserSidebar } from '@/components/layout/UserSidebar';

interface ProfileData {
  displayName: string;
  email: string;
  countryCode: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

const EMPTY_PROFILE: ProfileData = {
  displayName: '',
  email: '',
  countryCode: '+91',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
};

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export default function ProfilePage() {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [draft, setDraft] = useState<ProfileData>(EMPTY_PROFILE);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', user.email));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const loaded: ProfileData = {
            displayName: data.displayName ?? user.displayName,
            email: user.email,
            countryCode: data.countryCode ?? '+91',
            phone: data.phone ?? '',
            address: data.address ?? '',
            city: data.city ?? '',
            province: data.province ?? '',
            postalCode: data.postalCode ?? '',
          };
          setProfile(loaded);
          setDraft(loaded);
        }
      } catch {
        showSnackbar('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!mounted) return null;

  const handleChange = (field: keyof ProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user || !auth.currentUser) return;
    if (!draft.displayName.trim()) {
      showSnackbar('Full name cannot be empty.', 'warning');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.email), {
        displayName: draft.displayName,
        countryCode: draft.countryCode,
        phone: draft.phone,
        address: draft.address,
        city: draft.city,
        province: draft.province,
        postalCode: draft.postalCode,
      });
      await updateProfile(auth.currentUser, { displayName: draft.displayName });
      setProfile(draft);
      setEditing(false);
      showSnackbar('Profile updated successfully.', 'success');
    } catch {
      showSnackbar('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const field = (
    label: string,
    key: keyof ProfileData,
    opts?: { type?: string; disabled?: boolean }
  ) => (
    <TextField
      fullWidth
      label={label}
      value={editing ? draft[key] : profile[key]}
      onChange={(e) => handleChange(key, e.target.value)}
      type={opts?.type ?? 'text'}
      variant="outlined"
      size="small"
      slotProps={{ input: { readOnly: !editing || opts?.disabled } }}
    />
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
        <UserSidebar />

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Content */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ maxWidth: 760, mx: 'auto' }}>

                {/* Avatar + name card */}
                <Card sx={{ mb: 3 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                    <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '1.6rem', fontWeight: 700 }}>
                      {getInitials(profile.displayName || user?.displayName || '?')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {profile.displayName || user?.displayName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile.email}
                      </Typography>
                      <Typography variant="caption" color="primary.main" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                        {user?.role}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      {editing ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                            onClick={handleSave}
                            disabled={saving}
                          >
                            Save
                          </Button>
                        </Box>
                      ) : (
                        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                {/* Personal / Contact */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Contact Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      {field('Full Name', 'displayName')}
                      {field('Email Address', 'email', { disabled: true })}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          label="Code"
                          value={editing ? draft.countryCode : profile.countryCode}
                          onChange={(e) => handleChange('countryCode', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ width: 90 }}
                          slotProps={{ input: { readOnly: !editing } }}
                        />
                        {field('Phone Number', 'phone', { type: 'tel' })}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Address
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      {field('Street Address', 'address')}
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                        {field('City', 'city')}
                        {field('Province', 'province')}
                        {field('Postal Code', 'postalCode')}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

              </Box>
            )}
            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
