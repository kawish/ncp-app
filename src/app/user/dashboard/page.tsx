'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  AddCircleOutlined as AddCircleOutlineIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UserSidebar } from '@/components/layout/UserSidebar';

const mockUser = {
  name: 'Ahmed Khan',
  email: 'ahmed.khan@email.com',
  initials: 'AK',
};

const mockComplaints = [
  { id: 'NCP-2026-001', title: 'Road damage on Main Street', category: 'Infrastructure', status: 'Resolved', date: '2026-05-28', priority: 'High' },
  { id: 'NCP-2026-002', title: 'Garbage collection missed', category: 'Sanitation', status: 'In Progress', date: '2026-06-01', priority: 'Medium' },
  { id: 'NCP-2026-003', title: 'Street light not working', category: 'Utilities', status: 'Pending', date: '2026-06-03', priority: 'Low' },
  { id: 'NCP-2026-004', title: 'Water supply disruption', category: 'Water', status: 'Pending', date: '2026-06-04', priority: 'High' },
  { id: 'NCP-2026-005', title: 'Noise complaint near park', category: 'Environment', status: 'In Review', date: '2026-05-30', priority: 'Medium' },
];

const statsConfig = [
  { label: 'Total Complaints', value: 5, Icon: AssignmentIcon, color: '#2196F3', bg: 'rgba(33,150,243,0.12)' },
  { label: 'Pending', value: 2, Icon: HourglassEmptyIcon, color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
  { label: 'In Progress', value: 1, Icon: TrendingUpIcon, color: '#2196F3', bg: 'rgba(33,150,243,0.12)' },
  { label: 'Resolved', value: 1, Icon: CheckCircleIcon, color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
];


const statusColorMap: Record<string, 'success' | 'warning' | 'primary' | 'info'> = {
  Resolved: 'success',
  'In Progress': 'primary',
  Pending: 'warning',
  'In Review': 'info',
};

const priorityColorMap: Record<string, 'error' | 'warning' | 'success'> = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

const pendingCount = mockComplaints.filter((c) => c.status === 'Pending').length;

export default function UserDashboard() {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
        <UserSidebar user={mockUser} />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Content Area */}
          <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>

            {/* Stats Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 3,
              }}
            >
              {statsConfig.map(({ label, value, Icon, color, bg }) => (
                <Card key={label}>
                  <CardContent sx={{ p: '20px !important' }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Icon sx={{ color, fontSize: 22 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color, lineHeight: 1.2, mb: 0.5 }}>
                      {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Recent Complaints */}
            <Card>
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Complaints
                </Typography>
                <Button size="small" color="primary" component={Link} href="/user/complaints">
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {['ID', 'Title', 'Category', 'Priority', 'Status', 'Date Filed'].map((col) => (
                        <TableCell key={col} sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.secondary' }}>
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockComplaints.map((complaint) => (
                      <TableRow
                        key={complaint.id}
                        sx={{ '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 600 }}>
                            {complaint.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {complaint.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {complaint.category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={complaint.priority}
                            color={priorityColorMap[complaint.priority]}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={complaint.status}
                            color={statusColorMap[complaint.status]}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {complaint.date}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
