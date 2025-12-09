import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    function addToCart(music) {
        setCart(prev => {
            const existing = prev.find(item => item.music_id === music.music_id);

            if (existing) {
                if (existing.qty < existing.stock) {
                    return prev.map(item =>
                        item.music_id === music.music_id
                            ? { ...item, qty: item.qty + 1 }
                            : item
                    ); 
                } else {
                    alert("Nincs több készleten!");
                    return prev;
                }
            }

            return [...prev, { ...music, qty: 1 }];
        });

        alert("A terméket a kosárba helyeztük!");
    }

    function increaseQty(id) {
        setCart(prev =>
            prev.map(item =>
                item.music_id === id && item.qty < item.stock
                    ? { ...item, qty: item.qty + 1 }
                    : item
            )
        );
    }

    function decreaseQty(id) {
        setCart(prev =>
            prev.map(item =>
                item.music_id === id && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
    }

    function removeItem(id) {
        setCart(prev => prev.filter(item => item.music_id !== id));
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQty, decreaseQty, removeItem }}>
            {children}
        </CartContext.Provider>
    );
}

