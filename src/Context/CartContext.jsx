import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const ENDPOINTS = {
  CART: `${import.meta.env.VITE_API_URL}/api/v1/client/cart`,
  WISHLIST: `${import.meta.env.VITE_API_URL}/api/v1/client/favorites`,
  ORDERS: `${import.meta.env.VITE_API_URL}/api/v1/client/orders`
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(
    Number(localStorage.getItem("cartCount")) || 0
  );

  const [wishlistCount, setWishlistCount] = useState(
    Number(localStorage.getItem("wishlistCount")) || 0
  );
 if(localStorage.getItem("role")=="customer"){
   useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          axios.get(ENDPOINTS.CART, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
          axios.get(ENDPOINTS.WISHLIST, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        ]);
        const cartLength = cartRes.data?.data?.length;
        const wishlistLength = wishlistRes.data?.data?.length;

        localStorage.setItem("cartCount", cartLength);
        localStorage.setItem("wishlistCount", wishlistLength);

        setCartCount(cartLength);
        setWishlistCount(wishlistLength);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounts();
  }, []);

 }
 
  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, wishlistCount, setWishlistCount }}
    >
      {children}
    </CartContext.Provider>
  );
};