'use client';

import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

interface StatCardProps {
  number: string | number;
  label: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ number, label, description }) => {
  return (
    <Card
      sx={{
        padding: 3,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 24px rgba(33, 150, 243, 0.2)',
        },
      }}
    >
      <CardContent sx={{ padding: 0 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 1,
          }}
        >
          {number}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
