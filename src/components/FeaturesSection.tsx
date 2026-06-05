'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { CheckCircle, Security, Bolt } from '@mui/icons-material';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Easy Filing',
      description: 'File complaints in just a few clicks with our intuitive interface.',
    },
    {
      icon: Security,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-leading security measures.',
    },
    {
      icon: Bolt,
      title: 'Real-time Updates',
      description: 'Track your complaint status in real-time with instant notifications.',
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Why Choose Us?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 6,
            fontSize: '1.125rem',
          }}
        >
          A modern solution for efficient complaint management
        </Typography>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </Container>
    </Box>
  );
};
