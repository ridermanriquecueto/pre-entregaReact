import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

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

  const clearCart = () => {
    setCart([]);
  };

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalQuantity, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};