'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';
import { Send } from '@mui/icons-material';

export const ComplaintFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Public Service',
    'Infrastructure',
    'Corruption',
    'Harassment',
    'Environmental',
    'Safety',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.category || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    // Show success message
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', category: '', description: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="sm">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
          }}
        >
          File Your Complaint
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 4,
            fontSize: '1.125rem',
          }}
        >
          Share your complaint details below and we'll get back to you soon
        </Typography>

        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you! Your complaint has been submitted successfully. We'll contact you soon.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

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
    </Box>
  );
};
