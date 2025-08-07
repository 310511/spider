# Real-Time Notification System

## Overview

The MedChain application now includes a comprehensive real-time notification system with the following features:

- **Pop-out notification panel** accessible from the header bell icon
- **Real-time WebSocket connections** for instant notifications
- **Multiple notification types**: low stock, expiry, system, success, error
- **Severity levels**: low, medium, high, critical
- **Action URLs** for direct navigation to relevant pages
- **Read/unread status** tracking
- **Dismiss functionality** with API integration
- **Auto-refresh** capabilities

## Components

### 1. Notification Panel (`src/components/ui/notification-panel.tsx`)
- Beautiful pop-out panel with backdrop blur
- Scrollable notification list
- Time-ago formatting
- Severity-based color coding
- Action buttons for each notification

### 2. Notification Context (`src/contexts/NotificationContext.tsx`)
- Manages notification state globally
- WebSocket connection handling
- API integration for fetching/dismissing notifications
- Real-time notification broadcasting

### 3. Backend WebSocket Support (`backend/main.py`)
- WebSocket endpoint at `/ws/notifications`
- Connection management with automatic reconnection
- Real-time notification broadcasting
- Integration with alert system

## Features

### Real-Time Notifications
- WebSocket connection to `ws://localhost:8000/ws/notifications`
- Automatic reconnection on disconnection
- Fallback to API polling if WebSocket fails

### Notification Types
- **Low Stock**: Inventory items below threshold
- **Expiry**: Items expiring soon
- **System**: System updates and maintenance
- **Success**: Successful operations
- **Error**: System errors and warnings

### Severity Levels
- **Critical**: Red border, immediate attention required
- **High**: Orange border, high priority
- **Medium**: Yellow border, moderate priority
- **Low**: Blue border, informational

### Actions
- **View**: Navigate to relevant page
- **Dismiss**: Remove notification (with API call)
- **Refresh**: Manually refresh notifications

## Usage

### Frontend Integration
```tsx
import { useNotifications } from '@/contexts/NotificationContext';

const MyComponent = () => {
  const { 
    notifications, 
    unreadCount, 
    openPanel, 
    addNotification 
  } = useNotifications();

  // Add a notification
  addNotification({
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Item is running low',
    severity: 'high',
    actionUrl: '/inventory?item=123'
  });

  return (
    <Button onClick={openPanel}>
      Notifications ({unreadCount})
    </Button>
  );
};
```

### Backend Integration
```python
# Broadcast a notification
await broadcast_notification({
    "id": "notification_123",
    "notification_type": "low_stock",
    "title": "Low Stock Alert",
    "message": "Item is running low",
    "timestamp": "2024-01-01T12:00:00Z",
    "severity": "high",
    "action_url": "/inventory?item=123"
})
```

## API Endpoints

### GET `/inventory/alerts`
Returns all active alerts as notifications

### POST `/inventory/alerts/dismiss`
Dismisses a notification by ID

### POST `/inventory/alerts/check`
Manually triggers alert checks and broadcasts new notifications

### WebSocket `/ws/notifications`
Real-time notification stream

## Testing

### Demo Notifications
The system includes demo buttons on the main page to test notifications:

1. **Generate Demo Notifications**: Creates 5 different types of notifications
2. **Random Notification**: Creates a random notification

### WebSocket Test
Run the test script to verify WebSocket functionality:
```bash
python test_notifications.py
```

## Configuration

### WebSocket URL
Default: `ws://localhost:8000/ws/notifications`
Can be configured in `NotificationContext.tsx`

### Reconnection
- Automatic reconnection every 5 seconds on disconnection
- Fallback to API polling if WebSocket unavailable

### Notification Persistence
- Notifications are stored in React state
- API integration for persistence
- Automatic cleanup of dismissed notifications

## Styling

The notification system uses Tailwind CSS with:
- Backdrop blur effects
- Smooth animations
- Responsive design
- Accessibility features
- Dark/light mode support

## Security

- WebSocket connections are validated
- API endpoints require proper authentication
- Notification data is sanitized
- XSS protection implemented

## Performance

- Efficient WebSocket connection management
- Debounced API calls
- Optimized re-renders
- Memory leak prevention
- Connection pooling

## Future Enhancements

- Push notifications for mobile
- Email notifications
- Custom notification sounds
- Notification preferences
- Bulk actions (mark all as read)
- Notification history
- Advanced filtering and search 