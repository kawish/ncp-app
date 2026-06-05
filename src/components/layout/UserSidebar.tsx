'use client';

import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  AddCircleOutlined as AddCircleOutlineIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

const SIDEBAR_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', Icon: DashboardIcon, href: '/user/dashboard' },
  { label: 'My Complaints', Icon: AssignmentIcon, href: '/user/complaints' },
  { label: 'File Complaint', Icon: AddCircleOutlineIcon, href: '/user/complaint/form' },
  { label: 'Profile', Icon: PersonIcon, href: '/user/profile' },
  { label: 'Settings', Icon: SettingsIcon, href: '/user/settings' },
];

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export const UserSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const displayName = user?.displayName ?? '';
  const email = user?.email ?? '';
  const initials = getInitials(displayName);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'relative',
          height: '100%',
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* User Profile */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42, fontSize: '0.95rem', fontWeight: 700 }}>
          {initials}
        </Avatar>
        <Box sx={{ overflow: 'hidden', minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {email}
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 1.5 }}>
        {navItems.map(({ label, Icon, href }) => {
          const active = pathname === href;
          return (
            <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={href}
                sx={{
                  mx: 1.5,
                  borderRadius: 2,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  slotProps={{ primary: { style: { fontSize: '0.875rem', fontWeight: active ? 600 : 400 } } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

    </Drawer>
  );
};
