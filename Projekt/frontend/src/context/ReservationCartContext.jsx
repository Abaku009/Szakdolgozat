import { createContext, useState } from "react";

export const ReservationCartContext = createContext();

export function ReservationCartProvider({ children }) {
    const [cart, setCart] = useState([]);

    function addToCart(object) {
        const existing = cart.find(item => object.id === item.id && object.type === item.type);
        let newCart;

        if(existing) {
            if(existing.qty < existing.stock) {
                newCart = cart.map(item =>
                    item.id === object.id && item.type === object.type
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
                setCart(newCart);
                alert("A terméket a kosárba helyeztük!");
            } else {
                alert("Nincs több készleten!");
            }
        } else {
            newCart = [...cart, { ...object, qty: 1 }];
            setCart(newCart);
            alert("A terméket a kosárba helyeztük!");
        }
    }

    function increaseQty(id, type) {
        setCart(prev =>
            prev.map(item =>
                item.id === id && item.type === type && item.qty < item.stock
                    ? { ...item, qty: item.qty + 1 }
                    : item
            )
        );
    }

    function decreaseQty(id, type) {
        setCart(prev =>
            prev.map(item =>
                item.id === id && item.type === type && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
    }

    function removeItem(id, type) {
        setCart(prev => prev.filter(item => !(item.id === id && item.type === type)));
    }

    return (
        <ReservationCartContext.Provider value={{ cart, setCart, addToCart, increaseQty, decreaseQty, removeItem }}>
            {children}
        </ReservationCartContext.Provider>
    );
}

