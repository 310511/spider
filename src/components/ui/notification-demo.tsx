import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, AlertTriangle, Package, Clock, CheckCircle, Info } from 'lucide-react';

export const NotificationDemo: React.FC = () => {
  const { addNotification } = useNotifications();

  const generateDemoNotifications = () => {
    // Low stock notification
    addNotification({
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'Paracetamol 500mg is running low (15 units left). Please reorder soon.',
      severity: 'high',
      actionUrl: '/inventory?item=ms_001',
      itemId: 'ms_001'
    });

    // Expiry notification
    addNotification({
      type: 'expiry',
      title: 'Expiry Warning',
      message: 'Antibiotic Cream expires in 15 days. Consider using or disposing.',
      severity: 'critical',
      actionUrl: '/inventory?item=ms_004',
      itemId: 'ms_004'
    });

    // System notification
    addNotification({
      type: 'system',
      title: 'System Update',
      message: 'Inventory system has been updated with new features and improvements.',
      severity: 'low'
    });

    // Success notification
    addNotification({
      type: 'success',
      title: 'Order Confirmed',
      message: 'Purchase order #PO-2024-001 has been confirmed by supplier.',
      severity: 'medium',
      actionUrl: '/inventory/purchase-orders'
    });

    // Error notification
    addNotification({
      type: 'error',
      title: 'Connection Error',
      message: 'Failed to connect to supplier API. Please check your internet connection.',
      severity: 'medium'
    });
  };

  const generateRandomNotification = () => {
    const notifications = [
      {
        type: 'low_stock' as const,
        title: 'Low Stock Alert',
        message: 'Ibuprofen 400mg is running low (8 units left).',
        severity: 'high' as const,
        actionUrl: '/inventory?item=ms_002',
        itemId: 'ms_002'
      },
      {
        type: 'expiry' as const,
        title: 'Expiry Warning',
        message: 'Bandages (10cm) expire in 30 days.',
        severity: 'medium' as const,
        actionUrl: '/inventory?item=ms_003',
        itemId: 'ms_003'
      },
      {
        type: 'system' as const,
        title: 'Backup Complete',
        message: 'System backup completed successfully at 2:30 AM.',
        severity: 'low' as const
      },
      {
        type: 'success' as const,
        title: 'Stock Updated',
        message: 'Gauze Pads stock has been updated successfully.',
        severity: 'medium' as const,
        actionUrl: '/inventory?item=ms_005',
        itemId: 'ms_005'
      }
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    addNotification(randomNotification);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={generateDemoNotifications}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Bell className="h-4 w-4 mr-2" />
          Generate Demo Notifications
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={generateRandomNotification}
          className="bg-white/90 backdrop-blur-sm"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Random Notification
        </Button>
      </div>
    </div>
  );
}; 