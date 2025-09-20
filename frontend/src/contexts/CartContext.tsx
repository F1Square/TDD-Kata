import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sweet } from '@/services/sweetService';

interface CartItem extends Sweet {
  cartQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (sweet: Sweet, quantity?: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sweet-shop-cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('sweet-shop-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (sweet: Sweet, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => 
        (item._id || item.id) === (sweet._id || sweet.id)
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item._id || item.id) === (sweet._id || sweet.id)
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...sweet, cartQuantity: quantity }];
      }
    });
  };

  const removeFromCart = (sweetId: string) => {
    setItems(prevItems => 
      prevItems.filter(item => (item._id || item.id) !== sweetId)
    );
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        (item._id || item.id) === sweetId
          ? { ...item, cartQuantity: quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.cartQuantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};