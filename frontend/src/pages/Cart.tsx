import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleQuantityChange = (sweetId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(sweetId, newQuantity);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some sweets to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would process the payment here
      // For now, we'll just show a success message and clear the cart
      
      toast({
        title: "Payment Successful!",
        description: `Your order of $${getTotalPrice().toFixed(2)} has been processed.`,
      });
      
      clearCart();
      navigate('/');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-3xl font-bold text-candy-pink mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any sweets to your cart yet.
          </p>
          <Button variant="candy" onClick={() => navigate('/catalog')}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-candy-pink">Shopping Cart</h1>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {items.map((item) => (
            <Card key={item._id || item.id} className="border-candy-pink/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl || '/placeholder.svg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item._id || item.id || '', item.cartQuantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.cartQuantity}
                      onChange={(e) => handleQuantityChange(item._id || item.id || '', parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item._id || item.id || '', item.cartQuantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-lg text-candy-pink">
                      ${(item.price * item.cartQuantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item._id || item.id || '')}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-candy-pink/20 sticky top-24">
            <CardHeader>
              <CardTitle className="text-candy-pink">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.cartQuantity}</span>
                    <span>${(item.price * item.cartQuantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-candy-pink">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="candy"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/catalog')}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};