'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Container,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Send,
  AutoAwesome,
} from '@mui/icons-material';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UserSidebar } from '@/components/layout/UserSidebar';
import { getRelevantLegalSection } from '@/lib/aiService';

const mockUser = {
  name: 'Ahmed Khan',
  email: 'ahmed.khan@email.com',
  initials: 'AK',
};

const categories = [
  'Public Service',
  'Infrastructure',
  'Corruption',
  'Harassment',
  'Environmental',
  'Safety',
  'Other',
];

export default function FileComplaintPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [relevantInfo, setRelevantInfo] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.category || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    setFormData({ category: '', description: '' });
    setRelevantInfo('');
    setAiError('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleAiAssist = async () => {
    setAiError('');
    setAiLoading(true);
    try {
      const result = await getRelevantLegalSection(formData.description);
      setRelevantInfo(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to get AI assistance');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
        <UserSidebar />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Form Area */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 5 }}>
            <Container maxWidth="sm">
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                File Your Complaint
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mb: 4 }}>
                Share your complaint details below and we&apos;ll get back to you soon
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you! Your complaint has been submitted successfully. We&apos;ll contact you soon.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  select
                  label="Complaint Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Complaint Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  required
                  multiline
                  rows={5}
                  variant="outlined"
                  placeholder="Please describe your complaint in detail..."
                />

                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 1 }}
                  startIcon={aiLoading ? <CircularProgress size={18} /> : <AutoAwesome />}
                  disabled={!formData.description.trim() || aiLoading}
                  onClick={handleAiAssist}
                >
                  {aiLoading ? 'Analyzing...' : 'AI Assist'}
                </Button>

                {aiError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {aiError}
                  </Alert>
                )}

                {relevantInfo && (
                  <TextField
                    fullWidth
                    label="Relevant Information"
                    value={relevantInfo}
                    margin="normal"
                    multiline
                    minRows={4}
                    maxRows={20}
                    variant="outlined"
                    slotProps={{ input: { readOnly: true } }}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mt: 3, py: 1.5 }}
                  endIcon={<Send />}
                >
                  Submit Complaint
                </Button>
              </form>
            </Container>
            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
