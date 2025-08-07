import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '@/components/ui/notification-panel';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  refreshNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = 'ws://localhost:8000/ws/notifications';
        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
          console.log('WebSocket connected for notifications');
        };

        websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'notification') {
              const newNotification: Notification = {
                id: data.id || `notification_${Date.now()}`,
                type: data.notification_type || 'system',
                title: data.title || 'New Notification',
                message: data.message || '',
                timestamp: new Date(data.timestamp || Date.now()),
                severity: data.severity || 'medium',
                read: false,
                actionUrl: data.action_url,
                itemId: data.item_id
              };
              addNotification(newNotification);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        websocket.onclose = () => {
          console.log('WebSocket disconnected, attempting to reconnect...');
          setTimeout(connectWebSocket, 5000);
        };

        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        setWs(websocket);
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/inventory/alerts');
      if (response.ok) {
        const alertsData = await response.json();
        
        const formattedNotifications: Notification[] = alertsData.map((alert: any) => ({
          id: alert.alert_id,
          type: alert.type === 'low_stock' ? 'low_stock' : 'expiry',
          title: alert.type === 'low_stock' ? 'Low Stock Alert' : 'Expiry Warning',
          message: alert.message,
          timestamp: new Date(alert.created_at),
          severity: alert.severity || 'medium',
          read: false,
          itemId: alert.item_id,
          actionUrl: `/inventory?item=${alert.item_id}`
        }));

        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Add fallback notifications for demo
      addFallbackNotifications();
    }
  }, []);

  const addFallbackNotifications = () => {
    const fallbackNotifications: Notification[] = [
      {
        id: 'fallback_1',
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: 'Paracetamol 500mg is running low (15 units left)',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        severity: 'high',
        read: false,
        itemId: 'ms_001',
        actionUrl: '/inventory?item=ms_001'
      },
      {
        id: 'fallback_2',
        type: 'expiry',
        title: 'Expiry Warning',
        message: 'Antibiotic Cream expires in 15 days',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        severity: 'critical',
        read: false,
        itemId: 'ms_004',
        actionUrl: '/inventory?item=ms_004'
      },
      {
        id: 'fallback_3',
        type: 'system',
        title: 'System Update',
        message: 'Inventory system has been updated with new features',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        severity: 'low',
        read: true
      }
    ];

    setNotifications(fallbackNotifications);
  };

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const dismissNotification = useCallback(async (id: string) => {
    try {
      // Try to dismiss via API
      const response = await fetch('http://localhost:8000/inventory/alerts/dismiss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alert_id: id })
      });

      if (!response.ok) {
        console.warn('Failed to dismiss notification via API, removing locally');
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }

    // Remove from local state regardless of API response
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isPanelOpen,
    openPanel,
    closePanel,
    markAsRead,
    dismissNotification,
    refreshNotifications,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 