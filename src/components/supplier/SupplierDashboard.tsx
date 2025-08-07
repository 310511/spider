import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Package, AlertTriangle, ShoppingCart, RefreshCw, CheckCircle,
  XCircle, Clock, Truck, Search, X, TrendingUp, DollarSign, Star
} from "lucide-react";

interface SupplierOrder {
  order_id: string;
  item_name: string;
  quantity: number;
  status: "pending" | "sent" | "confirmed" | "received" | "cancelled";
  created_at: string;
  priority: "low" | "medium" | "high" | "urgent";
  total_amount: number | null;
}

interface SupplierInventory {
  id: string;
  name: string;
  current_stock: number;
  threshold_quantity: number;
  unit: string;
  status: "low_stock" | "normal";
  last_restocked: string | null;
}

interface SupplierPerformance {
  total_orders: number;
  completed_orders: number;
  average_response_time: number;
  customer_rating: number;
  total_revenue: number;
  monthly_growth: number;
  on_time_delivery_rate: number;
}

const SupplierDashboard: React.FC = () => {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [inventory, setInventory] = useState<SupplierInventory[]>([]);
  const [performance, setPerformance] = useState<SupplierPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockOrders: SupplierOrder[] = [
        {
          order_id: "ORD-001",
          item_name: "Surgical Masks",
          quantity: 1000,
          status: "pending",
          created_at: "2024-01-15",
          priority: "high",
          total_amount: 2500
        },
        {
          order_id: "ORD-002",
          item_name: "Gloves",
          quantity: 500,
          status: "confirmed",
          created_at: "2024-01-14",
          priority: "medium",
          total_amount: 1500
        }
      ];

      const mockInventory: SupplierInventory[] = [
        {
          id: "1",
          name: "Surgical Masks",
          current_stock: 5000,
          threshold_quantity: 1000,
          unit: "pieces",
          status: "normal",
          last_restocked: "2024-01-10"
        },
        {
          id: "2",
          name: "Gloves",
          current_stock: 800,
          threshold_quantity: 1000,
          unit: "boxes",
          status: "low_stock",
          last_restocked: "2024-01-05"
        }
      ];

      const mockPerformance: SupplierPerformance = {
        total_orders: 45,
        completed_orders: 42,
        average_response_time: 2.5,
        customer_rating: 4.8,
        total_revenue: 125000,
        monthly_growth: 15,
        on_time_delivery_rate: 95
      };

      setOrders(mockOrders);
      setInventory(mockInventory);
      setPerformance(mockPerformance);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.order_id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      sent: { color: "bg-blue-100 text-blue-800", icon: Truck },
      confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      received: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800"
    };

    return (
      <Badge className={priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium}>
        {priority}
      </Badge>
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchQuery === "" || 
        order.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [orders, searchQuery, statusFilter, priorityFilter]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [inventory, searchQuery, statusFilter]);

  const clearSearch = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading supplier dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground">
            Manage orders, track inventory, and monitor performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSupplierData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance.total_orders}</div>
              <p className="text-xs text-muted-foreground">
                {performance.completed_orders} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${performance.total_revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{performance.monthly_growth}% this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance.customer_rating}/5</div>
              <p className="text-xs text-muted-foreground">
                {performance.on_time_delivery_rate}% on-time delivery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance.average_response_time}h</div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders, inventory, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || statusFilter !== "all" || priorityFilter !== "all") && (
              <Button variant="outline" onClick={clearSearch} className="w-full lg:w-auto">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {searchQuery && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>
                  Found {filteredOrders.length} orders, {filteredInventory.length} inventory items
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Manage and track order status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <Alert>
                  <ShoppingCart className="h-4 w-4" />
                  <AlertTitle>
                    {searchQuery ? "No Orders Found" : "No Orders"}
                  </AlertTitle>
                  <AlertDescription>
                    {searchQuery 
                      ? "No orders match your search criteria." 
                      : "No orders have been placed yet."
                    }
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.order_id}>
                        <TableCell className="font-medium">{order.order_id}</TableCell>
                        <TableCell>{order.item_name}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>${order.total_amount?.toLocaleString() || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.order_id, "confirmed")}
                              disabled={order.status !== "pending"}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.order_id, "sent")}
                              disabled={order.status !== "confirmed"}
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              Ship
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Track stock levels and restock schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredInventory.length === 0 ? (
                <Alert>
                  <Package className="h-4 w-4" />
                  <AlertTitle>
                    {searchQuery ? "No Items Found" : "No Inventory Items"}
                  </AlertTitle>
                  <AlertDescription>
                    {searchQuery 
                      ? "No inventory items match your search criteria." 
                      : "No inventory items available."
                    }
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Restocked</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.current_stock} {item.unit}</TableCell>
                        <TableCell>{item.threshold_quantity} {item.unit}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === "low_stock" ? "destructive" : "default"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Update Stock
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Performance</CardTitle>
                <CardDescription>
                  Track your order fulfillment metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performance && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{Math.round((performance.completed_orders / performance.total_orders) * 100)}%</span>
                      </div>
                      <Progress value={(performance.completed_orders / performance.total_orders) * 100} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>On-time Delivery</span>
                        <span>{performance.on_time_delivery_rate}%</span>
                      </div>
                      <Progress value={performance.on_time_delivery_rate} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Customer Satisfaction</span>
                        <span>{performance.customer_rating * 20}%</span>
                      </div>
                      <Progress value={performance.customer_rating * 20} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly revenue and growth metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performance && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Revenue</span>
                      <span className="text-2xl font-bold">${performance.total_revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>+{performance.monthly_growth}% from last month</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Order Value</span>
                        <span>${performance.total_revenue > 0 ? Math.round(performance.total_revenue / performance.total_orders) : 0}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDashboard; 