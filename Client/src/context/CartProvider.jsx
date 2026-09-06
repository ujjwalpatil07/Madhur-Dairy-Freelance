import { useEffect, useMemo, useState, createContext, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { UserAuthContext } from "./AuthProvider";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { authUser } = useContext(UserAuthContext);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (!authUser?._id) {
            setCartItems([]);
            return;
        }

        const stored = localStorage.getItem(`cart_${authUser._id}`);
        if (stored) {
            setCartItems(JSON.parse(stored));
        } else {
            setCartItems([]);
        }
    }, [authUser]);

    useEffect(() => {
        if (authUser?._id) {
            localStorage.setItem(`cart_${authUser._id}`, JSON.stringify(cartItems));
        }
    }, [cartItems, authUser]);

    const addToCart = (productId, quantity, price) => {
        const formattedQuantity = Number(quantity.toFixed(3));

        setCartItems(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item =>
                    item.productId === productId
                        ? {
                            ...item,
                            quantity: Number((item.quantity + formattedQuantity).toFixed(3))
                        }
                        : item
                );
            }
            return [...prev, { productId, quantity: formattedQuantity, price }];
        });
    };

    const updateCartItem = (productId, newQuantity) => {
        setCartItems(prev =>
            prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
    };

    const clearCart = useCallback(() => {
        setCartItems([]);
        if (authUser?._id) {
            localStorage.removeItem(`cart_${authUser._id}`);
        }
    }, [authUser?._id]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
    }), [cartItems, clearCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired
};
