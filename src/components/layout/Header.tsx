import { useState } from "react";
import { Bell, Shield, User, Brain, TrendingUp, Pill, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationPanel } from "@/components/ui/notification-panel";
import { ProfilePanel } from "@/components/ui/profile-panel";

export const Header = () => {
  const { 
    unreadCount, 
    isPanelOpen, 
    openPanel, 
    closePanel, 
    notifications,
    markAsRead,
    dismissNotification,
    refreshNotifications
  } = useNotifications();

  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);

  const openProfilePanel = () => setIsProfilePanelOpen(true);
  const closeProfilePanel = () => setIsProfilePanelOpen(false);

  return (
    <>
      <header className="border-b bg-card shadow-card h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">MedChain</h1>
              <p className="text-xs text-muted-foreground">Inventory System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/infinite-memory">
            <Button variant="outline" className="font-semibold">
              <Brain className="h-4 w-4 mr-2" />
              Infinite Memory
            </Button>
          </Link>

          <Link to="/ml-predictions">
            <Button variant="outline" className="font-semibold">
              <TrendingUp className="h-4 w-4 mr-2" />
              ML Predictions
            </Button>
          </Link>

          <Link to="/medicine-recommendation">
            <Button variant="outline" className="font-semibold">
              <Pill className="h-4 w-4 mr-2" />
              Medicine AI
            </Button>
          </Link>

          <Link to="/inventory">
            <Button variant="outline" className="font-semibold">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
          </Link>
          
          <Link to="/marketplace">
            <Button variant="default" className="font-semibold">
              Marketplace 
            </Button>
          </Link>

          <Link to="/supplier-dashboard">
            <Button variant="outline" className="font-semibold">
              <Users className="h-4 w-4 mr-2" />
              Supplier
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-muted/50 transition-colors"
            onClick={openPanel}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-muted/50 transition-colors"
            onClick={openProfilePanel}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onDismiss={dismissNotification}
        onRefresh={refreshNotifications}
        unreadCount={unreadCount}
      />

      <ProfilePanel
        isOpen={isProfilePanelOpen}
        onClose={closeProfilePanel}
        userRole="System Administrator"
        userName="John Doe"
        userEmail="john.doe@medchain.com"
      />
    </>
  );
};