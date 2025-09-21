import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export interface Sweet {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
  imageUrl?: string;
  rating?: number;
  isNew?: boolean;
  isFavorite?: boolean;
}

interface SweetCardProps {
  sweet: Sweet;
  onFavorite?: (sweetId: string) => void;
  className?: string;
}

export const SweetCard = ({ sweet, onFavorite, className }: SweetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(sweet.isFavorite || false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(sweet._id || sweet.id || '');
  };

  const handleAddToCart = () => {
    if (sweet.quantity > 0) {
      addToCart(sweet, 1);
      toast({
        title: "Added to cart",
        description: `${sweet.name} has been added to your cart.`,
      });
    }
  };



  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 border-candy-pink/20 hover:border-candy-pink/40 hover:shadow-lg hover:shadow-candy-pink/10",
        isHovered && "transform -translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={sweet.imageUrl || sweet.image || "https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=300&fit=crop"}
          alt={sweet.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {sweet.isNew && (
            <Badge className="bg-golden-sweet text-chocolate border-0">
              New
            </Badge>
          )}
          {sweet.quantity === 0 && (
            <Badge variant="destructive">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 backdrop-blur hover:bg-white"
          onClick={handleFavorite}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorited ? "fill-candy-pink text-candy-pink" : "text-muted-foreground"
            )} 
          />
        </Button>


      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight">{sweet.name}</h3>
            {sweet.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-golden-sweet text-golden-sweet" />
                <span className="text-sm text-muted-foreground">{sweet.rating}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-candy-pink/30 text-candy-pink">
              {sweet.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {sweet.quantity} left
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {sweet.description || "Delicious sweet treat"}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-candy-pink">
            ${sweet.price.toFixed(2)}
          </span>
        </div>
        
        <Button
          variant={sweet.quantity > 0 ? "candy" : "outline"}
          onClick={handleAddToCart}
          disabled={sweet.quantity === 0}
          className="min-w-[100px]"
        >
          <ShoppingCart className="h-4 w-4" />
          {sweet.quantity > 0 ? "Add to Cart" : "Sold Out"}
        </Button>
      </CardFooter>
    </Card>
  );
};