import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Package, TrendingUp, DollarSign, Users, Upload, X } from "lucide-react";
import { Sweet } from "@/components/SweetCard";
import { sweetService, Sweet as BackendSweet } from "@/services/sweetService";
import { orderService, Order, OrderStats } from "@/services/orderService";
import { imageService } from "@/services/imageService";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export const Admin = () => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<BackendSweet[]>([]);
  const [selectedSweet, setSelectedSweet] = useState<BackendSweet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userStats, setUserStats] = useState<{ totalUsers: number; adminUsers: number; regularUsers: number } | null>(null);
  const { toast } = useToast();

  // Define categories
  const categories = ["All", "Chocolates", "Macarons", "Cotton Candy", "Lollipops", "Gummies", "Hard Candy"];

  // Load sweets from backend
  useEffect(() => {
    const loadSweets = async () => {
      try {
        setLoading(true);
        const data = await sweetService.getAllSweets();
        setSweets(data);
      } catch (error: any) {
        toast({
          title: "Failed to load sweets",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSweets();
  }, [toast]);

  // Load orders and stats
  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const [ordersData, statsData] = await Promise.all([
        orderService.getAllOrders(),
        orderService.getOrderStats()
      ]);
      setOrders(ordersData);
      setOrderStats(statsData.stats);
    } catch (error: any) {
      toast({
        title: "Failed to load orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load user stats
  const loadUserStats = async () => {
    try {
      const stats = await authService.getUserStats();
      setUserStats(stats);
    } catch (error: any) {
      console.error('Failed to load user stats:', error);
    }
  };

  // Load user stats on component mount
  useEffect(() => {
    loadUserStats();
  }, []);

  const handleAddSweet = () => {
    setSelectedSweet({
      name: "",
      category: "Chocolates",
      price: 0,
      quantity: 0,
      description: "",
      imageUrl: ""
    });
    setIsEditing(true);
  };

  const handleEditSweet = (sweet: BackendSweet) => {
    setSelectedSweet(sweet);
    setIsEditing(true);
  };

  const handleDeleteSweet = async (id: string) => {
    try {
      await sweetService.deleteSweet(id);
      setSweets(sweets.filter(sweet => (sweet._id || sweet.id) !== id));
      toast({
        title: "Sweet deleted successfully",
        description: "The sweet has been removed from your inventory.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete sweet",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRestockSweet = async (id: string) => {
    const quantity = prompt("Enter quantity to restock:");
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await sweetService.restockSweet(id, Number(quantity));
      setSweets(sweets.map(sweet => 
        (sweet._id || sweet.id) === id 
          ? { ...sweet, quantity: result.sweet.quantity }
          : sweet
      ));
      toast({
        title: "Restock successful",
        description: `Added ${quantity} units. Total stock: ${result.sweet.quantity}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to restock",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSweet) return;

    try {
      if (selectedSweet._id || selectedSweet.id) {
        // Update existing
        const updated = await sweetService.updateSweet(selectedSweet._id || selectedSweet.id || '', selectedSweet);
        setSweets(sweets.map(sweet => 
          (sweet._id || sweet.id) === (selectedSweet._id || selectedSweet.id) ? updated : sweet
        ));
        toast({
          title: "Sweet updated successfully",
          description: "Your changes have been saved.",
        });
      } else {
        // Add new
        const newSweet = await sweetService.addSweet(selectedSweet);
        setSweets([...sweets, newSweet]);
        toast({
          title: "Sweet added successfully",
          description: "New sweet has been added to your inventory.",
        });
      }

      setIsEditing(false);
      setSelectedSweet(null);
    } catch (error: any) {
      toast({
        title: "Failed to save sweet",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Image upload handlers
  const handleImageUpload = async (file: File) => {
    try {
      setImageUploading(true);
      const result = await imageService.uploadImage(file);
      
      if (selectedSweet) {
        setSelectedSweet({
          ...selectedSweet,
          imageUrl: result.imageUrl
        });
      }
      
      toast({
        title: "Image uploaded successfully",
        description: "The image has been uploaded to Cloudinary.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to upload image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
  const lowStockItems = sweets.filter(sweet => sweet.quantity < 10).length;
  const totalProducts = sweets.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-candy-pink to-candy-purple bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Manage your sweet shop inventory and operations
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Logged in as:
            </span>
            <span className="font-semibold text-candy-pink">
              {user?.username}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-candy-purple/20 text-candy-purple rounded-full border border-candy-purple/30">
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-candy-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold text-candy-pink">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-candy-pink" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-candy-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                  <p className="text-3xl font-bold text-golden-sweet">${totalValue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-golden-sweet" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-candy-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <p className="text-3xl font-bold text-destructive">{lowStockItems}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-candy-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-candy-purple">
                    {userStats ? userStats.totalUsers : 'Loading...'}
                  </p>
                </div>
                <Users className="h-8 w-8 text-candy-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
            <TabsTrigger value="add-product">Add/Edit Product</TabsTrigger>
            <TabsTrigger value="orders" onClick={loadOrders}>Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card className="border-candy-pink/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-candy-pink">Product Inventory</CardTitle>
                    <CardDescription>Manage your sweet shop products</CardDescription>
                  </div>
                  <Button variant="candy" onClick={handleAddSweet}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sweets.map((sweet) => (
                        <TableRow key={sweet.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={sweet.imageUrl || "https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=300&fit=crop"}
                                alt={sweet.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium">{sweet.name}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {sweet.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-candy-pink/30 text-candy-pink">
                              {sweet.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">${sweet.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={sweet.quantity < 10 ? "destructive" : "default"}
                              className={sweet.quantity < 10 ? "" : "bg-green-500 hover:bg-green-600"}
                            >
                              {sweet.quantity} units
                            </Badge>
                          </TableCell>
                          <TableCell>⭐ {(sweet as any).rating ? (sweet as any).rating.toFixed(1) : "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {(sweet as any).isNew && (
                                <Badge className="bg-golden-sweet text-chocolate">New</Badge>
                              )}
                              {sweet.quantity === 0 && (
                                <Badge variant="destructive">Out of Stock</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRestockSweet(sweet._id || sweet.id || '')}
                                title="Restock"
                              >
                                <Plus className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditSweet(sweet)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteSweet(sweet._id || sweet.id || '')}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product">
            <Card className="border-candy-pink/20">
              <CardHeader>
                <CardTitle className="text-candy-pink">
                  {isEditing ? (selectedSweet?.id ? "Edit Product" : "Add New Product") : "Product Form"}
                </CardTitle>
                <CardDescription>
                  {isEditing ? "Fill in the product details" : "Select a product to edit or add a new one"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing && selectedSweet ? (
                  <form onSubmit={handleSaveSweet} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={selectedSweet.name}
                          onChange={(e) => setSelectedSweet({...selectedSweet, name: e.target.value})}
                          className="border-candy-pink/20 focus:border-candy-pink"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={selectedSweet.category}
                          onValueChange={(value) => setSelectedSweet({...selectedSweet, category: value})}
                        >
                          <SelectTrigger className="border-candy-pink/20 focus:border-candy-pink">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(cat => cat !== "All").map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={selectedSweet.price}
                          onChange={(e) => setSelectedSweet({...selectedSweet, price: parseFloat(e.target.value) || 0})}
                          className="border-candy-pink/20 focus:border-candy-pink"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Stock Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={selectedSweet.quantity}
                          onChange={(e) => setSelectedSweet({...selectedSweet, quantity: parseInt(e.target.value) || 0})}
                          className="border-candy-pink/20 focus:border-candy-pink"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="image">Product Image</Label>
                        <div className="space-y-4">
                          {/* Current Image Preview */}
                          {selectedSweet.imageUrl && (
                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                              <img
                                src={selectedSweet.imageUrl}
                                alt="Product preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70"
                                onClick={() => setSelectedSweet({...selectedSweet, imageUrl: ""})}
                              >
                                <X className="h-3 w-3 text-white" />
                              </Button>
                            </div>
                          )}

                          {/* File Upload */}
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              disabled={imageUploading}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {imageUploading ? "Uploading..." : "Choose Image"}
                            </Button>
                            
                            {selectedFile && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">{selectedFile.name}</span>
                                <Button
                                  type="button"
                                  variant="candy"
                                  size="sm"
                                  onClick={() => handleImageUpload(selectedFile)}
                                  disabled={imageUploading}
                                >
                                  {imageUploading ? "Uploading..." : "Upload"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedFile(null)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Manual URL Input (fallback) */}
                          <div className="space-y-2">
                            <Label htmlFor="image-url">Or enter image URL manually:</Label>
                            <Input
                              id="image-url"
                              value={selectedSweet.imageUrl || ""}
                              onChange={(e) => setSelectedSweet({...selectedSweet, imageUrl: e.target.value})}
                              className="border-candy-pink/20 focus:border-candy-pink"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={selectedSweet.description}
                          onChange={(e) => setSelectedSweet({...selectedSweet, description: e.target.value})}
                          className="border-candy-pink/20 focus:border-candy-pink"
                          rows={3}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <Button type="submit" variant="candy">
                        {selectedSweet.id ? "Update Product" : "Add Product"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedSweet(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No Product Selected
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Select a product from the inventory to edit, or add a new product
                    </p>
                    <Button variant="candy" onClick={handleAddSweet}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border-candy-pink/20">
              <CardHeader>
                <CardTitle className="text-candy-pink">Order History</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : (
                  <>
                    {orderStats && (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                          <p className="text-2xl font-bold text-blue-700">{orderStats.totalOrders}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">Completed</p>
                          <p className="text-2xl font-bold text-green-700">{orderStats.completedOrders}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-600 font-medium">Pending</p>
                          <p className="text-2xl font-bold text-yellow-700">{orderStats.pendingOrders}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <p className="text-sm text-red-600 font-medium">Cancelled</p>
                          <p className="text-2xl font-bold text-red-700">{orderStats.cancelledOrders}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
                          <p className="text-2xl font-bold text-purple-700">${orderStats.totalRevenue.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell className="font-mono text-sm">
                                {order._id.slice(-8)}...
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{order.customerUsername}</p>
                                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="text-sm">
                                      {item.sweetName} x{item.quantity}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                ${order.totalAmount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    order.status === 'completed' ? 'default' :
                                    order.status === 'pending' ? 'secondary' :
                                    'destructive'
                                  }
                                  className={
                                    order.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                                    order.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                    ''
                                  }
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(status: 'pending' | 'completed' | 'cancelled') => {
                                    orderService.updateOrderStatus(order._id, status)
                                      .then(() => {
                                        setOrders(orders.map(o => 
                                          o._id === order._id ? { ...o, status } : o
                                        ));
                                        toast({
                                          title: "Order status updated",
                                          description: `Order status changed to ${status}`,
                                        });
                                      })
                                      .catch((error) => {
                                        toast({
                                          title: "Failed to update status",
                                          description: error.message,
                                          variant: "destructive",
                                        });
                                      });
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {orders.length === 0 && (
                        <div className="text-center py-8">
                          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            No Orders Found
                          </h3>
                          <p className="text-muted-foreground">
                            No customer orders have been placed yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};