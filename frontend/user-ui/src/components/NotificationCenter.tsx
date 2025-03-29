import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Trade as TradeIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { io } from 'socket.io-client';

interface Notification {
  id: string;
  type: 'trade' | 'profit' | 'system' | 'alert';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // 获取历史通知
    fetchNotifications();

    // 建立WebSocket连接
    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3001');
    setSocket(newSocket);

    // 订阅通知
    newSocket.emit('subscribeAlerts', 'user123'); // 替换为实际用户ID

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      socket.off('notification');
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
      });
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return <TradeIcon />;
      case 'profit':
        return <AccountBalanceIcon />;
      case 'alert':
        return <WarningIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box>
      <IconButton color="inherit" onClick={handleNotificationClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">通知中心</Typography>
          <Box>
            <IconButton size="small" onClick={handleMarkAllAsRead}>
              <CheckCircleIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="暂无通知" />
            </ListItem>
          ) : (
            notifications.map(notification => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <Box>
                  {!notification.read && (
                    <IconButton
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationCenter; 