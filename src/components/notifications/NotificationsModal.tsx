'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

export interface Notification {
  title: string;
  time: string;
}

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  open,
  onClose,
  notifications,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableScrollLock>
      <DialogTitle>Notifications</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List disablePadding>
          {notifications.map((n, i) => (
            <React.Fragment key={i}>
              <ListItem sx={{ py: 1.5, px: 3 }}>
                <ListItemText
                  primary={n.title}
                  secondary={n.time}
                  slotProps={{
                    primary: { style: { fontSize: '0.875rem', fontWeight: 500 } },
                    secondary: { style: { fontSize: '0.75rem' } },
                  }}
                />
              </ListItem>
              {i < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
