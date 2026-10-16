import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { productData } from '../data/product';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  retailPrice: number;
  setRetailPrice: (price: number) => void;
  isPriceEditing: boolean;
  setIsPriceEditing: (val: boolean) => void;
  checkoutNotice: string | null;
  setCheckoutNotice: (val: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('serein_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);
  const [retailPrice, setRetailPriceState] = useState<number>(() => {
    try {
      const savedPrice = localStorage.getItem('serein_retail_price');
      return savedPrice ? parseFloat(savedPrice) : productData.defaultPrice;
    } catch {
      return productData.defaultPrice;
    }
  });
  const [isPriceEditing, setIsPriceEditing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('serein_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const setRetailPrice = (price: number) => {
    setRetailPriceState(price);
    try {
      localStorage.setItem('serein_retail_price', price.toString());
    } catch {
      // ignore
    }
    // Update existing items in cart with new price
    setItems((prev) =>
      prev.map((item) =>
        item.id === 'serein-curl-set-teal' ? { ...item, price } : item
      )
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addItem = (quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === 'serein-curl-set-teal');
      if (existing) {
        return prev.map((item) =>
          item.id === 'serein-curl-set-teal'
            ? { ...item, quantity: item.quantity + quantity, price: retailPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          id: 'serein-curl-set-teal',
          title: productData.name,
          subtitle: productData.lengthSpecification,
          color: productData.availableColor.name,
          length: "60-inch",
          price: retailPrice,
          quantity: quantity,
          image: productData.images[0].src,
        },
      ];
    });
    // Open drawer to confirm addition
    openCart();
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalCount,
        subtotal,
        retailPrice,
        setRetailPrice,
        isPriceEditing,
        setIsPriceEditing,
        checkoutNotice,
        setCheckoutNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
