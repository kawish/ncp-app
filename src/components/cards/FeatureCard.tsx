'use client';

import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { SvgIconProps } from '@mui/material';

interface FeatureCardProps {
  icon: React.ComponentType<SvgIconProps>;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 3,
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 24px rgba(33, 150, 243, 0.15)',
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Icon sx={{ fontSize: 48, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Card>
  );
};
