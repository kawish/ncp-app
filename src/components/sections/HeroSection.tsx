'use client';

import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

export const HeroSection: React.FC = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        color: 'white',
        py: 12,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mb: 2,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          File Your Complaint Today
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 300,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            opacity: 0.95,
          }}
        >
          A centralized platform for reporting and tracking complaints with ease
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              fontWeight: 700,
              px: 4,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            endIcon={<ArrowForward />}
          >
            File a Complaint
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              fontWeight: 700,
              px: 4,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white',
              },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
