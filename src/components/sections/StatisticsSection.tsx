'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { StatCard } from '../cards/StatCard';

export const StatisticsSection: React.FC = () => {
  const stats = [
    { number: '15,420', label: 'Complaints Resolved', description: 'Successfully closed cases' },
    { number: '98%', label: 'Satisfaction Rate', description: 'From verified users' },
    { number: '24/7', label: 'Support Available', description: 'Round the clock assistance' },
    { number: '50K+', label: 'Active Users', description: 'Across the platform' },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Our Impact
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
          Empowering citizens with transparency and accountability
        </Typography>

        <div className="row g-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <StatCard number={stat.number} label={stat.label} description={stat.description} />
            </div>
          ))}
        </div>
      </Container>
    </Box>
  );
};
