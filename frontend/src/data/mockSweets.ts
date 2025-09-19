import { Sweet } from "@/components/SweetCard";

export const mockSweets: Sweet[] = [
  {
    id: "1",
    name: "Rainbow Macarons",
    category: "Macarons",
    price: 24.99,
    quantity: 15,
    description: "Delicate French macarons in vibrant rainbow colors with premium buttercream filling",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=300&fit=crop",
    rating: 4.8,
    isNew: true,
    isFavorite: false
  },
  {
    id: "2",
    name: "Artisan Chocolate Truffles",
    category: "Chocolates",
    price: 32.50,
    quantity: 8,
    description: "Handcrafted dark chocolate truffles with exotic flavor infusions",
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop",
    rating: 4.9,
    isNew: false,
    isFavorite: true
  },
  {
    id: "3",
    name: "Cotton Candy Dreams",
    category: "Cotton Candy",
    price: 8.99,
    quantity: 0,
    description: "Fluffy pink and blue cotton candy that melts in your mouth",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop",
    rating: 4.5,
    isNew: false,
    isFavorite: false
  },
  {
    id: "4",
    name: "Gourmet Lollipops",
    category: "Lollipops",
    price: 15.75,
    quantity: 22,
    description: "Hand-pulled artisan lollipops with natural fruit flavors and edible flowers",
    image: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=400&h=300&fit=crop",
    rating: 4.6,
    isNew: true,
    isFavorite: false
  },
  {
    id: "5",
    name: "Luxury Fudge Squares",
    category: "Fudge",
    price: 19.99,
    quantity: 12,
    description: "Rich, creamy fudge squares made with Belgian chocolate and premium nuts",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop",
    rating: 4.7,
    isNew: false,
    isFavorite: true
  },
  {
    id: "6",
    name: "Vintage Candy Mix",
    category: "Mixed",
    price: 12.50,
    quantity: 30,
    description: "A nostalgic collection of classic candies from around the world",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
    rating: 4.4,
    isNew: false,
    isFavorite: false
  },
  {
    id: "7",
    name: "Crystallized Ginger",
    category: "Gourmet",
    price: 16.25,
    quantity: 7,
    description: "Premium crystallized ginger pieces, perfect for the sophisticated palate",
    image: "https://images.unsplash.com/photo-1587736797235-eab4c4bef231?w=400&h=300&fit=crop",
    rating: 4.3,
    isNew: false,
    isFavorite: false
  },
  {
    id: "8",
    name: "Honey Lavender Caramels",
    category: "Caramels",
    price: 21.00,
    quantity: 18,
    description: "Soft caramels infused with local honey and organic lavender",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    rating: 4.9,
    isNew: true,
    isFavorite: true
  }
];

export const categories = [
  "All",
  "Macarons",
  "Chocolates",
  "Cotton Candy",
  "Lollipops",
  "Fudge",
  "Mixed",
  "Gourmet",
  "Caramels"
];