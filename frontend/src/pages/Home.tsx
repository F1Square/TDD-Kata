import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Heart, Gift, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-sweets.jpg";
import { SweetCard } from "@/components/SweetCard";
import { sweetService, Sweet as BackendSweet } from "@/services/sweetService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const Home = () => {
  const navigate = useNavigate();
  const [featuredSweets, setFeaturedSweets] = useState<BackendSweet[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load featured sweets from backend
  useEffect(() => {
    const loadFeaturedSweets = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const data = await sweetService.getAllSweets();
        // Show first 4 sweets as featured
        setFeaturedSweets(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured sweets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedSweets();
  }, [isAuthenticated]);



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <div className="space-y-6">
            <Badge className="bg-golden-sweet text-chocolate border-0 text-lg px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Sweet Experience
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-candy-pink to-white bg-clip-text text-transparent">
              Sweet Shop
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Discover the finest selection of artisan candies, chocolates, and confections crafted with love and premium ingredients.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="golden"
                size="lg"
                onClick={() => navigate("/catalog")}
                className="text-lg px-8 py-4 h-auto"
              >
                Explore Catalog
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-background to-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-candy-pink to-candy-purple bg-clip-text text-transparent">
              Featured Delights
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked selection of our most beloved treats, crafted to perfection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Loading featured sweets...</p>
              </div>
            ) : featuredSweets.length > 0 ? (
              featuredSweets.map((sweet) => (
                <SweetCard
                  key={sweet._id || sweet.id}
                  sweet={sweet as any}
                  onFavorite={(id) => console.log(`Favorite ${id}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  {isAuthenticated ? "No sweets available" : "Sign in to view our sweet collection"}
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="candy"
              size="lg"
              onClick={() => navigate("/catalog")}
              className="px-8"
            >
              View All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-candy-pink/20 hover:border-candy-pink/40 transition-colors group">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-candy-pink to-candy-purple rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-candy-pink">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Only the finest ingredients sourced from around the world to create exceptional treats
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-candy-pink/20 hover:border-candy-pink/40 transition-colors group">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-golden-sweet to-candy-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-chocolate" />
                </div>
                <h3 className="text-2xl font-bold text-candy-pink">Made with Love</h3>
                <p className="text-muted-foreground">
                  Every piece is handcrafted by our master confectioners with passion and care
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-candy-pink/20 hover:border-candy-pink/40 transition-colors group">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-candy-purple to-candy-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-candy-pink">Perfect Gifts</h3>
                <p className="text-muted-foreground">
                  Beautiful packaging and personalized options to make every occasion special
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};