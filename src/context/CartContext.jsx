import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    const storedCart = localStorage.getItem("sportRyderCart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const addToCart = (product, quantity = 1) => {
    let added = false;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const currentQuantity = existing ? existing.quantity : 0;
      const availableStock = Math.max(product.stock - currentQuantity, 0);

      if (availableStock <= 0) {
        return prevCart;
      }

      const quantityToAdd = Math.min(quantity, availableStock);
      added = true;

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });

    return added;
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.flatMap((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }

        return [];
      })
    );
  };

  const removeItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  useEffect(() => {
    localStorage.setItem("sportRyderCart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, removeItem, clearCart, totalQuantity, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};