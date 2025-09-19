import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { SweetCard } from "@/components/SweetCard";
import { sweetService, Sweet as BackendSweet } from "@/services/sweetService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const [sweets, setSweets] = useState<BackendSweet[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Define categories based on backend data
  const categories = ["All", "Chocolates", "Macarons", "Cotton Candy", "Lollipops", "Gummies", "Hard Candy"];

  useEffect(() => {
    const loadSweets = async () => {
      try {
        if (isAuthenticated) {
          const data = await sweetService.getAllSweets();
          setSweets(data);
        }
      } catch (error: any) {
        toast({
          title: "Error loading sweets",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSweets();
  }, [isAuthenticated, toast]);

  const handlePurchase = async (sweetId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase sweets.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await sweetService.purchaseSweet(sweetId, 1);
      
      // Update the sweets list with the new quantity
      setSweets(prevSweets => 
        prevSweets.map(sweet => 
          (sweet._id || sweet.id) === sweetId 
            ? { ...sweet, quantity: result.sweet.quantity }
            : sweet
        )
      );

      toast({
        title: "Purchase successful!",
        description: `You purchased 1 unit. ${result.sweet.quantity} units remaining.`,
      });
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedSweets = useMemo(() => {
    let filtered = sweets.filter((sweet) => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (sweet.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || sweet.category === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange === "under20") matchesPrice = sweet.price < 20;
      else if (priceRange === "20to30") matchesPrice = sweet.price >= 20 && sweet.price <= 30;
      else if (priceRange === "over30") matchesPrice = sweet.price > 30;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b as any).rating - (a as any).rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [sweets, searchQuery, selectedCategory, sortBy, priceRange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-candy-pink to-candy-purple bg-clip-text text-transparent">
            Sweet Catalog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of artisan confections
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/50 backdrop-blur rounded-xl p-6 mb-8 border border-candy-pink/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sweets by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-candy-pink/20 focus:border-candy-pink"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-candy-pink/20 focus:border-candy-pink">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="border-candy-pink/20 focus:border-candy-pink">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under20">Under $20</SelectItem>
                <SelectItem value="20to30">$20 - $30</SelectItem>
                <SelectItem value="over30">Over $30</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-candy-pink text-white border-candy-pink"
                    : "border-candy-pink/30 text-candy-pink hover:bg-candy-pink/10"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedSweets.length} of {sweets.length} products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedSweets.map((sweet) => (
            <SweetCard
              key={sweet._id || sweet.id}
              sweet={sweet as any}
              onPurchase={handlePurchase}
              onFavorite={(id) => console.log(`Favorite ${id}`)}
              className="hover:shadow-lg hover:shadow-candy-pink/20"
            />
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedSweets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-candy-pink to-candy-purple rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-candy-pink mb-2">No sweets found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="candy"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setPriceRange("all");
                setSortBy("name");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};