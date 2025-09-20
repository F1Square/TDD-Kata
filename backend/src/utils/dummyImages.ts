// Utility for generating dummy images based on sweet categories
export const getDummyImageUrl = (category: string): string => {
  const imageMap: { [key: string]: string } = {
    // Chocolate sweets
    'Chocolate': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop',
    'Candy': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=300&fit=crop',
    'Gummy': 'https://images.unsplash.com/photo-1582058091505-be1b0236b5c5?w=400&h=300&fit=crop',
    'Lollipop': 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=300&fit=crop',
    'Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    'Cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    'Ice Cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
    'Donut': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    'Pastry': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    'Muffin': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop'
  };

  // Return specific image for category or default chocolate image
  return imageMap[category] || imageMap['Chocolate'];
};

// Get all available categories with their dummy images
export const getAvailableCategories = (): Array<{category: string, imageUrl: string}> => {
  const categories = [
    'Chocolate',
    'Candy', 
    'Gummy',
    'Lollipop',
    'Cake',
    'Cookies',
    'Ice Cream',
    'Donut',
    'Pastry',
    'Muffin'
  ];

  return categories.map(category => ({
    category,
    imageUrl: getDummyImageUrl(category)
  }));
};