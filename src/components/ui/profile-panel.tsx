import { useState } from "react";
import { X, Settings, User, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export const ProfilePanel = ({ 
  isOpen, 
  onClose, 
  userRole = "Admin", 
  userName = "John Doe", 
  userEmail = "john.doe@medchain.com" 
}: ProfilePanelProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    // Simulate logout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    onClose();
    // In a real app, you would handle actual logout logic here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative mt-16 mr-6 w-80 bg-card border rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground">Profile</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-[calc(100vh-8rem)]">
          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{userName}</h4>
                <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {userRole}
                </Badge>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link to="/profile" onClick={onClose}>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-3"
              >
                <User className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">Profile</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link to="/settings" onClick={onClose}>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-3"
              >
                <Settings className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">Settings</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>

            <Separator className="my-2" />

            <Button
              variant="ghost"
              className="w-full justify-start h-12 px-3 text-destructive hover:text-destructive"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">
                {isLoading ? "Signing out..." : "Sign out"}
              </span>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}; 