'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <div className="row mb-4">
          {/* About */}
          <div className="col-md-3 mb-4">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The Centralized Complaint Portal is dedicated to providing a platform for citizens to report and track complaints efficiently.
            </Typography>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Home
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    File Complaint
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Track Status
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    FAQ
                  </Typography>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-md-3 mb-4">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Legal
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Privacy Policy
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Terms of Service
                  </Typography>
                </Link>
              </li>
              <li>
                <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    Cookie Policy
                  </Typography>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3 mb-4">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              📧 Email: support@ncp.gov
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              📞 Phone: 1-800-COMPLAIN
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              📍 Address: 123 Main St, City
            </Typography>
          </div>
        </div>

        {/* Copyright */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Centralized Complaint Portal. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
