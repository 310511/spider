import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Wallet, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Download,
  Lock,
  Wifi,
  Shield
} from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";

interface WalletConnectionProps {
  onClose?: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onClose }) => {
  const { 
    address, 
    signer, 
    provider, 
    isLoading,
    connectWallet,
    disconnectWallet,
    refreshWalletConnection,
    addAppNotification 
  } = useBlockchain();

  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const checkMetaMaskStatus = () => {
    const hasEthereum = typeof window.ethereum !== 'undefined';
    const isConnected = address !== null;
    
    return {
      hasEthereum,
      isConnected,
      address,
      hasSigner: signer !== null,
      hasProvider: provider !== null,
      isLoading
    };
  };

  const handleConnectWallet = async () => {
    setConnectionError(null);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setConnectionError("MetaMask is not installed");
        return;
      }

      await connectWallet();
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      
      let errorMessage = "Failed to connect wallet";
      
      if (error.code === 4001) {
        errorMessage = "Connection rejected by user";
      } else if (error.code === -32002) {
        errorMessage = "Please check MetaMask and try again";
      } else if (error.code === -32603) {
        errorMessage = "Internal JSON-RPC error. Please try again";
      } else if (error.message?.includes("User rejected")) {
        errorMessage = "Connection was rejected";
      } else if (error.message?.includes("already pending")) {
        errorMessage = "Connection request already pending";
      }
      
      setConnectionError(errorMessage);
      addAppNotification(errorMessage, "error");
    }
  };

  const handleForceRefresh = async () => {
    setConnectionError(null);
    try {
      await refreshWalletConnection();
    } catch (error: any) {
      setConnectionError("Failed to refresh connection");
      addAppNotification("Failed to refresh connection", "error");
    }
  };

  const status = checkMetaMaskStatus();

  const getTroubleshootingSteps = () => [
    {
      title: "Install MetaMask",
      description: "Download and install MetaMask browser extension",
      icon: Download,
      action: () => window.open("https://metamask.io/download/", "_blank"),
      condition: !status.hasEthereum
    },
    {
      title: "Unlock MetaMask",
      description: "Open MetaMask and unlock your wallet",
      icon: Lock,
      action: () => window.open("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html", "_blank"),
      condition: status.hasEthereum && !status.isConnected
    },
    {
      title: "Check Network",
      description: "Ensure you're connected to the correct network",
      icon: Wifi,
      action: () => {},
      condition: status.hasEthereum && !status.isConnected
    },
    {
      title: "Refresh Page",
      description: "Try refreshing the page and connecting again",
      icon: RefreshCw,
      action: () => window.location.reload(),
      condition: status.hasEthereum && !status.isConnected
    }
  ];

  const troubleshootingSteps = getTroubleshootingSteps();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Connection Status:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span>MetaMask:</span>
                <Badge variant={status.hasEthereum ? "default" : "destructive"}>
                  {status.hasEthereum ? "Available" : "Not Found"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>Connected:</span>
                <Badge variant={status.isConnected ? "default" : "secondary"}>
                  {status.isConnected ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>Loading:</span>
                <Badge variant={status.isLoading ? "default" : "secondary"}>
                  {status.isLoading ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>Provider:</span>
                <Badge variant={status.hasProvider ? "default" : "secondary"}>
                  {status.hasProvider ? "Ready" : "Not Ready"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Connected Address */}
          {status.isConnected && address && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Connected Address:</span>
                <code className="text-xs bg-green-100 px-2 py-1 rounded">
                  {address.substring(0, 6)}...{address.substring(-4)}
                </code>
              </div>
            </div>
          )}

          {/* Error Display */}
          {connectionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {!status.isConnected ? (
              <>
                <Button 
                  onClick={handleConnectWallet} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
                
                <Button 
                  onClick={handleForceRefresh} 
                  variant="outline"
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Force Refresh
                </Button>
              </>
            ) : (
              <Button 
                onClick={disconnectWallet} 
                variant="outline"
                className="w-full"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            )}
          </div>

          {/* Troubleshooting Section */}
          {!status.isConnected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Troubleshooting:</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                >
                  {showTroubleshoot ? "Hide" : "Show"} Steps
                </Button>
              </div>
              
              {showTroubleshoot && (
                <div className="space-y-2">
                  {troubleshootingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <step.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-muted-foreground">{step.description}</div>
                      </div>
                      {step.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={step.action}
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MetaMask Guide */}
          {!status.hasEthereum && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>MetaMask Required</AlertTitle>
              <AlertDescription>
                You need to install MetaMask to use the marketplace. 
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs"
                  onClick={() => window.open("https://metamask.io/download/", "_blank")}
                >
                  Download MetaMask
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Close Button */}
          {onClose && (
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="w-full"
            >
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 